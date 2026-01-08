import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    title: "Impulsionamos o Futuro dos Negócios em Angola",
    desc: "Mais do que consultoria, somos parceiros estratégicos na transformação digital e no crescimento sustentável da sua empresa perante os desafios do mercado.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070",
    button: "Conheça Nossa Visão"
  },
  {
    title: "Soluções Inteligentes para Desafios Complexos",
    desc: "Conectamos inovação tecnológica a resultados práticos. Otimizamos infraestruturas e processos cruciais para a excelência operacional na era digital.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072",
    button: "Ver Tecnologia"
  },
  {
    title: "Excelência em Engenharia e Telecomunicações",
    desc: "Garantimos a continuidade do seu negócio com manutenção rigorosa e implementação de redes de alta performance em todo o território nacional.",
    image: "https://images.unsplash.com/photo-1573163281534-116bbae807c0?q=80&w=2070",
    button: "Nossa Expertise"
  },
  {
    title: "Conectividade Sem Fronteiras para sua Empresa",
    desc: "Desenvolvemos infraestruturas de rede robustas que garantem estabilidade e velocidade, essenciais para a expansão do seu negócio em Angola.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2070",
    button: "Explorar Redes"
  },
  {
    title: "Inovação Digital com Foco em Resultados",
    desc: "Transformamos dados em decisões. Nossa consultoria especializada guia sua jornada de digitalização com as ferramentas mais avançadas do mercado.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070",
    button: "Digitalizar Agora"
  }
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[90vh] md:h-screen w-full overflow-hidden bg-transparent">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          {/* Imagem de Fundo */}
          <div className="absolute inset-0 z-0">
            <img 
              src={slides[current].image} 
              alt="" 
              className="w-full h-full object-cover"
            />
            {/* Overlays de Leitura */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-slate-950 z-10" />
          </div>

          {/* Conteúdo */}
          <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-8xl font-black text-white mb-6 max-w-4xl leading-[0.9] tracking-tighter">
                {slides[current].title.split(' ').map((word, i) => (
                  <span key={i} className={(i === 1 || i === 4) ? "text-blue-500" : ""}>
                    {word}{' '}
                  </span>
                ))}
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-200 mb-10 max-w-xl font-medium leading-relaxed opacity-90">
                {slides[current].desc}
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/30 text-sm uppercase tracking-widest"
                >
                  {slides[current].button}
                </motion.button>
                
                <motion.button
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                  className="px-10 py-5 bg-white/5 backdrop-blur-md border border-white/20 text-white font-black rounded-2xl transition-all text-sm uppercase tracking-widest"
                >
                  Falar com Consultor
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicadores de Slide (Dots) */}
      <div className="absolute bottom-12 right-12 z-30 flex gap-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`group relative h-1 transition-all duration-500 ${
              current === i ? "w-16 bg-blue-500" : "w-8 bg-white/30"
            }`}
          >
            <span className="absolute -top-4 left-0 text-[10px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
              0{i + 1}
            </span>
          </button>
        ))}
      </div>

      {/* Linha Decorativa Lateral */}
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-blue-500/50 to-transparent z-20" />
    </section>
  );
};

export default Hero;