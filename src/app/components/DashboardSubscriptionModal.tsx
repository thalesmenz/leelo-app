'use client';

import { useState, useEffect } from 'react';
import { X, Star, CheckCircle, Sparkle, ArrowRight, Crown } from 'phosphor-react';
import Link from 'next/link';

interface DashboardSubscriptionModalProps {
  hasActiveSubscription: boolean;
}

export default function DashboardSubscriptionModal({ hasActiveSubscription }: DashboardSubscriptionModalProps) {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    // Mostrar modal imediatamente quando não houver assinatura ativa
    if (!hasActiveSubscription) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [hasActiveSubscription]);

  const handleDismiss = () => {
    setShowModal(false);
  };

  if (!showModal || hasActiveSubscription) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-slide-in relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-100 to-green-100 rounded-full blur-3xl opacity-30 -mr-24 -mt-24"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-100 to-blue-100 rounded-full blur-3xl opacity-30 -ml-24 -mb-24"></div>

        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-5 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-400 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-xl">
            <Crown size={32} className="text-white" weight="fill" />
          </div>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-green-100 rounded-full px-3 py-1.5 mb-3">
            <Sparkle size={14} className="text-blue-600" weight="fill" />
            <span className="text-xs font-semibold text-gray-800">Desbloqueie todo o potencial</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Transforme sua clínica
          </h3>
          <p className="text-gray-600 text-sm">
            Assine o Leelo e tenha acesso completo a todas as funcionalidades
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-4 mb-4 relative z-10">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
            <Star size={16} className="text-yellow-500" weight="fill" />
            Com uma assinatura você terá:
          </h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2.5">
              <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" weight="fill" />
              <p className="text-gray-700 text-sm">
                <span className="font-semibold">Agenda inteligente</span> com QR Code
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" weight="fill" />
              <p className="text-gray-700 text-sm">
                <span className="font-semibold">Prontuário eletrônico</span> (PEP)
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" weight="fill" />
              <p className="text-gray-700 text-sm">
                <span className="font-semibold">Controle financeiro</span> completo
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" weight="fill" />
              <p className="text-gray-700 text-sm">
                <span className="font-semibold">Gestão de pacientes</span> e muito mais
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-3 mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkle size={20} className="text-white" weight="fill" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">7 dias grátis!</p>
              <p className="text-xs text-gray-700">Sem compromisso e sem cartão</p>
            </div>
          </div>
        </div>

        <div className="space-y-2.5 relative z-10">
          <Link
            href="/plans"
            className="w-full bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white font-semibold py-3 px-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] text-sm"
          >
            Ver planos e assinar
            <ArrowRight size={18} weight="bold" />
          </Link>
          <button
            onClick={handleDismiss}
            className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors text-sm"
          >
            Continuar sem assinar
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-3 relative z-10">
          Você pode assinar a qualquer momento
        </p>
      </div>
    </div>
  );
}

