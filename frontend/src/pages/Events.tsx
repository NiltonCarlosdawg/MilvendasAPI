import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Phone, Loader2, CheckCircle2, X, ArrowRight, Bell } from 'lucide-react';

interface EventItemType {
  id: string;
  title: string;
  eventDate: string; // Formato ISO: 2023-12-31T21:45:00.000Z
  location: string;
  descriptionShort: string;
  capacity: number | string;
  status: string;
}

const Events = () => {
  const [eventItems, setEventItems] = useState<EventItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFormId, setShowFormId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', eventTitle: '' });

  // Busca de dados na API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://milvendasapi.onrender.com/api/v1/events');
        const data = await response.json();
        // Filtra apenas os publicados
        const published = data.filter((ev: any) => ev.status === 'PUBLISHED');
        setEventItems(published);
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await fetch('https://milvendasapi.onrender.com/api/v1/events/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, eventId: showFormId }),
      });

      if (response.ok) {
        setSuccessId(showFormId);
        setTimeout(() => {
          setShowFormId(null);
          setSuccessId(null);
        }, 3000);
      }
    } catch (error) {
      console.error("Erro na inscrição:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <section id="events" className="py-24 bg-white dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Título da Secção */}
        <div className="max-w-3xl mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4"
          >
            <Bell size={14} className="animate-pulse" />
            <span>Fique Conectado</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight">
            Próximos <span className="text-blue-600">Eventos</span>
          </h2>
        </div>

        {/* Listagem de Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {eventItems.map((event, index) => {
            // TRATAMENTO DA DATA PARA EVITAR NÚMEROS GIGANTES
            const dateObj = new Date(event.eventDate);
            const dia = dateObj.getUTCDate();
            const mes = dateObj.toLocaleString('pt', { month: 'short' }).replace('.', '');

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 hover:border-blue-500/50 transition-all duration-500 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none"
              >
                <div className="relative z-10 flex flex-col md:flex-row gap-8">
                  
                  {/* DATA VISUAL (CORRIGIDA) */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-24 bg-slate-900 dark:bg-blue-600 rounded-2xl flex flex-col items-center justify-center text-white shadow-2xl shadow-blue-500/20">
                      <span className="text-3xl font-black">{dia}</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">{mes}</span>
                    </div>
                  </div>

                  {/* CONTEÚDO */}
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase rounded-lg border border-blue-200 dark:border-blue-500/20">
                        {event.location}
                      </span>
                      <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                        <Users size={12} /> {event.capacity} lugares
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h3>
                    
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 line-clamp-2">
                      {event.descriptionShort}
                    </p>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => { setShowFormId(event.id); setFormData({...formData, eventTitle: event.title}); }}
                        className="flex-grow py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-lg"
                      >
                        Reservar Lugar
                      </button>
                      <a 
                        href={`https://wa.me/244922965959?text=Info sobre: ${event.title}`}
                        className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-green-500 hover:border-green-500 transition-all"
                      >
                        <Phone size={20} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* FORMULÁRIO OVERLAY */}
                <AnimatePresence>
                  {showFormId === event.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 40 }}
                      className="absolute inset-0 z-20 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md p-8 flex flex-col justify-center"
                    >
                      <button 
                        onClick={() => setShowFormId(null)} 
                        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X size={24} />
                      </button>
                      
                      {successId === event.id ? (
                        <div className="text-center space-y-4">
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto"
                          >
                            <CheckCircle2 size={40} />
                          </motion.div>
                          <h4 className="text-2xl font-black dark:text-white">Inscrição Enviada!</h4>
                          <p className="text-slate-500 text-sm">Aguarde o nosso contacto.</p>
                        </div>
                      ) : (
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                          <div className="mb-4">
                            <h4 className="text-xl font-black dark:text-white">Reservar Vaga</h4>
                            <p className="text-xs text-blue-500 font-bold uppercase tracking-widest">{event.title}</p>
                          </div>
                          <input 
                            required
                            placeholder="Nome Completo"
                            className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border-none font-bold text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                            onChange={e => setFormData({...formData, name: e.target.value})}
                          />
                          <input 
                            required
                            type="email"
                            placeholder="Email para contacto"
                            className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border-none font-bold text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                            onChange={e => setFormData({...formData, email: e.target.value})}
                          />
                          <button 
                            disabled={submitting}
                            className="w-full py-5 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-600/20 transition-transform active:scale-95"
                          >
                            {submitting ? <Loader2 className="animate-spin mx-auto" /> : "Confirmar Presença"}
                          </button>
                        </form>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Events;