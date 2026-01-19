// src/admin/Dashboard.tsx - VERSÃO COM DESIGN UNIFICADO
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Image as ImageIcon, Mail, 
  Loader2, ArrowUpRight, Plus, PieChart, Clock, AlertCircle, Settings, 
  Database, Activity
} from 'lucide-react';

import AddEventModal from './components/AddEventModal';
import AddPortfolioModal from './components/AddPortfolioModal';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('eventos ativos');
  const [loading, setLoading] = useState(true);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  
  const [data, setData] = useState({
    events: [],
    portfolio: [],
    settings: [],
    newsletter: []
  });

  const API_BASE = 'https://milvendasapi.onrender.com/api/v1';

  const safeFetch = async (url: string, options = {}) => {
    try {
      const res = await fetch(url, options);
      if (!res.ok) return []; 
      const json = await res.json();
      return Array.isArray(json) ? json : (json.data || []);
    } catch (err) {
      console.error(`Erro na rota ${url}:`, err);
      return [];
    }
  };

  const fetchData = async () => {
  setLoading(true);
  try {
    // Removido token não utilizado
    // Se precisar do token no futuro, adicione aqui

    const [events, portfolio, settings] = await Promise.all([
      safeFetch(`${API_BASE}/events`),
      safeFetch(`${API_BASE}/portfolio`),
      safeFetch(`${API_BASE}/settings`),
    ]);

    setData({ events, portfolio, settings, newsletter: [] });
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { fetchData(); }, []);

  const handleMutationSuccess = () => {
    fetchData();
    setIsEventModalOpen(false);
    setIsPortfolioModalOpen(false);
  };

  const tabs = [
    { id: 'eventos ativos', label: 'Eventos Ativos', count: data.events.length, icon: <Calendar size={18}/> },
    { id: 'projetos no portfólio', label: 'Projetos no Portfólio', count: data.portfolio.length, icon: <ImageIcon size={18}/> },
    { id: 'configurações', label: 'Empresa', count: data.settings.length, icon: <Settings size={18}/> },
    { id: 'newsletter', label: 'Newsletter', count: 0, icon: <Mail size={18}/> },
  ];

  const currentTabData = tabs.find(t => t.id === activeTab);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-slate-500 font-black tracking-tighter uppercase text-xs">Sincronizando Ecossistema...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-700">
      
      {/* Header Estilo Página Pública */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-blue-500 font-black uppercase tracking-widest text-xs mb-2">Painel de Controlo</h2>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            Bem-vindo, Administrador
          </h1>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-4 rounded-[1.5rem] border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado da API</p>
            <p className="text-sm font-bold text-emerald-500">Servidor Online</p>
          </div>
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
            <Activity size={20} className="animate-pulse" />
          </div>
        </div>
      </div>

      {/* Ações Rápidas (Estilo Landing Page) */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-blue-500/20 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-black text-white mb-2">Gestão de Conteúdo</h3>
          <p className="text-blue-100 font-medium">Atualize seu portfólio e eventos para os clientes em tempo real.</p>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <button 
            onClick={() => setIsEventModalOpen(true)}
            className="flex items-center gap-2 px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 rounded-2xl font-black text-sm transition-all shadow-lg active:scale-95"
          >
            <Plus size={20} /> NOVO EVENTO
          </button>
          <button 
            onClick={() => setIsPortfolioModalOpen(true)}
            className="flex items-center gap-2 px-8 py-4 bg-blue-900/30 text-white hover:bg-blue-900/40 border border-white/20 rounded-2xl font-black text-sm transition-all active:scale-95"
          >
            <Plus size={20} /> NOVO PROJETO
          </button>
        </div>
      </div>

      {/* Navegação de Abas */}
      <div className="flex gap-4 md:gap-8 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm font-black transition-all relative flex items-center gap-2 whitespace-nowrap tracking-tight uppercase ${
              activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.icon}
            {tab.label}
            <span className={`ml-1 px-2 py-0.5 rounded-lg text-[10px] ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <motion.div layoutId="activeUnderline" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Grid de Estatísticas Unificado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Card Principal de Volume */}
        <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 p-10 rounded-[2.5rem] flex flex-col justify-between min-h-[350px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <Database size={200} />
          </div>
          
          <div>
            <div className="p-4 bg-blue-600 text-white rounded-2xl w-fit mb-8 shadow-xl shadow-blue-500/20">
              {currentTabData?.icon}
            </div>
            <h4 className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Total de {currentTabData?.label}</h4>
            <div className="flex items-baseline gap-4">
              <span className="text-8xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">
                {currentTabData?.count}
              </span>
              <div className="flex flex-col">
                <span className="text-emerald-500 text-sm font-black flex items-center gap-1">
                  <ArrowUpRight size={18}/> ONLINE
                </span>
                <span className="text-slate-400 text-[10px] font-bold">BASE DE DADOS ATIVA</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex items-center gap-3">
             <div className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
             <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Monitoramento Sincronizado</span>
          </div>
        </div>

        {/* Card de Status do Sistema */}
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 p-10 rounded-[2.5rem]">
          <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl w-fit mb-8">
            <PieChart size={32} />
          </div>
          <h4 className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest mb-8">Health Check</h4>
          
          <div className="space-y-4">
            <div className="p-6 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-700">
              <p className="text-slate-900 dark:text-white text-sm font-black uppercase tracking-tight">Render API</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <p className="text-slate-500 text-xs font-bold uppercase">Latência Baixa</p>
              </div>
            </div>
            
            <div className="p-6 bg-blue-600 text-white rounded-3xl shadow-xl shadow-blue-500/20">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Último Backup</p>
              <p className="text-lg font-black mt-1">Sincronizado Agora</p>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico Recente com Estilo de Lista Portfólio */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
          <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-3 uppercase text-sm tracking-widest">
            <Clock size={20} className="text-blue-600" /> Atividade de Publicação
          </h3>
          <button onClick={fetchData} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:text-blue-600 transition-all tracking-widest">
            Refresh
          </button>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.events.length === 0 && data.portfolio.length === 0 ? (
            <div className="p-24 flex flex-col items-center justify-center text-center opacity-40">
              <AlertCircle className="text-slate-400 mb-4" size={48} />
              <p className="text-slate-900 dark:text-white font-black text-xl tracking-tighter uppercase">Arquivo Vazio</p>
              <p className="text-slate-500 text-sm font-medium mt-1">Publique o seu primeiro item hoje.</p>
            </div>
          ) : (
            [...data.events, ...data.portfolio]
              .slice(0, 6)
              .map((item: any, idx: number) => (
                <div key={idx} className="p-8 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                      item.title ? 'bg-blue-600 text-white' : 'bg-indigo-600 text-white'
                    } shadow-lg shadow-blue-500/10`}>
                      {item.title ? <Calendar size={24} /> : <ImageIcon size={24} />}
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white font-black text-lg tracking-tight">
                        {item.title || item.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 text-[10px] font-black uppercase tracking-widest">API Ativa</span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span className="text-slate-500 text-xs font-bold uppercase">{item.category || 'Geral'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                    <ArrowUpRight size={20} className="text-blue-600" />
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {isEventModalOpen && <AddEventModal onClose={() => setIsEventModalOpen(false)} onSuccess={handleMutationSuccess} />}
        {isPortfolioModalOpen && <AddPortfolioModal onClose={() => setIsPortfolioModalOpen(false)} onSuccess={handleMutationSuccess} />}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;