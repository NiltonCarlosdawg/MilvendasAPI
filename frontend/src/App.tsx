import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Contextos
import { AppearanceProvider } from './context/AppearanceProvider';
import { AuthProvider, useAuth } from './context/AuthContext';

// Componentes Globais
import Splash from './components/Splash';
//import Customizer from './components/Customizer';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsappButton from './components/WhatsappButton';
import PartnersCarousel from './components/PartnersCarousel'; // ← ADICIONADO AQUI


// Páginas Públicas
import Hero from './pages/Hero';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Events from './pages/Events';
import Portfolio from './pages/Portfolio';
import AboutComplete from './pages/AboutComplete';

// Admin components
import Login from './auth/Login';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import EventosPreview from './admin/EventosPreview';
import PortifolioPreview from './admin/PortifolioPreview';
import ContactosPreview from './admin/ContactosPreview';
import NewsletterManager from './admin/NewsletterManager';

import logoMv from './assets/logo-mv.svg';

// ========================================================
// COMPONENTE DE ROTA PROTEGIDA (RESOLVIDO)
// ========================================================
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Enquanto verifica o token no backend, mostra um loading limpo
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Se não houver utilizador autenticado, manda para o login
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// ========================================================
// PÁGINA PRINCIPAL (ONE-PAGE LOGIC)
// ========================================================
// Atualize o componente MainPage no App.tsx:
const MainPage: React.FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <>
      <Navbar />
      <main>
        <section id="home"><Hero /></section>
        <section id="servicos"><Services /></section>
        <section id="sobre"><About /></section>
        <section id="contacto"><Contact /></section>
      </main>
      {/* CARROSSEL DE PARCEIROS ADICIONADO AQUI */}
      <PartnersCarousel />
      <Footer />
      <WhatsappButton />
    </>
  );
};

// ========================================================
// CONTEÚDO DO APP COM LOGICA DE ROTAS
// ========================================================
function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4500); // Tempo do Splash reduzido para melhor fluidez

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-500">
      <AnimatePresence mode="wait">
        {showSplash && <Splash key="splash" />}
      </AnimatePresence>

      {!showSplash && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="bg-white dark:bg-slate-900 min-h-screen relative"
        >
          {/* MARCA D'ÁGUA GLOBAL */}
          <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
            <motion.img 
              src={logoMv} 
              alt="" 
              animate={{ opacity: 0.04, scale: 1.05 }} 
              className="w-[85%] md:w-[50%] filter brightness-0 dark:invert transition-all duration-700" 
            />
          </div>

          <div className="relative z-10 text-slate-900 dark:text-white transition-colors duration-500">
            <Routes>
              {/* Rota Raiz */}
              <Route path="/" element={<MainPage />} />
              
              {/* Páginas Externas (Landing) */}
              <Route path="/events" element={<><Navbar /><Events /><Footer /><WhatsappButton /></>} />
              <Route path="/portfolio" element={<><Navbar /><Portfolio /><Footer /><WhatsappButton /></>} />

              <Route path="/sobre-completo" element={<><Navbar /><AboutComplete /><Footer /><WhatsappButton /></>} />
              
              {/* Autenticação (Redireciona se já estiver logado) */}
              <Route path="/auth/login" element={
                user ? <Navigate to="/auth/admin/dashboard" replace /> : <Login />
              } />
              
              {/* Painel Administrativo Protegido */}
              <Route path="/auth/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                {/* Redirecionamento automático da base /admin para dashboard */}
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="eventos" element={<EventosPreview />} />
                <Route path="portifolio" element={<PortifolioPreview />} />
                <Route path="contactos" element={<ContactosPreview />} />
                <Route path="newsletter" element={<NewsletterManager />} />

              </Route>
              
              {/* 404 - Volta para Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ========================================================
// EXPORTAÇÃO PRINCIPAL COM PROVIDERS
// ========================================================
export default function App() {
  return (
    <AppearanceProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppearanceProvider>
  );
}