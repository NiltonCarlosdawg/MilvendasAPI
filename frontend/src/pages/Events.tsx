import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, 
  Phone,
  Loader2,
  CheckCircle2,
  X,
  Bell,
  Calendar,
  MapPin,
  ExternalLink,
  Image as ImageIcon 
}
 from 'lucide-react';

// Interface atualizada conforme o backend
interface EventItemType {
  id: string;
  title: string;
  slug: string;
  eventDate: string;
  eventEndDate?: string | null;
  location: string;
  address?: string | null;
  descriptionShort: string;
  descriptionLong?: string | null;
  capacity: number | null;
  status: 'DRAFT' | 'PUBLISHED';
  eventType: 'OWN' | 'THIRD_PARTY';
  allowTicketRequest: boolean;
  externalLink?: string | null;
  organizerName?: string | null;
  organizerContact?: string | null;
  media?: Array<{
    id: string;
    url: string;
    isCover: boolean;
    mediaType: string;
  }>;
}

// Interface para o formulário de inscrição
interface TicketRequestForm {
  name: string;
  email: string;
  phone: string;
  quantity: number;
  message: string;
}

const Events = () => {
  const [eventItems, setEventItems] = useState<EventItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFormId, setShowFormId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<TicketRequestForm>({ 
    name: '', 
    email: '', 
    phone: '',
    quantity: 1,
    message: ''
  });

  // Busca de dados na API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://milvendasapi.onrender.com/api/v1/events?status=PUBLISHED');
        const data = await response.json();
        
        // A API já pode filtrar por status, mas mantemos o filtro por segurança
        const published = Array.isArray(data) ? data.filter((ev: any) => ev.status === 'PUBLISHED') : [];
        setEventItems(published);
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
        setErrorMessage("Não foi possível carregar os eventos. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showFormId) return;
    
    setSubmitting(true);
    setErrorMessage(null);
    
    try {
      // Endpoint corrigido conforme o backend
      const response = await fetch(`https://milvendasapi.onrender.com/api/v1/events/${showFormId}/ticket-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessId(showFormId);
        setTimeout(() => {
          setShowFormId(null);
          setSuccessId(null);
        }, 3000);
      } else {
        setErrorMessage(data.error || "Erro ao processar inscrição");
      }
    } catch (error) {
      console.error("Erro na inscrição:", error);
      setErrorMessage("Erro de conexão. Verifique sua internet.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateRange = (startDate: string, endDate?: string | null) => {
    const start = new Date(startDate);
    const formattedStart = start.toLocaleDateString('pt-PT', { 
      day: 'numeric', 
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    if (!endDate) return formattedStart;
    
    const end = new Date(endDate);
    const formattedEnd = end.toLocaleDateString('pt-PT', { 
      day: 'numeric', 
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `${formattedStart} - ${formattedEnd}`;
  };

  const getCoverImage = (event: EventItemType) => {
    const cover = event.media?.find(m => m.isCover) || event.media?.[0];
    return cover ? `https://milvendasapi.onrender.com/uploads/events/${cover.url}` : null;
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

        {/* Mensagem de erro global */}
        {errorMessage && !showFormId && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm">
            {errorMessage}
          </div>
        )}

        {/* Listagem de Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {eventItems.length === 0 ? (
            <div className="col-span-2 text-center py-20">
              <p className="text-slate-400 text-lg">Nenhum evento agendado no momento.</p>
            </div>
          ) : (
            eventItems.map((event, index) => {
              const coverImage = getCoverImage(event);
              const dateObj = new Date(event.eventDate);
              const dia = dateObj.getUTCDate();
              const mes = dateObj.toLocaleString('pt-PT', { month: 'short' }).replace('.', '');

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-500 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none"
                >
                  {/* Imagem de Capa (se existir) */}
                  {coverImage && (
                    <div className="absolute inset-0 opacity-10">
                      <img 
                        src={coverImage} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="relative z-10 flex flex-col md:flex-row gap-8 p-8 backdrop-blur-[2px]">
                    
                    {/* DATA VISUAL */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-24 bg-slate-900 dark:bg-blue-600 rounded-2xl flex flex-col items-center justify-center text-white shadow-2xl shadow-blue-500/20">
                        <span className="text-3xl font-black">{dia}</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">{mes}</span>
                      </div>
                    </div>

                    {/* CONTEÚDO */}
                    <div className="flex-grow">
                      <div className="flex items-center flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase rounded-lg border border-blue-200 dark:border-blue-500/20 flex items-center gap-1">
                          <MapPin size={12} /> {event.location}
                        </span>
                        {event.eventType === 'THIRD_PARTY' && (
                          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase rounded-lg border border-purple-200 dark:border-purple-500/20">
                            Externo
                          </span>
                        )}
                        {event.capacity && (
                          <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                            <Users size={12} /> {event.capacity} lugares
                          </div>
                        )}
                      </div>

                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                        {event.title}
                      </h3>
                      
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
                        {event.descriptionShort}
                      </p>

                      {/* Data detalhada */}
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
                        <Calendar size={14} />
                        <span>{formatDateRange(event.eventDate, event.eventEndDate)}</span>
                      </div>

                      {/* Endereço (se existir) */}
                      {event.address && (
                        <p className="text-xs text-slate-400 mb-6">
                          📍 {event.address}
                        </p>
                      )}

                      <div className="flex items-center gap-4">
                        {event.allowTicketRequest && (
                          <button
                            onClick={() => { 
                              setShowFormId(event.id); 
                              setFormData({
                                name: '', 
                                email: '', 
                                phone: '',
                                quantity: 1,
                                message: ''
                              });
                              setErrorMessage(null);
                            }}
                            className="flex-grow py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-lg"
                          >
                            Reservar Lugar
                          </button>
                        )}
                        
                        {event.externalLink && (
                          <a 
                            href={event.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-all"
                          >
                            <ExternalLink size={20} />
                          </a>
                        )}

                        <a 
                          href={`https://wa.me/244922965959?text=Olá! Gostaria de mais informações sobre o evento: ${event.title}`}
                          target="_blank"
                          rel="noopener noreferrer"
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
                        className="absolute inset-0 z-20 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md p-8 flex flex-col justify-center overflow-y-auto"
                      >
                        <button 
                          onClick={() => {
                            setShowFormId(null);
                            setErrorMessage(null);
                          }} 
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
                            <p className="text-slate-500 text-sm">Aguarde o nosso contacto via WhatsApp.</p>
                          </div>
                        ) : (
                          <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div className="mb-4">
                              <h4 className="text-xl font-black dark:text-white">Reservar Vaga</h4>
                              <p className="text-xs text-blue-500 font-bold uppercase tracking-widest">{event.title}</p>
                            </div>

                            {errorMessage && (
                              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs">
                                {errorMessage}
                              </div>
                            )}
                            
                            <input 
                              required
                              placeholder="Nome Completo *"
                              className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border-none font-bold text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                              value={formData.name}
                              onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                            
                            <input 
                              required
                              type="email"
                              placeholder="Email *"
                              className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border-none font-bold text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                              value={formData.email}
                              onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                            
                            <input 
                              required
                              type="tel"
                              placeholder="WhatsApp *"
                              className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border-none font-bold text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                              value={formData.phone}
                              onChange={e => setFormData({...formData, phone: e.target.value})}
                            />
                            
                            <div>
                              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                                Quantidade de ingressos
                              </label>
                              <select
                                className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border-none font-bold text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                                value={formData.quantity}
                                onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
                              >
                                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                  <option key={num} value={num}>{num} {num === 1 ? 'ingresso' : 'ingressos'}</option>
                                ))}
                              </select>
                            </div>
                            
                            <textarea
                              placeholder="Mensagem (opcional)"
                              rows={3}
                              className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border-none font-bold text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                              value={formData.message}
                              onChange={e => setFormData({...formData, message: e.target.value})}
                            />
                            
                            <button 
                              type="submit"
                              disabled={submitting}
                              className="w-full py-5 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-600/20 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {submitting ? (
                                <Loader2 className="animate-spin mx-auto" />
                              ) : (
                                "Confirmar Presença"
                              )}
                            </button>
                            
                            <p className="text-[10px] text-center text-slate-400">
                              * Campos obrigatórios
                            </p>
                          </form>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Events;