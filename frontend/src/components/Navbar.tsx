import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

// Importação do teu logo SVG
import logoMv from '../assets/logo-mv.svg';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappUrl = "https://wa.me/244922965959";

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      isScrolled ? 'bg-slate-900/90 backdrop-blur-xl py-4 border-b border-white/5 shadow-2xl' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO COM EFEITO DE PULSO NO HOVER */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ 
              scale: [1, 1.15, 1], // Faz o logo crescer e voltar
              transition: { 
                duration: 0.8, 
                repeat: Infinity, // Repete o pulso enquanto o rato estiver em cima
                ease: "easeInOut" 
              } 
            }}
            className="relative"
          >
            {/* Brilho de fundo que pulsa junto com o logo */}
            <motion.div 
              whileHover={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.4, 1]
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="absolute inset-0 bg-blue-500/40 blur-lg rounded-full"
            />
            
            <img 
              src={logoMv} 
              alt="Mil Vendas Logo" 
              className="h-10 w-10 relative z-10 object-contain filter brightness-0 invert drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
            />
          </motion.div>
          
          <span className="text-white font-bold tracking-tighter text-xl group-hover:text-blue-400 transition-colors">
            MIL VENDAS
          </span>
        </div>
        
        {/* LINKS DESKTOP */}
        <div className="hidden md:flex items-center space-x-10">
          {['Início', 'Serviços', 'Sobre', 'Contato'].map((item) => (
            <a 
              key={item} 
              href={`#${item === 'Início' ? 'inicio' : item.toLowerCase()}`} 
              className="text-gray-300 hover:text-blue-400 font-medium transition-colors"
            >
              {item}
            </a>
          ))}
          
          <motion.a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(59, 130, 246, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold transition-all"
          >
            Fale Connosco
          </motion.a>
        </div>

        {/* BOTÃO MOBILE */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;