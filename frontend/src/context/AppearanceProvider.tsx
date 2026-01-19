import React, { useState, useEffect } from 'react';
import { AppearanceContext } from './AppearanceContext';
import type { AppearanceContextType, Theme, Font } from './AppearanceContext';

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) return savedTheme;
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const [font, setFont] = useState<Font>(() => 
    (localStorage.getItem('font') as Font) || 'font-sans'
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove todas as classes
    root.classList.remove('light', 'dark', 'font-sans', 'font-serif', 'font-mono');
    
    // Adiciona classes atuais
    root.classList.add(theme, font);
    
    // Persiste no localStorage
    localStorage.setItem('theme', theme);
    localStorage.setItem('font', font);
    
    // Atualiza meta tag para cor do tema
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0f172a' : '#ffffff');
    }
  }, [theme, font]);

  // Listener para mudança de tema do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const persistSettings = () => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('font', font);
  };

  const value: AppearanceContextType = { 
    theme, 
    font, 
    setTheme, 
    setFont, 
    persistSettings 
  };

  return (
    <AppearanceContext.Provider value={value}>
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-900 text-slate-100' 
          : 'bg-white text-slate-900'
      }`}>
        {children}
      </div>
    </AppearanceContext.Provider>
  );
}