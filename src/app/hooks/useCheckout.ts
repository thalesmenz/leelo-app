import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { showToast } from '@/app/utils/toast';
import { stripeService } from '@/app/services/stripeService';
import { Plan } from '@/app/constants/plans';

export const useCheckout = (isAuthenticated: boolean) => {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (
    plan: Plan,
    billingPeriod: 'monthly' | 'yearly'
  ) => {
    if (!isAuthenticated) {
      showToast.error('Você precisa estar logado para contratar um plano');
      router.push('/login');
      return;
    }

    try {
      setLoadingPlan(plan.name);

      const priceId = billingPeriod === 'yearly' 
        ? plan.price_yearly 
        : plan.price_monthly;

      const periodLabel = billingPeriod === 'monthly' ? 'mensal' : 'anual';

      if (!priceId) {
        showToast.error(
          `O plano ${plan.name} (${periodLabel}) ainda não está disponível. ` +
          'Entre em contato com o suporte ou tente outro plano.'
        );
        setLoadingPlan(null);
        return;
      }

      const response = await stripeService.createCheckoutSession({
        plan_name: `${plan.name} - ${billingPeriod === 'monthly' ? 'Mensal' : 'Anual'}`,
        price_id: priceId,
        billing_period: billingPeriod,
        success_url: `${window.location.origin}/plans/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/plans`,
      });

      if (response.success && response.data?.url) {
        window.location.href = response.data.url;
      } else {
        showToast.error(response.message || 'Erro ao processar pagamento');
        setLoadingPlan(null);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao iniciar pagamento';
      
      if (error.response?.status === 401) {
        showToast.error('Sessão expirada. Faça login novamente.');
        router.push('/login');
      } else if (error.response?.status === 403) {
        showToast.error('Você não tem permissão para contratar este plano.');
      } else {
        showToast.error(errorMessage);
      }
      
      setLoadingPlan(null);
    }
  };

  return {
    loadingPlan,
    handleSelectPlan,
  };
};


