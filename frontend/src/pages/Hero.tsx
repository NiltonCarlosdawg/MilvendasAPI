import React from 'react';
import { motion } from 'framer-motion';
import logoMv from '../assets/logo-mv.svg';

const Hero = () => {
  const whatsappUrl = "https://wa.me/244922965959?text=Olá! Gostaria de falar sobre um projeto com a Mil Vendas.";

  return (
    <section id="inicio" className="min-h-screen flex items-center relative px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-12 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Tecnologia que <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Conecta e Inova</span>
          </h1>
          <p className="mt-8 text-xl text-gray-400 max-w-lg">
            A Mil Vendas entrega soluções digitais robustas, focadas na melhor experiência para o seu cliente.
          </p>

          <div className="mt-10 flex gap-4">
            <motion.a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 30px rgba(59,130,246,0.6)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-10 py-5 rounded-full font-bold shadow-lg transition-all text-lg"
            >
              Contactar Equipa
            </motion.a>
          </div>
        </motion.div>

        {/* LOGO SVG EM DESTAQUE */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex-1 flex justify-center"
        >
          <img 
            src={logoMv} 
            alt="Mil Vendas" 
            className="w-72 h-72 md:w-[500px] md:h-[500px] object-contain filter drop-shadow-[0_0_40px_rgba(59,130,246,0.3)] brightness-0 invert"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;