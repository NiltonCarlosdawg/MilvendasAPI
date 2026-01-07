// src/pages/admin/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  Trash2, Upload, LogOut, PlusCircle, Loader2, 
  Calendar, Briefcase, CheckCircle2, AlertCircle 
} from 'lucide-react'; 

const AdminDashboard = () => {
  const { token, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEvent, setIsEvent] = useState(false);
  const [status, setStatus] = useState<{type: 'success' | 'error', msg: string} | null>(null);
  
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    date: '', 
    location: '' 
  });

  const API_BASE = "https://milvendasapi.onrender.com/api/v1";

  // Função para carregar os itens do portfólio/eventos
  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/portfolio`);
      const data = await res.json();
      setItems(data.reverse()); // Os mais recentes aparecem primeiro
    } catch (err) { 
      console.error("Erro ao carregar dados:", err); 
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  // Lógica de Preview do ficheiro selecionado
  useEffect(() => {
    if (!file) { 
      setPreview(null); 
      return; 
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus({ type: 'error', msg: 'Por favor, selecione um ficheiro.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    const data = new FormData();
    data.append('file', file);
    data.append('title', formData.title);
    data.append('mediaType', file.type.startsWith('video') ? 'video' : 'image');

    // Lógica para diferenciar descrição de eventos
    const finalDescription = isEvent 
      ? `[EVENTO] Data: ${formData.date} | Local: ${formData.location} | ${formData.description}`
      : formData.description;
    data.append('description', finalDescription);

    try {
      const res = await fetch(`${API_BASE}/portfolio`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}` 
        },
        body: data
      });

      if (res.ok) {
        setFormData({ title: '', description: '', date: '', location: '' });
        setFile(null);
        fetchData();
        setStatus({ type: 'success', msg: 'Publicado com sucesso!' });
      } else {
        setStatus({ type: 'error', msg: 'Falha na publicação. Verifique o servidor.' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Erro de ligação ao servidor.' });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 4000);
    }
  };

  // Função para eliminar item (Resolvido erro TS6133)
  const deleteItem = async (id: string) => {
    if (!window.confirm("Deseja eliminar permanentemente este item?")) return;

    try {
      const res = await fetch(`${API_BASE}/portfolio/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });

      if (res.ok) {
        fetchData();
      } else {
        alert("Erro ao eliminar o item.");
      }
    } catch (err) {
      console.error("Erro na eliminação:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        
        {/* Header Superior */}
        <header className="flex justify-between items-center mb-12 bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/40">
              <PlusCircle className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tighter italic">MV_CONTROL</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em]">Gestão de Conteúdos</p>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-3 rounded-2xl transition-all duration-300 font-bold text-xs"
          >
            <LogOut size={18} /> SAIR
          </button>
        </header>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Coluna do Formulário (Upload) */}
          <div className="lg:col-span-5">
            <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/10 shadow-2xl sticky top-8">
              <div className="flex bg-black/40 p-1.5 rounded-2xl mb-8 border border-white/5">
                <button 
                  onClick={() => setIsEvent(false)}
                  className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl text-xs font-black transition-all ${!isEvent ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Briefcase size={16}/> PORTFÓLIO
                </button>
                <button 
                  onClick={() => setIsEvent(true)}
                  className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl text-xs font-black transition-all ${isEvent ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Calendar size={16}/> EVENTO
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-5">
                <input 
                  type="text" 
                  placeholder={isEvent ? "Título do Evento" : "Nome do Projeto"}
                  className="w-full bg-black/40 p-4 rounded-2xl border border-white/10 outline-none text-sm focus:border-blue-500 transition-colors" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  required 
                />

                {isEvent && (
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" placeholder="Data (Ex: 12 Out)" 
                      className="bg-black/40 p-4 rounded-2xl border border-white/10 text-sm outline-none focus:border-blue-500" 
                      value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                    <input 
                      type="text" placeholder="Localização" 
                      className="bg-black/40 p-4 rounded-2xl border border-white/10 text-sm outline-none focus:border-blue-500" 
                      value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                )}

                <textarea 
                  placeholder="Descrição breve..." 
                  className="w-full bg-black/40 p-4 rounded-2xl border border-white/10 h-32 outline-none text-sm resize-none focus:border-blue-500" 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  required
                />

                <div className="relative rounded-[2rem] border-2 border-dashed border-white/10 hover:border-blue-500/50 transition-all aspect-video flex items-center justify-center bg-black/20 overflow-hidden group">
                  <input 
                    type="file" 
                    id="file-upload" 
                    accept="image/*,video/*" 
                    className="hidden" 
                    onChange={e => setFile(e.target.files?.[0] || null)} 
                  />
                  <label htmlFor="file-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-3">
                    {preview ? (
                      <img src={preview} className="absolute inset-0 w-full h-full object-cover group-hover:opacity-40 transition-opacity" alt="Preview" />
                    ) : (
                      <div className="flex flex-col items-center text-slate-500 group-hover:text-blue-500">
                        <Upload size={32} className="mb-2" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Upload Media</span>
                      </div>
                    )}
                  </label>
                </div>

                {status && (
                  <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${status.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {status.type === 'success' ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
                    {status.msg}
                  </div>
                )}

                <button 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex justify-center items-center shadow-2xl transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'PUBLICAR NO SITE'}
                </button>
              </form>
            </div>
          </div>

          {/* Coluna da Listagem (Gestão) */}
          <div className="lg:col-span-7">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                  {items.map((item: any) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/10 group"
                    >
                      <div className="h-44 bg-slate-900 relative overflow-hidden">
                        <img 
                          src={`${API_BASE}/uploads/${item.mediaUrl}`} 
                          className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" 
                          alt={item.title} 
                        />
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-blue-400 border border-blue-500/30">
                          {item.description.includes('[EVENTO]') ? 'EVENT' : 'PORTFOLIO'}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h4 className="font-bold text-white text-sm mb-3 truncate uppercase tracking-tight">{item.title}</h4>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{item.mediaType}</span>
                          <button 
                            onClick={() => deleteItem(item.id)} 
                            className="text-red-500/30 hover:text-red-500 p-2 rounded-xl transition-all bg-red-500/5 hover:bg-red-500/10"
                            title="Eliminar"
                          >
                            <Trash2 size={18}/>
                          </button>
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