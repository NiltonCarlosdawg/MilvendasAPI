import { useState, useEffect } from 'react'; // JSX removido daqui para evitar o erro TS1484
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Contextos
import { AppearanceProvider } from './context/AppearanceProvider';
import { AuthProvider, useAuth } from './context/AuthContext';

// Componentes Globais
import Splash from './components/Splash';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsappButton from './components/WhatsappButton';

// Páginas Públicas
import Hero from './pages/Hero';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Events from './pages/Events';
import Portfolio from './pages/Portfolio';
import AboutComplete from './pages/AboutComplete';
import News from './pages/News';

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
// COMPONENTE DE MARCA D'ÁGUA DINÂMICA
// ========================================================
const WatermarkBackground = () => (
  <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
    <motion.img 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5 }}
      src={logoMv} 
      alt="" 
      className="w-[85vw] md:w-[50vw] opacity-[0.08] dark:opacity-[0.15] transition-all duration-500 brightness-0 dark:brightness-100"
      style={{ mixBlendMode: 'multiply' }} 
    />
    <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-slate-950 dark:via-transparent dark:to-slate-950 opacity-40" />
  </div>
);

// Alterado para React.ReactNode ou removido o import de JSX para compatibilidade
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <>{children}</> : <Navigate to="/auth/login" replace />;
};

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  const isAdminRoute = location.pathname.startsWith('/auth/admin');

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 relative">
      <AnimatePresence mode="wait">
        {showSplash && <Splash key="splash" />}
      </AnimatePresence>

      {!showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <WatermarkBackground />

          {!isAdminRoute && <Navbar />}
          
          <div className="relative z-10">
            <Routes location={location} key={location.pathname}>
              {/* LANDING PAGE */}
              <Route path="/" element={
                <div className="space-y-0">
                  <Hero />
                  <div className="bg-white/40 dark:bg-slate-950/40 backdrop-blur-[2px]">
                    <About />
                    <Services />
                    <Contact />
                  </div>
                  <Footer />
                  <WhatsappButton />
                </div>
              } />

              {/* PÁGINAS INDEPENDENTES */}
              <Route path="/about" element={<><AboutComplete /><Footer /></>} />
              <Route path="/news" element={<><News /><Footer /></>} />
              <Route path="/events" element={<><Events /><Footer /></>} />
              <Route path="/portfolio" element={<><Portfolio /><Footer /></>} />

              {/* Autenticação */}
              <Route path="/auth/login" element={
                user ? <Navigate to="/auth/admin/dashboard" replace /> : <Login />
              } />
              
              {/* Painel Administrativo */}
              <Route path="/auth/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="eventos" element={<EventosPreview />} />
                <Route path="portifolio" element={<PortifolioPreview />} />
                <Route path="contactos" element={<ContactosPreview />} />
                <Route path="newsletter" element={<NewsletterManager />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppearanceProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppearanceProvider>
  );
}