import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronRight, 
  Zap, 
  ShieldCheck, 
  Code2, 
  Cpu, 
  Globe2, 
  Rocket 
} from 'lucide-react';

const Services = () => {
  const [services, setServices] = useState([]);
  const [activeService, setActiveService] = useState<any>(null);
  const BASE_URL = 'http://teu-dominio-api.com/api/v1'; // Substitui pelo URL da tua API

  useEffect(() => {
    fetch(`${BASE_URL}/services`)
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error("Erro API Services:", err));
  }, []);

  // Mapeamento de ícones baseado no nome ou slug do serviço
  const getIcon = (slug: string) => {
    const icons: any = {
      'software': <Code2 size={32} />,
      'eventos': <Zap size={32} />,
      'seguranca': <ShieldCheck size={32} />,
      'consultoria': <Cpu size={32} />,
      'marketing': <Globe2 size={32} />,
      'default': <Rocket size={32} />
    };
    return icons[slug] || icons['default'];
  };

  return (
    <section id="servicos" className="py-32 bg-slate-50 dark:bg-[#020617] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <header className="max-w-3xl mb-20">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-black dark:text-white tracking-tighter uppercase mb-6"
          >
            SOLUÇÕES <br /> <span className="text-blue-600 font-outline-2 text-transparent">QUE MOVEM_</span>
          </motion.h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
            Combinamos engenharia de software de ponta com excelência operacional para entregar resultados reais no mercado angolano.
          </p>
        </header>

        {/* Grid de Serviços Estilo Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: any, idx: number) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setActiveService(service)}
              className="group relative p-10 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 cursor-pointer hover:border-blue-500/50 transition-all duration-500"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                {getIcon(service.slug)}
              </div>
              
              <h3 className="text-2xl font-bold dark:text-white mb-4 group-hover:translate-x-2 transition-transform">
                {service.nome}
              </h3>
              
              <p className="text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 font-medium">
                {service.descricao_curta || service.descricao}
              </p>

              <div className="flex items-center gap-2 text-blue-600 text-xs font-black uppercase tracking-widest">
                Saiba Mais <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Detalhe Decorativo */}
              <div className="absolute top-8 right-8 text-slate-100 dark:text-white/5 font-black text-6xl select-none">
                0{idx + 1}
              </div>
            </motion.div>
          ))}
        </div>

        {/* MODAL DE DETALHES DO SERVIÇO (Slide-over ou Center) */}
        <AnimatePresence>
          {activeService && (
            <div className="fixed inset-0 z-[110] flex items-center justify-end">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveService(null)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
              />
              
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-full max-w-xl h-full bg-white dark:bg-slate-900 shadow-2xl p-12 overflow-y-auto"
              >
                <button 
                  onClick={() => setActiveService(null)}
                  className="absolute top-10 right-10 p-4 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 hover:rotate-90 transition-all"
                >
                  <X size={24} />
                </button>

                <div className="mt-20">
                  <div className="w-20 h-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center mb-8 shadow-xl shadow-blue-600/30">
                    {getIcon(activeService.slug)}
                  </div>
                  
                  <h3 className="text-5xl font-black dark:text-white mb-8 tracking-tighter leading-none">
                    {activeService.nome}
                  </h3>

                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8 font-medium">
                      {activeService.descricao}
                    </p>
                    
                    <h4 className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs mb-6">O que entregamos:</h4>
                    <ul className="grid grid-cols-1 gap-4">
                      {activeService.entregaveis?.map((item: string, i: number) => (
                        <li key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-700 dark:text-slate-300 font-bold">
                          <div className="w-2 h-2 rounded-full bg-blue-600" />
                          {item}
                        </li>
                      )) || (
                        <li className="text-slate-400 italic">Detalhes técnicos disponíveis sob consulta.</li>
                      )}
                    </ul>
                  </div>

                  <button className="w-full mt-12 py-6 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform">
                    Solicitar Orçamento
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Services;