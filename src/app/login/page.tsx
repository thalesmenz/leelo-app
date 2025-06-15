'use client';

import { useState } from 'react';
import { EnvelopeSimple, Lock, Eye, EyeSlash, Scales } from 'phosphor-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.signin({ email, password });
      
      // Store the token in localStorage if remember is checked
      if (remember) {
        localStorage.setItem('token', response.token);
      } else {
        sessionStorage.setItem('token', response.token);
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#f5faff] to-[#eaf1fb]">
      <div className="flex-1 flex flex-col justify-center items-center">
        {/* Topo: Logo, nome, mensagem */}
        <div className="flex flex-col items-center mb-8">
          <span className="bg-blue-600 rounded-full p-3 mb-2 shadow-md">
            <Scales size={32} color="#fff" weight="fill" />
          </span>
          <h1 className="text-2xl font-bold text-blue-700">Leelo</h1>
          <p className="text-gray-700 mt-1 font-medium">Bem-vindo de volta</p>
          <span className="text-sm text-gray-400">Acesse sua conta e continue trabalhando</span>
        </div>
        {/* Card de login */}
        <main className="w-full max-w-md p-8 bg-white rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] border border-[#f0f4fa] flex flex-col items-center">
          <form className="w-full" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative flex items-center mb-4">
              <EnvelopeSimple className="absolute left-3 text-gray-400" size={20} />
              <input
                type="email"
                className="pl-10 pr-3 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-gray-700 placeholder-gray-400"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative flex items-center mb-2">
              <Lock className="absolute left-3 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="pl-10 pr-10 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-gray-700 placeholder-gray-400"
                placeholder="Sua senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 text-gray-400 hover:text-blue-600"
                tabIndex={-1}
                onClick={() => setShowPassword(s => !s)}
              >
                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="flex items-center justify-between mb-5 mt-2">
              <label className="flex items-center text-sm text-gray-600 select-none">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-gray-300 focus:ring-blue-500"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                Lembrar de mim
              </label>
              <Link href="#" className="text-sm text-blue-600 hover:underline font-medium">Esqueci minha senha</Link>
            </div>
            {error && <div className="text-red-500 text-sm text-center mb-2">{error}</div>}
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition mb-2 flex items-center justify-center gap-2 text-base"
              style={{ boxShadow: '0 4px 16px 0 rgba(0, 85, 255, 0.15)' }}
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
              <svg width="18" height="18" fill="none" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polyline points="96 48 176 128 96 208" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
            </button>
          </form>
          <div className="text-center text-sm text-gray-600 mt-2">
            Não tem uma conta?{' '}
            <Link href="/register" className="text-blue-600 font-semibold hover:underline">Criar conta gratuita</Link>
          </div>
        </main>
      </div>
      {/* Rodapé */}
      <footer className="w-full text-xs text-gray-400 text-center mb-4 mt-8">
        © 2024 Leelo • Transformando a advocacia brasileira
      </footer>
    </div>
  );
} 