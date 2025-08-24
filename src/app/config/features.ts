// Arquivo de configuração de funcionalidades
// Para desabilitar uma funcionalidade, simplesmente mude para false

export const FEATURES = {
  // Visão consolidada do módulo financeiro
  // true = usuários podem ver dados de todos os subusuários
  // false = usuários veem apenas seus próprios dados
  FINANCE_CONSOLIDATED_VIEW: true,
  
  // Módulo de fisioterapeutas
  // true = apenas usuários principais podem acessar
  // false = todos os usuários podem acessar
  SUBUSERS_RESTRICTED_ACCESS: true,
  
  // Outras funcionalidades podem ser adicionadas aqui
  // EXEMPLO: FEATURE_NAME: true,
};

// Função helper para verificar se uma funcionalidade está ativa
export const isFeatureEnabled = (featureName: keyof typeof FEATURES): boolean => {
  return FEATURES[featureName] === true;
};

// Função para obter todas as funcionalidades ativas
export const getActiveFeatures = () => {
  return Object.entries(FEATURES)
    .filter(([_, enabled]) => enabled)
    .map(([name]) => name);
};



