// src/admin/components/AddPortfolioModal.tsx
import React, { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';

interface AddPortfolioModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddPortfolioModal: React.FC<AddPortfolioModalProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Comunicação',
    client: '',
    year: new Date().getFullYear().toString(),
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Selecione uma imagem ou vídeo");

    setLoading(true);
    
    // O segredo do upload: FormData
    const data = new FormData();
    data.append('file', file); // 'file' deve ser igual ao upload.single('file') do backend
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('client', formData.client);
    data.append('year', formData.year);

    try {
      const token = localStorage.getItem('@MilVendas:token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/portfolio`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // NOTA: Não defina 'Content-Type' aqui, o navegador faz isso automaticamente para FormData
        },
        body: data
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const errData = await response.json();
        alert(`Erro: ${errData.error}`);
      }
    } catch  {
      alert("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold dark:text-white">Novo Item de Portfólio</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-red-500"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 text-center">
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              accept="image/*,video/*"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <Upload className={`mb-2 ${file ? 'text-green-500' : 'text-blue-500'}`} size={32} />
              <span className="text-sm dark:text-gray-300">
                {file ? file.name : "Clique para selecionar mídia"}
              </span>
            </label>
          </div>

          <input 
            type="text" 
            placeholder="Título do Projeto"
            className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-lg dark:text-white border-none focus:ring-2 focus:ring-blue-500"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            required
          />

          <textarea 
            placeholder="Descrição curta"
            className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-lg dark:text-white border-none focus:ring-2 focus:ring-blue-500 h-24"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <select 
              className="p-3 bg-slate-100 dark:bg-slate-900 rounded-lg dark:text-white border-none"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="Comunicação">Comunicação</option>
              <option value="Marketing">Marketing</option>
              <option value="Design">Design</option>
              <option value="Eventos">Eventos</option>
            </select>
            <input 
              type="text" 
              placeholder="Cliente"
              className="p-3 bg-slate-100 dark:bg-slate-900 rounded-lg dark:text-white border-none"
              value={formData.client}
              onChange={e => setFormData({...formData, client: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex justify-center items-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Salvar no Portfólio"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPortfolioModal;