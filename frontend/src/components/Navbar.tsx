// src/components/Navbar.tsx - COMPLETAMENTE RESPONSIVO
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, LogIn } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logoMv from '../assets/logo-mv.svg';
import { useAppearance } from '../hooks/useAppearance';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useAppearance();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Mapeamento das rotas - Sobre volta a ser âncora
  const navLinks = [
    { name: 'Serviços', href: '#servicos', external: false },
    { name: 'Sobre', href: '#sobre', external: false },
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
      // Para links âncora na mesma página
      setIsMenuOpen(false);
      
      // Se não estiver na home, navega para home primeiro
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
        className={`fixed w-full z-50 transition-all duration-500 px-4 sm:px-6 
        ${scrolled 
          ? 'py-3 bg-slate-950/95 backdrop-blur-md shadow-2xl border-b border-white/5' 
          : 'py-4 sm:py-5 bg-gradient-to-b from-slate-950/90 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* LOGO - TAMANHO AUMENTADO */}
          <a href="/" className="flex items-center gap-2 group">
            <img 
              src={logoMv} 
              alt="Logo Mil Vendas" 
              // ALTERADO: w-12 h-12 md:w-16 md:h-16 (aumentei consideravelmente)
              className="w-16 h-16 md:w-20 md:h-20 filter brightness-0 !invert transition-transform group-hover:scale-110" 
            />
            <span className="text-lg sm:text-xl md:text-2xl font-bold !text-white tracking-tighter whitespace-nowrap">
              {/* Texto removido conforme seu código */}
            </span>
          </a>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center gap-6 md:gap-8">
            {navLinks.map((link) => (
              link.external === false ? (
                <Link
                  key={link.name}
                  to={link.href.startsWith('#') ? '/' : link.href}
                  onClick={() => link.href.startsWith('#') && handleNavClick(link.href)}
                  className="!text-gray-400 hover:!text-white transition-all font-medium text-xs uppercase tracking-[0.2em] relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
                </Link>
              ) : (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="!text-gray-400 hover:!text-white transition-all font-medium text-xs uppercase tracking-[0.2em] relative group"
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
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 !text-white hover:bg-white/10 transition-all"
              title="Alternar Modo Claro/Escuro"
              aria-label={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.div key="sun" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }}>
                    <Sun size={18} className="text-yellow-400" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }}>
                    <Moon size={18} className="text-blue-300" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* MENU HAMBURGUER (MOBILE) */}
            <button
              onClick={toggleMenu}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 !text-white hover:bg-white/10 transition-all"
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMenuOpen}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu size={20} />
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
            {/* OVERLAY ESCURO */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            />

            {/* MENU LATERAL */}
            <motion.div
              ref={menuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-slate-900 border-l border-white/10 z-50 shadow-2xl md:hidden overflow-y-auto"
            >
              {/* CABEÇALHO DO MENU MOBILE */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    {/* LOGO NO MENU MOBILE TAMBÉM AUMENTADO */}
                    <img 
                      src={logoMv} 
                      alt="Logo" 
                      className="w-28 h-28 filter brightness-0 !invert" // ALTERADO: w-14 h-14
                    />
                    <span className="text-xl font-bold !text-white">MIL VENDAS</span>
                  </div>
                  <button
                    onClick={toggleMenu}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                    aria-label="Fechar menu"
                  >
                    <X size={20} className="!text-white" />
                  </button>
                </div>
                
                {/* INFO DA EMPRESA */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">
                    Sua agência tecnológica em Luanda
                  </p>
                  <p className="text-xs text-gray-500">
                    Especialistas em soluções digitais
                  </p>
                </div>
              </div>

              {/* LINKS DO MENU MOBILE */}
              <div className="p-4">
                <ul className="space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {link.external === false ? (
                        <Link
                          to={link.href.startsWith('#') ? '/' : link.href}
                          onClick={() => {
                            handleNavClick(link.href);
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all group"
                        >
                          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          </div>
                          <div className="flex-1">
                            <span className="!text-white font-medium block">{link.name}</span>
                            <span className="text-xs text-gray-400 block mt-1">
                              {link.href.startsWith('#') ? 'Página inicial' : 'Página dedicada'}
                            </span>
                          </div>
                          <div className="text-gray-500 group-hover:text-blue-400 transition-colors">
                            →
                          </div>
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all group"
                        >
                          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          </div>
                          <div className="flex-1">
                            <span className="!text-white font-medium block">{link.name}</span>
                            <span className="text-xs text-gray-400 block mt-1">
                              Link externo
                            </span>
                          </div>
                          <div className="text-gray-500 group-hover:text-blue-400 transition-colors">
                            ↗
                          </div>
                        </a>
                      )}
                    </motion.li>
                  ))}
                </ul>

                {/* SEÇÃO ADICIONAL NO MENU MOBILE */}
                <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <h3 className="!text-white font-semibold mb-3 flex items-center gap-2">
                    <LogIn size={16} />
                    Área Administrativa
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Acesso restrito à equipa Mil Vendas
                  </p>
                  <Link
                    to="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 !text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <LogIn size={16} />
                    Entrar no Sistema
                  </Link>
                </div>

                {/* RODAPÉ DO MENU MOBILE */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Modo:</span>
                    <button
                      onClick={toggleTheme}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                    >
                      {theme === 'dark' ? (
                        <>
                          <Sun size={16} className="text-yellow-400" />
                          <span className="text-sm !text-white">Claro</span>
                        </>
                      ) : (
                        <>
                          <Moon size={16} className="text-blue-300" />
                          <span className="text-sm !text-white">Escuro</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    © {new Date().getFullYear()} Mil Vendas. Todos os direitos reservados.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ESPAÇO RESERVADO PARA O NAVBAR (evita conteúdo escondido) */}
      {/* Aumentei um pouco o espaçamento para compensar o logo maior */}
      <div className="h-20 sm:h-24 md:h-28"></div>
    </>
  );
};

export default Navbar;