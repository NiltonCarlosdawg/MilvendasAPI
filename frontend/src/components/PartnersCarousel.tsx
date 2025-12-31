// src/components/PartnersCarousel.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Building2 } from 'lucide-react';

const PartnersCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Logos dos parceiros - imagens fictícias + Angonet real
  const partners = [
    {
      id: 1,
      name: 'Angonet',
      logo: ' /partners/angonet.jpeg', // Logo real que você vai adicionar
      alt: 'Angonet - Parceiro tecnológico',
      website: 'https://angonet.com'
    },
    {
      id: 2,
      name: 'Tech Solutions Angola',
      logo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      alt: 'Tech Solutions Angola',
      website: '#'
    },
    {
      id: 3,
      name: 'Inovação Digital LDA',
      logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      alt: 'Inovação Digital LDA',
      website: '#'
    },
    {
      id: 4,
      name: 'Startup Hub Luanda',
      logo: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      alt: 'Startup Hub Luanda',
      website: '#'
    },
    {
      id: 5,
      name: 'Cloud Systems Africa',
      logo: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      alt: 'Cloud Systems Africa',
      website: '#'
    },
    {
      id: 6,
      name: 'Digital Partners',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      alt: 'Digital Partners',
      website: '#'
    },
    {
      id: 7,
      name: 'Angola Tech Partners',
      logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      alt: 'Angola Tech Partners',
      website: '#'
    },
    {
      id: 8,
      name: 'Innovation Africa',
      logo: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      alt: 'Innovation Africa',
      website: '#'
    }
  ];

  // Para demonstração, vamos usar imagens Unsplash como placeholders
  // Na produção, você colocará os logos reais na pasta public/partners/

  const itemsPerPage = () => {
    if (window.innerWidth >= 1280) return 5; // xl
    if (window.innerWidth >= 1024) return 4; // lg
    if (window.innerWidth >= 768) return 3; // md
    return 2; // sm
  };

  const totalPages = Math.ceil(partners.length / itemsPerPage());

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-rotate
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Muda a cada 4 segundos

    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  // Reset index quando muda o tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      setCurrentIndex(0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calcular quais parceiros mostrar na página atual
  const startIndex = currentIndex * itemsPerPage();
  const visiblePartners = partners.slice(startIndex, startIndex + itemsPerPage());

  return (
    <section className="bg-slate-50 dark:bg-slate-800/30 py-12 border-y border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Parceiros de Confiança
            </h2>
          </div>
          <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
            Trabalhamos com as melhores empresas para entregar soluções de excelência
          </p>
        </motion.div>

        {/* Carrossel */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          {/* Botão Anterior */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-700 hover:scale-110 transition-all"
            aria-label="Parceiro anterior"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-gray-300" />
          </button>

          {/* Logos dos Parceiros */}
          <div className="overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              {visiblePartners.map((partner) => (
                <motion.div
                  key={partner.id}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all group"
                >
                  <div className="relative h-24 flex items-center justify-center">
                    {partner.id === 1 ? (
                      // Para Angonet (logo real)
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 dark:from-blue-500/5 dark:to-blue-600/5 rounded-xl blur-sm group-hover:blur-0 transition-all" />
                        <div className="relative z-10 flex items-center justify-center">


                          {/* Placeholder para logo Angonet */}
                          <div className="text-center">
                            <img src=" /partners/angonet.jpeg" alt="" />
                          </div>
                        </div>
                      </div>
                    ) : (


                      // Para outros parceiros (imagens fictícias)
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl blur-sm group-hover:blur-0 transition-all" />
                        <img
                          src={partner.logo}
                          alt={partner.alt}
                          className="relative z-10 w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 text-center">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {partner.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      Parceiro {partner.id === 1 ? 'Oficial' : 'Estratégico'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Botão Próximo */}
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-700 hover:scale-110 transition-all"
            aria-label="Próximo parceiro"
          >
            <ChevronRight className="w-5 h-5 text-slate-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Indicadores de Página */}
        <div className="flex justify-center items-center gap-2 mt-10">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-blue-600 w-8'
                  : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
              }`}
              aria-label={`Ir para página ${index + 1}`}
            />
          ))}
        </div>

        {/* Instruções */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-slate-500 dark:text-gray-500">
            Passe o mouse sobre o carrossel para pausar • Clique nas setas para navegar
          </p>
          
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersCarousel;