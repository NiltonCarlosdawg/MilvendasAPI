import React, { useState } from 'react';
import { 
  Facebook, Linkedin, Instagram, Mail, Phone, MapPin, 
  ArrowUp, ChevronRight, Send, Loader2, CheckCircle2 
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import logoMv from '../assets/logo-mv.svg';

const Footer = () => {
  const { settings } = useSettings();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de subscrição
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }, 1500);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-slate-950 text-slate-400 pt-20 pb-10 border-t border-slate-900 relative overflow-hidden">
      {/* Glow Effect Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* SECÇÃO DE NEWSLETTER (Adicionada) */}
        <div className="bg-slate-900/50 border border-slate-800 p-8 md:p-12 rounded-[3rem] mb-20 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-md">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-3">Fique por dentro da tecnologia em Angola</h3>
            <p className="text-sm text-slate-400">Receba os nossos relatórios mensais sobre infraestrutura e inovação diretamente no seu email.</p>
          </div>
          <form onSubmit={handleSubscribe} className="w-full lg:max-w-md relative">
            <input 
              required
              type="email"
              placeholder="Seu melhor email corporativo"
              className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl py-5 px-6 outline-none focus:border-blue-600 transition-all text-white font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button 
              type="submit"
              disabled={loading || subscribed}
              className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : 
               subscribed ? <CheckCircle2 size={20} /> : 
               <><span className="hidden sm:inline">Subscrever</span> <Send size={18} /></>}
            </button>
          </form>
        </div>

        {/* GRID DE LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Branding */}
          <div className="space-y-6">
            <img src={logoMv} alt="Mil Vendas" className="h-10 w-auto brightness-0 invert" />
            <p className="text-sm leading-relaxed">
              Excelência técnica em telecomunicações e engenharia. Parceiros estratégicos na construção da Angola digital.
            </p>
            <div className="flex gap-4">
              {[Linkedin, Facebook, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navegação */}
          <div>
            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-blue-600"></span> Links Úteis
            </h4>
            <ul className="space-y-3 text-sm">
              {['Início', 'Sobre', 'Serviços', 'Portfólio', 'Notícias'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="hover:text-blue-500 flex items-center gap-2 group transition-colors">
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Serviços (Dinâmico se quiseres) */}
          <div>
            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-blue-600"></span> Especialidades
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>Engenharia de Redes RF</li>
              <li>Manutenção Crítica O&M</li>
              <li>Desenvolvimento de Software</li>
              <li>Consultoria TI & Redes</li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-blue-600"></span> Contacto
            </h4>
            <div className="space-y-4 text-sm">
              <p className="flex gap-3"><MapPin size={18} className="text-blue-500 shrink-0" /> Nova Vida, Rua 120, Luanda</p>
              <p className="flex gap-3"><Phone size={18} className="text-blue-500 shrink-0" /> {settings['contact_phone'] || '+244 922 965 959'}</p>
              <p className="flex gap-3"><Mail size={18} className="text-blue-500 shrink-0" /> {settings['contact_email'] || 'geral@milvendas.ao'}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs">© {currentYear} Mil Vendas Consultoria. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <button onClick={scrollToTop} className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;