// frontend/src/pages/Events.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Bell, Calendar, MapPin, ExternalLink, Image as ImageIcon, Clock, ArrowUpRight } from 'lucide-react';
import EventDetailsModal from '../components/EventDetailsModal';

// ─── URLs centralizadas ────────────────────────────────────────────────────────
// Remove /api/v1 do final se o VITE_API_URL já o incluir, evitando duplicação
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://api.milvendas.ao')
  .replace(/\/api\/v1\/?$/, '');

const API_URL     = `${API_BASE_URL}/api/v1`;   // para chamadas à API
const UPLOADS_URL = `${API_BASE_URL}/uploads`;  // para ficheiros estáticos

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface EventMedia {
  id: string;
  url: string;
  isCover: boolean;
  mediaType: string;
  order: number;
}

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
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'FINISHED';
  eventType: 'OWN' | 'THIRD_PARTY';
  allowTicketRequest: boolean;
  externalLink?: string | null;
  organizerName?: string | null;
  organizerContact?: string | null;
  media?: EventMedia[];
}

interface TicketRequestForm {
  name: string;
  email: string;
  phone: string;
  quantity: number;
  message: string;
}

// ─── Helper: resolve URL da imagem de capa ────────────────────────────────────
const getCoverImage = (event: EventItemType): string | null => {
  const cover = event.media?.find(m => m.isCover) ?? event.media?.[0];
  if (!cover) return null;
  // O campo url guarda apenas o filename (ex: "abc123-foto.jpg")
  // O ficheiro está fisicamente em uploads/events/
  return `${UPLOADS_URL}/events/${cover.url}`;
};

