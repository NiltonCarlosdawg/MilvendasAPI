import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
  Trash2, Upload, LogOut, PlusCircle, Loader2, 
  Calendar, Briefcase, ChevronRight, CheckCircle2, AlertCircle 
} from 'lucide-react';

const AdminDashboard = () => {
  const { token, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEvent, setIsEvent] = useState(false);
  const [status, setStatus] = useState<{type: 'success' | 'error', msg: string} | null>(null);
  
  const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '' });
  const API_BASE = "https://milvendasapi.onrender.com/api/v1";

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/portfolio`);
      const data = await res.json();
      setItems(data.reverse()); // Mostrar os mais recentes primeiro
    } catch (err) { console.error(err); }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  // Preview da imagem selecionada
  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setStatus(null);

    const mediaType = file.type.startsWith('video') ? 'video' : 'image';
    const data = new FormData();
    data.append('file', file);
    data.append('title', formData.title);
    data.append('mediaType', mediaType);

    const finalDescription = isEvent 
      ? `[EVENTO] Data: ${formData.date} | Local: ${formData.location} | ${formData.description}`
      : formData.description;
    data.append('description', finalDescription);

    try {
      const res = await fetch(`${API_BASE}/portfolio`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });

      if (res.ok) {
        setFormData({ title: '', description: '', date: '', location: '' });
        setFile(null);
        fetchData();
        setStatus({ type: 'success', msg: 'Publicado com sucesso no sistema!' });
      } else {
        setStatus({ type: 'error', msg: 'Erro ao publicar. Tente novamente.' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Erro de ligação ao servidor.' });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 4000);
    }
  };

    function deleteItem(id: any): void {
        throw new Error('Function not implemented.');
    }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Background Decorativo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-12 bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/40">
              <PlusCircle className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tighter italic">MV_CONTROL</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em]">Nível de Acesso: Administrador</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout} 
            className="group flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-3 rounded-2xl transition-all duration-300 font-bold text-xs"
          >
            <LogOut size={18} className="group-hover:rotate-12 transition-transform"/> SAIR
          </motion.button>
        </header>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Formulário - Coluna 5 */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/10 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                Criar Novo Conteúdo
              </h2>

              {/* Toggle Switch Bonitinho */}
              <div className="flex bg-black/40 p-1.5 rounded-2xl mb-8 border border-white/5">
                <button 
                  onClick={() => setIsEvent(false)}
                  className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl text-xs font-black transition-all ${!isEvent ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Briefcase size={16}/> PORTFÓLIO
                </button>
                <button 
                  onClick={() => setIsEvent(true)}
                  className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl text-xs font-black transition-all ${isEvent ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Calendar size={16}/> EVENTO
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-5">
                <div className="group">
                  <input 
                    type="text" 
                    placeholder={isEvent ? "Ex: Tech Summit 2025" : "Ex: App Mil Vendas"}
                    className="w-full bg-black/40 p-4 rounded-2xl border border-white/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600 text-sm" 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    required 
                  />
                </div>

                {isEvent && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" placeholder="Data (Ex: 20 Mai)" 
                      className="bg-black/40 p-4 rounded-2xl border border-white/10 text-sm outline-none focus:border-blue-500 transition-all" 
                      value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                    <input 
                      type="text" placeholder="Localização" 
                      className="bg-black/40 p-4 rounded-2xl border border-white/10 text-sm outline-none focus:border-blue-500 transition-all" 
                      value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </motion.div>
                )}

                <textarea 
                  placeholder="Descreve os detalhes do projeto ou evento de forma cativante..." 
                  className="w-full bg-black/40 p-4 rounded-2xl border border-white/10 h-32 outline-none focus:border-blue-500 transition-all text-sm resize-none" 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  required
                />

                {/* Upload Area com Preview */}
                <div className="relative group overflow-hidden rounded-[2rem] border-2 border-dashed border-white/10 hover:border-blue-500/50 transition-all aspect-video flex items-center justify-center bg-black/20">
                  <input type="file" id="file" accept="image/*,video/*" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
                  <label htmlFor="file" className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-3 p-4">
                    {preview ? (
                      file?.type.startsWith('video') ? (
                        <div className="text-blue-500 flex flex-col items-center gap-2">
                          <CheckCircle2 size={40} />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white">Vídeo Selecionado</span>
                        </div>
                      ) : (
                        <img src={preview} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Preview" />
                      )
                    ) : (
                      <>
                        <div className="p-4 bg-white/5 rounded-full text-slate-500 group-hover:text-blue-500 group-hover:bg-blue-500/10 transition-all">
                          <Upload size={28} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Média (JPG, MP4)</span>
                      </>
                    )}
                  </label>
                </div>

                <AnimatePresence>
                  {status && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }}
                      className={`flex items-center gap-3 p-4 rounded-2xl text-xs font-bold ${status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
                    >
                      {status.type === 'success' ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
                      {status.msg}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex justify-center shadow-2xl shadow-blue-600/30 transition-all"
                >
                  {loading ? <Loader2 className="animate-spin" /> : `PUBLICAR ${isEvent ? 'EVENTO' : 'PROJETO'}`}
                </motion.button>
              </form>
            </div>
          </div>

          {/* Listagem - Coluna 7 */}
          <div className="lg:col-span-7">
             <div className="flex items-center justify-between mb-8 px-4">
               <h3 className="text-white font-bold text-xl">Feed de Conteúdo</h3>
               <span className="bg-white/5 px-4 py-1.5 rounded-full text-[10px] font-bold text-slate-400 border border-white/5 uppercase tracking-widest">
                 {items.length} Itens Total
               </span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                  {items.map((item: any, idx) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group relative bg-white/5 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-blue-500/30 transition-all shadow-xl"
                    >
                      <div className="h-48 bg-slate-900 overflow-hidden relative">
                        {item.mediaType === 'video' ? (
                          <video src={`${API_BASE}/uploads/${item.mediaUrl}`} className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <img src={`${API_BASE}/uploads/${item.mediaUrl}`} className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" alt="" />
                        )}
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-blue-400 border border-blue-500/30">
                          {item.description.includes('[EVENTO]') ? 'EVENT' : 'PORTFOLIO'}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h4 className="font-bold text-white text-sm mb-2 truncate uppercase tracking-tight">{item.title}</h4>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{item.mediaType}</span>
                          <motion.button 
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteItem(item.id)} 
                            className="text-red-500/40 hover:text-red-500 p-2 rounded-xl transition-all"
                          >
                            <Trash2 size={18}/>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;