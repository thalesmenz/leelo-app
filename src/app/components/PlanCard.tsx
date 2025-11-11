import { CheckCircle, Star, ArrowRight, CurrencyDollar } from 'phosphor-react';
import { Plan } from '@/app/constants/plans';

interface PlanCardProps {
  plan: Plan;
  billingPeriod: 'monthly' | 'yearly';
  loadingPlan: string | null;
  onSelectPlan: (plan: Plan) => void;
}

export const PlanCard = ({ plan, billingPeriod, loadingPlan, onSelectPlan }: PlanCardProps) => {
  const getCurrentPrice = () => {
    return billingPeriod === 'yearly' 
      ? Math.round(plan.yearlyPrice / 12) 
      : plan.monthlyPrice;
  };

  const price = getCurrentPrice();
  const isRecommended = plan.recommended;

  return (
    <div
      className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow ${
        isRecommended
          ? 'border-2 border-green-200 bg-gradient-to-br from-green-50/30 to-blue-50/30'
          : 'border border-gray-200'
      }`}
    >
      {isRecommended && (
        <div className="absolute -top-3 right-6">
          <span className="bg-gradient-to-r from-blue-500 to-green-400 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Star size={12} weight="fill" />
            Mais Popular
          </span>
        </div>
      )}

      {billingPeriod === 'yearly' && (
        <div className="absolute top-6 right-6">
          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-lg">
            -20%
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <p className="text-gray-600 text-lg">{plan.description}</p>
      </div>

      <div className="mb-8">
        {billingPeriod === 'yearly' && (
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-gray-400 text-xl line-through">R$ {plan.monthlyPrice}</span>
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-md text-xs font-bold">
              20% OFF
            </span>
          </div>
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-gray-500 text-2xl">R$</span>
          <span className="text-6xl font-bold text-gray-900">{price}</span>
          <span className="text-gray-500 text-xl">/mês</span>
        </div>
        {billingPeriod === 'yearly' && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <CurrencyDollar size={14} className="text-green-600" weight="fill" />
              <span className="text-green-700 font-semibold text-xs">
                Economize R$ {plan.monthlyPrice * 12 - plan.yearlyPrice}/ano
              </span>
            </div>
            <p className="text-xs text-gray-600">
              Total anual: R$ {plan.yearlyPrice}
            </p>
          </div>
        )}
      </div>

      <ul className="space-y-4 mb-8">
        {plan.features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <li key={idx} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle size={14} weight="fill" className="text-green-600" />
              </div>
              <span className="text-gray-700">{feature.text}</span>
            </li>
          );
        })}
      </ul>

      <button
        onClick={() => onSelectPlan(plan)}
        disabled={loadingPlan !== null}
        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
          isRecommended
            ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white hover:shadow-lg hover:scale-[1.02]'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
      >
        {loadingPlan === plan.name ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Carregando...
          </>
        ) : (
          <>
            {plan.cta}
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </div>
  );
};




