// src/context/ContentContext.tsx
// NOTA: useContent foi movido para src/hooks/useContent.ts para satisfazer
// a regra react-refresh/only-export-components (apenas componentes por ficheiro).
import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface ContentContextType {
  content: Record<string, string>;
  updateContent: (key: string, value: string) => void;
  resetContent: () => void;
  saveToStorage: () => void;
  loadFromStorage: () => void;
}

// ─── Conteúdo padrão ──────────────────────────────────────────────────────────
const defaultContent: Record<string, string> = {
  'hero_title_1': 'Tecnologia que',
  'hero_title_highlight': 'Conecta e Inova',
  'hero_description': 'A Mil Vendas entrega soluções digitais robustas, focadas na melhor experiência para o seu cliente.',
  'hero_button_text': 'Contactar Equipa',
  'hero_whatsapp': '244922965959',
  'services_badge': 'O que fazemos',
  'services_title': 'Soluções Completas',
  'service_1_title': 'Web Development',
  'service_1_desc': 'Aplicações robustas com React, Node e as tecnologias mais recentes.',
  'service_2_title': 'Telecomunicações',
  'service_2_desc': 'Consultoria especializada para otimizar a conectividade da sua empresa.',
  'service_3_title': 'Mobile Solutions',
  'service_3_desc': 'Apps nativas e híbridas focadas na experiência do utilizador.',
  'service_4_title': 'Consultoria Tech',
  'service_4_desc': 'Estratégia digital para escalar o seu modelo de negócio.',
  'about_title': 'Compromisso com a Excelência',
  'about_description': 'A Mil Vendas não é apenas uma empresa, é o seu braço direito tecnológico em Luanda.',
  'about_feature_1': 'Desenvolvimento Nativo',
  'about_feature_2': 'Cloud Computing',
  'about_feature_3': 'Segurança de Dados',
};

// ─── Context ──────────────────────────────────────────────────────────────────
export const ContentContext = createContext<ContentContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────
interface ContentProviderProps {
  children: ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  const [content, setContent] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('site_content');
      return saved ? (JSON.parse(saved) as Record<string, string>) : defaultContent;
    } catch {
      return defaultContent;
    }
  });

  const updateContent = (key: string, value: string) => {
    setContent(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem('site_content', JSON.stringify(updated));
      return updated;
    });
  };

  const resetContent = () => {
    setContent(defaultContent);
    localStorage.setItem('site_content', JSON.stringify(defaultContent));
  };

  const saveToStorage = () => {
    localStorage.setItem('site_content', JSON.stringify(content));
  };

  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem('site_content');
      if (saved) setContent(JSON.parse(saved) as Record<string, string>);
    } catch {
      // Ignora erros de parse
    }
  };


  useEffect(() => {
    try {
      const saved = localStorage.getItem('site_content');
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, string>;
        setContent(parsed);
      }
    } catch {
      // Ignora erros de parse
    }
  }, []);

  return (
    <ContentContext.Provider value={{ content, updateContent, resetContent, saveToStorage, loadFromStorage }}>
      {children}
    </ContentContext.Provider>
  );
};