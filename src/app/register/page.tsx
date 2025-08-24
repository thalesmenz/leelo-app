'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EnvelopeSimple, Eye, EyeSlash, User, Check } from 'phosphor-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { registerSchema, type RegisterFormData } from '../schemas/auth';
import { FormInput, PasswordInput } from '../components';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Após registro bem-sucedido, faz login automaticamente
        const loginResult = await login(data.email, data.password);
        
        if (loginResult.success) {
          // Redireciona para dashboard após login bem-sucedido
          router.push('/dashboard');
        }
      } else {
        throw new Error(result.message || 'Erro no registro');
      }
    } catch (error: any) {
      const message = error.message || 'Erro ao registrar usuário';
      console.error('Erro no registro:', message);
    } finally {
      setLoading(false);
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

        {/* Register Card */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Criar conta</h2>
              <p className="text-gray-600">Preencha os dados para criar sua conta</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Seu nome completo"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    {...register('name')}
                    autoComplete="name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

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
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    {...register('password')}
                    autoComplete="new-password"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-sm"></div>
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repita sua senha"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    {...register('confirmPassword')}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeSlash size={20} className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Força da senha:</p>
                  <div className="flex gap-1">
                    <div className={`flex-1 h-2 rounded-full ${password.length >= 6 ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                    <div className={`flex-1 h-2 rounded-full ${password.length >= 8 ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                    <div className={`flex-1 h-2 rounded-full ${/[A-Z]/.test(password) ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                    <div className={`flex-1 h-2 rounded-full ${/\d/.test(password) ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Check size={12} className={password.length >= 6 ? 'text-emerald-500' : 'text-gray-300'} />
                    <span className={password.length >= 6 ? 'text-emerald-600' : 'text-gray-400'}>Mínimo 6 caracteres</span>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  className="mt-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  {...register('acceptTerms')}
                />
                <label htmlFor="acceptTerms" className="text-sm text-gray-600 leading-relaxed">
                  Aceito os{' '}
                  <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">termos de uso</a> e{' '}
                  <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">política de privacidade</a>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Criando conta...
                  </>
                ) : (
                  'Criar conta gratuita'
                )}
              </button>

              {/* Botão Fazer Login */}
              <Link
                href="/login"
                className="w-full bg-white border-2 border-transparent text-black font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 hover:bg-emerald-50 relative"
                style={{
                  background: 'linear-gradient(white, white) padding-box, linear-gradient(to right, #3b82f6, #10b981) border-box',
                  border: '2px solid transparent'
                }}
              >
                Fazer login
              </Link>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
                  Fazer login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <p className="text-xs text-gray-400 text-center">
          Precisa de ajuda? <Link href="#" className="text-emerald-600 hover:text-emerald-700">Entre em contato</Link>
        </p>
      </div>
    </div>
  );
} 