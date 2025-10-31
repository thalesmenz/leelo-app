'use client';

import { CheckCircle, Star, X, ArrowRight, Activity, Calendar, FileText, CurrencyDollar, ClipboardText, ChartLine, Envelope, Users, Gear, ShieldCheck, Tag, ChartBar, User, SignOut, List } from 'phosphor-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { showToast } from '@/app/utils/toast';
import { useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { stripeService } from '@/app/services/stripeService';

export default function PlansPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, logoutAllDevices } = useAuth();
  const [loading, setLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const plans = [
    {
      name: 'Individual',
      monthlyPrice: 99,
      yearlyPrice: 990, // 99 * 10 meses (20% de desconto)
      // Adicione aqui os Price IDs dos seus planos criados na Stripe
      // Exemplo: price_monthly: 'price_xxxxx', price_yearly: 'price_xxxxx'
      price_monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_INDIVIDUAL_MONTHLY || '',
      price_yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_INDIVIDUAL_YEARLY || '',
      description: 'Para fisioterapeutas autônomos',
      recommended: false,
      features: [
        { icon: Calendar, text: 'Agenda inteligente com calendário visual' },
        { icon: Users, text: 'Cadastro e gestão completa de pacientes' },
        { icon: FileText, text: 'Prontuário eletrônico digital (PEP)' },
        { icon: ClipboardText, text: 'Anamnese digital personalizada' },
        { icon: Gear, text: 'Gestão de serviços e tratamentos' },
        { icon: ChartLine, text: 'Controle financeiro completo' },
        { icon: CurrencyDollar, text: 'Contas a receber e pagar' },
        { icon: FileText, text: 'Transações e relatórios financeiros' },
        { icon: ChartBar, text: 'Dashboard com métricas em tempo real' },
        { icon: Envelope, text: 'Suporte técnico especializado' },
      ],
      cta: 'Começar agora',
    },
    {
      name: 'Plus',
      monthlyPrice: 147,
      yearlyPrice: 1470, // 147 * 10 meses (20% de desconto)
      // Adicione aqui os Price IDs dos seus planos criados na Stripe
      price_monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PLUS_MONTHLY || '',
      price_yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PLUS_YEARLY || '',
      description: 'Para clínicas em crescimento',
      recommended: true,
      features: [
        { icon: Calendar, text: 'Agenda inteligente com calendário visual' },
        { icon: Users, text: 'Cadastro e gestão completa de pacientes' },
        { icon: FileText, text: 'Prontuário eletrônico digital (PEP)' },
        { icon: ClipboardText, text: 'Anamnese digital personalizada' },
        { icon: Gear, text: 'Gestão de serviços e tratamentos' },
        { icon: ChartLine, text: 'Controle financeiro completo' },
        { icon: CurrencyDollar, text: 'Contas a receber e pagar' },
        { icon: FileText, text: 'Transações e relatórios financeiros' },
        { icon: ChartBar, text: 'Dashboard com métricas em tempo real' },
        { icon: Envelope, text: 'Suporte técnico especializado' },
        { icon: Users, text: 'Gerenciamento de equipe de fisioterapeutas' },
        { icon: ChartLine, text: 'Visão consolidada de relatórios financeiros' },
        { icon: CurrencyDollar, text: 'Controle financeiro por fisioterapeuta' },
        { icon: Calendar, text: 'Agenda compartilhada entre membros da equipe' },
        { icon: ChartBar, text: 'Dashboard consolidado com métricas da equipe' },
        { icon: ShieldCheck, text: 'Suporte prioritário e dedicado' },
      ],
      cta: 'Começar agora',
    },
  ];

  const getCurrentPrice = (monthlyPrice: number, yearlyPrice: number) => {
    return billingPeriod === 'yearly' ? Math.round(yearlyPrice / 12) : monthlyPrice;
  };

  const handleSelectPlan = async (plan: typeof plans[0]) => {
    if (!isAuthenticated) {
      showToast.error('Você precisa estar logado para contratar um plano');
      router.push('/login');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      showToast.error('Usuário não identificado');
      return;
    }

    try {
      setLoading(true);

      // Pegar o Price ID baseado no período de cobrança
      const priceId = billingPeriod === 'yearly' 
        ? plan.price_yearly 
        : plan.price_monthly;

      // Se não tiver Price ID configurado, usar valor dinâmico (fallback)
      if (!priceId) {
        const amount = billingPeriod === 'yearly' 
          ? plan.yearlyPrice 
          : plan.monthlyPrice;
        
        showToast.error('Price ID não configurado. Configure os Price IDs na Stripe e nas variáveis de ambiente.');
        setLoading(false);
        return;
      }

      const response = await stripeService.createCheckoutSession({
        user_id: userId,
        plan_name: `${plan.name} - ${billingPeriod === 'monthly' ? 'Mensal' : 'Anual'}`,
        price_id: priceId,
        billing_period: billingPeriod,
        success_url: `${window.location.origin}/plans/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/plans`,
      });

      if (response.success && response.data?.url) {
        // Redirecionar para Stripe Checkout
        window.location.href = response.data.url;
      } else {
        showToast.error('Erro ao processar pagamento');
        setLoading(false);
      }
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao iniciar pagamento');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleLogoutAllDevices = async () => {
    await logoutAllDevices();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between bg-white h-16 px-8 border-b border-gray-200">
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Planos</h2>
                <span className="text-gray-500 text-sm">
                  Bem-vindo, {user?.name || 'Usuário'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Voltar ao Dashboard
              </Link>
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <span className="hidden md:block text-sm font-medium">{user?.name}</span>
                  <User size={16} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <SignOut size={16} />
                      Sair
                    </button>
                    
                    <button
                      onClick={handleLogoutAllDevices}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      Sair de todos os dispositivos
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Overlay para fechar o menu quando clicar fora */}
            {showUserMenu && (
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowUserMenu(false)}
              />
            )}
          </>
        ) : (
          <div className="flex items-center gap-4 ml-auto">
            <Link
              href="/login"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-400 hover:to-blue-500 transition-all shadow-lg"
            >
              Criar conta
            </Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-6">
            <Star size={16} className="text-gray-600" weight="fill" />
            <span className="text-sm font-medium text-gray-700">7 dias grátis • Sem cartão de crédito</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
            Planos que crescem{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
              com sua clínica
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Gestão completa para fisioterapeutas. Agenda, prontuário, financeiro e muito mais em uma única plataforma.
          </p>

          <div className="inline-flex items-center bg-gray-100 rounded-full p-1 mb-8">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all relative ${
                billingPeriod === 'yearly'
                  ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>Anual</span>
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Individual e Plus Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {plans.map((plan, index) => {
              const price = getCurrentPrice(plan.monthlyPrice, plan.yearlyPrice);
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
                    onClick={() => handleSelectPlan(plan)}
                    disabled={loading}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      isRecommended
                        ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white hover:shadow-lg hover:scale-[1.02]'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                  >
                    {loading ? (
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
            })}
          </div>

          {/* Enterprise Card - Full Width */}
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
                    <span className="text-5xl font-bold">{getCurrentPrice(299, 2990)}</span>
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
                  onClick={() => router.push('/register?plan=enterprise')}
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

          <p className="text-center text-sm text-gray-500 mt-8">
            Cancele quando quiser • Sem compromisso • Dados protegidos
          </p>
        </div>
      </section>
    </div>
  );
}




