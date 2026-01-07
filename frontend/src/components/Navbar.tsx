// src/components/Navbar.tsx
import React, { useState, useEffect, useRef } from 'react';
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
  const menuRef = useRef<HTMLDivElement>(null);

  // MANTENDO A TUA LÓGICA DE LINKS ORIGINAL
  const navLinks = [
    { name: 'Serviços', href: '#servicos', external: false },
    { name: 'Sobre', href: '#sobre', external: false },
    { name: 'Portfólio', href: '/portfolio', external: false },
    { name: 'Eventos', href: '/events', external: false },
    { name: 'Contacto', href: '#contacto', external: false },
    { name: 'Blog', href: '/news', external: false },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fechar menu ao mudar de rota
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
          scrolled 
          ? 'py-3 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-2xl border-b border-slate-200/50 dark:border-slate-800/50' 
          : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="relative z-10 group">
            <img 
              src={logoMv} 
              alt="Mil Vendas" 
              className={`h-10 md:h-12 transition-all duration-500 ${
                (theme === 'dark' || scrolled) ? 'brightness-0 invert' : ''
              }`} 
            />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-6 bg-slate-100/50 dark:bg-slate-900/50 px-6 py-2 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
              {navLinks.map((link) => (
                link.href.startsWith('#') ? (
                  <a 
                    key={link.name}
                    href={link.href}
                    className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                )
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* THEME TOGGLE */}
              <button 
                onClick={toggleTheme}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 text-slate-500 hover:text-blue-500 shadow-sm border border-slate-200 dark:border-slate-800 transition-all"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* LOGIN / ADMIN */}
           
            
            </div>
          </div>

          {/* MOBILE TOGGLE */}
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={toggleTheme} className="text-slate-500 dark:text-slate-400">
              {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button 
              className="p-2 text-slate-900 dark:text-white" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU FULLSCREEN */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-white dark:bg-slate-950 lg:hidden flex flex-col pt-32 px-10"
          >
            <div className="space-y-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {link.href.startsWith('#') ? (
                    <a 
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-4xl font-black text-slate-900 dark:text-white flex items-center justify-between group"
                    >
                      {link.name}
                      <ArrowRight className="opacity-0 group-hover:opacity-100 transition-all text-blue-600" />
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-4xl font-black text-slate-900 dark:text-white flex items-center justify-between group"
                    >
                      {link.name}
                      <ArrowRight className="opacity-0 group-hover:opacity-100 transition-all text-blue-600" />
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-auto mb-10 border-t border-slate-100 dark:border-slate-800 pt-10">
           
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;