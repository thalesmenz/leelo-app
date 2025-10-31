import api from '../config/axios';

export const stripeService = {
  async createCheckoutSession(data: {
    user_id: string;
    plan_name: string;
    price_id?: string; // Price ID da Stripe
    amount?: number; // Se não tiver price_id
    patient_plan_id?: string;
    billing_period?: 'monthly' | 'yearly';
    success_url?: string;
    cancel_url?: string;
  }) {
    const response = await api.post('/stripe/checkout-session', data);
    return response.data;
  },
};
