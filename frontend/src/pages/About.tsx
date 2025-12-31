import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import logoMv from '../assets/logo-mv.svg';

const About = () => {
  const [sobreNos, setSobreNos] = useState("");

  useEffect(() => {
  fetch('https://milvendasapi.onrender.com/api/v1/settings')
    .then(res => res.json())
    .then(data => {
      if (data.sobre_nos) setSobreNos(data.sobre_nos);
    });
}, []);

  return (
    <section id="sobre" className="py-24 bg-slate-800/10 text-white relative px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center order-2 md:order-1"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full"></div>
            <img 
              src={logoMv} 
              alt="Sobre MV" 
              className="relative z-10 w-72 h-72 md:w-96 md:h-96 object-contain filter brightness-0 invert drop-shadow-2xl" 
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="order-1 md:order-2"
        >
          <h2 className="text-4xl font-bold mb-6">Compromisso com a Excelência</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-6">
            {/* Conteúdo dinâmico da API com fallback para o teu texto original */}
            {sobreNos || `A Mil Vendas não é apenas uma agência, é o seu braço direito tecnológico em Luanda. Utilizamos a marca "mv" como símbolo da nossa agilidade e precisão.`}
          </p>
          <ul className="space-y-4">
            {['Desenvolvimento Nativo', 'Cloud Computing', 'Segurança de Dados'].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-600/20 rounded flex items-center justify-center text-blue-500 font-bold">✓</div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default About;