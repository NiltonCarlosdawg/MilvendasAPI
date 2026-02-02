// src/components/PartnersCarousel.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Building2, Sparkles, Shield, Star } from 'lucide-react';

const PartnersCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Logos dos parceiros - apenas 4 como solicitado
  const partners = [
    {
      id: 1,
      name: 'Angonet',
      logo: '/partners/angonet.jpeg',
      alt: 'Angonet - Parceiro tecnológico',
      type: 'Parceiro',
      description: '',
      years: '6+ meses'
    },
    {
      id: 2,
      name: 'Governo Provincial do Huambo',
      logo: '/partners/huambo.jpeg',
      alt: 'Governo Provincial do Huambo',
      type: 'Parceiro',
      description: '',
      years: '6+ meses'
    },
    {
      id: 3,
      name: 'ICB-URBE',
      logo: '/partners/icb urbe.jpeg',
      alt: 'ICB-URBE',
      type: 'Parceiro',
      description: '',
      years: '6+ meses'
    },
    {
      id: 4,
      name: 'Banco ACCESS',
      logo: '/partners/access.jpeg',
      alt: 'Banco ACCESS',
      type: 'Parceiro',
      description: '',
      years: '6+ meses'
    },
    {
      id:5,
      name:'Socialite',
      logo:'/partners/socialite.jpeg',
      alt:'Socialite',
      type:'Parceiro',
      description:'',
      years: '6+ meses'
    },
    {
      id:6,
      name:'VHF',
      logo:'/partners/vhf.jpeg',
      alt:'Socialite',
      type:'Parceiro',
      description:'',
      years: '6+ meses'
    }
  ];

  // Responsividade
  const itemsPerPage = () => {
    if (window.innerWidth >= 1024) return 4; // Desktop: mostra todos os 4
    if (window.innerWidth >= 768) return 2;  // Tablet: mostra 2
    return 1; // Mobile: mostra 1
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

  // Auto-rotate apenas quando necessário
  useEffect(() => {
    if (isPaused || totalPages <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // 3 segundos que eu Melqui coloqueiiiiiiiiiii

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, totalPages]);

  // Reset index na mudança de tamanho
  useEffect(() => {
    const handleResize = () => {
      setCurrentIndex(0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calcular parceiros visíveis
  const startIndex = currentIndex * itemsPerPage();
  const visiblePartners = partners.slice(startIndex, startIndex + itemsPerPage());
  const needsNavigation = totalPages > 1;

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-900/20"></div>
      
      {/* Elementos decorativos */}
      <div className="absolute top-10 left-10 opacity-10">
        <Sparkles className="w-24 h-24 text-blue-500" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-10">
        <Shield className="w-24 h-24 text-blue-500" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho impressionante */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div 
            className="inline-flex items-center gap-3 mb-6"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full blur-lg opacity-50"></div>
              <div className="relative p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-2xl">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-blue-700 dark:from-white dark:to-blue-400 bg-clip-text text-transparent">
              Nossos Parceiros
            </h2>
          </motion.div>
          
          <motion.p 
            className="text-lg md:text-xl text-slate-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Colaboramos com as melhores instituições para oferecer soluções de 
            <span className="text-blue-600 dark:text-blue-400 font-semibold"> excelência e inovação</span>
          </motion.p>
        </motion.div>

        {/* Carrossel principal */}
        <div 
          className="relative"
          onMouseEnter={() => needsNavigation && setIsPaused(true)}
          onMouseLeave={() => needsNavigation && setIsPaused(false)}
        >
          {/* Overlay esquerdo gradiente */}
          <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-20 pointer-events-none"></div>
          
          {/* Overlay direito gradiente */}
          <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-20 pointer-events-none"></div>

          {/* Botão Anterior */}
          {needsNavigation && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 p-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all group"
              aria-label="Parceiro anterior"
            >
              <div className="relative">
                <ChevronLeft className="w-6 h-6 text-slate-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </motion.button>
          )}

          {/* Container dos Parceiros */}
          <div className="overflow-hidden px-4 md:px-8">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6, type: "spring" }}
              className={`grid ${
                itemsPerPage() === 4 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' 
                  : itemsPerPage() === 2 
                  ? 'grid-cols-1 md:grid-cols-2' 
                  : 'grid-cols-1'
              } gap-6 md:gap-8`}
            >
              {visiblePartners.map((partner, index) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group relative"
                >
                  {/* Card do parceiro */}
                  <div className="relative h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 shadow-lg hover:shadow-2xl overflow-hidden">
                    
                    {/* Efeito de brilho ao fundo */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Decoração do canto */}
                    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent transform rotate-45 translate-x-16 -translate-y-16"></div>
                    </div>

                    {/* Container da imagem - tamanho fixo e padronizado */}
                    <div className="relative h-40 mb-8 flex items-center justify-center">
                      {/* Efeito de brilho atrás da imagem */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50"></div>
                      
                      {/* Moldura da imagem */}
                      <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                        <div className="relative w-full h-full rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 group-hover:border-blue-500 transition-all duration-300 shadow-inner">
                          <img
                            src={partner.logo}
                            alt={partner.alt}
                            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Informações do parceiro */}
                    <div className="relative z-10 text-center">
                      {/* Nome do parceiro */}
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {partner.name}
                      </h3>
                      
                      {/* Tipo de parceiro */}
                      <div className="mb-4">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full border border-blue-100 dark:border-blue-800 group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-all">
                          <Star className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {partner.type}
                          </span>
                        </span>
                      </div>
                      
                      {/* Descrição */}
                      <p className="text-slate-600 dark:text-gray-300 text-sm mb-4 min-h-[40px]">
                        {partner.description}
                      </p>
                      
                      {/* Tempo de parceria */}
                      <div className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        {partner.years} de parceria
                      </div>
                    </div>

                    {/* Efeito hover */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-blue-500/20 transition-all duration-500 pointer-events-none"></div>
                  </div>

                  {/* Sombra projetada */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-blue-500/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Botão Próximo */}
          {needsNavigation && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 p-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all group"
              aria-label="Próximo parceiro"
            >
              <div className="relative">
                <ChevronRight className="w-6 h-6 text-slate-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-l from-blue-500/0 to-blue-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </motion.button>
          )}
        </div>

        {/* Indicadores de página */}
        {needsNavigation && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center items-center gap-3 mt-12"
          >
            {Array.from({ length: totalPages }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`relative rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-12 h-3 bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30'
                    : 'w-3 h-3 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                }`}
                aria-label={`Ir para página ${index + 1}`}
              >
                {index === currentIndex && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Instruções */}
        {needsNavigation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-slate-500 dark:text-gray-400 inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-200/50 dark:border-slate-700/50">
              <span className="flex h-2 w-2">
               
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Passe o mouse para pausar • Clique ou arraste para navegar
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PartnersCarousel;