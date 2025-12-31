// src/admin/EventosPreview.tsx - VERSÃO CORRIGIDA
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
 MapPin, Trash2, Plus, RefreshCw, 
  Loader2,  AlertTriangle, 
  Edit3, Image as Ticket, EyeOff
} from 'lucide-react';
import AddEventModal from './components/AddEventModal';

const EventosPreview: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // URL base correta conforme o seu events.routes.js
  const API_URL = 'https://milvendasapi.onrender.com/api/v1/events';

  const loadEvents = async () => {
    try {
      setSyncing(true);
      setApiError(null);
      
      const token = localStorage.getItem('@MilVendas:token');
      
      /**
       * CORREÇÃO: No seu ficheiro de rotas, a listagem é feita em GET /
       * O token no header é que define se o backend deve mostrar rascunhos ou apenas ativos.
       */
      const response = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error(`Erro: ${response.status}`);

      const data = await response.json();
      // Garante que pegamos o array independentemente do formato da resposta
      const eventsArray = Array.isArray(data) ? data : (data.data || []);
      
      // Ordenar por data (mais recentes primeiro)
      setEvents(eventsArray.sort((a: any, b: any) => 
        new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
      ));

    } catch (error: any) {
      console.error("Erro ao carregar eventos:", error);
      setApiError("Não foi possível carregar os eventos. Verifique se o servidor está online.");
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => { loadEvents(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remover este evento e todos os ficheiros associados?")) return;
    
    try {
      const token = localStorage.getItem('@MilVendas:token');
      const response = await fetch(`${API_URL}/admin/${id}`, { // Rota DELETE correta: /admin/:id
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setEvents(prev => prev.filter((e) => e.id !== id));
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Erro ao eliminar: ${errorData.message || 'Verifique as permissões.'}`);
      }
    } catch {
      alert("Erro de conexão ao eliminar.");
    }
  };

  const handleEdit = (event: any) => {
    setEventToEdit(event);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
        <p className="text-slate-500 font-medium tracking-wide">Acedendo aos eventos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Gestão de Eventos</h1>
          <p className="text-slate-500 text-sm font-medium">Controle total sobre as publicações na plataforma.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={loadEvents} 
            className="flex-1 md:flex-none p-3 text-slate-500 hover:text-blue-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl transition-all shadow-sm"
          >
            <RefreshCw size={20} className={syncing ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => { setEventToEdit(null); setIsModalOpen(true); }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all"
          >
            <Plus size={20} /> Novo Evento
          </button>
        </div>
      </div>

      {apiError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 font-bold">
          <AlertTriangle size={20} />
          <span className="text-sm">{apiError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {events.length === 0 && !syncing ? (
             <div className="p-20 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] text-center">
                <p className="text-slate-400 font-bold">Nenhum evento encontrado.</p>
             </div>
          ) : (
            events.map((event: any) => (
              <motion.div 
                layout
                key={event.id || event._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 flex flex-col md:flex-row items-start md:items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="hidden sm:flex flex-col items-center justify-center min-w-[70px] h-[70px] bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <span className="text-xs font-bold text-blue-600 uppercase">
                        {new Date(event.eventDate).toLocaleString('pt-PT', { month: 'short' })}
                      </span>
                      <span className="text-2xl font-black dark:text-white">
                        {new Date(event.eventDate).getDate()}
                      </span>
                    </div>
                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${event.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-xl text-slate-900 dark:text-white leading-none">{event.title}</h3>
                      
                      {event.status !== 'active' && (
                        <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-md font-black bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 uppercase">
                          <EyeOff size={10} /> Oculto
                        </span>
                      )}
                      
                      <span className={`text-[9px] px-2 py-0.5 rounded-md font-black tracking-widest uppercase ${
                        event.eventType === 'PROPRIO' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' 
                          : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
                      }`}>
                        {event.eventType}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
                      <span className="flex items-center gap-1.5"><MapPin size={15} className="text-blue-500"/> {event.location}</span>
                      {event.price && <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold"><Ticket size={15}/> {Number(event.price).toLocaleString()} Kz</span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4 md:mt-0 w-full md:w-auto">
                  <button 
                    onClick={() => handleEdit(event)}
                    className="flex-1 md:flex-none flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <Edit3 size={18} /> Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(event.id || event._id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {isModalOpen && (
        <AddEventModal 
          onClose={() => { setIsModalOpen(false); setEventToEdit(null); }} 
          onSuccess={loadEvents} 
          eventToEdit={eventToEdit}
        />
      )}
    </div>
  );
};

export default EventosPreview;