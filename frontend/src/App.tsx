import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { AppearanceProvider } from './context/AppearanceProvider';
import Splash from './components/Splash';
import Customizer from './components/Customizer';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsappButton from './components/WhatsappButton';

import Hero from './pages/Hero';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';

import logoMv from './assets/logo-mv.svg';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [showCustomizer, setShowCustomizer] = useState(false);

  useEffect(() => {
    // Aumentado para 6000ms (6 segundos) conforme solicitado
    const timer = setTimeout(() => {
      setShowSplash(false);
      const skip = localStorage.getItem('skipCustomizer');
      if (skip !== 'true') {
        setShowCustomizer(true);
      }
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-500">
      <AnimatePresence mode="wait">
        {showSplash && <Splash key="splash" />}
      </AnimatePresence>

      {!showSplash && (
        <>
          <AnimatePresence>
            {showCustomizer && (
              <Customizer 
                key="customizer" 
                onComplete={() => setShowCustomizer(false)} 
              />
            )}
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="bg-white dark:bg-slate-900 min-h-screen transition-colors duration-500 selection:bg-blue-500 selection:text-white overflow-x-hidden relative"
          >
            {/* MARCA D'ÁGUA GLOBAL */}
            <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
              <motion.img 
                src={logoMv} 
                alt="" 
                animate={{ opacity: 0.05, scale: 1.1 }} 
                className="w-[85%] md:w-[55%] filter brightness-0 dark:invert transition-all duration-500" 
              />
            </div>

            {/* CONTEÚDO PRINCIPAL */}
            <div className="relative z-10 text-slate-900 dark:text-white transition-colors duration-500">
              <Navbar />
              
              <main>
                <Routes>
                  <Route path="/" element={
                    <>
                      {/* IDs para funcionamento das rotas de âncora do Header */}
                      <section id="home"><Hero /></section>
                      <section id="servicos"><Services /></section>
                      <section id="sobre"><About /></section>
                      <section id="contacto"><Contact /></section>
                    </>
                  } />
                </Routes>
              </main>

              <Footer />
              <WhatsappButton />
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppearanceProvider>
      <AppContent />
    </AppearanceProvider>
  );
}