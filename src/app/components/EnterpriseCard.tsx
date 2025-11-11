import { CheckCircle, Star, ArrowRight } from 'phosphor-react';
import { ENTERPRISE_PLAN } from '@/app/constants/plans';

interface EnterpriseCardProps {
  billingPeriod: 'monthly' | 'yearly';
  onContact: () => void;
}

export const EnterpriseCard = ({ billingPeriod, onContact }: EnterpriseCardProps) => {
  const getCurrentPrice = () => {
    return billingPeriod === 'yearly' 
      ? Math.round(ENTERPRISE_PLAN.yearlyPrice / 12) 
      : ENTERPRISE_PLAN.monthlyPrice;
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl p-8 shadow-2xl text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
            <Star size={18} weight="fill" />
            <span className="font-semibold">Para Empresas Maiores</span>
          </div>
          <h3 className="text-4xl font-bold mb-4">{ENTERPRISE_PLAN.name}</h3>
          <p className="text-lg text-white/90 mb-6">
            {ENTERPRISE_PLAN.description}
          </p>
          <div className="mb-6">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-white/80 text-2xl">R$</span>
              <span className="text-5xl font-bold">{getCurrentPrice()}</span>
              <span className="text-white/80 text-xl">/mês</span>
            </div>
            {billingPeriod === 'yearly' && (
              <p className="text-white/80 text-sm">
                ou R$ {ENTERPRISE_PLAN.yearlyPrice}/ano
              </p>
            )}
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <CheckCircle size={20} weight="fill" className="text-white flex-shrink-0 mt-0.5" />
              <span>Tudo do plano Plus incluído</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle size={20} weight="fill" className="text-white flex-shrink-0 mt-0.5" />
              <span className="font-semibold">Fisioterapeutas ilimitados</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle size={20} weight="fill" className="text-white flex-shrink-0 mt-0.5" />
              <span>Suporte prioritário 24/7</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle size={20} weight="fill" className="text-white flex-shrink-0 mt-0.5" />
              <span>Visão consolidada completa</span>
            </li>
          </ul>
          <button
            onClick={onContact}
            className="w-full bg-white text-gray-900 py-3 px-6 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
          >
            Contatar Vendas
            <ArrowRight size={18} />
          </button>
        </div>
        <div className="hidden md:block">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h4 className="font-semibold mb-3 text-lg">Perfeito para:</h4>
            <ul className="space-y-2 text-white/90">
              <li>• Clínicas com muitos profissionais</li>
              <li>• Empresas que crescem rápido</li>
              <li>• Múltiplos fisioterapeutas</li>
              <li>• Gestão de grande equipe</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};




