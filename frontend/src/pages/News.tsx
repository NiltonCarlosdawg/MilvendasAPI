import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Clock, ArrowRight, X, Loader2, Newspaper } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  date: string;
  author: string;
  read_time: string;
  category?: string;
}

const News = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  // DADOS MOCK - Para garantir que o site tenha conteúdo robusto de imediato
  const mockNews: NewsItem[] = [
    {
      id: 1,
      title: "A Expansão da Fibra Óptica e o Futuro da Conectividade em Angola",
      excerpt: "Analisamos como os novos investimentos em infraestrutura de backbone estão a preparar o país para a era do 5G e da economia digital.",
      content: `
        <p>O setor das telecomunicações em Angola está a atravessar uma transformação sem precedentes. Com o aumento da literacia digital, a procura por largura de banda cresceu 40% no último ano.</p>
        <p>A <strong>Mil Vendas Consultoria</strong> tem estado na vanguarda, apoiando operadoras na implementação de redes de última milha. Este artigo explora os desafios técnicos da topografia local e as soluções de engenharia que estamos a adotar para garantir redundância e alta disponibilidade.</p>
        <br/>
        <h3 class="text-xl font-bold text-blue-600">Pontos Chave:</h3>
        <ul class="list-disc ml-5 mt-4 space-y-2">
          <li>Redução de latência em centros urbanos através de anéis de fibra.</li>
          <li>Integração de sistemas legados com novas tecnologias GPON.</li>
          <li>Formação contínua de equipas técnicas locais para manutenção preventiva.</li>
        </ul>
      `,
      image_url: "https://images.unsplash.com/photo-1544666046-bc584176664b?q=80&w=2070",
      date: "12 Mai 2024",
      author: "Eng. Alberto Costa",
      read_time: "5 min",
      category: "Infraestrutura"
    },
    {
      id: 2,
      title: "Manutenção Preditiva: Como a IA está a evitar falhas em torres de RF",
      excerpt: "Descubra como utilizamos algoritmos de monitorização remota para prever anomalias antes que causem interrupções de serviço.",
      content: `
        <p>A manutenção corretiva é dispendiosa e prejudica a experiência do utilizador final. Na Mil Vendas, estamos a implementar sensores IoT em estações base (BTS) para recolher dados em tempo real.</p>
        <p>Estes dados são processados por sistemas de inteligência que identificam padrões de sobreaquecimento ou desgaste de componentes, permitindo uma intervenção planeada antes da falha total.</p>
      `,
      image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070",
      date: "08 Mai 2024",
      author: "Equipa Técnica MV",
      read_time: "4 min",
      category: "Tecnologia"
    },
    {
      id: 3,
      title: "Mil Vendas Celebra 10 Anos de Excelência Operacional em Angola",
      excerpt: "Uma jornada marcada pelo compromisso técnico e pela confiança das maiores operadoras do mercado angolano.",
      content: `
        <p>Celebrar uma década no mercado angolano é um marco de resiliência. Durante este período, a Mil Vendas não apenas instalou hardware, mas construiu infraestruturas que conectam famílias e empresas.</p>
        <p>O nosso foco para os próximos anos mantém-se na digitalização dos processos de engenharia e na expansão para novas províncias.</p>
      `,
      image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070",
      date: "01 Mai 2024",
      author: "Direção Executiva",
      read_time: "3 min",
      category: "Institucional"
    }
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://milvendasapi.onrender.com/api/v1/news');
        if (response.ok) {
          const data = await response.json();
          setNewsItems(Array.isArray(data) && data.length > 0 ? data : mockNews);
        } else {
          setNewsItems(mockNews);
        }
      } catch  {
        console.warn("API indisponível, a carregar dados locais.");
        setNewsItems(mockNews);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center bg-slate-950 min-h-[400px]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <section id="noticias" className="py-24 bg-white dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-blue-600 font-bold mb-4 uppercase tracking-widest text-sm"
            >
              <Newspaper size={18} />
              <span>Mil Vendas Insights</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
              Atualizações e <span className="text-blue-600 font-extrabold italic">Tendências</span> do Setor
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm border-l-2 border-blue-600 pl-6 py-2">
            Mantenha-se informado sobre os projetos e tecnologias que movem a infraestrutura de Angola.
          </p>
        </div>

        {/* Grid de Notícias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {newsItems.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedArticle(article)}
              className="group cursor-pointer flex flex-col h-full bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500"
            >
              {/* Media Container */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={article.image_url} 
                  alt={article.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6 z-10">
                  <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl">
                    {article.category || 'Geral'}
                  </span>
                </div>
              </div>

              {/* Text Container */}
              <div className="p-10 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 mb-6 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-500" /> {article.date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-blue-500" /> {article.read_time}</span>
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                  {article.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-8 flex-grow">
                  {article.excerpt}
                </p>

                <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                  Ler artigo
                  <ArrowRight size={18} />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Modal Detalhado */}
        <AnimatePresence>
          {selectedArticle && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedArticle(null)}
                className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl"
              />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                className="relative bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl overflow-hidden"
              >
                {/* Modal Cover Image */}
                <div className="relative h-[45vh]">
                  <img src={selectedArticle.image_url} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full text-white transition-all z-50"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-8 md:p-16">
                  <div className="flex flex-wrap items-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest mb-10">
                    <span className="flex items-center gap-2 bg-blue-500/10 text-blue-500 px-4 py-2 rounded-xl">
                      <User size={16} /> {selectedArticle.author}
                    </span>
                    <span className="flex items-center gap-2"><Calendar size={16} /> {selectedArticle.date}</span>
                    <span className="flex items-center gap-2"><Clock size={16} /> {selectedArticle.read_time} de leitura</span>
                  </div>

                  <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-10 leading-[1.1]">
                    {selectedArticle.title}
                  </h2>

                  <div 
                    className="prose prose-xl dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed font-medium"
                    dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default News;