// src/admin/NewsletterManager.tsx
import React, { useState } from 'react';
import { Send, Users, Mail, Loader2, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';

const NewsletterManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  const [formData, setFormData] = useState({
    subject: '',
    content: ''
  });

  const API_URL = 'https://milvendasapi.onrender.com/api/v1/newsletter/broadcast';

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm("Confirmar o envio desta newsletter para TODOS os subscritores?")) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('@MilVendas:token');
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSent(true);
        setFormData({ subject: '', content: '' });
        setTimeout(() => setSent(false), 5000);
      } else {
        alert("Erro ao enviar newsletter. Verifique as permissões do servidor.");
      }
    } catch  {
      alert("Erro de ligação ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Newsletter</h1>
        <p className="text-slate-500 text-sm font-medium">Comunique-se diretamente com a sua base de subscritores.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulário de Redação */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSend} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-6">
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Assunto do E-mail</label>
              <input 
                required
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                placeholder="Ex: Novidades Incríveis na MilVendas!"
                className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-lg font-bold focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Conteúdo (HTML suportado)</label>
                <button 
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"
                >
                  <Eye size={14}/> {previewMode ? "Editar Código" : "Visualizar Layout"}
                </button>
              </div>

              {previewMode ? (
                <div 
                  className="w-full p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 min-h-[300px] prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: formData.content || '<p className="text-slate-400 italic">Nada para visualizar...</p>' }}
                />
              ) : (
                <textarea 
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="<h1>Olá!</h1><p>Confira as nossas ofertas...</p>"
                  className="w-full p-6 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl h-[300px] font-mono text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                />
              )}
            </div>

            <button 
              type="submit"
              disabled={loading || !formData.subject || !formData.content}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-500/30 transition-all disabled:opacity-50 disabled:shadow-none"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : sent ? (
                <><CheckCircle2 size={20}/> Newsletter Enviada!</>
              ) : (
                <><Send size={20}/> Disparar para todos os Subscritores</>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar de Informações */}
        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-500/20">
            <div className="p-3 bg-white/10 rounded-xl w-fit mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-2xl font-black mb-1">Audiência</h3>
            <p className="text-indigo-100 text-sm mb-6">Seus e-mails serão entregues a todos os utilizadores que subscreveram no site.</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
                <span className="text-sm font-medium">Subscritores Ativos</span>
                <span className="text-xl font-black">--</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-[2rem] p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
              <AlertTriangle size={18}/>
              <span className="text-sm uppercase tracking-wider">Atenção</span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-500 leading-relaxed font-medium">
              O envio de newsletter é **irreversível**. Certifique-se de que o conteúdo não contém erros gramaticais ou links quebrados antes de disparar.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] p-6">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Mail size={16} className="text-blue-600"/> Dicas de Template
            </h4>
            <ul className="text-xs text-slate-500 space-y-3 font-medium">
              <li>• Use tags <strong>&lt;h1&gt;</strong> para títulos grandes.</li>
              <li>• Use <strong>&lt;button&gt;</strong> estilizado para CTAs.</li>
              <li>• Evite imagens muito pesadas.</li>
              <li>• Inclua sempre um link de contacto.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NewsletterManager;