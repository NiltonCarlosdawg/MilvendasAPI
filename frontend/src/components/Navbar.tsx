// src/components/Navbar.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logoMv from '../assets/logo-mv.svg';
import { useAppearance } from '../hooks/useAppearance';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useAppearance();
  const location = useLocation();

  // Links atualizados para navegar entre páginas e secções da Home
  const navLinks = [
    { name: 'Serviços', href: '/#servicos' },
    { name: 'Sobre', href: '/#sobre' },
    { name: 'Portfólio', href: '/portfolio' },
    { name: 'Eventos', href: '/events' },
    { name: 'Blog', href: '/news' },
    { name: 'Contacto', href: '/#contacto' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? 'py-4 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-xl' 
            : 'py-8 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="relative z-10 flex items-center gap-3 group">
            {/* LÓGICA DO LOGOTIPO: 
                brightness-0: Transforma letras brancas em preto no Light Mode
                dark:brightness-100: Mantém o branco original no Dark Mode
            */}
            <img 
              src={logoMv} 
              alt="Mil Vendas" 
              className="h-10 md:h-12 w-auto transition-all duration-300 brightness-0 dark:brightness-100" 
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-black uppercase tracking-widest transition-all hover:text-blue-600 ${
                  scrolled 
                    ? 'text-slate-600 dark:text-slate-300' 
                    : 'text-slate-900 dark:text-white'
                } ${location.pathname === link.href ? 'text-blue-600' : ''}`}
              >
                {link.name}
              </Link>
            ))}

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:scale-110 transition-all"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="flex lg:hidden items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-slate-600 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-900 dark:text-white"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[60] bg-white dark:bg-slate-950 p-10 flex flex-col justify-center"
          >
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-10 right-10 text-slate-900 dark:text-white">
              <X size={40} />
            </button>
            
            <div className="space-y-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-5xl font-black text-slate-900 dark:text-white flex items-center justify-between group"
                  >
                    {link.name}
                    <ArrowRight className="text-blue-600" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;