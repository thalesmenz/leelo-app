'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EnvelopeSimple, Eye, EyeSlash } from 'phosphor-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginSchema, type LoginFormData } from '../schemas/auth';
import { FormInput, PasswordInput } from '../components';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data.email, data.password);
      
      if (result.success) {
        // Redireciona para dashboard após login bem-sucedido
        router.push('/dashboard');
      }
    } catch (error) {
      // Erro já tratado no hook useAuth
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute -right-40 bottom-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded flex items-center justify-center text-white font-bold text-lg">
            L
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mt-2">Leelo</h1>
          <p className="text-gray-700 mt-1 font-medium">Gerencie sua clínica com inteligência</p>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo de volta</h2>
              <p className="text-gray-600">Acesse sua conta ou crie uma nova</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeSimple size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    {...register('email')}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-sm"></div>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    {...register('password')}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlash size={20} className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Lembrar de mim</span>
                </label>
                <Link href="#" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  Esqueci minha senha
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>

              {/* Botão Criar Conta */}
              <Link
                href="/register"
                className="w-full bg-white border-2 border-transparent bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-border text-black font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 hover:bg-emerald-50 relative"
                style={{
                  background: 'linear-gradient(white, white) padding-box, linear-gradient(to right, #3b82f6, #10b981) border-box',
                  border: '2px solid transparent'
                }}
              >
                Criar conta
              </Link>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OU CONTINUE COM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 