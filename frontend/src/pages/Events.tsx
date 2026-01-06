// src/pages/Events.tsx - CÓDIGO INTEGRADO COM API
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, Phone, Loader2 } from 'lucide-react';

interface EventItemType {
  id: string;
  title: string;
  eventDate: string;
  location: string;
  descriptionShort: string;
  capacity: number | string;
  status: string;
}

const Events = () => {
  const [eventItems, setEventItems] = useState<EventItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubscriptionForm, setShowSubscriptionForm] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [subscriptionData, setSubscriptionData] = useState({
    name: '',
    email: '',
    phone: '',
    eventTitle: ''
  });

  const API_URL = 'https://milvendasapi.onrender.com/api/v1/events';

  // 1. Carregar Eventos Reais da API
  const fetchEvents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      
      // Filtrar apenas eventos publicados para o público
      const publishedEvents = data.filter((ev: any) => ev.status === 'PUBLISHED');
      setEventItems(publishedEvents);
    } catch (error) {
      console.error("Erro ao carregar eventos da API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubscribeClick = (eventId: string, eventTitle: string) => {
    setShowSubscriptionForm(eventId);
    setSubscriptionData(prev => ({ ...prev, eventTitle }));
  };

  // 2. Enviar Inscrição para a API (Newsletter/Lead)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Aqui enviamos para a sua rota de newsletter ou contactos
      const response = await fetch('https://milvendasapi.onrender.com/api/v1/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: subscriptionData.email,
          name: subscriptionData.name,
          metadata: {
            event: subscriptionData.eventTitle,
            phone: subscriptionData.phone
          }
        })
      });

      if (response.ok) {
        alert(`Obrigado ${subscriptionData.name}! Inscrição confirmada para o evento.`);
        setSubscriptionData({ name: '', email: '', phone: '', eventTitle: '' });
        setShowSubscriptionForm(null);
      } else {
        throw new Error();
      }
    } catch  {
      alert("Erro ao processar inscrição. Tente novamente ou contacte-nos via WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-900">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium">Sincronizando agenda de eventos...</p>
      </div>
    );
  }

  if (eventItems.length === 0) {
    return (
      <section id="eventos" className="min-h-screen py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Calendar size={64} className="mx-auto text-slate-300 mb-6" />
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Sem eventos próximos</h1>
          <p className="text-slate-500 max-w-xl mx-auto mb-8">Estamos a preparar novas experiências tecnológicas. Subscreva a nossa newsletter para ser o primeiro a saber.</p>
          <a href="#newsletter" className="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl">Avisem-me de novos eventos</a>
        </div>
      </section>
    );
  }

  return (
    <section id="eventos" className="min-h-screen py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-16"
        >
          <h2 className="text-blue-600 font-black tracking-widest uppercase text-xs mb-3">Live Experience</h2>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">Eventos & Workshops</h1>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Conecte-se com especialistas e acelere a sua jornada digital.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {eventItems.map((event, index) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50 flex flex-col"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 text-blue-600 font-bold mb-4">
                  <Calendar size={18} />
                  <span>{new Date(event.eventDate).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long' })}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 leading-tight">{event.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed">{event.descriptionShort}</p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                    <Clock size={16} /> 
                    {new Date(event.eventDate).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                    <MapPin size={16} /> 
                    {event.location}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                    <Users size={16} /> 
                    Cap: {event.capacity || 'Ilimitada'}
                  </div>
                </div>
              </div>

              {showSubscriptionForm === event.id ? (
                <form onSubmit={handleSubmit} className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-blue-100 dark:border-blue-900">
                  <input 
                    required 
                    placeholder="Nome" 
                    className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl" 
                    value={subscriptionData.name} 
                    onChange={e => setSubscriptionData({...subscriptionData, name: e.target.value})} 
                  />
                  <input 
                    required 
                    type="email" 
                    placeholder="Email" 
                    className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl" 
                    value={subscriptionData.email} 
                    onChange={e => setSubscriptionData({...subscriptionData, email: e.target.value})} 
                  />
                  <input 
                    placeholder="Telefone (opcional)" 
                    className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl" 
                    value={subscriptionData.phone} 
                    onChange={e => setSubscriptionData({...subscriptionData, phone: e.target.value})} 
                  />
                  <div className="flex gap-2 pt-2">
                    <button 
                      disabled={submitting} 
                      type="submit" 
                      className="flex-1 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl"
                    >
                      {submitting ? '...' : 'Confirmar'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowSubscriptionForm(null)} 
                      className="px-4 py-3 bg-slate-100 dark:bg-slate-800 text-sm font-bold rounded-xl"
                    >
                      X
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleSubscribeClick(event.id, event.title)} 
                    className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                  >
                    Quero Participar
                  </button>
                  <a 
                    href={`https://wa.me/244922965959?text=Informações: ${event.title}`} 
                    className="p-4 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all"
                  >
                    <Phone size={20} />
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;