import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, MousePointer2 } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-[#030712]">
      
      {/* Luzes de fundo (Glow Effects) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 dark:bg-blue-600/20 blur-[130px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 dark:bg-cyan-500/15 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          
          {/* Badge de introdução animada */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 mb-10"
          >
            <Sparkles size={14} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Inovação Digital em Angola
            </span>
          </motion.div>

          {/* Título com gradiente e estilo "Bento" */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-slate-950 dark:text-white tracking-tighter leading-[0.85] mb-10">
              MILVENDAS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-500">
                GROUP_
              </span>
            </h1>
          </motion.div>

          {/* Parágrafo focado em conversão */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-12"
          >
            Especialistas em transformar ideias em **experiências digitais de alto impacto**. De eventos tecnológicos a soluções corporativas, definimos o padrão de excelência.
          </motion.p>

          {/* Grupo de Botões Dinâmicos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-5"
          >
            <button 
              onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] flex items-center gap-3"
            >
              Explorar Portfólio <ArrowRight size={18} />
            </button>
            
            <button 
              onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 bg-transparent border-2 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
            >
              Vamos Conversar?
            </button>
          </motion.div>
        </div>
      </div>

      {/* Decoração Lateral: Texto Vertical ou Elemento de Mouse */}
      <div className="absolute right-10 bottom-10 hidden lg:flex flex-col items-center gap-4">
        <span className="[writing-mode:vertical-lr] text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 dark:text-slate-700">
          Scroll para explorar
        </span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-blue-600"
        >
          <MousePointer2 size={20} />
        </motion.div>
      </div>

      {/* Grid Decorativo de fundo */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
    </section>
  );
};

export default Hero;