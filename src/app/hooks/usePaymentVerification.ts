import { useState, useEffect } from 'react';
import { showToast } from '@/app/utils/toast';
import { stripeService } from '@/app/services/stripeService';

export interface PaymentStatus {
  status: 'loading' | 'success' | 'error' | 'pending';
  message: string;
  details?: {
    payment_status?: string;
    amount_total?: number;
    currency?: string;
    plan_name?: string;
  };
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 3000; // 3 segundos

export const usePaymentVerification = (sessionId: string | null) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    status: 'loading',
    message: 'Verificando pagamento...'
  });
  const [retryCount, setRetryCount] = useState(0);

  const verifyPayment = async (sessionId: string, isRetry = false) => {
    try {
      const response = await stripeService.verifyCheckoutSession(sessionId);

      if (response.success && response.data) {
        const { payment_status, status } = response.data;

        if (payment_status === 'paid' || status === 'complete') {
          setPaymentStatus({
            status: 'success',
            message: 'Pagamento confirmado!',
            details: response.data
          });
          if (!isRetry) {
            showToast.success('Pagamento realizado com sucesso!');
          }
        } else if (payment_status === 'unpaid') {
          setPaymentStatus({
            status: 'pending',
            message: 'Pagamento pendente',
            details: response.data
          });
          if (!isRetry) {
            showToast.error('Pagamento ainda não foi confirmado');
          }
        } else {
          setPaymentStatus({
            status: 'pending',
            message: 'Aguardando confirmação do pagamento',
            details: response.data
          });
        }
      } else {
        setPaymentStatus({
          status: 'error',
          message: response.message || 'Erro ao verificar pagamento'
        });
        if (!isRetry) {
          showToast.error(response.message || 'Erro ao verificar pagamento');
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao verificar pagamento';
      
      if (retryCount < MAX_RETRIES) {
        console.log(`Tentativa ${retryCount + 1}/${MAX_RETRIES} falhou. Tentando novamente em ${RETRY_DELAY/1000}s...`);
        setRetryCount(prev => prev + 1);
        
        setPaymentStatus({
          status: 'loading',
          message: `Tentando novamente (${retryCount + 1}/${MAX_RETRIES})...`
        });
        
        setTimeout(() => {
          verifyPayment(sessionId, true);
        }, RETRY_DELAY);
      } else {
        setPaymentStatus({
          status: 'error',
          message: errorMessage
        });
        showToast.error(`${errorMessage}. Todas as tentativas falharam.`);
      }
    }
  };

  const retry = () => {
    if (sessionId) {
      setRetryCount(0);
      verifyPayment(sessionId);
    }
  };

  useEffect(() => {
    if (sessionId) {
      verifyPayment(sessionId);
    } else {
      setPaymentStatus({
        status: 'error',
        message: 'ID da sessão não encontrado'
      });
    }
  }, [sessionId]);

  return {
    paymentStatus,
    retryCount,
    maxRetries: MAX_RETRIES,
    retry,
  };
};




