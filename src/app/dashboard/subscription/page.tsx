'use client';

import { useEffect, useState } from 'react';
import { stripeService } from '@/app/services/stripeService';
import { showToast } from '@/app/utils/toast';
import { Modal } from '@/app/components/Modal';

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(true);
  const [sub, setSub] = useState<any>(null);
  const [canceling, setCanceling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await stripeService.getSubscription();
      if (res.success) setSub(res.data || null);
      else showToast.error(res.message || 'Erro ao carregar assinatura');
    } catch (e: any) {
      showToast.error(e.message || 'Erro ao carregar assinatura');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancelAtPeriodEnd = async () => {
    try {
      setCanceling(true);
      const res = await stripeService.cancelSubscription();
      if (res.success) {
        showToast.success('Assinatura será cancelada ao final do período.');
        await load();
      } else {
        showToast.error(res.message || 'Erro ao cancelar assinatura');
      }
    } catch (e: any) {
      showToast.error(e.message || 'Erro ao cancelar assinatura');
    } finally {
      setCanceling(false);
    }
  };

  const formatDate = (iso?: string | null) => {
    if (!iso) return '-';
    return new Date(iso).toLocaleDateString('pt-BR');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Minha Assinatura</h1>

      {loading ? (
        <div className="text-gray-500">Carregando...</div>
      ) : !sub ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          Você não possui assinatura ativa.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-4 max-w-xl">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-gray-500">Plano</div>
            <div className="font-medium">{sub.plan_name}</div>
            <div className="text-gray-500">Status</div>
            <div className="font-medium capitalize">{sub.status}</div>
            <div className="text-gray-500">Início do período</div>
            <div className="font-medium">{formatDate(sub.current_period_start)}</div>
            <div className="text-gray-500">Fim do período</div>
            <div className="font-medium">{formatDate(sub.current_period_end)}</div>
            <div className="text-gray-500">Cancelar no fim do período</div>
            <div className="font-medium">{sub.cancel_at_period_end ? 'Sim' : 'Não'}</div>
          </div>

          <div className="mt-4 flex gap-3">
            {!sub.cancel_at_period_end && (
              <button
                onClick={() => setShowConfirm(true)}
                disabled={canceling}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                {canceling ? 'Cancelando...' : 'Cancelar ao final do período'}
              </button>
            )}
          </div>
          <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Cancelar assinatura?" size="sm">
            <p className="text-sm text-gray-600 mb-4">
              Esta ação marcará sua assinatura para cancelar ao final do período atual. Você continuará com acesso até {formatDate(sub.current_period_end)}.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                onClick={async () => { await cancelAtPeriodEnd(); setShowConfirm(false); }}
                disabled={canceling}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
              >
                Confirmar cancelamento
              </button>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
}


