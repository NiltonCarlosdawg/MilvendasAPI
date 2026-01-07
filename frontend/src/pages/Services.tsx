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

  // Lista de Serviços com IMAGENS CORPORATIVAS
  const servicesList = [
    {
      title: settings['service_1_title'] || 'Engenharia de Telecomunicações',
      desc: settings['service_1_desc'] || 'Planeamento e otimização de redes críticas. A nossa equipa técnica garante conectividade estável no terreno.',
      // Imagem: Equipa técnica/engenheiros em campo ou data center
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2070&auto=format&fit=crop",
    },
    {
      title: settings['service_2_title'] || 'Desenvolvimento de Software',
      desc: settings['service_2_desc'] || 'Plataformas digitais à medida. Os nossos developers criam sistemas que aceleram os seus processos de negócio.',
      // Imagem: Equipa de desenvolvimento a colaborar
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
    },
    {
      title: settings['service_3_title'] || 'Soluções Mobile & Apps',
      desc: settings['service_3_desc'] || 'Aplicações nativas focadas na experiência do utilizador, desenhadas para conectar a sua empresa aos clientes.',
      // Imagem: Profissionais a analisar UX/UI em dispositivos móveis
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    },
    {
      title: settings['service_4_title'] || 'Consultoria Estratégica & O&M',
      desc: settings['service_4_desc'] || 'Gestão de infraestruturas e consultoria de TI para assegurar a continuidade e o crescimento operacional.',
      // Imagem: Reunião executiva/estratégica
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop",
    }
  ];

  return (
    <section id="servicos" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Decorativo Subtil */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Cabeçalho da Secção */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-blue-500 font-bold tracking-widest uppercase text-sm bg-blue-500/10 px-4 py-2 rounded-full"
          >
            O Que Fazemos
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-6 text-4xl md:text-5xl font-black text-white"
          >
            Expertise Humana, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Resultados Tecnológicos
            </span>
          </motion.h2>
        </div>

        {/* Grid de Serviços com Imagens */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {servicesList.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }} // O card sobe ligeiramente
              className="group relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col h-full hover:border-blue-500/50 transition-all duration-500 shadow-lg shadow-black/50"
            >
              {/* Contentor da Imagem (Topo) */}
              <div className="relative h-56 overflow-hidden">
                {/* Overlay para escurecer a imagem ligeiramente */}
                <div className="absolute inset-0 bg-slate-900/30 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Contentor do Texto (Base) */}
              <div className="p-8 flex flex-col flex-grow relative z-20 bg-slate-900">
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>

                <p className="text-slate-400 leading-relaxed text-sm mb-8 flex-grow">
                  {service.desc}
                </p>

                {/* Link Simulado */}
                <div className="flex items-center gap-2 text-sm font-bold text-slate-500 group-hover:text-white transition-colors mt-auto cursor-pointer">
                  <span>Saber mais</span>
                  <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
              
               {/* Brilho subtil nas bordas ao passar o rato */}
               <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-3xl pointer-events-none transition-all duration-500"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;