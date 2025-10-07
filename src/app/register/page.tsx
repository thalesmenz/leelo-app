'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EnvelopeSimple, Eye, EyeSlash, User, Check, ArrowRight, Heart, Shield, UserPlus, Calendar, FileText, Activity } from 'phosphor-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { registerSchema, type RegisterFormData } from '../schemas/auth';
import { FormInput, PasswordInput } from '../components';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

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
      
      const result = await authService.signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        const loginResult = await login(data.email, data.password);
        
        if (loginResult.success) {
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
        <div className="absolute top-1/3 right-1/4 w-12 h-12 text-blue-100 opacity-20">
          <FileText size={48} />
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
              Comece sua{' '}
              <span className="text-green-600">
                transformação digital
              </span>
            </h2>
            
            <p className="text-xl text-slate-600 mb-12 leading-relaxed">
              Junte-se a milhares de fisioterapeutas que já modernizaram sua gestão clínica com o Leelo.
            </p>

            {/* Features fisioterapia */}
            <div className="space-y-6">
              <div className="flex items-center text-slate-700">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <UserPlus size={20} className="text-green-600" />
                </div>
                <span className="text-lg font-medium">Cadastro rápido e seguro</span>
              </div>
              <div className="flex items-center text-slate-700">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <Shield size={20} className="text-blue-600" />
                </div>
                <span className="text-lg font-medium">Dados protegidos com criptografia</span>
              </div>
              <div className="flex items-center text-slate-700">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <Heart size={20} className="text-green-600" />
                </div>
                <span className="text-lg font-medium">Acesso imediato após cadastro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de cadastro */}
        <div className="w-full lg:w-1/2 xl:w-3/5 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-sm mx-auto animate-slide-in">
            <div className="platform-card rounded-2xl p-6">
              {/* Header do formulário */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 platform-gradient rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <UserPlus size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">Criar conta</h2>
                <p className="text-slate-600 text-sm">Preencha os dados para começar</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Campo de nome */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Nome completo
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User size={20} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      placeholder="Seu nome completo"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      {...register('name')}
                      autoComplete="name"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

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
                      <div className="w-5 h-5 border-2 border-slate-300 rounded-sm"></div>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      {...register('password')}
                      autoComplete="new-password"
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

                {/* Campo de confirmar senha */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Confirmar senha
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <div className="w-5 h-5 border-2 border-slate-300 rounded-sm"></div>
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repita sua senha"
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      {...register('confirmPassword')}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Password strength indicator */}
                {password && (
                  <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-700 font-medium">Força da senha:</p>
                    <div className="flex gap-1">
                      <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${password.length >= 6 ? 'bg-gradient-to-r from-blue-500 to-green-500' : 'bg-slate-200'}`}></div>
                      <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${password.length >= 8 ? 'bg-gradient-to-r from-blue-500 to-green-500' : 'bg-slate-200'}`}></div>
                      <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${/[A-Z]/.test(password) ? 'bg-gradient-to-r from-blue-500 to-green-500' : 'bg-slate-200'}`}></div>
                      <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${/\d/.test(password) ? 'bg-gradient-to-r from-blue-500 to-green-500' : 'bg-slate-200'}`}></div>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Check size={12} className={password.length >= 6 ? 'text-blue-500' : 'text-slate-400'} />
                      <span className={password.length >= 6 ? 'text-blue-600' : 'text-slate-500'}>Mínimo 6 caracteres</span>
                    </div>
                  </div>
                )}

                {/* Checkbox de termos */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    {...register('acceptTerms')}
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-slate-600 leading-relaxed">
                    Aceito os{' '}
                    <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                      termos de uso
                    </Link>{' '}
                    e{' '}
                    <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                      política de privacidade
                    </Link>
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-red-500 text-sm">{errors.acceptTerms.message}</p>
                )}

                {/* Botão de cadastro */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full platform-gradient hover:opacity-90 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Criando conta...
                    </>
                  ) : (
                    <>
                      Criar conta gratuita
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

                {/* Botão de login */}
                <Link
                  href="/login"
                  className="w-full bg-white border-2 border-blue-200 text-blue-700 font-semibold py-3 px-4 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Fazer login
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-slate-500 text-xs">
                  Já tem uma conta?{' '}
                  <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                    Fazer login
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