import React from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';
import { Link } from 'react-router-dom';
import { Target, Eye, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';

const About = () => {
  const { settings } = useSettings();

  const content = {
    title: settings['about_title'] || "Mil Vendas Consultoria",
    description: settings['about_description'] || "Empresa angolana especializada em serviços técnicos de telecomunicações, focada em infraestruturas críticas e parcerias estratégicas.",
  };

  const pillars = [
    {
      icon: <Target className="text-blue-500" size={24} />,
      title: "Missão",
      text: "Entregar excelência técnica em telecomunicações e engenharia, conectando Angola ao futuro."
    },
    {
      icon: <Eye className="text-indigo-500" size={24} />,
      title: "Visão",
      text: "Ser a referência nacional em inovação e manutenção de infraestruturas críticas até 2027."
    },
    {
      icon: <ShieldCheck className="text-emerald-500" size={24} />,
      title: "Valores",
      text: "Integridade, segurança operacional e compromisso rigoroso com os prazos dos nossos parceiros."
    }
  ];

  return (
    <section id="sobre" className="py-24 bg-white dark:bg-slate-900 overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* SUGESTÃO 4: LAYOUT SPLIT (Imagem + Texto) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          
          {/* Lado Esquerdo: Composição de Imagem */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974" 
                alt="Equipa Mil Vendas" 
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-blue-600/10 mix-blend-multiply" />
            </div>
            
            {/* Badge Flutuante de Autoridade */}
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-8 rounded-2xl shadow-xl hidden md:block"
            >
              <div className="text-4xl font-black">1+</div>
              <div className="text-xs uppercase tracking-widest opacity-80">Anos de Experiência</div>
            </motion.div>
          </motion.div>

          {/* Lado Direito: Texto e Diferenciais */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-blue-600 font-black uppercase tracking-tighter text-sm mb-4">
              Quem Somos
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
              {content.title}
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              {content.description}
            </p>

            <div className="space-y-4 mb-10">
              {['Sites Corporativos Profissionais', 'Manutenção Preventiva Especializada', 'Equipa Técnica Certificada'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-bold">
                  <CheckCircle2 className="text-blue-500" size={20} />
                  {item}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/sobre"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
              >
                <FileText size={20} />
                História Completa
              </Link>
            </div>
          </motion.div>
        </div>

        {/* SUGESTÃO 3: PILARES (Missão, Visão, Valores) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center mb-6 shadow-md group-hover:bg-blue-600 group-hover:text-white transition-all">
                {pillar.icon}
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white mb-3">
                {pillar.title}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                {pillar.text}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default About;