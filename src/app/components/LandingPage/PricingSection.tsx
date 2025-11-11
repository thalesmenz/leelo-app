'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { useCheckout } from '@/app/hooks/useCheckout';
import { PLANS } from '@/app/constants/plans';
import { PlanCard, PriceToggle, EnterpriseCard } from '@/app/components';

export default function PricingSection() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { loadingPlan, handleSelectPlan } = useCheckout(isAuthenticated);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  return (
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

          <PriceToggle 
            billingPeriod={billingPeriod}
            onToggle={setBillingPeriod}
          />
        </div>

        {/* Pricing Cards */}
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

        {/* Enterprise Card */}
        <EnterpriseCard
          billingPeriod={billingPeriod}
          onContact={() => router.push('/register?plan=enterprise')}
        />

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
  );
}




