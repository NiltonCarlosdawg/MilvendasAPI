// src/components/Footer.tsx - ATUALIZADO com Integração de API
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Twitter, Lock, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setStatus('loading');
      
      // Chamada para a rota definida em newsletter.routes.js
      const response = await fetch('https://milvendasapi.onrender.com/api/v1/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Subscrição efetuada com sucesso!');
        setEmail('');
        // Reset do status após 5 segundos
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        throw new Error(data.message || 'Erro ao subscrever.');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Ocorreu um erro. Tente mais tarde.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <footer className="bg-slate-950 pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-6 tracking-tighter italic">MIL VENDAS</h3>
            <p className="text-gray-500 max-w-sm mb-8">
              Líderes em soluções tecnológicas em Luanda. Conectamos marcas a pessoas através do código e do design.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, link: "#" },
                { Icon: Instagram, link: "#" },
                { Icon: Linkedin, link: "#" },
                { Icon: Twitter, link: "#" }
              ].map(({ Icon, link }, i) => (
                <motion.a
                  key={i}
                  href={link}
                  whileHover={{ y: -5, color: "#3b82f6", backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                  className="p-3 bg-slate-900 rounded-lg text-gray-400 transition-colors border border-white/5"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Explorar</h4>
            <ul className="space-y-4 text-gray-500">
              <li><a href="/#servicos" className="hover:text-blue-500 transition-colors">Serviços</a></li>
              <li><a href="/#sobre" className="hover:text-blue-500 transition-colors">Sobre Nós</a></li>
              <li><Link to="/portfolio" className="hover:text-blue-500 transition-colors">Portfólio</Link></li>
              <li><Link to="/events" className="hover:text-blue-500 transition-colors">Eventos</Link></li>
              <li><a href="/#contacto" className="hover:text-blue-500 transition-colors">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
              <Mail size={18} className="text-blue-500" />
              Newsletter
            </h4>
            
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-3 text-blue-400"
              >
                <CheckCircle2 size={20} />
                <p className="text-xs font-medium">{message}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Seu melhor email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50"
                  required
                />
                <motion.button 
                  type="submit"
                  disabled={status === 'loading'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : 'Subscrever'}
                </motion.button>
                {status === 'error' && (
                  <p className="text-[10px] text-red-500 font-medium px-1">{message}</p>
                )}
              </form>
            )}
            
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-gray-600 text-[10px] uppercase tracking-widest font-bold">
          <p>© {new Date().getFullYear()} Mil Vendas Digital. Luanda, Angola.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;