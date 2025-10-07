'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EnvelopeSimple, Eye, EyeSlash, Lock, ArrowRight, Activity, Shield, Heart, User, Calendar, FileText } from 'phosphor-react';
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
        router.push('/dashboard');
      }
    } catch (error) {
      // Erro já tratado no hook useAuth
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-blue-50 to-green-50">
      {/* Background fisioterapia */}
      <div className="absolute inset-0 gradient-bg"></div>
      
      {/* Elementos decorativos fisioterapia */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 text-blue-100 opacity-20">
          <Activity size={128} />
        </div>
        <div className="absolute bottom-20 left-20 w-24 h-24 text-green-100 opacity-20">
          <Heart size={96} />
        </div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 text-blue-100 opacity-20">
          <User size={64} />
        </div>
        <div className="absolute bottom-1/3 right-1/3 w-20 h-20 text-green-100 opacity-20">
          <Calendar size={80} />
        </div>
      </div>

      {/* Padrão sutil */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233b82f6' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Sidebar com informações fisioterapia */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 flex-col justify-center px-12 xl:px-16">
          <div className="animate-slide-in">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 platform-gradient rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <Activity size={28} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold text-slate-800">Leelo</h1>
            </div>
            
            <h2 className="text-5xl font-bold text-slate-800 mb-6 leading-tight">
              Gestão para{' '}
              <span className="text-green-600">
                fisioterapeutas
              </span>
            </h2>
            
            <p className="text-xl text-slate-600 mb-12 leading-relaxed">
              A plataforma completa para clínicas de fisioterapia. Agendamentos, prontuários, evolução dos pacientes e gestão financeira em um só lugar.
            </p>

            {/* Features fisioterapia */}
            <div className="space-y-6">
              <div className="flex items-center text-slate-700">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <Calendar size={20} className="text-blue-600" />
                </div>
                <span className="text-lg font-medium">Agendamento de sessões</span>
              </div>
              <div className="flex items-center text-slate-700">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <FileText size={20} className="text-green-600" />
                </div>
                <span className="text-lg font-medium">Prontuários e evolução</span>
              </div>
              <div className="flex items-center text-slate-700">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <Shield size={20} className="text-blue-600" />
                </div>
                <span className="text-lg font-medium">Segurança e LGPD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de login */}
        <div className="w-full lg:w-1/2 xl:w-3/5 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-sm mx-auto animate-slide-in">
            <div className="platform-card rounded-2xl p-6">
              {/* Header do formulário */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 platform-gradient rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Lock size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">Bem-vindo de volta</h2>
                <p className="text-slate-600 text-sm">Acesse sua conta para continuar</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Campo de email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    E-mail
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <EnvelopeSimple size={20} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      {...register('email')}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Campo de senha */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Senha
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock size={20} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Sua senha"
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      {...register('password')}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Opções adicionais */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-slate-600">Lembrar de mim</span>
                  </label>
                  <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                    Esqueci minha senha
                  </Link>
                </div>

                {/* Botão de login */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full platform-gradient hover:opacity-90 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Entrando...
                    </>
                  ) : (
                    <>
                      Entrar
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Divisor */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-slate-500">ou</span>
                  </div>
                </div>

                {/* Botão de cadastro */}
                <Link
                  href="/register"
                  className="w-full bg-white border-2 border-blue-200 text-blue-700 font-semibold py-3 px-4 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Criar conta gratuita
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-slate-500 text-xs">
                  Ao continuar, você concorda com nossos{' '}
                  <Link href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                    Termos de Uso
                  </Link>{' '}
                  e{' '}
                  <Link href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                    Política de Privacidade
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 