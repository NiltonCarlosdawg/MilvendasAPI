// frontend/src/pages/Events.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Phone, Loader2, Bell, Calendar, MapPin, ExternalLink, Image as ImageIcon } from 'lucide-react';
import EventDetailsModal from '../components/EventDetailsModal';

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
  const [selectedEvent, setSelectedEvent] = useState<EventItemType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
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

  // URL base da API
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.milvendas.ao';

  // Busca de dados na API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://api.milvendas.ao/api/v1/events?status=PUBLISHED');
        const data = await response.json();
        
        // Garante que é um array e filtra apenas os publicados
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
  }, [API_BASE_URL]);

  // Função para abrir o modal de detalhes
  const openEventDetails = (event: EventItemType) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  // Função para formatar data com intervalo
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

  // Função para obter a imagem de capa
  const getCoverImage = (event: EventItemType) => {
    const cover = event.media?.find(m => m.isCover) || event.media?.[0];
    return cover ? `${API_BASE_URL}/uploads/events/${cover.url}` : null;
  };

  // Função para lidar com a submissão do formulário de inscrição
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showFormId) return;
    
    setSubmitting(true);
    setErrorMessage(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/events/${showFormId}/ticket-request`, {
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
                  className="group relative bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-500 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none cursor-pointer"
                  onClick={() => openEventDetails(event)}
                >
                  {/* Imagem de Capa como fundo */}
                  {coverImage && (
                    <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
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
                        
                        {/* Badge para evento externo */}
                        {event.eventType === 'THIRD_PARTY' && (
                          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase rounded-lg border border-purple-200 dark:border-purple-500/20">
                            Externo
                          </span>
                        )}
                        
                        {/* Indicador de capacidade */}
                        {event.capacity && (
                          <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                            {/*<Users size={12} />*/} {/*{event.capacity}*/} {/*lugares*/}
                          </div>
                        )}

                        {/* Indicador de imagem */}
                        {event.media && event.media.length > 0 && (
                          <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                            <ImageIcon size={12} /> {event.media.length}
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
                        <p className="text-xs text-slate-400 mb-6 line-clamp-1">
                          📍 {event.address}
                        </p>
                      )}

                      {/* Botões de ação - NOTA: O clique no card já abre o modal, 
                          estes botões precisam de stopPropagation para não abrir o modal duas vezes */}
                      <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                        {/* Botão de reserva (só se permitido) */}
                        {event.allowTicketRequest && (
                          <button
                            onClick={(e) => { 
                              e.stopPropagation();
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
                        
                        {/* Link externo (se existir) */}
                        {event.externalLink && (
                          <a 
                            href={event.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-all"
                          >
                            <ExternalLink size={20} />
                          </a>
                        )}

                        {/* Link para WhatsApp */}
                        {/*<a 
                          href={`https://wa.me/244922965959?text=Olá! Gostaria de mais informações sobre o evento: ${event.title}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-green-500 hover:border-green-500 transition-all"
                        >
                         <Phone size={20} />
                        </a>*/}
                      </div>
                    </div>
                  </div>

                  {/* FORMULÁRIO OVERLAY - para inscrição rápida */}
                  <AnimatePresence>
                    {showFormId === event.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        className="absolute inset-0 z-20 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md p-8 flex flex-col justify-center overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowFormId(null);
                            setErrorMessage(null);
                          }} 
                          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                        
                        {successId === event.id ? (
                          <div className="text-center space-y-4">
                            <motion.div 
                              initial={{ scale: 0 }} animate={{ scale: 1 }}
                              className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
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
                                <svg className="animate-spin mx-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
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

        {/* Modal de Detalhes do Evento */}
        <EventDetailsModal 
          event={selectedEvent}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedEvent(null);
          }}
        />
      </div>
    </section>
  );
};

export default Events;