// ─── Componente principal ─────────────────────────────────────────────────────
const Events = () => {
  const [eventItems, setEventItems]   = useState<EventItemType[]>([]);
  const [loading, setLoading]         = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventItemType | null>(null);
  const [modalOpen, setModalOpen]     = useState(false);
  const [showFormId, setShowFormId]   = useState<string | null>(null);
  const [submitting, setSubmitting]   = useState(false);
  const [successId, setSuccessId]     = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState<TicketRequestForm>({
    name: '', email: '', phone: '', quantity: 1, message: ''
  });

  // ── Fetch de eventos ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/events?status=PUBLISHED`);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();

        // O backend já filtra por status=PUBLISHED, mas filtramos
        // localmente também como salvaguarda
        const published = Array.isArray(data)
          ? data.filter((ev: EventItemType) => ev.status === 'PUBLISHED')
          : [];

        setEventItems(published);
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        setErrorMessage('Não foi possível carregar os eventos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const openEventDetails = (event: EventItemType) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleImageError = (eventId: string) => {
    setImageErrors(prev => new Set(prev).add(eventId));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showFormId) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_URL}/events/${showFormId}/ticket-request`, {
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
        setErrorMessage(data.error || 'Erro ao processar inscrição');
      }
    } catch (error) {
      console.error('Erro na inscrição:', error);
      setErrorMessage('Erro de conexão. Verifique a sua internet.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Formatação de datas ──────────────────────────────────────────────────────
  const formatDateRange = (startDate: string, endDate?: string | null) => {
    const fmt = (d: string) => new Date(d).toLocaleDateString('pt-PT', {
      day: 'numeric', month: 'long'
    });
    return endDate ? `${fmt(startDate)} - ${fmt(endDate)}` : fmt(startDate);
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
    </div>
  );

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <section id="events" className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4"
            >
              <Bell size={14} className="animate-pulse" />
              <span>Agenda de Eventos</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tight">
              Próximos<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Eventos
              </span>
            </h2>
          </div>

          <p className="text-slate-500 dark:text-slate-400 max-w-md text-sm leading-relaxed">
            Descubra os melhores eventos, workshops e encontros.
            Clique para ver detalhes e garantir sua participação.
          </p>
        </div>

        {/* Erro global */}
        {errorMessage && !showFormId && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm">
            {errorMessage}
          </div>
        )}

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {eventItems.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
              <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Nenhum evento agendado</h3>
              <p className="text-slate-500 max-w-sm">Volte em breve para conferir novos eventos e oportunidades.</p>
            </div>
          ) : (
            eventItems.map((event, index) => {
              const coverImage = getCoverImage(event);
              const hasImage   = !!coverImage && !imageErrors.has(event.id);
              const dateObj    = new Date(event.eventDate);
              const dia  = dateObj.getUTCDate();
              const mes  = dateObj.toLocaleString('pt-PT', { month: 'short' }).toUpperCase().replace('.', '');
              const hora = dateObj.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
              const isExternal = event.eventType === 'THIRD_PARTY';

              return (
                <motion.article
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true, margin: '-50px' }}
                  className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl shadow-slate-200/50 dark:shadow-none dark:hover:shadow-blue-500/10 transition-all duration-500 border border-slate-200 dark:border-slate-800 flex flex-col"
                >
                  {/* Imagem */}
                  <div
                    className="relative aspect-[4/3] overflow-hidden cursor-pointer bg-slate-100 dark:bg-slate-800"
                    onClick={() => openEventDetails(event)}
                  >
                    {hasImage ? (
                      <>
                        <motion.img
                          src={coverImage!}
                          alt={event.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          onError={() => handleImageError(event.id)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
                        <div className="w-16 h-16 bg-white/60 dark:bg-slate-700/60 rounded-2xl flex items-center justify-center mb-3">
                          <ImageIcon className="w-8 h-8 text-slate-400" />
                        </div>
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Sem imagem</span>
                      </div>
                    )}

                    {/* Badge data */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg text-center min-w-[70px]">
                        <span className="block text-2xl font-black text-slate-900 dark:text-white leading-none">{dia}</span>
                        <span className="block text-[10px] font-black text-blue-600 uppercase tracking-wider mt-1">{mes}</span>
                      </div>
                    </div>

                    {/* Badge externo */}
                    {isExternal && (
                      <div className="absolute top-4 right-4 px-3 py-1.5 bg-purple-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1">
                        <ExternalLink size={11} />
                        Externo
                      </div>
                    )}

                    {/* Badge galeria */}
                    {(event.media?.length ?? 0) > 1 && (
                      <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-full flex items-center gap-1.5">
                        <ImageIcon size={12} />
                        {event.media!.length} fotos
                      </div>
                    )}

                    {/* Botão hover */}
                    <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (event.allowTicketRequest) {
                            setShowFormId(event.id);
                            setFormData({ name: '', email: '', phone: '', quantity: 1, message: '' });
                            setErrorMessage(null);
                          } else {
                            openEventDetails(event);
                          }
                        }}
                        className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-xl transition-all active:scale-95 ${
                          event.allowTicketRequest
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30'
                            : 'bg-white text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {event.allowTicketRequest ? 'Reservar Vaga' : 'Ver Detalhes'}
                      </button>
                    </div>
                  </div>

                  {/* Conteúdo do card */}
                  <div className="flex flex-col flex-grow p-6">
                    <div className="flex items-center gap-4 mb-3 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-blue-500" />
                        {hora}
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin size={13} className="text-blue-500" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>

                    <h3
                      className="text-xl font-black text-slate-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer"
                      onClick={() => openEventDetails(event)}
                    >
                      {event.title}
                    </h3>

                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4 flex-grow">
                      {event.descriptionShort}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/50">
                      <span className="text-xs text-slate-400 font-medium">
                        {formatDateRange(event.eventDate, event.eventEndDate)}
                      </span>
                      <button
                        onClick={() => openEventDetails(event)}
                        className="flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-wider transition-colors group/btn"
                      >
                        Saber mais
                        <ArrowUpRight size={14} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                      </button>
                    </div>
                  </div>

                  {/* Overlay formulário de ingresso */}
                  <AnimatePresence>
                    {showFormId === event.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 bg-white dark:bg-slate-900 p-6 flex flex-col overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h4 className="text-lg font-black dark:text-white">Reservar Vaga</h4>
                            <p className="text-xs text-blue-500 font-bold uppercase tracking-widest truncate max-w-[200px]">{event.title}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowFormId(null);
                              setErrorMessage(null);
                            }}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                        </div>

                        {successId === event.id ? (
                          <div className="flex flex-col items-center justify-center flex-grow text-center space-y-4">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-20 h-20 bg-green-100 dark:bg-green-500/20 text-green-600 rounded-full flex items-center justify-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            </motion.div>
                            <div>
                              <h4 className="text-xl font-black dark:text-white mb-1">Inscrição Confirmada!</h4>
                              <p className="text-slate-500 text-sm">Entraremos em contacto em breve.</p>
                            </div>
                          </div>
                        ) : (
                          <form onSubmit={handleFormSubmit} className="space-y-4 flex-grow flex flex-col">
                            {errorMessage && (
                              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs">
                                {errorMessage}
                              </div>
                            )}

                            <div className="space-y-3 flex-grow">
                              <input
                                required
                                placeholder="Nome Completo *"
                                className="w-full p-3.5 bg-slate-100 dark:bg-slate-800 rounded-xl border-none font-bold text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:font-medium"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                              />
                              <input
                                required
                                type="email"
                                placeholder="Email *"
                                className="w-full p-3.5 bg-slate-100 dark:bg-slate-800 rounded-xl border-none font-bold text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:font-medium"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                              />
                              <input
                                required
                                type="tel"
                                placeholder="WhatsApp *"
                                className="w-full p-3.5 bg-slate-100 dark:bg-slate-800 rounded-xl border-none font-bold text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:font-medium"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                              />
                              <select
                                className="w-full p-3.5 bg-slate-100 dark:bg-slate-800 rounded-xl border-none font-bold text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                value={formData.quantity}
                                onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                              >
                                {[1, 2, 3, 4, 5].map(num => (
                                  <option key={num} value={num}>{num} {num === 1 ? 'ingresso' : 'ingressos'}</option>
                                ))}
                              </select>
                              <textarea
                                placeholder="Mensagem (opcional)"
                                rows={3}
                                className="w-full p-3.5 bg-slate-100 dark:bg-slate-800 rounded-xl border-none font-bold text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none placeholder:font-medium"
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                              />
                            </div>

                            <button
                              type="submit"
                              disabled={submitting}
                              className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 mt-auto"
                            >
                              {submitting
                                ? <Loader2 className="animate-spin mx-auto w-5 h-5" />
                                : 'Confirmar Presença'
                              }
                            </button>
                          </form>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })
          )}
        </div>

        {/* Modal de detalhes */}
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