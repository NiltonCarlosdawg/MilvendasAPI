import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, Tag, Layers } from 'lucide-react';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const BASE_URL = 'http://teu-dominio-api.com/api/v1'; // Substitui pelo teu URL real

  useEffect(() => {
    fetch(`${BASE_URL}/projects`)
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Erro API Projects:", err));
  }, []);

  return (
    <section id="portfolio" className="py-24 bg-white dark:bg-[#030712] relative">
      <div className="container mx-auto px-6">
        <header className="mb-16">
          <h2 className="text-6xl md:text-8xl font-black dark:text-white tracking-tighter uppercase">
            Nosso <span className="text-blue-600">Impacto_</span>
          </h2>
        </header>

        {/* Grid de Projetos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project: any) => (
            <motion.div
              key={project.id}
              layoutId={`card-${project.id}`}
              onClick={() => setSelectedProject(project)}
              className="group relative h-[450px] rounded-[3rem] overflow-hidden cursor-pointer bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5"
            >
              <img 
                src={project.imagem_url} 
                alt={project.nome} 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              <div className="absolute bottom-0 p-10 w-full">
                <span className="px-4 py-1 rounded-full bg-blue-600 text-[10px] font-bold text-white uppercase tracking-widest mb-4 inline-block">
                  {project.categoria || 'Desenvolvimento'}
                </span>
                <h3 className="text-4xl font-black text-white leading-tight">{project.nome}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* MODAL BONITO */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
              {/* Overlay Escuro */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              />

              {/* Conteúdo do Modal */}
              <motion.div 
                layoutId={`card-${selectedProject.id}`}
                className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/10"
              >
                {/* Lado Esquerdo: Imagem */}
                <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                  <img 
                    src={selectedProject.imagem_url} 
                    className="w-full h-full object-cover" 
                    alt={selectedProject.nome} 
                  />
                </div>

                {/* Lado Direito: Info */}
                <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto bg-white dark:bg-slate-900">
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-6 right-6 p-3 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <X size={20} />
                  </button>

                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
                      <Layers size={14} />
                      {selectedProject.categoria || 'Inovação Digital'}
                    </div>

                    <h3 className="text-4xl md:text-5xl font-black dark:text-white leading-[0.9]">
                      {selectedProject.nome}
                    </h3>

                    <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                      {selectedProject.descricao || "Um projeto focado em excelência tecnológica desenvolvido pelo Milvendas Group para o mercado Angolano."}
                    </p>

                    <div className="grid grid-cols-2 gap-6 py-6 border-y border-slate-100 dark:border-white/5">
                      <div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                          <Calendar size={14} /> Data
                        </div>
                        <span className="font-bold dark:text-white">2024</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                          <Tag size={14} /> Tags
                        </div>
                        <span className="font-bold dark:text-white">UI/UX, API, Angola</span>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                      <button className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-all">
                        Ver Projeto Live <ExternalLink size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Portfolio;