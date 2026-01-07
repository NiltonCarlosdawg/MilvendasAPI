import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Loader2, 
  Calendar, 
  Tag, 
  Layers, 
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';

interface PortfolioItemType {
  id: string;
  title: string;
  category: string;
  description: string;
  mediaUrl: string;
  technologies?: string[];
  client?: string;
  year?: string;
}

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<PortfolioItemType | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItemType[]>([]);
  const [loading, setLoading] = useState(true);

  // DADOS MOCK ROBUSTOS (Para quando a API não tem dados ou está offline)
  const mockProjects: PortfolioItemType[] = [
    {
      id: '1',
      title: 'Otimização de Rede RF - Luanda Sul',
      category: 'Telecom',
      description: 'Implementação de melhorias na camada de rádio frequência para aumentar a capacidade de dados em zonas de alta densidade populacional.',
      mediaUrl: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=1974',
      technologies: ['Huawei BTS', 'Análise de Espectro', '5G Ready'],
      client: 'Operadora Principal Angola',
      year: '2023'
    },
    {
      id: '2',
      title: 'Portal de Gestão de Infraestruturas',
      category: 'Software',
      description: 'Desenvolvimento de uma plataforma web personalizada para monitorização em tempo real de ativos de rede e equipas de campo.',
      mediaUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026',
      technologies: ['React', 'Node.js', 'PostgreSQL'],
      client: 'Mil Vendas Interno',
      year: '2024'
    },
    {
      id: '3',
      title: 'Manutenção de Torres de Comunicação',
      category: 'Infra',
      description: 'Programa anual de manutenção preventiva e corretiva em mais de 50 torres de comunicação em províncias remotas.',
      mediaUrl: 'https://images.unsplash.com/photo-1512428559083-a401c33c2b55?q=80&w=2070',
      technologies: ['Segurança em Altura', 'O&M', 'Geradores'],
      client: 'Unitel / Movicel Partners',
      year: '2023'
    }
  ];

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch('https://milvendasapi.onrender.com/api/v1/portfolio');
        if (response.ok) {
          const data = await response.json();
          setPortfolioItems(data.length > 0 ? data : mockProjects);
        } else {
          setPortfolioItems(mockProjects);
        }
      } catch  {
        setPortfolioItems(mockProjects);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const categories = ['all', 'Telecom', 'Software', 'Infra'];

  const filteredItems = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <section id="portfolio" className="py-24 bg-white dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Cabeçalho e Filtros */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-blue-600 font-black uppercase tracking-widest text-sm mb-4">Projetos de Excelência</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
              Nossa <span className="text-blue-600">Engenharia</span> em Ação
            </h3>
          </div>

          <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  activeFilter === cat 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat === 'all' ? 'Ver Todos' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Mosaico de Projetos */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelectedProject(item)}
                className="group relative cursor-pointer bg-slate-900 rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-xl shadow-slate-200 dark:shadow-none"
              >
                {/* Imagem de Fundo */}
                <img 
                  src={item.mediaUrl} 
                  alt={item.title} 
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                />
                
                {/* Overlay Gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                {/* Conteúdo do Card */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-600/20 backdrop-blur-md border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase">
                      <CheckCircle2 size={12} /> Concluído
                    </span>
                  </div>
                  
                  <h4 className="text-2xl font-black text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h4>
                  
                  <p className="text-slate-300 text-sm line-clamp-2 mb-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    {item.description}
                  </p>

                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-950 self-end transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <ArrowUpRight size={24} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Modal do Projeto */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="absolute inset-0 bg-slate-950/95 backdrop-blur-md"
              />
              
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="relative bg-white dark:bg-slate-900 w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row h-[90vh] lg:h-auto"
              >
                {/* Media do Modal */}
                <div className="lg:w-1/2 h-64 lg:h-auto relative">
                  <img src={selectedProject.mediaUrl} className="w-full h-full object-cover" alt={selectedProject.title} />
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-6 left-6 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white lg:hidden"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Conteúdo do Modal */}
                <div className="lg:w-1/2 p-8 lg:p-12 overflow-y-auto">
                  <div className="hidden lg:flex justify-end mb-4">
                    <button onClick={() => setSelectedProject(null)} className="p-3 text-slate-400 hover:text-blue-500 transition-colors">
                      <X size={32} />
                    </button>
                  </div>

                  <span className="text-blue-600 font-black text-xs uppercase tracking-[0.2em] mb-4 block">
                    Detalhes do Caso de Estudo
                  </span>
                  
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
                    {selectedProject.title}
                  </h2>

                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                    {selectedProject.description}
                  </p>

                  <div className="grid grid-cols-2 gap-8 mb-10">
                    <div className="space-y-1">
                      <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Tag size={12} className="text-blue-500" /> Cliente
                      </span>
                      <p className="font-bold text-slate-900 dark:text-white">{selectedProject.client || 'Particular'}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Calendar size={12} className="text-blue-500" /> Ano
                      </span>
                      <p className="font-bold text-slate-900 dark:text-white">{selectedProject.year || '2024'}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-10">
                    <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <Layers size={12} className="text-blue-500" /> Tecnologias Aplicadas
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies?.map((tech, i) => (
                        <span key={i} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a 
                    href={`https://wa.me/244922965959?text=Vi o seu projeto "${selectedProject.title}" e gostaria de algo semelhante.`}
                    className="block w-full py-5 bg-blue-600 text-white text-center font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                  >
                    SOLICITAR SOLUÇÃO SIMILAR
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