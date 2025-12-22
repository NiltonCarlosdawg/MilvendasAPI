import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Smartphone, Globe, BarChart3 } from 'lucide-react';

const services = [
  { title: 'Web Development', desc: 'Aplicações robustas com React, Node e as tecnologias mais recentes.', icon: <Code2 className="w-8 h-8 text-blue-500" /> },
  { title: 'Telecomunicações', desc: 'Consultoria especializada para otimizar a conectividade da sua empresa.', icon: <Globe className="w-8 h-8 text-blue-500" /> },
  { title: 'Mobile Solutions', desc: 'Apps nativas e híbridas focadas na experiência do utilizador.', icon: <Smartphone className="w-8 h-8 text-blue-500" /> },
  { title: 'Consultoria Tech', desc: 'Estratégia digital para escalar o seu modelo de negócio.', icon: <BarChart3 className="w-8 h-8 text-blue-500" /> }
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-blue-500 font-semibold tracking-wide uppercase text-sm">O que fazemos</h2>
          <p className="mt-2 text-4xl font-bold text-white">Soluções Completas</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:border-blue-500 transition-all group cursor-default"
            >
              <div className="mb-4 group-hover:scale-110 transition-transform">{s.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;