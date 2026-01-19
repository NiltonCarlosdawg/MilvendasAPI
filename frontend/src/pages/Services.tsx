// Services.tsx corrigido
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Smartphone, Globe, BarChart3, X, CheckCircle, ArrowRight, Clock, Users, Shield } from 'lucide-react';
import { useSettings } from '../hooks/useSettings'; 

const Services = () => {
  const { settings, loading } = useSettings();
  const [selectedService, setSelectedService] = useState<number | null>(null);

  // Dados de Fallback para os textos globais da secção
  const defaultContent = {
    badge: "O que fazemos",
    title: "Soluções Completas"
  };

  // URLs de imagens do Unsplash para cada serviço
  const serviceImages = [
    {
      url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      alt: 'Desenvolvimento Web'
    },
    {
      url: 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      alt: 'Telecomunicações'
    },
    {
      url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      alt: 'Mobile Solutions'
    },
    {
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      alt: 'Consultoria Tech'
    }
  ];

  // Dados completos dos serviços
  const defaultServices = [
    { 
      title: settings['service_1_title'] || 'Web Development', 
      shortDesc: settings['service_1_desc'] || 'Aplicações robustas com React, Node e as tecnologias mais recentes.', 
      icon: <Code2 className="w-8 h-8 text-blue-500" />,
      image: serviceImages[0],
      detailedInfo: {
        description: 'Desenvolvemos aplicações web modernas, escaláveis e de alto desempenho utilizando as tecnologias mais avançadas do mercado.',
        features: [
          'Desenvolvimento com React, Next.js e TypeScript',
          'APIs RESTful e GraphQL com Node.js',
          'Arquitetura de microserviços',
          'Integração contínua e entrega (CI/CD)',
          'Otimização de performance e SEO',
          'Testes automatizados e qualidade de código'
        ],
        benefits: [
          'Aplicações 100% responsivas',
          'Segurança de dados garantida',
          'Manutenção e suporte 24/7',
          'Escalabilidade automática',
          'Tempo de carregamento otimizado'
        ],
        timeline: '4-12 semanas',
        projects: '2+ projetos entregues'
      }
    },
    { 
      title: settings['service_2_title'] || 'Telecomunicações', 
      shortDesc: settings['service_2_desc'] || 'Consultoria especializada para otimizar a conectividade da sua empresa.', 
      icon: <Globe className="w-8 h-8 text-blue-500" />,
      image: serviceImages[1],
      detailedInfo: {
        description: 'Soluções completas em telecomunicações para empresas que precisam de conectividade confiável e de alta velocidade.',
        features: [
          'Planejamento e implementação de redes',
          'Sistemas VoIP e telefonia IP',
          'Redes privadas virtuais (VPN)',
          'Infraestrutura de data centers',
          'Sistemas de videoconferência',
          'Monitoramento e manutenção proativa'
        ],
        benefits: [
          'Redução de custos operacionais',
          'Conectividade global garantida',
          'Suporte técnico especializado',
          'Segurança de rede avançada',
          'Escalabilidade conforme necessidade'
        ],
        timeline: '2-8 semanas',
        projects: ''//30+ redes implementadas
      }
    },
    { 
      title: settings['service_3_title'] || 'Mobile Solutions', 
      shortDesc: settings['service_3_desc'] || 'Apps nativas e híbridas focadas na experiência do utilizador.', 
      icon: <Smartphone className="w-8 h-8 text-blue-500" />,
      image: serviceImages[2],
      detailedInfo: {
        description: 'Desenvolvimento de aplicativos móveis que oferecem experiências excepcionais em iOS e Android.',
        features: [
          'Apps nativas (Swift, Kotlin)',
          'Aplicações híbridas (React Native, Flutter)',
          'Integração com APIs e sistemas legados',
          'Design UX/UI mobile-first',
          'Publicação nas app stores',
          'Analytics e monitoramento de uso'
        ],
        benefits: [
          'Experiência do usuário otimizada',
          'Desempenho nativo em todos os dispositivos',
          'Atualizações e manutenção contínua',
          'Integração com wearables e IoT',
          'Monetização através de apps'
        ],
        timeline: '6-16 semanas',
        projects: '2+ apps publicados'
      }
    },
    { 
      title: settings['service_4_title'] || 'Consultoria Tech', 
      shortDesc: settings['service_4_desc'] || 'Estratégia digital para escalar o seu modelo de negócio.', 
      icon: <BarChart3 className="w-8 h-8 text-blue-500" />,
      image: serviceImages[3],
      detailedInfo: {
        description: 'Consultoria especializada para transformação digital, otimização de processos e escalabilidade tecnológica.',
        features: [
          'Auditoria tecnológica completa',
          'Planejamento estratégico digital',
          'Otimização de processos de TI',
          'Migração para a nuvem',
          'Gestão de projetos ágil',
          'Treinamento e capacitação de equipes'
        ],
        benefits: [
          'Redução de custos em até 40%',
          'Aumento da produtividade',
          'Tomada de decisões baseada em dados',
          'Competitividade no mercado digital',
          'Futuro-proofing tecnológico'
        ],
        timeline: 'Personalizado por projeto',
        projects: ''//25+ empresas consultadas
      }
    }
  ];

  const content = {
    badge: settings['services_badge'] || defaultContent.badge,
    title: settings['services_title'] || defaultContent.title
  };

  if (loading && Object.keys(settings).length === 0) {
    return <div className="py-24 bg-slate-50 dark:bg-slate-900 min-h-[400px]" />; 
  }

  return (
    <>
      <section id="servicos" className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm">
              {content.badge}
            </h2>
            <p className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">
              {content.title}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {defaultServices.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all group cursor-pointer overflow-hidden relative shadow-sm hover:shadow-xl"
                onClick={() => setSelectedService(i)}
              >
                {/* Imagem de fundo com overlay - ajustada para light mode */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={s.image.url}
                    alt={s.image.alt}
                    className="w-full h-full object-cover opacity-20 dark:opacity-20 group-hover:opacity-30 dark:group-hover:opacity-30 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/50 to-transparent dark:from-slate-900 dark:via-slate-900/70 dark:to-transparent"></div>
                </div>
                
                {/* Conteúdo */}
                <div className="relative z-10 p-8">
                  <div className="flex flex-col items-center text-center">
                    {/* Ícone com fundo */}
                    <div className="mb-6 p-4 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      {s.icon}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {s.title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                      {s.shortDesc}
                    </p>
                    
                    {/* Botão Saiba Mais */}
                    <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700/50 w-full">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedService(i);
                        }}
                        className="flex items-center justify-center gap-2 w-full text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors group/btn"
                      >
                        <span className="text-xs font-semibold uppercase tracking-widest">
                          Saiba Mais
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Efeito de brilho ao hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </motion.div>
            ))}
          </div>

          {/* Texto adicional */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-20 text-center"
          >
            <div className="inline-block px-8 py-4 bg-blue-100 dark:bg-blue-600/20 backdrop-blur-sm rounded-2xl border border-blue-200 dark:border-blue-500/30">
              <p className="text-slate-700 dark:text-gray-300 text-lg font-medium">
                Cada solução é personalizada para atender às <span className="text-blue-600 dark:text-blue-400 font-semibold">necessidades específicas</span> do seu negócio
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MODAL DE DETALHES DO SERVIÇO - AGORA COMPATÍVEL COM LIGHT/DARK MODE */}
      <AnimatePresence>
        {selectedService !== null && (
          <>
            {/* Overlay escuro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-6"
            >
              <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl">
                {/* Cabeçalho do modal */}
                <div className="relative h-48 md:h-64 overflow-hidden">
                  <img 
                    src={defaultServices[selectedService].image.url}
                    alt={defaultServices[selectedService].image.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-white/70 dark:via-slate-900/70 to-transparent"></div>
                  
                  {/* Botão fechar */}
                  <button
                    onClick={() => setSelectedService(null)}
                    className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  {/* Título no header */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700">
                        {defaultServices[selectedService].icon}
                      </div>
                      <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                          {defaultServices[selectedService].title}
                        </h2>
                        <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold uppercase tracking-widest mt-1">
                          Serviço Especializado
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conteúdo do modal */}
                <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-16rem)]">
                  {/* Descrição */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="p-1.5 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </span>
                      Sobre este Serviço
                    </h3>
                    <p className="text-slate-600 dark:text-gray-300 leading-relaxed">
                      {defaultServices[selectedService].detailedInfo.description}
                    </p>
                  </div>

                  {/* Grid de informações */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Funcionalidades */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="p-1.5 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </span>
                        Funcionalidades Principais
                      </h3>
                      <ul className="space-y-3">
                        {defaultServices[selectedService].detailedInfo.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 mt-2 flex-shrink-0"></div>
                            <span className="text-slate-600 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefícios */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="p-1.5 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </span>
                        Benefícios
                      </h3>
                      <ul className="space-y-3">
                        {defaultServices[selectedService].detailedInfo.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                            <span className="text-slate-600 dark:text-gray-300">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Informações adicionais */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                          <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">Timeline Média</h4>
                      </div>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {defaultServices[selectedService].detailedInfo.timeline}
                      </p>
                      <p className="text-slate-500 dark:text-gray-400 text-sm mt-2">Tempo estimado de implementação</p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                          <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">Experiência</h4>
                      </div>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {defaultServices[selectedService].detailedInfo.projects}
                      </p>
                      <p className="text-slate-500 dark:text-gray-400 text-sm mt-2">Projetos entregues com sucesso</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">Pronto para transformar seu negócio?</h4>
                        <p className="text-slate-500 dark:text-gray-400">Vamos conversar sobre seu projeto</p>
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setSelectedService(null)}
                          className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl transition-colors"
                        >
                          Fechar
                        </button>
                        <a
                          href="https://wa.me/244922965959"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
                        >
                          Solicitar Orçamento
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Services;