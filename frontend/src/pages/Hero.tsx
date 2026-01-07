import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  // SLIDE 1: Foco na Visão Macro e Parceria Estratégica
  {
    title: "Impulsionamos o Futuro dos Negócios em Angola",
    // A descrição não diz "o que" fazem, mas "como" o cliente se beneficia.
    desc: "Mais do que consultoria, somos parceiros estratégicos na transformação digital e no crescimento sustentável da sua empresa perante os desafios do mercado.",
    // Imagem sugerida: Algo que remeta a crescimento, cidade moderna ou networking empresarial de alto nível.
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070", // Exemplo: Arranha-céus corporativos
    button: "Conheça Nossa Visão"
  },

  // SLIDE 2: Foco na Expertise Técnica/Inovação (sem listar serviços)
  {
    title: "Soluções Inteligentes para Desafios Complexos",
    // Foca na capacidade de resolver problemas difíceis usando tecnologia.
    desc: "Conectamos inovação tecnológica a resultados práticos. Otimizamos infraestruturas e processos cruciais para a excelência operacional na era digital.",
    // Imagem sugerida: Algo tecnológico, dados, redes ou infraestrutura abstrata.
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072", // Exemplo: Rede global/tecnologia
    button: "Nossas Especialidades"
  },

  // SLIDE 3: Foco em Resultados e Liderança de Mercado
  {
    title: "Redefinindo Padrões de Desempenho",
    // Foca no resultado final para o cliente: ser líder.
    desc: "Estratégias comprovadas que elevam a sua operação. Preparamos o seu negócio não apenas para competir, mas para liderar o seu setor.",
    // Imagem sugerida: Algo que transmita sucesso, topo, liderança ou uma equipa confiante.
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070", // Exemplo: Equipa em reunião estratégica
    button: "Veja o Impacto"
  }
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  // Auto-play de 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-slate-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* Imagem de Fundo com Overlay para leitura */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] scale-110"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent" />
          
          {/* Conteúdo Centralizado */}
          <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-black text-white mb-6 max-w-2xl"
            >
              {slides[current].title}
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-slate-200 mb-10 max-w-xl"
            >
              {slides[current].desc}
            </motion.p>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="w-fit px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all"
            >
              {slides[current].button}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navegação (Dots) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button 
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 transition-all rounded-full ${current === i ? 'w-8 bg-blue-500' : 'w-2 bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;