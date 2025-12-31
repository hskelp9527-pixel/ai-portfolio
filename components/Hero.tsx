
import React from 'react';
import { motion } from 'framer-motion';
import { Theme } from '../types';

interface HeroProps {
  theme: Theme;
}

export const Hero: React.FC<HeroProps> = ({ theme }) => {
  return (
    <section id="about" className="min-h-[60vh] flex flex-col items-center justify-center relative overflow-hidden px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        className="text-center w-full select-none relative"
      >
        <h1 className={`text-[12vw] md:text-[8rem] lg:text-[10rem] font-bold tracking-tighter leading-[1.1] transition-colors duration-300 hero-text drop-shadow-2xl ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          拥抱AI
        </h1>
        <h1 className={`text-[12vw] md:text-[8rem] lg:text-[10rem] font-bold tracking-tighter leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r hero-text pb-6 ${theme === 'dark' ? 'from-blue-300 via-indigo-200 to-purple-200' : 'from-blue-600 via-indigo-500 to-purple-500'}`}>
          重塑生产力
        </h1>
      </motion.div>
    </section>
  );
};
