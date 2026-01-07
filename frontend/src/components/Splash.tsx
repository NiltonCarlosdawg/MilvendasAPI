import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoMv from '../assets/logo-mv.svg';

const phrases = [
  "Iniciando sistemas de engenharia...",
  "Otimizando protocolos de rede...",
  "Sincronizando infraestrutura...",
  "Mil Vendas Consultoria"
];

const Splash = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev < phrases.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      exit={{ opacity: 0, scale: 1.1 }}
      className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center"
      >
        <img src={logoMv} alt="Logo" className="w-24 h-24 mb-12 brightness-0 invert" />
        
        <div className="w-48 h-[2px] bg-slate-800 rounded-full mb-6 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: "easeInOut" }}
            className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500"
          >
            {phrases[index]}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Splash;