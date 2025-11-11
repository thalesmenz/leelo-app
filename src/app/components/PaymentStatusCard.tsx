import { CheckCircle, XCircle, WarningCircle } from 'phosphor-react';

interface PaymentDetails {
  plan_name?: string;
  amount_total?: number;
  currency?: string;
}

interface PaymentStatusCardProps {
  status: 'loading' | 'success' | 'error' | 'pending';
  message: string;
  details?: PaymentDetails;
  sessionId?: string | null;
  retryCount?: number;
  maxRetries?: number;
}

export const PaymentStatusCard = ({ 
  status, 
  message, 
  details, 
  sessionId,
  retryCount = 0,
  maxRetries = 3 
}: PaymentStatusCardProps) => {
  const renderIcon = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="w-16 h-16 mx-auto mb-6">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        );
      case 'success':
        return (
          <div className="mb-6">
            <CheckCircle size={64} className="mx-auto text-green-500" weight="fill" />
          </div>
        );
      case 'error':
        return (
          <div className="mb-6">
            <XCircle size={64} className="mx-auto text-red-500" weight="fill" />
          </div>
        );
      case 'pending':
        return (
          <div className="mb-6">
            <WarningCircle size={64} className="mx-auto text-yellow-500" weight="fill" />
          </div>
        );
    }
  };

  const renderTitle = () => {
    switch (status) {
      case 'loading':
        return 'Verificando Pagamento...';
      case 'success':
        return 'Pagamento Confirmado!';
      case 'error':
        return 'Erro na Verificação';
      case 'pending':
        return 'Pagamento Pendente';
    }
  };

  const renderMessage = () => {
    switch (status) {
      case 'loading':
        if (retryCount > 0) {
          return `Tentando reconectar com o Stripe... (tentativa ${retryCount}/${maxRetries})`;
        }
        return 'Aguarde enquanto verificamos seu pagamento com o Stripe.';
      case 'success':
        return 'Seu pagamento foi processado com sucesso. Em breve você receberá a confirmação por e-mail.';
      case 'error':
        return `${message}${retryCount >= maxRetries ? ' Não foi possível verificar o pagamento após várias tentativas.' : ''}`;
      case 'pending':
        return 'Seu pagamento está sendo processado. Você receberá uma confirmação por e-mail assim que for aprovado.';
    }
  };

  return (
    <>
      {renderIcon()}
      
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        {renderTitle()}
      </h1>
      
      <p className="text-gray-600 mb-6">
        {renderMessage()}
      </p>

      {details && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          {details.plan_name && (
            <div className="mb-2">
              <p className="text-xs text-gray-500">Plano</p>
              <p className="text-sm font-medium text-gray-700">{details.plan_name}</p>
            </div>
          )}
          {details.amount_total !== undefined && (
            <div className="mb-2">
              <p className="text-xs text-gray-500">Valor</p>
              <p className="text-sm font-medium text-gray-700">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: details.currency?.toUpperCase() || 'BRL' 
                }).format(details.amount_total)}
              </p>
            </div>
          )}
          {sessionId && (
            <div>
              <p className="text-xs text-gray-500">ID da Sessão</p>
              <p className="text-xs font-mono text-gray-700 break-all">{sessionId}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

