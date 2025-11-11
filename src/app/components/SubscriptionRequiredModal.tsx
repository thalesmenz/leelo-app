'use client';

import { Star, X } from 'phosphor-react';
import { useRouter } from 'next/navigation';
import { Modal } from './Modal';

interface SubscriptionRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionRequiredModal({ isOpen, onClose }: SubscriptionRequiredModalProps) {
  const router = useRouter();

  const handleGoToPlans = () => {
    router.push('/plans');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assinatura Necessária" size="md">
      <div className="text-center py-4">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-green-400 flex items-center justify-center">
            <Star size={40} weight="fill" className="text-white" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Assine um plano para continuar
        </h3>

        <p className="text-gray-600 mb-6">
          Esta funcionalidade requer uma assinatura ativa. Escolha um plano que se adapte às suas necessidades e desbloqueie todos os recursos.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-blue-800 font-medium mb-2">✨ O que você ganha com uma assinatura:</p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Acesso completo a todas as funcionalidades</li>
            <li>• Sem limites de uso</li>
            <li>• Suporte</li>
            <li>• Atualizações e novos recursos</li>
          </ul>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleGoToPlans}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-green-400 text-white hover:from-green-400 hover:to-blue-500 font-semibold transition-all shadow-lg"
          >
            Ver Planos
          </button>
        </div>
      </div>
    </Modal>
  );
}


