'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'phosphor-react';
import { usePaymentVerification } from '@/app/hooks/usePaymentVerification';
import { PaymentStatusCard } from '@/app/components';

function PlansSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const session = searchParams.get('session_id');
    setSessionId(session);
  }, [searchParams]);

  const { paymentStatus, retryCount, maxRetries, retry } = usePaymentVerification(sessionId);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <PaymentStatusCard
          status={paymentStatus.status}
          message={paymentStatus.message}
          details={paymentStatus.details}
          sessionId={sessionId}
          retryCount={retryCount}
          maxRetries={maxRetries}
        />

        <div className="space-y-3">
          {paymentStatus.status === 'error' && sessionId && (
            <button
              onClick={retry}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow transition-all"
            >
              Tentar Novamente
            </button>
          )}
          
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow transition-all"
          >
            <ArrowLeft size={20} />
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlansSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-gray-500">Carregando...</span>
        </div>
      </div>
    }>
      <PlansSuccessContent />
    </Suspense>
  );
}
