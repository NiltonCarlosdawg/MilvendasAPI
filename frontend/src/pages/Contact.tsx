import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Loader2, 
  CheckCircle2, 
  Clock,
  Send
} from 'lucide-react';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState<any>({}); 

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Novo Projeto',
    message: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('https://milvendasapi.onrender.com/api/v1/settings');
        const data = await response.json();
        if (Array.isArray(data)) {
          const config = data.reduce((acc: any, curr: any) => {
            if (curr.key) acc[curr.key.toLowerCase()] = curr.value;
            return acc;
          }, {});
          setSettings(config);
        }
      } catch (error) { console.error(error); }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de envio
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: 'Novo Projeto', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    }, 2000);
  };

  return (
    /* bg-transparent para revelar o logo no fundo */
    <section id="contacto" className="py-24 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Coluna de Informações: Agora translúcida */}
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-none">
                Vamos Construir o <br /> <span className="text-blue-600">Seu Próximo Projeto</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium max-w-md">
                Estamos prontos para oferecer a consultoria e o suporte técnico que a sua infraestrutura exige.
              </p>
            </div>

            <div className="grid gap-6">
              {[
                { icon: <Phone />, label: "Telefone", value: settings['phone'] || "+244 922 965 959" },
                { icon: <Mail />, label: "Email", value: settings['email'] || "geral@milvendas.ao" },
                { icon: <MapPin />, label: "Localização", value: settings['address'] || "Nova Vida, Luanda, Angola" },
                { icon: <Clock />, label: "Horário", value: "Seg - Sex: 08h às 17h" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-6 p-6 rounded-3xl bg-white/20 dark:bg-slate-800/30 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50"
                >
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-slate-900 dark:text-white font-bold">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Formulário: Efeito Vidro Fosco (Glassmorphism) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] border border-white/20 dark:border-slate-800/50 shadow-2xl relative overflow-hidden"
          >
            {/* Brilho decorativo interno */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl" />

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-2">Nome Completo</label>
                  <input 
                    required
                    type="text" 
                    className="w-full p-4 bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all"
                    placeholder="Ex: João Manuel"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-2">Email Corporativo</label>
                  <input 
                    required
                    type="email" 
                    className="w-full p-4 bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all"
                    placeholder="joao@empresa.ao"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-2">Mensagem</label>
                <textarea 
                  required
                  rows={5}
                  className="w-full p-4 bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all resize-none"
                  placeholder="Como a Mil Vendas pode ajudar o seu negócio?"
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : success ? (
                  <><CheckCircle2 /> Mensagem Enviada!</>
                ) : (
                  <>
                    Enviar Solicitação
                    <Send size={20} />
                  </>
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </div>

      {/* Decoração de fundo translúcida */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-10" />
    </section>
  );
};

export default Contact;