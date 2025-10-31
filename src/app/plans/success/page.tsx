'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, ArrowLeft } from 'phosphor-react';
import { showToast } from '../../utils/toast';

function PlansSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const session = searchParams.get('session_id');
    setSessionId(session);

    if (session) {
      showToast.success('Pagamento realizado com sucesso!');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <div className="mb-6">
          <CheckCircle size={64} className="mx-auto text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Pagamento Confirmado!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Seu pagamento foi processado com sucesso. Em breve você receberá a confirmação por e-mail.
        </p>

        {sessionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-xs text-gray-500 mb-1">ID da Sessão</p>
            <p className="text-sm font-mono text-gray-700 break-all">{sessionId}</p>
          </div>
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
  );
}

export default function PlansSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Carregando...</div>
      </div>
    }>
      <PlansSuccessContent />
    </Suspense>
  );
}
