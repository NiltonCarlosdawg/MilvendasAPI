import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Contextos
import { AppearanceProvider } from './context/AppearanceProvider';
import { AuthProvider, useAuth } from './context/AuthContext';

// Componentes Globais
import Navbar from './components/Navbar';
import Splash from './components/Splash';

// Páginas e Secções
import Hero from './pages/Hero';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Portfolio from './pages/Portfolio';
import Events from './pages/Events';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';

// --- COMPONENTE HOME (A Grande Montra Unificada) ---
// Adicionamos IDs em cada section para a Navbar funcionar com scroll suave
const Home = () => (
  <main className="bg-white dark:bg-slate-950">
    <section id="home">
      <Hero />
    </section>

    <section id="portfolio" className="scroll-mt-20">
      <Portfolio />
    </section>

    <section id="events" className="scroll-mt-20">
      <Events />
    </section>

    <section id="servicos" className="scroll-mt-20">
      <Services />
    </section>

    <section id="sobre" className="scroll-mt-20">
      <About />
    </section>

    <section id="contacto" className="scroll-mt-20">
      <Contact />
    </section>
  </main>
);

// --- COMPONENTE DE PROTEÇÃO DE ROTA ---
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth(); 
  // Se não estiver logado, redireciona para o login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />; 
};

// --- LAYOUT PARA PÁGINAS PÚBLICAS (Com Navbar) ---
const PublicLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="min-h-screen transition-colors duration-500">
      <AnimatePresence mode="wait">
        {showSplash && (
          <Splash key="splash" onFinish={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {!showSplash && (
        <Routes>
          {/* GRUPO 1: Páginas que mostram a Navbar */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            
            {/* Rotas individuais caso o utilizador queira aceder diretamente */}
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/eventos" element={<Events />} />
          </Route>

          {/* GRUPO 2: Páginas sem a Navbar principal */}
          <Route path="/login" element={<Login />} />
          
          {/* Rota Protegida do Admin */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Redirecionamento de segurança para qualquer rota inexistente */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppearanceProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </AppearanceProvider>
  );
}