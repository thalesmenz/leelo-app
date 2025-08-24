import toast from 'react-hot-toast';

export const showToast = {
  // Toast de sucesso
  success: (message: string) => {
    toast.success(message, {
      style: {
        background: '#10B981',
        color: '#fff',
        fontWeight: '500',
      },
    });
  },

  // Toast de erro
  error: (message: string) => {
    toast.error(message, {
      style: {
        background: '#EF4444',
        color: '#fff',
        fontWeight: '500',
      },
    });
  },

  // Toast de informação
  info: (message: string) => {
    toast(message, {
      style: {
        background: '#3B82F6',
        color: '#fff',
        fontWeight: '500',
      },
    });
  },

  // Toast de aviso
  warning: (message: string) => {
    toast(message, {
      style: {
        background: '#F59E0B',
        color: '#fff',
        fontWeight: '500',
      },
    });
  },

  // Toast de loading
  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        background: '#6B7280',
        color: '#fff',
        fontWeight: '500',
      },
    });
  },

  // Dismiss toast
  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },
};

/*
EXEMPLOS DE USO:

// Toast de sucesso
showToast.success('Dados salvos com sucesso!');

// Toast de erro
showToast.error('Erro ao salvar dados');

// Toast de informação
showToast.info('Carregando dados...');

// Toast de aviso
showToast.warning('Atenção: dados não salvos');

// Toast de loading com dismiss
const loadingToast = showToast.loading('Salvando...');
// ... fazer alguma operação
showToast.dismiss(loadingToast);
showToast.success('Salvo!');

// Com useFormSubmit (automático)
const { submit } = useFormSubmit({
  successMessage: 'Operação realizada com sucesso!',
  errorMessage: 'Erro na operação',
});
*/ 