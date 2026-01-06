import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState<any>({}); 

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Solicitação de Orçamento',
    message: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('https://milvendasapi.onrender.com/api/v1/settings');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const config = data.reduce((acc: any, curr: any) => {
            if (curr.key) {
              const normalizedKey = curr.key.toLowerCase().replace(/[\s-]/g, '_');
              acc[normalizedKey] = curr.value;
            }
            return acc;
          }, {});
          setSettings(config);
        }
      } catch (error) {
        console.error("Erro ao carregar settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://milvendasapi.onrender.com/api/v1/contacts/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: 'Solicitação de Orçamento', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch  {
      alert("Erro ao enviar.");
    } finally {
      setLoading(false);
    }
  };

  const displayPhone = settings.telefone_whatsapp || settings.contact_phone || '930 000 000';
  const displayEmail = settings.email_oficial || settings.contact_email || 'geral@milvendas.com';
  const displayAddress = settings.endereco_sede || settings.contact_address || 'Benguela, Angola';
  
  const whatsappNumber = displayPhone.toString().replace(/\s+/g, '').replace('+', '');

  return (
    <section id="contacto" className="py-24 relative px-6 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-blue-500 font-black uppercase tracking-widest text-xs">Contacto</h2>
          <p className="text-4xl md:text-5xl font-black text-white mt-2 tracking-tighter">
            {settings.contact_title || 'Vamos criar algo incrível?'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          
          {/* INFO DE CONTACTO */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-slate-900/60 p-10 rounded-[2.5rem] border border-slate-800 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-white mb-8">Informações Oficiais</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="p-3 bg-blue-600/20 rounded-xl text-blue-500 border border-blue-500/10">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Localização</p>
                    <p className="text-white font-semibold text-lg">{displayAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="p-3 bg-blue-600/20 rounded-xl text-blue-500 border border-blue-500/10">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Email</p>
                    <p className="text-white font-semibold text-lg">{displayEmail}</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="p-3 bg-blue-600/20 rounded-xl text-blue-500 border border-blue-500/10">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Telefone</p>
                    <p className="text-white font-semibold text-lg">{displayPhone}</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-10 border-t border-slate-800">
                <a 
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20"
                >
                  <MessageSquare size={20} />
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </motion.div>

          {/* FORMULÁRIO */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Seu Nome</label>
                <input 
                  required
                  className="w-full p-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Seu Email</label>
                <input 
                  required
                  type="email"
                  className="w-full p-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Mensagem</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full p-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-900 resize-none focus:ring-2 focus:ring-blue-500"
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : success ? <><CheckCircle2 /> Mensagem Enviada</> : "Enviar Proposta"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;