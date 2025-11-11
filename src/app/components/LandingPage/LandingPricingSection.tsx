'use client';

import { useState } from 'react';
import { CheckCircle, Star, ArrowRight, CurrencyDollar, X, UserPlus, SignIn } from 'phosphor-react';
import Link from 'next/link';

interface Plan {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  recommended: boolean;
  features: string[];
}

const PLANS: Plan[] = [
  {
    name: 'Individual',
    monthlyPrice: 99,
    yearlyPrice: 990,
    description: 'Para fisioterapeutas autônomos',
    recommended: false,
    features: [
      'Agenda inteligente com calendário visual',
      'Cadastro e gestão completa de pacientes',
      'Prontuário eletrônico digital (PEP)',
      'Anamnese digital personalizada',
      'Gestão de serviços e tratamentos',
      'Controle financeiro completo',
      'Contas a receber e pagar',
      'Transações e relatórios financeiros',
      'Dashboard com métricas em tempo real',
      'Suporte técnico especializado',
    ]
  },
  {
    name: 'Plus',
    monthlyPrice: 147,
    yearlyPrice: 1470,
    description: 'Para clínicas em crescimento',
    recommended: true,
    features: [
      'Tudo do plano Individual',
      'Gerenciamento de equipe de fisioterapeutas',
      'Visão consolidada de relatórios financeiros',
      'Controle financeiro por fisioterapeuta',
      'Agenda compartilhada entre membros da equipe',
      'Dashboard consolidado com métricas da equipe',
      'Suporte prioritário e dedicado',
    ]
  }
];

export default function LandingPricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const getCurrentPrice = (plan: Plan) => {
    return billingPeriod === 'yearly' 
      ? Math.round(plan.yearlyPrice / 12) 
      : plan.monthlyPrice;
  };

  return (
    <>
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Planos que crescem{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
                com sua clínica
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Escolha o plano ideal para você. Todos os planos incluem teste grátis de 7 dias.
            </p>

            {/* Toggle de período */}
            <div className="inline-flex items-center gap-4 bg-gray-100 rounded-full p-1.5">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  billingPeriod === 'monthly'
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                  billingPeriod === 'yearly'
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Anual
                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">-20%</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {PLANS.map((plan, index) => {
              const price = getCurrentPrice(plan);
              const isRecommended = plan.recommended;

              return (
                <div
                  key={index}
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
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle size={14} weight="fill" className="text-green-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      isRecommended
                        ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white hover:shadow-lg hover:scale-[1.02]'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    } flex items-center justify-center gap-2`}
                  >
                    Começar agora
                    <ArrowRight size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Enterprise Card */}
          <div className="relative bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl p-8 shadow-2xl text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                  <Star size={18} weight="fill" />
                  <span className="font-semibold">Para Empresas Maiores</span>
                </div>
                <h3 className="text-4xl font-bold mb-4">Enterprise</h3>
                <p className="text-lg text-white/90 mb-6">
                  Ideal para clínicas grandes, redes e franquias que precisam de flexibilidade total.
                </p>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-white/80 text-2xl">R$</span>
                    <span className="text-5xl font-bold">{billingPeriod === 'yearly' ? '239' : '299'}</span>
                    <span className="text-white/80 text-xl">/mês</span>
                  </div>
                  {billingPeriod === 'yearly' && (
                    <p className="text-white/80 text-sm">
                      ou R$ 2.990/ano
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
                  onClick={() => handleSelectPlan({ name: 'Enterprise', monthlyPrice: 299, yearlyPrice: 2990, description: 'Para empresas', recommended: false, features: [] })}
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

          {/* Garantias */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Cancele quando quiser • Sem compromisso • Dados protegidos
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                7 dias grátis
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Sem cartão de crédito
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Cancele quando quiser
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Suporte especializado
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de autenticação */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-slide-in relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Star size={32} className="text-white" weight="fill" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Ótima escolha!
              </h3>
              <p className="text-gray-600 text-lg">
                Você selecionou o plano <span className="font-bold text-gray-900">{selectedPlan?.name}</span>
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 mb-6">
              <p className="text-gray-800 font-medium mb-4">
                Para continuar, você precisa de uma conta Leelo
              </p>
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" weight="fill" />
                <p className="text-sm text-gray-700">7 dias de teste grátis</p>
              </div>
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" weight="fill" />
                <p className="text-sm text-gray-700">Sem cartão de crédito necessário</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" weight="fill" />
                <p className="text-sm text-gray-700">Cancele quando quiser</p>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/register"
                className="w-full bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                <UserPlus size={20} weight="fill" />
                Criar conta grátis
              </Link>
              <Link
                href="/login"
                className="w-full bg-white border-2 border-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
              >
                <SignIn size={20} weight="fill" />
                Já tenho conta
              </Link>
            </div>

            <p className="text-center text-xs text-gray-500 mt-6">
              Após criar sua conta, você poderá escolher o plano e iniciar seu teste grátis
            </p>
          </div>
        </div>
      )}
    </>
  );
}



