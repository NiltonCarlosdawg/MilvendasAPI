import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Wifi, 
  Settings, 
  Cpu, 
  CheckCircle, 
  Globe, 
  Users, 
  FileText,
  Home,
  ArrowLeft,
  Shield,
  Award,
  Clock,
  MapPin,
  Monitor,
  Database,
  Workflow,
  Building
} from 'lucide-react';
import { Link } from 'react-router-dom';
import logoMv from '../assets/logo-mv.svg';

const AboutComplete = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-500">
      {/* Botão Voltar */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Voltar para o site</span>
            </Link>
            
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
              </svg>
              Topo
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600/10 dark:bg-blue-600/20 blur-[100px] rounded-full"></div>
              <img 
                src={logoMv} 
                alt="Logo Mil Vendas" 
                className="relative z-10 w-32 h-32 object-contain filter brightness-0 dark:invert"
              />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Mil Vendas Consultoria
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Serviços profissionais em Telecomunicações, Redes RF e Infraestruturas Técnicas
          </p>
        </motion.div>

        {/* Índice com links internos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 mb-12 border border-slate-200 dark:border-slate-700"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <FileText className="text-blue-600" />
            Índice da Apresentação
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { num: '1', title: 'Quem Somos', icon: Users, id: 'quem-somos' },
              { num: '2', title: 'O Que Fazemos', icon: Settings, id: 'o-que-fazemos' },
              { num: '3', title: 'Diferenciais Competitivos', icon: Target, id: 'diferenciais' },
              { num: '4', title: 'Planeamento & Otimização RF', icon: Wifi, id: 'planeamento' },
              { num: '5', title: 'Instalação & Montagem', icon: Cpu, id: 'instalacao' },
              { num: '6', title: 'Operação & Manutenção RF', icon: Settings, id: 'operacao-manutencao' },
              { num: '7', title: 'Serviços de Redes IT', icon: Globe, id: 'redes-it-software' },
              { num: '8', title: 'Metodologia de Trabalho', icon: Workflow, id: 'metodologia-trabalho' },
              { num: '9', title: 'Áreas de Atuação', icon: Building, id: 'areas-atuacao' },
              { num: '10', title: 'Por Que Escolher a Mil Vendas', icon: Award, id: 'por-que-escolher' },
              { num: '11', title: 'Contactos', icon: Users, id: 'contactos-final' }
            ].map((item) => (
              <button
                key={item.num}
                onClick={() => scrollToSection(item.id)}
                className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-md transition-all group text-left w-full"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold">
                  {item.num}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {item.title}
                  </h3>
                </div>
                <item.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Seção 1: Quem Somos */}
        <section id="quem-somos" className="mb-16 scroll-mt-24">
          <div className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-800 rounded-2xl p-8 border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">1. Quem Somos</h2>
            </div>
            
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p className="text-lg">
                A <strong>Mil Vendas Consultoria</strong> é uma empresa angolana especializada em serviços técnicos de telecomunicações, com foco em planeamento, instalação, optimização e manutenção de redes e infraestruturas críticas.
              </p>
              <p>
                Atuamos como <strong>parceiro técnico</strong> de operadoras e integradores, garantindo execução segura, padronizada e alinhada com normas internacionais.
              </p>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Missão</h4>
                <p>Fornecer soluções técnicas de excelência em telecomunicações, contribuindo para o desenvolvimento tecnológico de Angola.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção 2: O Que Fazemos */}
        <section id="o-que-fazemos" className="mb-16 scroll-mt-24">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">2. O Que Fazemos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Wifi, title: 'Planejamento e Otimização de Redes RF', desc: 'WiMAX, LTE, Wi-Fi, análises de cobertura, site survey' },
              { icon: Cpu, title: 'Instalação e Montagem', desc: 'Infraestruturas de telecom, antenas, cabinets, racks, energia' },
              { icon: Settings, title: 'Operação & Manutenção (O&M)', desc: 'Monitorização, drive tests, ajustes técnicos, limpeza preventiva' },
              { icon: Globe, title: 'Redes Informáticas e IT', desc: 'VoIP, VPN, LAN/WAN estruturado, desenvolvimento de software' },
              { icon: FileText, title: 'Inspeções Técnicas', desc: 'Auditorias, reengenharia, relatórios detalhados com evidências' },
              { icon: Target, title: 'Consultoria Especializada', desc: 'Soluções customizadas para cada cliente e projeto' }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all group hover:shadow-lg"
              >
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Seção 3: Diferenciais Competitivos */}
        <section id="diferenciais" className="mb-16 scroll-mt-24">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">3. Diferenciais Competitivos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Equipa técnica especializada e certificada',
              'Conformidade com normas internacionais',
              'Execução documentada com relatórios e fotos',
              'Atuação nacional em todo território angolano',
              'Serviços integrados de ponta a ponta',
              'Foco na fiabilidade e desempenho operacional'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <span className="text-slate-700 dark:text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Seção 4: Planeamento & Otimização RF */}
        <section id="planeamento" className="mb-16 scroll-mt-24">
          <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Wifi className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">4. Planeamento & Otimização RF</h2>
            </div>
            
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Planeamento de redes (WIMAX, LTE, Wi-Fi)',
                'Site Survey e análises de cobertura',
                'Planeamento e Otimização de Redes Rádio',
                'Planeamento de transmissão',
                'Reengenharia de parâmetros e KPIs',
                'Relatórios técnicos de desempenho'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Seção 5: Instalação & Montagem */}
        <section id="instalacao" className="mb-16 scroll-mt-24">
          <div className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-800 rounded-2xl p-8 border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Cpu className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">5. Instalação & Montagem</h2>
            </div>
            
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Instalação de antenas e equipamentos RF',
                'Montagem de cabinets, racks e energia',
                'Organização e esteiramento de cabos',
                'Instalação de suportes estruturais',
                'Configuração e ativação de equipamentos'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Seção 6: Operação & Manutenção RF (O&M) - NOVA SEÇÃO */}
        <section id="operacao-manutencao" className="mb-16 scroll-mt-24">
          <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">6. Operação & Manutenção RF (O&M)</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Monitorização & Inspeções</h3>
                <ul className="space-y-3">
                  {[
                    'Inspeções e monitorização regular',
                    'Drive Tests para análise de desempenho',
                    'Verificação de Line of Sight (LOS)'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 flex-shrink-0 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-1">
                        <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Ajustes Técnicos & Manutenção</h3>
                <ul className="space-y-3">
                  {[
                    'Ajustes técnicos (tilt, azimute, altura)',
                    'Limpeza e manutenção preventiva',
                    'Calibração de equipamentos RF'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 flex-shrink-0 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-1">
                        <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documentação Completa
              </h4>
              <p className="text-slate-700 dark:text-slate-300">
                Todos os serviços incluem relatórios completos com evidências fotográficas, garantindo transparência e rastreabilidade.
              </p>
            </div>
          </div>
        </section>

        {/* Seção 7: Serviços de Redes IT e Software - NOVA SEÇÃO */}
        <section id="redes-it-software" className="mb-16 scroll-mt-24">
          <div className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-800 rounded-2xl p-8 border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">7. Serviços de Redes IT e Software</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-blue-600" />
                  Redes e Infraestrutura
                </h3>
                <ul className="space-y-3">
                  {[
                    'Redes locais e remotas (LAN/WAN)',
                    'Estruturação de redes cabladas',
                    'VoIP e soluções de telefonia IP',
                    'VPN para acesso remoto seguro',
                    'Certificação e organização de racks'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-1">
                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                      </div>
                      <span className="text-slate-700 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  Desenvolvimento de Software
                </h3>
                <ul className="space-y-3">
                  {[
                    'Sistemas de gestão para telecomunicações',
                    'Aplicações web e móveis',
                    'Integração de sistemas',
                    'Bancos de dados e armazenamento',
                    'Soluções customizadas por encomenda'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-1">
                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                      </div>
                      <span className="text-slate-700 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Seção 8: Metodologia de Trabalho - NOVA SEÇÃO */}
        <section id="metodologia-trabalho" className="mb-16 scroll-mt-24">
          <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Workflow className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">8. Metodologia de Trabalho</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '1',
                  title: 'Planeamento',
                  description: 'Análise detalhada dos requisitos e definição da estratégia',
                  color: 'from-blue-500 to-blue-600'
                },
                {
                  step: '2',
                  title: 'Execução Técnica',
                  description: 'Implementação conforme padrões internacionais',
                  color: 'from-green-500 to-green-600'
                },
                {
                  step: '3',
                  title: 'Documentação',
                  description: 'Registro completo com relatórios e evidências',
                  color: 'from-purple-500 to-purple-600'
                },
                {
                  step: '4',
                  title: 'Validação Final',
                  description: 'Testes rigorosos e garantia de qualidade',
                  color: 'from-orange-500 to-orange-600'
                }
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className={`bg-gradient-to-r ${item.color} text-white rounded-xl p-6 h-full`}>
                    <div className="text-3xl font-bold mb-3 opacity-90">{item.step}</div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-white/90">{item.description}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <div className="w-8 h-1 bg-slate-300 dark:bg-slate-600"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Suporte Pós-Instalação</h4>
              <p className="text-slate-700 dark:text-slate-300">
                Oferecemos suporte contínuo após a implementação, garantindo que todas as soluções continuem a operar com máxima eficiência.
              </p>
            </div>
          </div>
        </section>

        {/* Seção 9: Áreas de Atuação - NOVA SEÇÃO */}
        <section id="areas-atuacao" className="mb-16 scroll-mt-24">
          <div className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-800 rounded-2xl p-8 border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Building className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">9. Áreas de Atuação</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  sector: 'Operadoras de Telecomunicações',
                  description: 'Parceria técnica com as principais operadoras do mercado angolano',
                  clients: ['Unitel', 'Movicel', 'Africell', 'Angola Telecom']
                },
                {
                  sector: 'Empresas de Infraestruturas',
                  description: 'Fornecimento de soluções técnicas para construção e manutenção de infraestruturas',
                  clients: ['Construtoras', 'Empresas de energia', 'Provedores de internet']
                },
                {
                  sector: 'Integradores Técnicos',
                  description: 'Suporte especializado para empresas de integração de sistemas',
                  clients: ['Distribuidores', 'Instaladores', 'Consultorias técnicas']
                },
                {
                  sector: 'Empresas com Conectividade',
                  description: 'Soluções de conectividade interna para grandes organizações',
                  clients: ['Bancos', 'Hospitais', 'Universidades', 'Empresas industriais']
                }
              ].map((area, index) => (
                <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    {area.sector}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {area.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {area.clients.map((client, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full">
                        {client}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seção 10: Por Que Escolher a Mil Vendas */}
        <section id="por-que-escolher" className="mb-16 scroll-mt-24">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-10 text-white">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-white/20 rounded-xl">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold">10. Por Que Escolher a Mil Vendas?</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Shield className="w-6 h-6" />,
                  title: 'Confiabilidade Garantida',
                  description: 'Execução segura e padronizada seguindo normas internacionais'
                },
                {
                  icon: <Award className="w-6 h-6" />,
                  title: 'Expertise Técnica',
                  description: 'Equipa especializada com anos de experiência em telecomunicações'
                },
                {
                  icon: <FileText className="w-6 h-6" />,
                  title: 'Documentação Completa',
                  description: 'Relatórios detalhados com fotos e evidências de execução'
                },
                {
                  icon: <MapPin className="w-6 h-6" />,
                  title: 'Atuação Nacional',
                  description: 'Cobertura em todo território angolano com suporte local'
                },
                {
                  icon: <Settings className="w-6 h-6" />,
                  title: 'Soluções Integradas',
                  description: 'Serviços de ponta a ponta, desde planeamento até manutenção'
                },
                {
                  icon: <Clock className="w-6 h-6" />,
                  title: 'Tempo de Resposta',
                  description: 'Suporte rápido e eficiente para manutenção e correções'
                }
              ].map((item, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 rounded-lg">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                  </div>
                  <p className="text-blue-100">{item.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-10 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <h3 className="text-2xl font-bold mb-4 text-center">Compromisso com a Excelência</h3>
              <p className="text-lg text-blue-100 text-center max-w-3xl mx-auto">
                Na Mil Vendas, não entregamos apenas serviços - entregamos <strong>soluções que fazem a diferença</strong>. 
                Cada projeto é tratado com o máximo de profissionalismo, atenção aos detalhes e compromisso com os resultados.
              </p>
            </div>
          </div>
        </section>

        {/* Contacto Final */}
        <section id="contactos-final" className="mt-20 mb-10 scroll-mt-24">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-900 dark:to-slate-950 rounded-2xl p-10 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">11. Contactos</h2>
            <p className="text-xl mb-8 text-slate-300">
              Entre em contacto para uma consultoria personalizada
            </p>
            
            <div className="space-y-6 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm text-slate-400">Telefone</p>
                  <p className="text-xl font-bold">+244 922 965 959</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="text-xl font-bold">geral@milvendas.ao</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm text-slate-400">Endereço</p>
                  <p className="text-xl font-bold">Rua 120 – Urbanização Nova Vida</p>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl transition-all hover:scale-105"
              >
                <ArrowLeft size={20} />
                Voltar para o Site Principal
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutComplete;