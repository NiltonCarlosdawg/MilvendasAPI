// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// URL base da sua API (ajuste conforme seu ambiente)
const API_URL = import.meta.env.VITE_API_URL || 'https:/milvendasapi.onrender.com/api/v1';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Verificar se existe um token ao carregar o app
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('@MilVendas:token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Valida o token buscando o perfil do usuário no backend
        const response = await fetch(`${API_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Se o token for inválido ou expirado, limpa tudo
          logout();
        }
      } catch (error) {
        console.error("Erro ao validar sessão:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 2. Função de Login integrada ao seu AuthController.js
  const login = async (email: string, password: string): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Lança o erro vindo da API (ex: "Senha incorreta")
      throw new Error(data.error || 'Falha na autenticação');
    }

    // Sucesso: Salva Token e dados
    localStorage.setItem('@MilVendas:token', data.token);
    setUser(data.user);
  };

  // 3. Função de Logout
  const logout = () => {
    localStorage.removeItem('@MilVendas:token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      loading, 
      login, 
      logout 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};