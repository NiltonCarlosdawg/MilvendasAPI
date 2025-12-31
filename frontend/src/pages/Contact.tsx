import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, Globe, CheckCircle2, Instagram, Linkedin } from 'lucide-react';

const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui podes integrar com Formspree ou EmailJS
    setIsSent(true);
    setTimeout(() => setIsSent(false), 5000);
  };

  const contactDetails = [
    { icon: <Phone size={20} />, label: "Telefone", value: "+244 9XX XXX XXX", color: "bg-green-500/10 text-green-600" },
    { icon: <Mail size={20} />, label: "Email", value: "info@milvendas.co.ao", color: "bg-blue-500/10 text-blue-600" },
    { icon: <MapPin size={20} />, label: "Localização", value: "Luanda, Angola", color: "bg-red-500/10 text-red-600" }
  ];

  return (
    <section className="relative py-32 px-6 overflow-hidden bg-white dark:bg-[#030712]">
      {/* Decoração de Fundo */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-20">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter mb-6"
          >
            VAMOS <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">CONVERSAR?_</span>
          </motion.h2>
          <p className="max-w-xl text-slate-500 dark:text-slate-400 font-medium text-lg italic">
            "A tecnologia aproxima, mas a parceria transforma." Estamos prontos para o seu próximo desafio.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Lado Esquerdo: Info de Contacto */}
          <div className="lg:col-span-5 space-y-8">
            <div className="grid grid-cols-1 gap-6">
              {contactDetails.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 hover:border-blue-500/50 transition-all duration-500"
                >
                  <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">{item.label}</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">{item.value}</span>
                </motion.div>
              ))}
            </div>

            {/* Redes Sociais */}
            <div className="flex gap-4 pt-6">
              {[<Instagram size={24}/>, <Linkedin size={24}/>, <Globe size={24}/>].map((icon, i) => (
                <button key={i} className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Lado Direito: Formulário */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative p-8 md:p-12 rounded-[3rem] bg-slate-900 dark:bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-4">Nome Completo</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Nilton Carlos"
                      className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-blue-500 transition-all"
                      onChange={(e) => setFormState({...formState, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-4">Teu Melhor Email</label>
                    <input 
                      type="email" 
                      required
                      placeholder="exemplo@gmail.com"
                      className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-blue-500 transition-all"
                      onChange={(e) => setFormState({...formState, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-4">O que tens em mente?</label>
                  <textarea 
                    rows={5}
                    required
                    placeholder="Conta-nos sobre o teu projeto ou evento..."
                    className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                  />
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all ${isSent ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-500'} text-white shadow-xl shadow-blue-600/20`}
                >
                  {isSent ? (
                    <> <CheckCircle2 size={18} /> Mensagem Enviada! </>
                  ) : (
                    <> <Send size={18} /> Enviar Mensagem </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;