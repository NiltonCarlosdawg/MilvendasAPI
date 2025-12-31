import React from 'react';
import { motion } from 'framer-motion';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  linkedinUrl: string;
  image: string;
}

const TeamSection = () => {
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Mario Rosa",
      position: "CEO & Fundador",
      linkedinUrl: "https://linkedin.com/in/mariorosa",
      image: "/assets/chefes/mario-rosa.jpg" // Coloque as imagens na pasta public/assets/chefs/
    },
    {
      id: 2,
      name: "Vagner",
      position: "CTO & Co-Fundador",
      linkedinUrl: "https://linkedin.com/in/vagner",
      image: "/assets/chefes/vagner.jpg"
    },
    {
      id: 3,
      name: "Justino Benguela",
      position: "Head de Operações",
      linkedinUrl: "https://linkedin.com/in/justinobenguela",
      image: "/assets/chefes/justino-benguela.jpg"
    },
    {
      id: 4,
      name: "Rosemeuri",
      position: "Head de Marketing",
      linkedinUrl: "https://linkedin.com/in/rosemeuri",
      image: "/assets/chefes/rosemeuri.jpg"
    }
  ];

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
            Conheça Nossa Liderança
          </h2>
          <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
            Os visionários por trás da excelência da Mil Vendas
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full">
                {/* TOP: Imagem (60% do card) */}
                <div className="h-48 md:h-56 overflow-hidden relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      // Fallback para imagem quebrada
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=3b82f6&color=fff&size=400`;
                    }}
                  />
                  {/* Badge de destaque */}
                  <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Líder
                  </div>
                </div>

                {/* MIDDLE: Informações (25%) */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold mb-4">
                    {member.position}
                  </p>
                  
                  {/* Linha decorativa */}
                  <div className="w-12 h-1 bg-blue-600/30 dark:bg-blue-400/30 rounded-full mb-4"></div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-slate-600 dark:text-gray-400 flex items-center">
                      <span className="font-medium text-slate-900 dark:text-gray-300 mr-2">Experiência:</span>
                      10+ anos
                    </p>
                    <p className="text-sm text-slate-600 dark:text-gray-400 flex items-center">
                      <span className="font-medium text-slate-900 dark:text-gray-300 mr-2">Foco:</span>
                      {member.id === 1 && "Estratégia & Negócios"}
                      {member.id === 2 && "Tecnologia & Inovação"}
                      {member.id === 3 && "Operações & Eficiência"}
                      {member.id === 4 && "Marketing & Crescimento"}
                    </p>
                  </div>
                </div>

                {/* BOTTOM: LinkedIn (15%) */}
                <div className="px-6 pb-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium group/link"
                  >
                    <div className="w-8 h-8 bg-blue-600/10 dark:bg-blue-400/10 rounded-full flex items-center justify-center group-hover/link:bg-blue-600/20 transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <span className="text-sm">Visite o meu LinkedIn</span>
                    <span className="opacity-0 group-hover/link:opacity-100 transition-opacity duration-300">→</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;