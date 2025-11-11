'use client';

import { useEffect } from 'react';
import { useSubscriptionModal } from '../contexts/SubscriptionContext';
import { SubscriptionRequiredModal } from './SubscriptionRequiredModal';

export function SubscriptionModalHandler() {
  const { showSubscriptionModal, hideSubscriptionModal, isSubscriptionModalOpen } = useSubscriptionModal();

  useEffect(() => {
    const handleSubscriptionRequired = () => {
      showSubscriptionModal();
    };

    window.addEventListener('subscriptionRequired', handleSubscriptionRequired);

    return () => {
      window.removeEventListener('subscriptionRequired', handleSubscriptionRequired);
    };
  }, [showSubscriptionModal]);

  return (
    <SubscriptionRequiredModal
      isOpen={isSubscriptionModalOpen}
      onClose={hideSubscriptionModal}
    />
  );
}




