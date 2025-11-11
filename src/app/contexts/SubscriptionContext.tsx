'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SubscriptionContextType {
  showSubscriptionModal: () => void;
  hideSubscriptionModal: () => void;
  isSubscriptionModalOpen: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const showSubscriptionModal = () => setIsOpen(true);
  const hideSubscriptionModal = () => setIsOpen(false);

  return (
    <SubscriptionContext.Provider
      value={{
        showSubscriptionModal,
        hideSubscriptionModal,
        isSubscriptionModalOpen: isOpen,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptionModal() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptionModal must be used within SubscriptionProvider');
  }
  return context;
}




