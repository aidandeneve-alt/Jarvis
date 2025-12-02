import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import Visualizer from '@/components/jarvis/Visualizer';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Battery, ShieldCheck, Globe, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

export default function Jarvis() {
  const [status, setStatus] = useState('idle'); // idle, listening, processing, speaking
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Web Speech API References
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setStatus('listening');
        setIsListening(true);
      };

      recognition.onend = () => {
        if (status === 'listening') {
            setStatus('idle');
        }
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleCommand(transcript);
      };

      recognitionRef.current = recognition;
    } else {
      console.error("Speech Recognition API not supported in this browser.");
    }

    // Preload voices
    const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            console.log("Voices loaded:", voices.length);
        }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Initial greeting
    const hasGreeted = sessionStorage.getItem('hasGreeted');
    if (!hasGreeted) {
        setTimeout(() => {
            addMessage({ role: 'assistant', content: 'J.A.R.V.I.S. initialized. Ready for commands.', timestamp: new Date() });
            speak("Jarvis initialized. Ready for commands.");
            sessionStorage.setItem('hasGreeted', 'true');
        }, 1000);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error("Recognition start error", e);
      }
    }
  };

  const speak = (text) => {
    if (isMuted || !synthRef.current) return;

    // Cancel any current speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a good sci-fi/robotic voice or just a deep male voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google US English')) || 
                           voices.find(v => v.name.includes('Daniel')) ||
                           voices.find(v => v.lang === 'en-US');
    
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setStatus('speaking');
    utterance.onend = () => setStatus('idle');

    synthRef.current.speak(utterance);
  };

  const addMessage = (msg) => {
    setMessages(prev => [...prev, msg]);
  };

  const handleCommand = async (command) => {
    if (!command) return;

    // 1. Add user message
    addMessage({ role: 'user', content: command, timestamp: new Date() });
    setStatus('processing');

    try {
      // 2. Send to LLM
      // We'll use a prompt to make it act like Jarvis
      const systemPrompt = `
        You are J.A.R.V.I.S (Just A Rather Very Intelligent System), a highly advanced AI assistant.
        Keep your responses concise, intelligent, and slightly witty/British. 
        Do not use markdown formatting (like **bold**), just plain text as this will be spoken aloud.
        If asked to do something you can't (like control real world hardware), explain your limitations as "I lack the necessary physical interfaces at the moment, sir."
        Current Date: ${new Date().toDateString()}
      `;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `User: ${command}`,
        system_prompt: systemPrompt, // Note: InvokeLLM might not support system_prompt directly in all versions, usually we put it in prompt.
        // Let's adjust the prompt to include instructions.
      });
      
      // Correction for InvokeLLM: it takes 'prompt' and optionally 'response_json_schema'.
      // I will structure the prompt to include the persona.
      const fullPrompt = `
        System: ${systemPrompt}
        User: ${command}
        Jarvis:
      `;
      
      const llmResponse = await base44.integrations.Core.InvokeLLM({
          prompt: fullPrompt
      });

      // 3. Process response
      const responseText = typeof llmResponse === 'string' ? llmResponse : JSON.stringify(llmResponse);
      
      addMessage({ role: 'assistant', content: responseText, timestamp: new Date() });
      
      // 4. Log to DB
      try {
          await base44.entities.CommandLog.create({
              command: command,
              response: responseText,
              mode: isListening ? 'voice' : 'text'
          });
      } catch (err) {
          console.error("Failed to log command", err);
      }

      // 5. Speak response
      speak(responseText);

    } catch (error) {
      console.error("Processing Error:", error);
      const errorMsg = "I'm detecting a network anomaly, sir. Unable to process that request.";
      addMessage({ role: 'assistant', content: errorMsg, timestamp: new Date() });
      speak(errorMsg);
      setStatus('idle');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 gap-12">
        
      {/* HUD Elements */}
      <div className="absolute top-24 left-8 hidden md:block opacity-50 pointer-events-none">
        <div className="flex flex-col gap-4 text-cyan-500/60 font-mono text-xs">
            <div className="flex items-center gap-2"><Globe className="w-4 h-4" /> NETWORK: SECURE</div>
            <div className="flex items-center gap-2"><Battery className="w-4 h-4" /> POWER: 100%</div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> PROTOCOL: MARK VII</div>
        </div>
      </div>

      <div className="absolute top-24 right-8 hidden md:block opacity-50 pointer-events-none">
        <div className="flex flex-col items-end gap-1 text-cyan-500/60 font-mono text-xs">
             <p>SYS.LOC: 127.0.0.1</p>
             <p>MEM.ALLOC: NORMAL</p>
             <p>UPTIME: {Math.floor(performance.now() / 1000)}s</p>
        </div>
      </div>

      {/* Central Visualizer */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="mt-8"
      >
        <Visualizer state={status} />
      </motion.div>

      {/* Status Text */}
      <div className="h-8">
        <AnimatePresence mode="wait">
            <motion.p
                key={status}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-cyan-400 font-mono text-lg tracking-[0.2em] uppercase text-center"
            >
                {status === 'idle' && "Systems Ready"}
                {status === 'listening' && "Listening..."}
                {status === 'processing' && "Analyzing..."}
                {status === 'speaking' && "Responding..."}
            </motion.p>
        </AnimatePresence>
      </div>

      {/* Voice Controls */}
      <div className="mt-12 flex items-center gap-8 z-20">
         {/* Mute Toggle */}
         <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-full border-cyan-900/50 backdrop-blur-md transition-all ${isMuted ? 'bg-red-950/30 text-red-400 hover:bg-red-900/40' : 'bg-cyan-950/30 text-cyan-400 hover:bg-cyan-900/40'}`}
         >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
         </Button>

         {/* Main Mic Toggle */}
         <Button
            onClick={toggleListening}
            className={`h-24 w-24 rounded-full border-2 transition-all duration-500 relative group overflow-hidden ${
               isListening 
               ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.4)] hover:shadow-[0_0_60px_rgba(239,68,68,0.6)]' 
               : 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.2)] hover:shadow-[0_0_60px_rgba(6,182,212,0.4)]'
            }`}
         >
            <div className={`absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity ${isListening ? 'bg-red-500' : 'bg-cyan-500'}`} />
            {isListening ? <MicOff className="w-10 h-10 text-red-400 relative z-10" /> : <Mic className="w-10 h-10 text-cyan-400 relative z-10" />}
         </Button>
      </div>
      
      {/* Subtitles */}
      <div className="mt-12 h-16 text-center max-w-2xl px-4">
          <AnimatePresence mode="wait">
              {messages.length > 0 && (
                  <motion.p
                    key={messages.length}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`font-mono text-lg md:text-xl leading-relaxed ${
                        messages[messages.length - 1].role === 'assistant' 
                        ? 'text-cyan-300 text-shadow-glow' 
                        : 'text-cyan-700 italic'
                    }`}
                  >
                    "{messages[messages.length - 1].content}"
                  </motion.p>
              )}
          </AnimatePresence>
      </div>
    </div>
  );
}
