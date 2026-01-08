import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

const Services = () => {
  const { settings } = useSettings();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const servicesList = [
    {
      title: settings['service_1_title'] || 'Engenharia de Telecomunicações',
      desc: settings['service_1_desc'] || 'Planeamento e otimização de redes críticas. A nossa equipa técnica garante conectividade estável no terreno.',
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2070&auto=format&fit=crop",
    },
    {
      title: settings['service_2_title'] || 'Desenvolvimento de Software',
      desc: settings['service_2_desc'] || 'Plataformas digitais à medida. Os nossos developers criam sistemas que aceleram os seus processos de negócio.',
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop",
    },
    {
      title: settings['service_3_title'] || 'Manutenção Industrial',
      desc: settings['service_3_desc'] || 'Suporte técnico especializado para infraestruturas de energia e sistemas críticos 24/7.',
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    }
  ];

  return (
    /* bg-transparent para revelar o logo de fundo do App.tsx */
    <section id="servicos" className="py-24 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-none">
              Soluções Técnicas <br /> <span className="text-blue-600">de Alta Performance</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
              Combinamos tecnologia de ponta com execução rigorosa para garantir a continuidade do seu negócio.
            </p>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {servicesList.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative flex flex-col h-full rounded-[2.5rem] overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-2xl"
            >
              {/* Imagem com Overlay mais leve para transparência */}
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-90 dark:opacity-80"
                />
              </div>

              {/* Contentor do Texto - Glassmorphism Aplicado */}
              <div className="p-8 flex flex-col flex-grow relative z-20 bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl transition-colors duration-500">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-blue-500 transition-colors">
                  {service.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-8 flex-grow font-medium">
                  {service.desc}
                </p>

                {/* Link Simulado */}
                <div className="flex items-center gap-2 text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-auto cursor-pointer">
                  <span>Saber mais</span>
                  <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
              
               {/* Brilho nas bordas */}
               <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/30 rounded-[2.5rem] pointer-events-none transition-all duration-500"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Elemento decorativo translúcido para ajudar na profundidade */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] -z-10" />
    </section>
  );
};

export default Services;