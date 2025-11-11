'use client';

import { ArrowRight, CheckCircle } from 'phosphor-react';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
          Pronto para transformar sua{' '}
          <span className="text-white/90">prática clínica?</span>
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Junte-se a centenas de fisioterapeutas que já estão usando o Leelo para 
          gerenciar suas clínicas de forma mais eficiente e profissional.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/plans"
            className="group px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2"
          >
            Começar agora
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/register"
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300"
          >
            Criar conta grátis
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-white/90">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle size={20} weight="fill" className="text-white" />
            <span className="text-sm sm:text-base">Teste grátis por 7 dias</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle size={20} weight="fill" className="text-white" />
            <span className="text-sm sm:text-base">Sem cartão de crédito</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle size={20} weight="fill" className="text-white" />
            <span className="text-sm sm:text-base">Cancele quando quiser</span>
          </div>
        </div>
      </div>
    </section>
  );
}




