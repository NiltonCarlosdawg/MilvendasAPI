// src/components/EventCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar } from 'lucide-react';

// ─── Tipo mínimo necessário para o card ───────────────────────────────────────
interface EventCardItem {
  id: string;
  title: string;
  descriptionShort: string;
  eventDate: string;
  location: string;
  capacity?: number | null;
}

interface EventCardProps {
  event: EventCardItem;
  onClick: () => void;
  index: number;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick, index }) => {
  const dateObj = new Date(event.eventDate);
  const dia = dateObj.getUTCDate();
  const mes = dateObj.toLocaleString('pt-PT', { month: 'short' }).replace('.', '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="cursor-pointer group relative bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 hover:border-blue-500/50 transition-all duration-500 overflow-hidden shadow-xl"
    >
      <div className="relative z-10 flex flex-col md:flex-row gap-8">
        {/* Data */}
        <div className="flex-shrink-0">
          <div className="w-20 h-24 bg-slate-900 dark:bg-blue-600 rounded-2xl flex flex-col items-center justify-center text-white shadow-2xl shadow-blue-500/20">
            <span className="text-3xl font-black">{dia}</span>
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">{mes}</span>
          </div>
        </div>

        {/* Informações */}
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase rounded-lg border border-blue-200 dark:border-blue-500/20">
              {event.location}
            </span>
            {event.capacity != null && (
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

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar size={14} />
            <span>{new Date(event.eventDate).toLocaleDateString('pt-PT')}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;