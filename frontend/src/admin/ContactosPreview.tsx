// src/admin/ContactosPreview.tsx - ATUALIZADO
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Loader2, CheckCircle2, AlertTriangle, Globe } from 'lucide-react';

const ContactosPreview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const [info, setInfo] = useState({
    contact_address: '',
    contact_email: '',
    contact_phone: '',
  });

  // URL de produção corrigida
  const API_URL = 'https://milvendasapi.onrender.com/api/v1/settings';

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setApiError(null);
        const response = await fetch(API_URL);
        
        if (!response.ok) throw new Error("Não foi possível carregar os contactos.");

        const data = await response.json();
        // O seu controller retorna um settingsMap { key: value }
        setInfo({
          contact_address: data.contact_address || '',
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || '',
        });
      } catch (error: any) {
        console.error("Erro ao carregar configurações:", error);
        setApiError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleUpdate = async (key: string, value: string) => {
    if (!value) return;
    
    setSaving(true);
    setLastSaved(false);
    try {
      const token = localStorage.getItem('@MilVendas:token');
      const response = await fetch(API_URL, {
        method: 'POST', // O seu controller usa POST com upsert
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ key, value })
      });

      if (response.ok) {
        setLastSaved(true);
        setTimeout(() => setLastSaved(false), 3000);
      } else {
        throw new Error("Erro ao salvar");
      }
    } catch {
      alert("Erro ao sincronizar dado com o servidor.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
        <p className="text-slate-500">Carregando informações oficiais...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Contactos da Empresa</h1>
          <p className="text-slate-600 dark:text-gray-400">Gerencie os dados que aparecem no rodapé e na página de contacto.</p>
        </div>
        
        <div className="flex items-center gap-2">
          {saving && (
            <div className="flex items-center gap-2 text-blue-500 text-sm font-medium">
              <Loader2 size={16} className="animate-spin" />
              Sincronizando...
            </div>
          )}
          {lastSaved && (
            <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
              <CheckCircle2 size={16} />
              Guardado!
            </div>
          )}
        </div>
      </div>

      {apiError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertTriangle size={20} />
          <p className="text-sm font-medium">Aviso: {apiError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Painel de Edição */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail Oficial</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={18} />
              </div>
              <input 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
                placeholder="exemplo@milvendas.com"
                value={info.contact_email}
                onChange={(e) => setInfo({...info, contact_email: e.target.value})}
                onBlur={() => handleUpdate('contact_email', info.contact_email)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Telefone / WhatsApp</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Phone size={18} />
              </div>
              <input 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
                placeholder="+244 9XX XXX XXX"
                value={info.contact_phone}
                onChange={(e) => setInfo({...info, contact_phone: e.target.value})}
                onBlur={() => handleUpdate('contact_phone', info.contact_phone)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Endereço Sede</label>
            <div className="relative">
              <div className="absolute left-4 top-4 text-slate-400">
                <MapPin size={18} />
              </div>
              <textarea 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none h-32 resize-none" 
                placeholder="Rua, Bairro, Cidade, Angola"
                value={info.contact_address}
                onChange={(e) => setInfo({...info, contact_address: e.target.value})}
                onBlur={() => handleUpdate('contact_address', info.contact_address)}
              />
            </div>
          </div>
        </div>

        {/* Visualização de Cartão Virtual */}
        <div className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-600 rounded-3xl transform transition-transform group-hover:scale-[1.02] duration-500"></div>
          <div className="relative p-10 h-full flex flex-col justify-between text-white z-10">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Globe className="animate-pulse" size={24} />
                <span className="font-bold tracking-tighter text-xl">MIL VENDAS</span>
              </div>
              <h3 className="text-3xl font-light mb-8">Como os clientes <br/><span className="font-bold">verão os dados:</span></h3>
            </div>

            <div className="space-y-6">
              <motion.div animate={{ opacity: info.contact_email ? 1 : 0.3 }} className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md"><Mail size={20}/></div>
                <span className="text-lg">{info.contact_email || 'email@pendente.com'}</span>
              </motion.div>
              
              <motion.div animate={{ opacity: info.contact_phone ? 1 : 0.3 }} className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md"><Phone size={20}/></div>
                <span className="text-lg">{info.contact_phone || '+244 --- --- ---'}</span>
              </motion.div>

              <motion.div animate={{ opacity: info.contact_address ? 1 : 0.3 }} className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md"><MapPin size={20}/></div>
                <span className="text-lg leading-snug">{info.contact_address || 'Endereço não definido'}</span>
              </motion.div>
            </div>

            <div className="mt-12 pt-6 border-t border-white/20 text-xs opacity-60">
              Sincronizado via Psql Database • Atualizado em tempo real
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactosPreview;