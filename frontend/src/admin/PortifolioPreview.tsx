// src/admin/PortifolioPreview.tsx - ATUALIZADO
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Plus, RefreshCw, Loader2, ExternalLink, AlertTriangle } from 'lucide-react';
import AddPortfolioModal from './components/AddPortfolioModal'; 

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  mediaUrl: string;
  client?: string;
  year?: string;
}

const PortifolioPreview: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Configuração de URLs robusta
  const BASE_URL = 'https://milvendasapi.onrender.com/api/v1';
  const API_URL = `${BASE_URL}/portfolio`;
  const MEDIA_BASE_URL = 'https://milvendasapi.onrender.com/uploads/';

  const loadPortfolio = async () => {
    try {
      setSyncing(true);
      setApiError(null);
      
      const response = await fetch(API_URL);
      
      // Se retornar 404 ou 500, o response.ok será false
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: Não foi possível conectar ao servidor.`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("O servidor não retornou um JSON válido. Verifique a rota no backend.");
      }

      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Erro na API de Portfólio:", error);
      setApiError(error.message);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja eliminar este item permanentemente?")) return;

    try {
      const token = localStorage.getItem('@MilVendas:token');
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setItems(prev => prev.filter(item => item.id !== id));
      } else {
        alert("Não foi possível eliminar. Verifique sua sessão.");
      }
    } catch  {
      alert("Erro de conexão ao eliminar item.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
        <p className="text-slate-500 font-medium">Conectando ao banco de dados...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Portfólio</h1>
          <p className="text-slate-600 dark:text-gray-400">
            {items.length} projetos registrados.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={loadPortfolio}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 transition-all"
          >
            <RefreshCw size={18} className={syncing ? "animate-spin" : ""} />
            Sincronizar
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all"
          >
            <Plus size={18} />
            Novo Projeto
          </button>
        </div>
      </div>

      {/* Alerta de Erro de API */}
      {apiError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertTriangle size={20} />
          <p className="text-sm font-medium">Aviso: {apiError}</p>
        </div>
      )}

      {/* Grid de Itens */}
      {items.length === 0 && !apiError ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl">
          <p className="text-slate-500">Nenhum projeto encontrado. Comece adicionando um novo!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all"
            >
              <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img 
                  src={`${MEDIA_BASE_URL}${item.mediaUrl}`} 
                  alt={item.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Erro+ao+Carregar+Midia';
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button className="p-3 bg-white rounded-full text-blue-600 hover:scale-110 transition-transform">
                    <Edit2 size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-3 bg-white rounded-full text-red-600 hover:scale-110 transition-transform"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-600 shadow-sm">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                    {item.title}
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">{item.year}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-gray-400 line-clamp-2 mb-4">
                  {item.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-xs text-slate-500 italic truncate max-w-[150px]">
                    Cliente: {item.client || 'N/A'}
                  </span>
                  <button className="text-blue-500 hover:text-blue-600 transition-colors">
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de Criação */}
      {isModalOpen && (
        <AddPortfolioModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={loadPortfolio} 
        />
      )}
    </div>
  );
};

export default PortifolioPreview;