import  { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Clock, Search, X, Loader2 } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  date: string;
  author: string;
  read_time: string;
}

const News = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://milvendasapi.onrender.com/api/v1/news');
        
        if (!response.ok) {
          throw new Error('Erro ao buscar notícias');
        }
        
        const data = await response.json();
        setNewsItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao carregar notícias:", err);
        setNewsItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredItems = newsItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <section id="noticias" className="min-h-screen py-24 bg-white dark:bg-slate-900 transition-colors flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </section>
    );
  }

  return (
    <section id="noticias" className="min-h-screen py-24 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        {/* Barra de Pesquisa */}
        <div className="relative max-w-lg mx-auto mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Pesquisar artigos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          />
        </div>

        {/* Lista de Artigos */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 dark:text-gray-400">Nenhum artigo encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredItems. map((article) => (
              <motion. div 
                key={article. id} 
                onClick={() => setSelectedArticle(article)}
                className="cursor-pointer group bg-slate-50 dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-200 dark: border-slate-700"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <img 
                    src={article.image_url} 
                    alt={article.title}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e. target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                    }}
                  />
                </div>
                <div className="p-5">
                  <div className="flex gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><Calendar size={12}/> {article.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12}/> {article. read_time}</span>
                  </div>
                  <h4 className="text-lg font-bold dark:text-white group-hover:text-blue-500">{article.title}</h4>
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">{article.excerpt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Artigo Completo */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 overflow-y-auto">
          <motion. div 
            initial={{ opacity:  0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full my-8 relative"
          >
            <button 
              onClick={() => setSelectedArticle(null)}
              className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 z-10"
            >
              <X size={24} className="text-slate-600 dark:text-gray-400" />
            </button>

            <img 
              src={selectedArticle.image_url}
              alt={selectedArticle. title}
              className="w-full h-96 object-cover rounded-t-3xl"
              onError={(e) => {
                (e. target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
              }}
            />

            <div className="p-12">
              <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                <span className="flex items-center gap-2"><Calendar size={16}/> {selectedArticle.date}</span>
                <span className="flex items-center gap-2"><Clock size={16}/> {selectedArticle.read_time}</span>
                <span className="flex items-center gap-2"><User size={16}/> {selectedArticle.author}</span>
              </div>

              <h2 className="text-4xl font-bold dark:text-white mb-6">{selectedArticle.title}</h2>

              <div 
                className="prose dark:prose-invert max-w-none text-slate-700 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html:  selectedArticle.content }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default News;