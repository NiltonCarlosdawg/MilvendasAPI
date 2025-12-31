import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, ArrowRight, X, PlayCircle, Clock, Sparkles } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  description: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
}

const Events = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const API_URL = "https://milvendasapi.onrender.com/api/v1";

  useEffect(() => {
    fetch(`${API_URL}/portfolio`)
      .then(res => res.json())
      .then(data => {
        // Filtramos apenas o que foi marcado como [EVENTO] no Admin
        const onlyEvents = data.filter((item: any) => item.description.includes('[EVENTO]'));
        setEvents(onlyEvents);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Função para limpar a tag [EVENTO] e extrair dados da descrição
  const parseDescription = (desc: string) => {
    return desc.replace(/\[EVENTO\]/g, '').split('|').pop()?.trim() || desc;
  };

  const extractMeta = (desc: string, key: 'Data' | 'Local') => {
    const match = desc.match(new RegExp(`${key}: (.*?) \\|`));
    return match ? match[1] : (key === 'Data' ? 'Em breve' : 'Luanda, AO');
  };

  return (
    <section className="relative py-32 px-6 overflow-hidden bg-white dark:bg-[#030712] transition-colors duration-500">
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 text-blue-600 mb-4">
              <Sparkles size={18} />
              <span className="text-xs font-black uppercase tracking-[0.4em]">Experiências Reais</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
              PRÓXIMOS <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">EVENTOS_</span>
            </h2>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-xs text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed"
          >
            Conectamos mentes brilhantes através de workshops, palestras e cimeiras tecnológicas em Angola.
          </motion.p>
        </header>

        {/* Grid de Eventos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {events.map((event, idx) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedEvent(event)}
              className="group relative cursor-pointer"
            >
              {/* Card Base */}
              <div className="relative h-[500px] w-full rounded-[3rem] overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 transition-all duration-500 group-hover:shadow-[0_30px_60px_-15px_rgba(37,99,235,0.2)]">
                
                {/* Imagem/Vídeo de Fundo */}
                <div className="absolute inset-0">
                  {event.mediaType === 'video' ? (
                    <video src={`${API_URL}/uploads/${event.mediaUrl}`} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 opacity-80" muted />
                  ) : (
                    <img src={`${API_URL}/uploads/${event.mediaUrl}`} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" alt="" />
                  )}
                  {/* Overlay Gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />
                </div>

                {/* Conteúdo do Card */}
                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                  <div className="flex gap-3 mb-6">
                    <span className="bg-blue-600/90 backdrop-blur-md text-[10px] font-black text-white px-4 py-1.5 rounded-full uppercase tracking-widest">
                      {extractMeta(event.description, 'Data')}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-4 leading-tight group-hover:text-blue-400 transition-colors">
                    {event.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-blue-500" />
                      {extractMeta(event.description, 'Local')}
                    </div>
                  </div>
                </div>

                {/* Botão Flutuante que aparece no Hover */}
                <div className="absolute top-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-slate-950 shadow-2xl">
                    <ArrowRight size={24} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MODAL DETALHADO (Mesma lógica visual do Admin) */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl"
            />

            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row h-[90vh] lg:h-auto"
            >
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-8 right-8 z-20 bg-black/50 hover:bg-blue-600 p-3 rounded-full text-white transition-all"
              >
                <X size={24} />
              </button>

              {/* Lado Esquerdo: Media */}
              <div className="w-full lg:w-1/2 h-full bg-black relative">
                {selectedEvent.mediaType === 'video' ? (
                  <video src={`${API_URL}/uploads/${selectedEvent.mediaUrl}`} controls autoPlay className="w-full h-full object-cover" />
                ) : (
                  <img src={`${API_URL}/uploads/${selectedEvent.mediaUrl}`} className="w-full h-full object-cover" alt="" />
                )}
              </div>

              {/* Lado Direito: Texto */}
              <div className="w-full lg:w-1/2 p-12 md:p-20 flex flex-col justify-center bg-white dark:bg-slate-900">
                <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-6">
                  <Calendar size={16} /> Detalhes do Evento
                </div>
                
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-none">
                  {selectedEvent.title}
                </h2>

                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-10 font-medium">
                  {parseDescription(selectedEvent.description)}
                </p>

                <div className="grid grid-cols-2 gap-8 mb-12">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Onde</span>
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                      <MapPin size={18} className="text-blue-600" />
                      {extractMeta(selectedEvent.description, 'Local')}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Quando</span>
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                      <Clock size={18} className="text-blue-600" />
                      {extractMeta(selectedEvent.description, 'Data')}
                    </div>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-600 hover:bg-blue-500 py-6 rounded-3xl text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/30 transition-all"
                >
                  Reservar Lugar Agora
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Events;