// src/pages/Portfolio.tsx - VERSÃO SINCRONIZADA COM ADMIN
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  Code, Smartphone, Globe, Eye, Loader2} from 'lucide-react';

interface PortfolioItemType {
  id: string;
  title: string;
  category: string;
  description: string;
  mediaUrl: string; // Sincronizado com Admin
  technologies?: string[];
  client?: string;
  year?: string;
}

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<PortfolioItemType | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lógica de URLs idêntica ao PortifolioPreview.tsx (Admin)
  const API_URL = 'https://milvendasapi.onrender.com/api/v1/portfolio';
  const MEDIA_BASE_URL = 'https://milvendasapi.onrender.com/uploads/';

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        
        if (!response.ok) throw new Error('Falha ao conectar com o servidor');
        
        const data = await response.json();
        // A API retorna um array direto conforme visto na lógica do Admin
        setPortfolioItems(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Erro no Portfólio Público:", err);
        setError("Não foi possível carregar os projetos.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const getIcon = (category?: string) => {
    const cat = category?.toLowerCase() || 'web';
    if (cat.includes('mobile') || cat.includes('app')) return <Smartphone className="w-5 h-5" />;
    if (cat.includes('software') || cat.includes('code')) return <Code className="w-5 h-5" />;
    return <Globe className="w-5 h-5" />;
  };

  const categories = ['all', ...Array.from(new Set(
    portfolioItems.map(item => item.category).filter(Boolean)
  ))];

  const filteredItems = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-900">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-slate-500 font-medium">Carregando galeria...</p>
      </div>
    );
  }

  return (
    <section id="portfolio" className="min-h-screen py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Títulos */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h2 className="text-blue-500 font-bold uppercase tracking-widest text-sm">Nosso Portfólio</h2>
          <h1 className="mt-2 text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
            Trabalhos de Excelência
          </h1>
        </motion.div>

        {/* Filtros */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-8 py-3 rounded-2xl font-bold transition-all ${
                  activeFilter === category 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 scale-105' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {category === 'all' ? 'Todos' : category}
              </button>
            ))}
          </div>
        )}

        {/* Grid de Projetos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <AnimatePresence mode='popLayout'>
            {filteredItems.map((item, index) => (
              <motion.div 
                layout
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group bg-slate-50 dark:bg-slate-800/40 rounded-[2.5rem] border border-slate-200 dark:border-slate-700/50 overflow-hidden hover:border-blue-500 transition-colors"
              >
                {/* Imagem com a Lógica do Admin */}
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={`${MEDIA_BASE_URL}${item.mediaUrl}`} 
                    alt={item.title}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/800x600?text=Imagem+indisponivel'; }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center p-8">
                    <button 
                      onClick={() => setSelectedProject(item)}
                      className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black flex items-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-all shadow-2xl"
                    >
                      <Eye size={20} /> VER DETALHES
                    </button>
                  </div>
                  <div className="absolute top-6 left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl shadow-xl text-blue-600">
                    {getIcon(item.category)}
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{item.title}</h3>
                      <span className="text-blue-500 text-xs font-black uppercase tracking-widest">{item.category}</span>
                    </div>
                    <span className="text-slate-400 font-bold">{item.year}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mb-6">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-xs font-bold text-slate-400 uppercase">Cliente:</div>
                    <div className="text-sm font-black text-slate-700 dark:text-slate-200">{item.client || 'Particular'}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Modal (Utilizando os dados sincronizados) */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white dark:bg-slate-900 rounded-[3rem] max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="relative h-64 md:h-[500px]">
                  <img 
                    src={`${MEDIA_BASE_URL}${selectedProject.mediaUrl}`} 
                    className="w-full h-full object-cover" 
                    alt={selectedProject.title} 
                  />
                  <button onClick={() => setSelectedProject(null)} className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full text-white border border-white/20">✕</button>
                </div>
                <div className="p-8 md:p-16">
                  <span className="text-blue-600 font-black uppercase tracking-widest">{selectedProject.category}</span>
                  <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mt-4 mb-8 tracking-tighter">{selectedProject.title}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                    <div className="space-y-4">
                       <h4 className="font-black text-slate-900 dark:text-white uppercase text-sm">Sobre o Projeto</h4>
                       <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">{selectedProject.description}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl space-y-6">
                       <div>
                         <p className="text-xs font-black text-blue-500 uppercase mb-1">Cliente</p>
                         <p className="font-bold dark:text-white text-xl">{selectedProject.client || 'N/A'}</p>
                       </div>
                       <div>
                         <p className="text-xs font-black text-blue-500 uppercase mb-1">Ano de Conclusão</p>
                         <p className="font-bold dark:text-white text-xl">{selectedProject.year || '2024'}</p>
                       </div>
                    </div>
                  </div>

                  <a 
                    href={`https://wa.me/244922965959?text=Olá! Vi o projeto "${selectedProject.title}" e gostaria de algo semelhante.`}
                    target="_blank"
                    className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl text-center block shadow-2xl shadow-blue-500/20 transition-all scale-100 hover:scale-[1.02]"
                  >
                    SOLICITAR ORÇAMENTO PARA PROJETO SIMILAR
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default Portfolio;