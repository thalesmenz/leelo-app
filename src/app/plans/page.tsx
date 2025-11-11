'use client';

import { Star } from 'phosphor-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { useCheckout } from '@/app/hooks/useCheckout';
import { PLANS } from '@/app/constants/plans';
import { PlanCard, UserMenu, PriceToggle, EnterpriseCard, PriceWarning } from '@/app/components';

export default function PlansPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, logoutAllDevices } = useAuth();
  const { loadingPlan, handleSelectPlan } = useCheckout(isAuthenticated);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [priceIdWarnings, setPriceIdWarnings] = useState<string[]>([]);

  // Validar se os Price IDs estão configurados
  const validatePriceIds = () => {
    const missingConfigs: string[] = [];
    
    PLANS.forEach(plan => {
      if (!plan.price_monthly) {
        missingConfigs.push(`${plan.name} (Mensal)`);
      }
      if (!plan.price_yearly) {
        missingConfigs.push(`${plan.name} (Anual)`);
      }
    });

    return missingConfigs;
  };

  // Validar Price IDs no carregamento
  useEffect(() => {
    const warnings = validatePriceIds();
    setPriceIdWarnings(warnings);
    
    if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Price IDs não configurados:', warnings);
    }
  }, [billingPeriod]);

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
              <UserMenu
                userName={user?.name}
                userEmail={user?.email}
                onLogout={handleLogout}
                onLogoutAllDevices={handleLogoutAllDevices}
              />
            </div>
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

          <PriceToggle 
            billingPeriod={billingPeriod}
            onToggle={setBillingPeriod}
          />
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <PriceWarning warnings={priceIdWarnings} />

          {/* Individual e Plus Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {PLANS.map((plan, index) => (
              <PlanCard
                key={index}
                plan={plan}
                billingPeriod={billingPeriod}
                loadingPlan={loadingPlan}
                onSelectPlan={(plan) => handleSelectPlan(plan, billingPeriod)}
              />
            ))}
          </div>

          {/* Enterprise Card - Full Width */}
          <EnterpriseCard
            billingPeriod={billingPeriod}
            onContact={() => router.push('/register?plan=enterprise')}
          />

          <p className="text-center text-sm text-gray-500 mt-8">
            Cancele quando quiser • Sem compromisso • Dados protegidos
          </p>
        </div>
      </section>
    </div>
  );
}
