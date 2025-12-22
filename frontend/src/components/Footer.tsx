import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-6 tracking-tighter">MIL VENDAS</h3>
            <p className="text-gray-500 max-w-sm mb-8">
              Líderes em soluções tecnológicas em Luanda. Conectamos marcas a pessoas através do código e do design.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -5, color: "#3b82f6", backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                  className="p-3 bg-slate-900 rounded-lg text-gray-400 transition-colors border border-white/5"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Links</h4>
            <ul className="space-y-4 text-gray-500">
              <li><a href="#services" className="hover:text-blue-500 transition-colors">Serviços</a></li>
              <li><a href="#sobre" className="hover:text-blue-500 transition-colors">Sobre Nós</a></li>
              <li><a href="#contato" className="hover:text-blue-500 transition-colors">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Newsletter</h4>
            <div className="flex flex-col gap-3">
              <input type="email" placeholder="Seu email" className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" />
              <motion.button 
                whileHover={{ scale: 1.02, boxShadow: "0px 0px 15px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-blue-600 text-white font-bold py-2 rounded-xl text-sm transition-all"
              >
                Subscrever
              </motion.button>
            </div>
          </div>
        </div>
        
        <div className="text-center pt-8 border-t border-white/5 text-gray-600 text-sm">
          © {new Date().getFullYear()} Mil Vendas. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;