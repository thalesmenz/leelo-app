'use client';

import { SubscriptionProvider } from '../contexts/SubscriptionContext';
import { SubscriptionModalHandler } from './SubscriptionModalHandler';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SubscriptionProvider>
      {children}
      <SubscriptionModalHandler />
    </SubscriptionProvider>
  );
}




