// Contact.tsx corrigido
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

  const displayPhone = settings.telefone_whatsapp || settings.contact_phone || '922 965 959';
  const displayEmail = settings.email_oficial || settings.contact_email || 'geral@milvendas.com';
  const displayAddress = settings.endereco_sede || settings.contact_address || 'Luanda, Nova Vida, Rua 120';
  
  const whatsappNumber = displayPhone.toString().replace(/\s+/g, '').replace('+', '');

  return (
    <section id="contacto" className="py-24 relative px-4 sm:px-6 bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase text-sm">
            Contacto
          </h2>
          <p className="mt-2 text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
            {settings.contact_title || 'Vamos criar algo incrível?'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* INFO DE CONTACTO */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-slate-800/80 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Informações Oficiais</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="p-3 bg-blue-100 dark:bg-blue-600/20 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Localização</p>
                    <p className="text-slate-900 dark:text-white font-semibold text-lg">{displayAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="p-3 bg-blue-100 dark:bg-blue-600/20 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Email</p>
                    <p className="text-slate-900 dark:text-white font-semibold text-lg">{displayEmail}</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="p-3 bg-blue-100 dark:bg-blue-600/20 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Telefone</p>
                    <p className="text-slate-900 dark:text-white font-semibold text-lg">{displayPhone}</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
                <a 
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
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
            className="bg-white dark:bg-slate-800/80 rounded-3xl p-8 md:p-10 shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-gray-300 ml-2">Seu Nome</label>
                <input 
                  required
                  className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-gray-300 ml-2">Seu Email</label>
                <input 
                  required
                  type="email"
                  className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-gray-300 ml-2">Mensagem</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-slate-900 dark:bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Mensagem Enviada
                  </>
                ) : (
                  "Enviar Proposta"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;