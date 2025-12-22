import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './pages/Hero';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import WhatsappButton from './components/WhatsappButton';

// Importação do SVG
import logoMv from './assets/logo-mv.svg'; 

function App() {
  return (
    <div className="bg-slate-900 min-h-screen font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden relative">
      
      {/* MARCA D'ÁGUA NO FUNDO (SVG) */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <motion.img 
          src={logoMv} 
          alt="" 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.12, scale: 1.1 }} 
          transition={{ duration: 2 }}
          className="w-[85%] md:w-[55%] filter brightness-0 invert" 
        />
      </div>

      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Services />
          <About />
          <Contact />
        </main>
        <Footer />
        <WhatsappButton />
      </div>
    </div>
  );
}

export default App;