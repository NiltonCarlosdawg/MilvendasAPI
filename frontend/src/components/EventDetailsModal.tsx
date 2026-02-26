// src/components/EventDetailsModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, ExternalLink, Phone, Ticket } from 'lucide-react';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface EventMedia {
  id: string;
  url: string;
  isCover: boolean;
  mediaType: string;
}

interface EventDetail {
  id: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'FINISHED';
  eventType: 'OWN' | 'THIRD_PARTY';
  descriptionShort: string;
  descriptionLong?: string | null;
  eventDate: string;
  eventEndDate?: string | null;
  location: string;
  address?: string | null;
  capacity?: number | null;
  organizerName?: string | null;
  organizerContact?: string | null;
  externalLink?: string | null;
  allowTicketRequest: boolean;
  media?: EventMedia[];
}

interface EventDetailsModalProps {
  event: EventDetail | null;
  onClose: () => void;
  isOpen: boolean;
}

// ─── URL helper ───────────────────────────────────────────────────────────────
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://api.milvendas.ao')
  .replace(/\/api\/v1\/?$/, '');

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, onClose, isOpen }) => {
  if (!event || !isOpen) return null;

  const coverMedia = event.media?.find(m => m.isCover) ?? event.media?.[0];
  const coverUrl   = coverMedia ? `${API_BASE_URL}/uploads/events/${coverMedia.url}` : null;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('pt-PT', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Cabeçalho com imagem */}
            {coverUrl && (
              <div className="relative h-64 w-full">
                <img
                  src={coverUrl}
                  alt={event.title}
                  className="w-full h-full object-cover rounded-t-3xl"
                />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-slate-800/90 rounded-xl text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
                    event.status === 'PUBLISHED' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {event.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
                    event.eventType === 'OWN' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
                  }`}>
                    {event.eventType === 'OWN' ? 'Próprio' : 'Externo'}
                  </span>
                </div>
              </div>
            )}

            {/* Conteúdo */}
            <div className="p-8 space-y-6">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">{event.title}</h2>

              {/* Datas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <Calendar className="text-blue-500 mb-2" size={20} />
                  <p className="text-sm text-slate-500">Data de Início</p>
                  <p className="font-bold dark:text-white">{formatDate(event.eventDate)}</p>
                </div>

                {event.eventEndDate && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    <Calendar className="text-purple-500 mb-2" size={20} />
                    <p className="text-sm text-slate-500">Data de Término</p>
                    <p className="font-bold dark:text-white">{formatDate(event.eventEndDate)}</p>
                  </div>
                )}
              </div>

              {/* Local */}
              <div className="flex items-start gap-3">
                <MapPin className="text-blue-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-bold dark:text-white">{event.location}</p>
                  {event.address && <p className="text-sm text-slate-500">{event.address}</p>}
                </div>
              </div>

              {/* Descrições */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black mb-2 dark:text-white">Descrição Curta</h3>
                  <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                    {event.descriptionShort}
                  </p>
                </div>

                {event.descriptionLong && (
                  <div>
                    <h3 className="text-lg font-black mb-2 dark:text-white">Descrição Completa</h3>
                    <div
                      className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl prose dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: event.descriptionLong }}
                    />
                  </div>
                )}
              </div>

              {/* Organizador */}
              {(event.organizerName ?? event.organizerContact) && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <h3 className="text-lg font-black mb-3 dark:text-white">Organizador</h3>
                  {event.organizerName && (
                    <p className="font-bold dark:text-white">{event.organizerName}</p>
                  )}
                  {event.organizerContact && (
                    <a
                      href={`https://wa.me/${event.organizerContact.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-green-600 hover:text-green-700 mt-2"
                    >
                      <Phone size={16} /> {event.organizerContact}
                    </a>
                  )}
                </div>
              )}

              {/* Link externo */}
              {event.externalLink && (
                <a
                  href={event.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink size={20} /> Página do Evento
                </a>
              )}

              {/* Reservar lugar */}
              {event.allowTicketRequest && (
                <button
                  onClick={onClose}
                  className="w-full py-4 bg-green-600 text-white rounded-xl font-black hover:bg-green-700 transition-colors"
                >
                  <Ticket size={20} className="inline mr-2" />
                  Reservar Lugar
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventDetailsModal;