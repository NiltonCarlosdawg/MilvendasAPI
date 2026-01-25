import { motion } from 'framer-motion';
import logoMv from '../assets/logo-mv.svg';
import { useSettings } from '../hooks/useSettings';

const Hero = () => {
  const { settings, loading } = useSettings();

  const defaultContent = {
    title_part1: "Tecnologia que",
    title_highlight: "Conecta e Inova",
    description: "A Mil Vendas entrega soluções digitais robustas, focadas na melhor experiência para o seu cliente.",
    button_text: "Contactar Equipa",
    whatsapp_number: "244922965959"
  };

  const content = {
    title_part1: settings['hero_title_1'] || defaultContent.title_part1,
    title_highlight: settings['hero_title_highlight'] || defaultContent.title_highlight,
    description: settings['hero_description'] || defaultContent.description,
    button_text: settings['hero_button_text'] || defaultContent.button_text,
    whatsapp: settings['hero_whatsapp'] || defaultContent.whatsapp_number
  };

  const whatsappUrl = `https://wa.me/${content.whatsapp}?text=Olá! Gostaria de falar sobre um projeto com a Mil Vendas.`;

  if (loading && Object.keys(settings).length === 0) {
    return <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-500" />; 
  }

  return (
    <section id="hero" className="min-h-screen flex items-center relative px-6 overflow-hidden">
      {/* Imagem de fundo principal */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-900/40 dark:from-slate-900/80 dark:to-slate-900/60"></div>
      </div>
      
      {/* Overlay com efeito glassmorphism/blur para melhorar legibilidade */}
      <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm"></div>

      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-12 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          {/* Container do texto com fundo semi-transparente para melhor contraste */}
          <div className="bg-white/20 dark:bg-black/30 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/30 dark:border-white/10">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              {content.title_part1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-100">
                {content.title_highlight}
              </span>
            </h1>
            
            <p className="mt-8 text-xl text-blue-50 dark:text-blue-100 max-w-lg">
              {content.description}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <motion.a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 30px rgba(59,130,246,0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-full font-bold shadow-lg transition-all text-lg text-center"
              >
                {content.button_text}
              </motion.a>
              
              <a 
                href="#contacto"
                className="bg-white/20 hover:bg-white/30 dark:bg-black/30 dark:hover:bg-black/40 border-2 border-white text-white px-8 py-5 rounded-full font-bold transition-all text-center backdrop-blur-sm"
              >
                Saber Mais
              </a>
            </div>
          </div>
        </motion.div>

        {/* LOGO com efeito borrado igual ao About.tsx */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex-1 flex justify-center relative"
        >
          {/* Efeito blur igual ao About.tsx - APENAS AQUI */}
          <div className="absolute inset-0 bg-blue-600/10 dark:bg-blue-600/20 blur-[100px] rounded-full transition-colors duration-500"></div>
          
          {/* Logo limpo e simples */}
          <img 
            src={logoMv} 
            alt="Mil Vendas" 
            className="relative z-10 w-72 h-72 md:w-[500px] md:h-[500px] object-contain filter drop-shadow-[0_0_40px_rgba(59,130,246,0.2)] brightness-0 dark:invert transition-all duration-500"
          />
        </motion.div>
      </div>

      {/* Elementos decorativos no fundo (opcional) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Hero;