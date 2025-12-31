import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Certifique-se de ter instalado: npm install framer-motion
import { X, Save, Loader2,  Building2, Info, Calendar as CalendarIcon } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  eventToEdit?: any;
}

const AddEventModal: React.FC<Props> = ({ onClose, onSuccess, eventToEdit }) => {
  const [loading, setLoading] = useState(false);
  
  // Função auxiliar para formatar data para o input datetime-local (YYYY-MM-DDTHH:mm)
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16);
    } catch (e) {
      return '';
    }
  };

  const [formData, setFormData] = useState({
    title: eventToEdit?.title || '',
    eventType: eventToEdit?.eventType || 'OWN',
    descriptionShort: eventToEdit?.descriptionShort || '',
    descriptionLong: eventToEdit?.descriptionLong || '',
    eventDate: formatDateForInput(eventToEdit?.eventDate),
    eventEndDate: formatDateForInput(eventToEdit?.eventEndDate),
    location: eventToEdit?.location || '',
    address: eventToEdit?.address || '',
    capacity: eventToEdit?.capacity || '',
    allowTicketRequest: eventToEdit?.allowTicketRequest ?? true,
    externalLink: eventToEdit?.externalLink || '',
    organizerName: eventToEdit?.organizerName || '',
    organizerContact: eventToEdit?.organizerContact || '',
    status: eventToEdit?.status || 'PUBLISHED'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('@MilVendas:token');
      const url = eventToEdit 
        ? `https://milvendasapi.onrender.com/api/v1/events/admin/${eventToEdit.id}`
        : `https://milvendasapi.onrender.com/api/v1/events/admin/create`;

      const response = await fetch(url, {
        method: eventToEdit ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          capacity: formData.capacity ? Number(formData.capacity) : null,
          eventDate: formData.eventDate ? new Date(formData.eventDate).toISOString() : null,
          eventEndDate: formData.eventEndDate ? new Date(formData.eventEndDate).toISOString() : null
        })
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        alert(`Erro: ${error.message || 'Falha ao processar'}`);
      }
    } catch  {
      alert("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-white/20"
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <CalendarIcon className="text-blue-600" />
              {eventToEdit ? 'Editar Evento' : 'Novo Evento'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 ml-1">Tipo</label>
              <select name="eventType" value={formData.eventType} onChange={handleChange} className="w-full p-4 bg-slate-100 dark:bg-slate-900 border-none rounded-2xl font-bold text-blue-600">
                <option value="OWN">Propriedade MilVendas</option>
                <option value="THIRD_PARTY">Terceiros</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 ml-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full p-4 bg-slate-100 dark:bg-slate-900 border-none rounded-2xl font-bold">
                <option value="PUBLISHED">Publicado</option>
                <option value="DRAFT">Rascunho</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>
            <div className="flex items-center pt-6 px-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="allowTicketRequest" checked={formData.allowTicketRequest} onChange={handleChange} className="w-6 h-6 rounded-lg border-slate-300 text-blue-600" />
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Pedir Bilhetes?</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <input name="title" required value={formData.title} onChange={handleChange} placeholder="Título do Evento" className="w-full p-4 bg-slate-100 dark:bg-slate-900 border-none rounded-2xl text-lg font-bold" />
            <textarea name="descriptionShort" required value={formData.descriptionShort} onChange={handleChange} placeholder="Descrição curta..." className="w-full p-4 bg-slate-100 dark:bg-slate-900 border-none rounded-2xl h-20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">Data Início</label>
                <input name="eventDate" type="datetime-local" required value={formData.eventDate} onChange={handleChange} className="w-full p-4 bg-slate-100 dark:bg-slate-900 border-none rounded-2xl" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">Data Fim</label>
                <input name="eventEndDate" type="datetime-local" value={formData.eventEndDate} onChange={handleChange} className="w-full p-4 bg-slate-100 dark:bg-slate-900 border-none rounded-2xl" />
              </div>
            </div>
            <div className="space-y-4">
              <input name="location" required value={formData.location} onChange={handleChange} placeholder="Local (Ex: Marginal)" className="w-full p-4 bg-slate-100 dark:bg-slate-900 border-none rounded-2xl mt-6" />
              <input name="capacity" type="number" value={formData.capacity} onChange={handleChange} placeholder="Capacidade" className="w-full p-4 bg-slate-100 dark:bg-slate-900 border-none rounded-2xl" />
            </div>
          </div>

          {formData.eventType === 'THIRD_PARTY' && (
            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] space-y-4 border border-blue-100 dark:border-blue-800">
               <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"><Building2 size={16}/> Organizador</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="organizerName" placeholder="Nome" value={formData.organizerName} onChange={handleChange} className="w-full p-4 bg-white dark:bg-slate-800 border-none rounded-2xl" />
                  <input name="organizerContact" placeholder="Contacto" value={formData.organizerContact} onChange={handleChange} className="w-full p-4 bg-white dark:bg-slate-800 border-none rounded-2xl" />
               </div>
               <input name="externalLink" placeholder="Link Externo (https://...)" value={formData.externalLink} onChange={handleChange} className="w-full p-4 bg-white dark:bg-slate-800 border-none rounded-2xl" />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 ml-1 flex items-center gap-2"><Info size={14}/> Conteúdo HTML</label>
            <textarea name="descriptionLong" value={formData.descriptionLong} onChange={handleChange} placeholder="Conteúdo detalhado..." className="w-full p-4 bg-slate-100 dark:bg-slate-900 border-none rounded-2xl h-44 font-mono text-sm" />
          </div>

          <div className="pt-4 flex gap-4">
             <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 rounded-2xl font-bold">Cancelar</button>
             <button type="submit" disabled={loading} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" /> : <><Save size={20}/> Guardar</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddEventModal;