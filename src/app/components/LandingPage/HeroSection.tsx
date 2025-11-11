'use client';

import { ArrowRight, Calendar, Users, FileText, CurrencyDollar, CheckCircle, Sparkle } from 'phosphor-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Background animado */}
      <div className="absolute inset-0 gradient-bg opacity-50"></div>
      
      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 mb-8 shadow-lg">
            <Sparkle size={16} className="text-blue-500" weight="fill" />
            <span className="text-sm font-medium text-gray-700">7 dias grátis • Sem cartão de crédito</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Gestão completa para{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
              fisioterapeutas
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Agenda inteligente, prontuário eletrônico, controle financeiro e muito mais. 
            Tudo em uma plataforma desenvolvida especialmente para você.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/plans"
              className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-xl font-semibold text-lg hover:from-green-400 hover:to-blue-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2"
            >
              Começar agora
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 shadow-lg"
            >
              Ver funcionalidades
            </Link>
          </div>

          {/* Features rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <Calendar size={24} className="text-white" weight="fill" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Agenda Inteligente</h3>
              <p className="text-sm text-gray-600">Gestão completa de agendamentos</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <FileText size={24} className="text-white" weight="fill" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Prontuário Digital</h3>
              <p className="text-sm text-gray-600">PEP conforme regulamentação</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <Users size={24} className="text-white" weight="fill" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Gestão de Pacientes</h3>
              <p className="text-sm text-gray-600">Histórico completo</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <CurrencyDollar size={24} className="text-white" weight="fill" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Controle Financeiro</h3>
              <p className="text-sm text-gray-600">Relatórios em tempo real</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
}




