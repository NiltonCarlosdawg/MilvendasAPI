//import React from 'react';
import { motion } from 'framer-motion';
import logoMv from '../assets/logo-mv.svg';
import { useSettings } from '../hooks/useSettings';
import { Link } from 'react-router-dom';

const About = () => {
  const { settings, loading } = useSettings();

  // Conteúdo baseado na apresentação da empresa
  const defaultContent = {
    title: "Mil Vendas Consultoria",
    description: "Empresa angolana especializada em serviços técnicos de telecomunicações, com foco em planeamento, instalação, optimização e manutenção de redes e infraestruturas críticas. Atuamos como parceiro técnico de operadoras e integradores.",
    features: [
      'Planejamento & Otimização RF',
      'Instalação & Montagem de Infraestruturas',
      'Operação & Manutenção (O&M)',
      'Redes IT, VoIP e Soluções Software'
    ]
  };

  const content = {
    title: settings['about_title'] || defaultContent.title,
    description: settings['about_description'] || defaultContent.description,
    features: [
      settings['about_feature_1'] || defaultContent.features[0],
      settings['about_feature_2'] || defaultContent.features[1],
      settings['about_feature_3'] || defaultContent.features[2],
      settings['about_feature_4'] || defaultContent.features[3],
    ]
  };

  if (loading && Object.keys(settings).length === 0) {
    return <div className="py-24 bg-white dark:bg-slate-900 min-h-[500px] transition-colors duration-500" />;
  }

  return (
    <>
      <section id="sobre" className="py-24 bg-white dark:bg-slate-800/10 text-slate-900 dark:text-white relative px-6 transition-colors duration-500">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex justify-center order-2 md:order-1"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600/10 dark:bg-blue-600/20 blur-[100px] rounded-full transition-colors duration-500"></div>
              <img 
                src={logoMv} 
                alt="Sobre MV" 
                className="relative z-10 w-72 h-72 md:w-96 md:h-96 object-contain filter brightness-0 dark:invert drop-shadow-2xl transition-all duration-500" 
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 md:order-2"
          >
            <h2 className="text-4xl font-bold mb-6 transition-colors duration-500">{content.title}</h2>
            <p className="text-slate-600 dark:text-gray-400 text-lg leading-relaxed mb-6 transition-colors duration-500">
              {content.description}
            </p>
            
            <ul className="space-y-4 mb-8">
              {content.features.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-600/10 dark:bg-blue-600/20 rounded flex items-center justify-center text-blue-600 dark:text-blue-500 font-bold transition-colors duration-500">
                    ✓
                  </div>
                  <span className="text-slate-700 dark:text-gray-200 transition-colors duration-500">{item}</span>
                </li>
              ))}
            </ul>

            {/* Botão para ver apresentação completa - SEM TARGET BLANK */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Ver Apresentação Completa
              </Link>
              
              <a
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-semibold rounded-xl transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Contactar Agora
              </a>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Seção da equipe */}
      
    </>
  );
};

export default About;