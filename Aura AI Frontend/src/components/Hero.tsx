import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <div className="relative pt-20 pb-16 px-6 text-center overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-aura-purple/20 blur-[120px] rounded-full -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wider uppercase text-aura-purple">
          <Sparkles size={14} />
          <span>The Future of Intelligence</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight leading-[0.9]">
          Experience <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-aura-purple via-aura-pink to-aura-purple bg-[length:200%_auto] animate-gradient">
            Aura AI
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/60 max-w-xl mx-auto leading-relaxed font-light">
          A sophisticated conversational partner designed to elevate your productivity and spark your creativity.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <button 
            onClick={onGetStarted}
            className="px-8 py-4 rounded-2xl bg-white text-black font-bold flex items-center gap-2 hover:bg-white/90 transition-all hover:scale-105 active:scale-95"
          >
            Get Started <ArrowRight size={18} />
          </button>
          <button 
            onClick={onGetStarted}
            className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all"
          >
            Learn More
          </button>
        </div>
      </motion.div>
    </div>
  );
};
