// src/authProvider.ts
import type { AuthProvider } from 'react-admin';
import { BASE_URL, PATHS } from './api/endpoints';

interface LoginResponse {
  token: string;
  user: { id: string; name: string; email: string };
}

const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const response = await fetch(`${BASE_URL}${PATHS.auth}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password }),
    });
    const json = await response.json().catch(() => ({})) as LoginResponse;
    if (!response.ok) throw new Error(json?.message || json?.error || 'Credenciais inválidas');

    // DEBUG — remove depois de confirmar a estrutura da resposta
    console.log('[authProvider] login response:', json);

    const token = json?.token ?? json?.accessToken ?? json?.data?.token ?? json?.data?.accessToken;
    const user  = json?.user  ?? json?.data?.user;

    if (!token) throw new Error('Token não encontrado na resposta da API');

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },

  checkAuth: () =>
    localStorage.getItem('token') ? Promise.resolve() : Promise.reject(),

  checkError: (error: any) => {
    if (error?.status === 401 || error?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getIdentity: () => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return Promise.reject();
      const user = JSON.parse(raw) as { id: string; name: string };
      return Promise.resolve({ id: user.id, fullName: user.name, avatar: undefined });
    } catch {
      return Promise.reject();
    }
  },

  getPermissions: () => Promise.resolve(null),
};

export default authProvider;