import api from '../config/axios';

// Types
export interface CreateCheckoutSessionRequest {
  plan_name: string;
  price_id?: string;
  amount?: number;
  billing_period?: 'monthly' | 'yearly';
  success_url?: string;
  cancel_url?: string;
}

export interface CreateCheckoutSessionResponse {
  success: boolean;
  message: string;
  data?: {
    url: string;
  };
}

export interface VerifyCheckoutSessionResponse {
  success: boolean;
  message?: string;
  data?: {
    status?: string;
    payment_status?: string;
    amount_total?: number;
    currency?: string;
    customer_email?: string;
    plan_name?: string;
    subscription_id?: string;
  };
}

export const stripeService = {
  async createCheckoutSession(
    data: CreateCheckoutSessionRequest
  ): Promise<CreateCheckoutSessionResponse> {
    const response = await api.post<CreateCheckoutSessionResponse>(
      '/stripe/checkout-session',
      data
    );
    return response.data;
  },

  async verifyCheckoutSession(
    sessionId: string
  ): Promise<VerifyCheckoutSessionResponse> {
    const response = await api.get<VerifyCheckoutSessionResponse>(
      `/stripe/checkout-session/${sessionId}`
    );
    return response.data;
  },

  async getSubscription(): Promise<{
    success: boolean;
    data?: any;
    message?: string;
  }> {
    const response = await api.get('/stripe/subscription');
    return response.data;
  },

  async cancelSubscription(): Promise<{
    success: boolean;
    data?: { cancel_at_period_end: boolean };
    message?: string;
  }> {
    const response = await api.post('/stripe/subscription/cancel');
    return response.data;
  },
};
