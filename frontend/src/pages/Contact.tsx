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
    // Simulação de envio (integrar com o seu backend de emails se necessário)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: <Phone className="text-blue-500" />,
      title: "Telefone & WhatsApp",
      value: settings['contact_phone'] || "+244 922 965 959",
      desc: "Segunda a Sexta, 08h às 18h"
    },
    {
      icon: <Mail className="text-indigo-500" />,
      title: "Email Geral",
      value: settings['contact_email'] || "geral@milvendas.ao",
      desc: "Respondemos em até 24 horas"
    },
    {
      icon: <MapPin className="text-emerald-500" />,
      title: "Sede em Luanda",
      value: "Nova Vida, Rua 120",
      desc: "Angola"
    }
  ];

  return (
    <section id="contacto" className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LADO ESQUERDO: INFO DE CONTACTO */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-blue-600 font-black uppercase tracking-widest text-sm mb-4">Fala Connosco</h2>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-8">
                Pronto para elevar a sua <span className="text-blue-600">infraestrutura?</span>
              </h3>
              
              <div className="space-y-6 mb-12">
                {contactInfo.map((item, i) => (
                  <div key={i} className="flex gap-6 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{item.title}</h4>
                      <p className="text-lg font-black text-slate-900 dark:text-white mt-1">{item.value}</p>
                      <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Horário de Funcionamento Visual */}
              <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white">
                <div className="flex items-center gap-4 mb-4">
                  <Clock size={24} />
                  <span className="font-black text-xl">Horário de Operação</span>
                </div>
                <p className="opacity-90 leading-relaxed">
                  A nossa equipa de suporte técnico está disponível para emergências 24/7 para clientes com contrato de manutenção ativo.
                </p>
              </div>
            </motion.div>
          </div>

          {/* LADO DIREITO: FORMULÁRIO */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase ml-2">Nome Completo</label>
                    <input 
                      required
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl font-bold text-slate-900 dark:text-white transition-all outline-none"
                      placeholder="Ex: Nilton Costa"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase ml-2">Email Corporativo</label>
                    <input 
                      required
                      type="email"
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl font-bold text-slate-900 dark:text-white transition-all outline-none"
                      placeholder="nome@empresa.ao"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-2">Assunto da Consulta</label>
                  <select 
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl font-bold text-slate-900 dark:text-white transition-all outline-none appearance-none"
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                  >
                    <option>Novo Projeto de Telecom</option>
                    <option>Desenvolvimento de Software</option>
                    <option>Manutenção Preventiva</option>
                    <option>Outros Assuntos</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-2">Como podemos ajudar?</label>
                  <textarea 
                    required
                    rows={5}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl font-bold text-slate-900 dark:text-white transition-all outline-none resize-none"
                    placeholder="Descreva brevemente a sua necessidade técnica..."
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 bg-blue-600 text-white rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : success ? (
                    <><CheckCircle2 /> Mensagem Recebida!</>
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
      </div>
    </section>
  );
};

export default Contact;