// Configuration Tranzak API
export const TRANZAK_CONFIG = {
  // URLs API
  SANDBOX_URL: 'https://sandbox.dsapi.tranzak.me',
  PRODUCTION_URL: 'https://dsapi.tranzak.me',
  
  // Endpoints
  ENDPOINTS: {
    AUTH: '/v1/auth/token',
    COLLECTIONS: '/v1/requests/collections',
  },
  
  // Devise
  CURRENCY: 'XAF' as const,
  
  // Timeout payment request (15 minutes selon doc)
  PAYMENT_TIMEOUT_MS: 15 * 60 * 1000,
  
  // Token cache (utiliser 3/4 de expiresIn avant renouvellement)
  TOKEN_CACHE_RATIO: 0.75,
};

export const getTranzakApiUrl = (): string => {
  const env = import.meta.env.VITE_TRANZAK_API_URL || TRANZAK_CONFIG.SANDBOX_URL;
  return env;
};

export const getTranzakAppId = (): string => {
  const appId = import.meta.env.VITE_TRANZAK_APP_ID;
  if (!appId) {
    throw new Error('VITE_TRANZAK_APP_ID is not set');
  }
  return appId;
};

export const getTranzakAppKey = (): string => {
  const appKey = import.meta.env.VITE_TRANZAK_APP_KEY;
  if (!appKey) {
    throw new Error('VITE_TRANZAK_APP_KEY is not set');
  }
  return appKey;
};

export const getTranzakWebhookSecret = (): string => {
  const secret = import.meta.env.VITE_TRANZAK_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('VITE_TRANZAK_WEBHOOK_SECRET is not set');
  }
  return secret;
};

// Types pour les réponses Tranzak
export interface TranzakAuthResponse {
  accessToken: string;
  expiresIn: number; // en secondes
}

export interface TranzakPaymentRequest {
  amount: number;
  currency: string;
  description?: string;
  redirectUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, any>;
}

export interface TranzakPaymentResponse {
  requestId: string;
  paymentUrl: string;
  qrCode?: string;
}

export interface TranzakPaymentStatus {
  requestId: string;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED';
  transactionId?: string;
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  metadata?: Record<string, any>;
}

export interface TranzakWebhookPayload {
  event: 'SUCCESSFUL' | 'FAILED';
  requestId: string;
  transactionId?: string;
  status: string;
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  metadata?: Record<string, any>;
}
