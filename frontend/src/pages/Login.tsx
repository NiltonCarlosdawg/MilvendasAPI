import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://milvendasapi.onrender.com/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(email, password); // Guarda o token no Contexto e LocalStorage
        navigate('/admin/dashboard'); // Redireciona para o painel
      } else {
        setError(data.message || 'Credenciais inválidas. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor da Mil Vendas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6 font-mono">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-3xl border border-blue-500/20 shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white italic tracking-tighter">MV_ADMIN</h2>
          <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">Acesso restrito à equipa técnica</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs font-bold text-blue-400 uppercase mb-2 block">E-mail Corporativo</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                type="email" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 text-white outline-none focus:border-blue-500 transition-all"
                placeholder="admin@milvendas.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-blue-400 uppercase mb-2 block">Chave de Segurança</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                type="password"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 text-white outline-none focus:border-blue-500 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 flex items-center gap-3 text-red-500 text-sm italic">
              <ShieldAlert size={18} /> {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl uppercase tracking-widest transition-all flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'AUTENTICAR SISTEMA'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;