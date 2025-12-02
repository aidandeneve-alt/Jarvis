import React from 'react';
import { motion } from 'framer-motion';

export default function Visualizer({ state }) {
  // state: 'idle', 'listening', 'processing', 'speaking'

  const variants = {
    idle: {
      scale: [1, 1.05, 1],
      opacity: 0.5,
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    },
    listening: {
      scale: [1, 1.2, 1],
      borderColor: "rgba(6, 182, 212, 0.8)",
      boxShadow: "0 0 40px rgba(6, 182, 212, 0.6)",
      transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
    },
    processing: {
      rotate: 360,
      scale: 0.9,
      borderColor: "rgba(236, 72, 153, 0.8)", // Pinkish for thinking
      boxShadow: "0 0 50px rgba(236, 72, 153, 0.4)",
      transition: { duration: 1, repeat: Infinity, ease: "linear" }
    },
    speaking: {
      scale: [1, 1.4, 0.9, 1.2, 1],
      opacity: 1,
      borderColor: "rgba(6, 182, 212, 1)",
      boxShadow: "0 0 60px rgba(6, 182, 212, 0.8)",
      transition: { duration: 1.5, repeat: Infinity, times: [0, 0.2, 0.5, 0.8, 1] }
    }
  };

  const colorVariants = {
    idle: "border-cyan-900/30 bg-cyan-900/5",
    listening: "border-cyan-400 bg-cyan-500/10",
    processing: "border-pink-500 bg-pink-500/10",
    speaking: "border-cyan-400 bg-cyan-400/20"
  };

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Outer Rings */}
      <motion.div
        className="absolute inset-0 rounded-full border border-cyan-800/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-4 rounded-full border border-cyan-700/20 border-dashed"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Core Visualizer */}
      <motion.div
        variants={variants}
        animate={state}
        className={`w-32 h-32 rounded-full border-4 backdrop-blur-sm flex items-center justify-center z-10 ${colorVariants[state]}`}
      >
        <div className={`w-20 h-20 rounded-full ${state === 'processing' ? 'bg-pink-500/20' : 'bg-cyan-400/20'} blur-md`} />
      </motion.div>

      {/* Particles (Simulated with simple divs for now) */}
      {state === 'speaking' && (
        <>
           <motion.div 
             className="absolute w-full h-full border border-cyan-500/30 rounded-full"
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: [0, 1, 0], scale: 1.5 }}
             transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
           />
           <motion.div 
             className="absolute w-full h-full border border-cyan-500/30 rounded-full"
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: [0, 1, 0], scale: 1.5 }}
             transition={{ duration: 2, repeat: Infinity, delay: 1.0 }}
           />
        </>
      )}
    </div>
  );
}
