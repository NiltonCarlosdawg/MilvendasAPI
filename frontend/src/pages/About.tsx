import { motion } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';
import { Link } from 'react-router-dom';
import { Target, Eye, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';

const About = () => {
  const { settings } = useSettings();

  const content = {
    title: settings['about_title'] || "Mil Vendas Consultoria",
    description: settings['about_description'] || "Empresa angolana especializada em serviços técnicos de telecomunicações, focada em infraestruturas críticas e parcerias estratégicas.",
  };

  const pillars = [
    {
      icon: <Target className="text-blue-500" size={24} />,
      title: "Missão",
      text: "Entregar excelência técnica em telecomunicações e engenharia, conectando Angola ao futuro."
    },
    {
      icon: <Eye className="text-indigo-500" size={24} />,
      title: "Visão",
      text: "Ser a referência nacional em inovação e manutenção de infraestruturas críticas até 2027."
    },
    {
      icon: <ShieldCheck className="text-emerald-500" size={24} />,
      title: "Valores",
      text: "Integridade, segurança operacional e compromisso rigoroso com os prazos dos nossos parceiros."
    }
  ];

  return (
    /* bg-transparent permite ver o logo no fundo do App.tsx */
    <section id="sobre" className="py-24 bg-transparent overflow-hidden transition-colors duration-500 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Efeito de brilho translúcido no fundo do texto */}
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                {content.title}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-medium">
                {content.description}
              </p>
              
              <div className="space-y-4 mb-10">
                {['Manutenção de Redes RF', 'Instalações de Telecomunicações', 'Consultoria Técnica Especializada'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-bold">
                    <div className="p-1 rounded-full bg-blue-500/10 text-blue-500">
                      <CheckCircle2 size={20} />
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              <Link
                to="/about"
                className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
              >
                <FileText size={20} />
                História Completa
              </Link>
            </div>
          </motion.div>

          {/* Imagem da Equipa Corporativa com Transparência */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white/10">
              <img 
                // Nova imagem: Equipa corporativa de profissionais negros
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
                alt="Equipa Mil Vendas" 
                className="w-full h-full object-cover opacity-90 dark:opacity-75" 
              />
              {/* Overlay gradiente para fundir a imagem com o fundo transparente do site */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/40 dark:from-slate-950/60 via-transparent to-transparent" />
            </div>
            
            {/* Elemento flutuante de experiência (Glassmorphism) */}
            <div className="absolute -bottom-6 -right-6 p-6 rounded-3xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl hidden md:block">
               <p className="text-3xl font-black text-blue-600">1+</p>
               <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Anos de Mercado</p>
            </div>
          </motion.div>
        </div>

        {/* Cards de Pilares (Glassmorphism aplicado) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl bg-white/30 dark:bg-slate-800/30 backdrop-blur-md border border-white/20 dark:border-slate-700/30 hover:border-blue-500/50 transition-all group shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center mb-6 shadow-md group-hover:bg-blue-600 group-hover:text-white transition-all">
                {pillar.icon}
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white mb-3">
                {pillar.title}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-sm">
                {pillar.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;