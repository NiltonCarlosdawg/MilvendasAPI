// src/components/Navbar.tsx - VERSÃO COM TEMA COMPLETO
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logoMv from '../assets/logo-mv.svg';
import { useAppearance } from '../hooks/useAppearance';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useAppearance();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Mapeamento das rotas
  const navLinks = [
    { name: 'Sobre', href: '#sobre', external: false },
    { name: 'Serviços', href: '#servicos', external: false },
    { name: 'Portfólio', href: '/portfolio', external: false },
    { name: 'Eventos', href: '/events', external: false },
    { name: 'Contacto', href: '#contacto', external: false },
  ];

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fechar menu ao mudar de rota
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bloquear scroll quando menu está aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      setIsMenuOpen(false);
      
      if (location.pathname !== '/') {
        window.location.href = `/${href}`;
      } else {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <>
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 px-4 sm:px-6 
        ${scrolled 
          ? 'py-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-lg border-b border-slate-200 dark:border-white/5' 
          : 'py-4 sm:py-5 bg-gradient-to-b from-white/90 dark:from-slate-950/90 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* LOGO */}
          <a href="/" className="flex items-center gap-2 group">
            <img 
              src={logoMv} 
              alt="Logo Mil Vendas" 
              className="w-12 h-12 md:w-16 md:h-16 logo-mv transition-transform group-hover:scale-110" 
            />
          </a>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center gap-6 md:gap-8">
            {navLinks.map((link) => (
              link.external === false ? (
                <Link
                  key={link.name}
                  to={link.href.startsWith('#') ? '/' : link.href}
                  onClick={() => link.href.startsWith('#') && handleNavClick(link.href)}
                  className="text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-all font-medium text-xs uppercase tracking-[0.2em] relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
                </Link>
              ) : (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-all font-medium text-xs uppercase tracking-[0.2em] relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
                </a>
              )
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* BOTÃO TEMA */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
              title="Alternar Modo Claro/Escuro"
              aria-label={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.div key="sun" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }}>
                    <Sun size={18} className="text-yellow-500" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }}>
                    <Moon size={18} className="text-blue-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* MENU HAMBURGUER */}
            <button
              onClick={toggleMenu}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMenuOpen}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X size={20} className="text-slate-700 dark:text-white" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu size={20} className="text-slate-700 dark:text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* MENU MOBILE OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            />

            <motion.div
              ref={menuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/10 z-50 shadow-2xl md:hidden overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <img 
                      src={logoMv} 
                      alt="Logo" 
                      className="w-14 h-14 logo-mv"
                    />
                    <span className="text-xl font-bold text-slate-900 dark:text-white">MIL VENDAS</span>
                  </div>
                  <button
                    onClick={toggleMenu}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                    aria-label="Fechar menu"
                  >
                    <X size={20} className="text-slate-700 dark:text-white" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-slate-600 dark:text-gray-400">
                    Sua agência tecnológica em Luanda
                  </p>
                </div>
              </div>

              <div className="p-4">
                <ul className="space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={link.href.startsWith('#') ? '/' : link.href}
                        onClick={() => {
                          handleNavClick(link.href);
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all group"
                      >
                        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/10 group-hover:bg-blue-200 dark:group-hover:bg-blue-500/20 transition-colors">
                          <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500"></div>
                        </div>
                        <div className="flex-1">
                          <span className="text-slate-900 dark:text-white font-medium block">{link.name}</span>
                        </div>
                        <div className="text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          →
                        </div>
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-slate-600 dark:text-gray-500">Modo:</span>
                    <button
                      onClick={toggleTheme}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                    >
                      {theme === 'dark' ? (
                        <>
                          <Sun size={16} className="text-yellow-500" />
                          <span className="text-sm text-slate-900 dark:text-white">Claro</span>
                        </>
                      ) : (
                        <>
                          <Moon size={16} className="text-blue-700" />
                          <span className="text-sm text-slate-900 dark:text-white">Escuro</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-20 sm:h-24 md:h-28"></div>
    </>
  );
};

export default Navbar;