import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Cpu, Mic } from 'lucide-react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#050505] text-cyan-50 font-sans selection:bg-cyan-500/30">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-cyan-900/30 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-lg font-bold tracking-widest text-cyan-400 uppercase font-mono">JARVIS</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm font-medium tracking-wide text-cyan-600/80 uppercase font-mono">
             <Link to={createPageUrl('Home')} className="hover:text-cyan-400 transition-colors">
                Home
             </Link>
             <Link to={createPageUrl('Jarvis')} className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                <Mic className="w-4 h-4" /> Interface
             </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-16 min-h-screen relative overflow-hidden">
        {/* Background Ambient Effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
        
        {children}
      </main>
    </div>
  );
}
