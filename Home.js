import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Power, ChevronRight, Cpu } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 relative z-10">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-8 max-w-2xl"
      >
        <div className="flex justify-center mb-8">
          <motion.div 
            animate={{ 
              boxShadow: ["0 0 20px rgba(6,182,212,0.2)", "0 0 60px rgba(6,182,212,0.6)", "0 0 20px rgba(6,182,212,0.2)"] 
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-32 h-32 rounded-full bg-cyan-950/30 border-2 border-cyan-500/50 flex items-center justify-center backdrop-blur-md"
          >
            <Cpu className="w-16 h-16 text-cyan-400" />
          </motion.div>
        </div>

        <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-900 font-mono tracking-tighter">
            J.A.R.V.I.S.
            </h1>
            <p className="text-cyan-500/80 text-lg md:text-xl font-light tracking-wide">
            JUST A RATHER VERY INTELLIGENT SYSTEM
            </p>
        </div>

        <p className="text-gray-400 max-w-md mx-auto">
          Advanced natural language processing and voice synthesis interface. 
          Ready for deployment.
        </p>

        <div className="pt-8">
          <Link to={createPageUrl('Jarvis')}>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(6,182,212,0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-cyan-950/50 border border-cyan-500/50 rounded-full text-cyan-400 font-mono text-lg uppercase tracking-widest transition-all hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
            >
              <Power className="w-5 h-5 group-hover:text-white transition-colors" />
              <span>Initialize System</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 text-center">
        <p className="text-[10px] text-cyan-900 font-mono uppercase tracking-[0.3em]">
            Stark Industries Proprietary Technology
        </p>
      </div>
    </div>
  );
}
