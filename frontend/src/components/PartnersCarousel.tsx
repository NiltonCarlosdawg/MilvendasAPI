import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

const PartnersCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Mantendo os teus dados originais
  const partners = [
    {
      id: 1,
      name: 'Angonet',
      logo: '/partners/angonet.jpeg',
      alt: 'Angonet - Parceiro tecnológico',
    },
    {
      id: 2,
      name: 'Tech Solutions Angola',
      logo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      alt: 'Tech Solutions Angola',
    },
    {
      id: 3,
      name: 'Inovação Digital LDA',
      logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      alt: 'Inovação Digital LDA',
    },
    {
      id: 4,
      name: 'Telecom Pro',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      alt: 'Telecom Pro',
    }
  ];

  const itemsPerPage = { mobile: 2, desktop: 4 };
  const totalPages = Math.ceil(partners.length / itemsPerPage.desktop);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalPages);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, totalPages]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % totalPages);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);

  return (
    <section className="py-20 bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Título Minimalista */}
        <div className="flex flex-col items-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4"
          >
            <ShieldCheck size={14} />
            <span>Trusted Partners</span>
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white text-center">
            Empresas que confiam na nossa <span className="text-blue-600 italic">excelência</span>
          </h2>
        </div>

        <div 
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Container do Carousel */}
          <div className="flex justify-center items-center gap-8 md:gap-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 items-center justify-items-center w-full"
              >
                {partners.slice(currentIndex * itemsPerPage.desktop, (currentIndex + 1) * itemsPerPage.desktop).map((partner) => (
                  <div key={partner.id} className="relative group/logo w-full flex justify-center">
                    <img
                      src={partner.logo}
                      alt={partner.alt}
                      className="h-12 md:h-16 w-auto object-contain grayscale opacity-40 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 transition-all duration-500"
                    />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Botões de Navegação (Apenas visíveis no hover ou desktop) */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all z-20"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all z-20"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Indicadores de Página Modernos */}
        <div className="flex justify-center gap-3 mt-12">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentIndex ? 'bg-blue-600 w-10' : 'bg-slate-200 dark:bg-slate-800 w-4 hover:bg-slate-300'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default PartnersCarousel;