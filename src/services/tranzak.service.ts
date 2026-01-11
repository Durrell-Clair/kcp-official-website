import {
  getTranzakApiUrl,
  getTranzakAppId,
  getTranzakAppKey,
  TRANZAK_CONFIG,
  type TranzakAuthResponse,
  type TranzakPaymentRequest,
  type TranzakPaymentResponse,
  type TranzakPaymentStatus,
} from '@/config/tranzak';

// Cache pour le token d'authentification
interface TokenCache {
  token: string;
  expiresAt: number; // timestamp en ms
}

let tokenCache: TokenCache | null = null;

/**
 * Obtient un token d'authentification Tranzak (avec cache)
 */
export async function getTranzakAuthToken(): Promise<string> {
  // Vérifier si le token cache est encore valide (utiliser 3/4 de expiresIn)
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }

  const apiUrl = getTranzakApiUrl();
  const appId = getTranzakAppId();
  const appKey = getTranzakAppKey();

  try {
    const response = await fetch(`${apiUrl}${TRANZAK_CONFIG.ENDPOINTS.AUTH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appId,
        appKey,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to authenticate with Tranzak' }));
      throw new Error(error.message || 'Failed to authenticate with Tranzak');
    }

    const data: TranzakAuthResponse = await response.json();
    
    // Cache le token (utiliser 3/4 de expiresIn avant renouvellement)
    const expiresInMs = data.expiresIn * 1000;
    const cacheDuration = expiresInMs * TRANZAK_CONFIG.TOKEN_CACHE_RATIO;
    
    tokenCache = {
      token: data.accessToken,
      expiresAt: Date.now() + cacheDuration,
    };

    return data.accessToken;
  } catch (error) {
    console.error('Tranzak authentication error:', error);
    throw error;
  }
}

/**
 * Crée une demande de paiement Tranzak
 */
export async function createTranzakPaymentRequest(
  amount: number,
  currency: string = TRANZAK_CONFIG.CURRENCY,
  description?: string,
  redirectUrl?: string,
  cancelUrl?: string,
  metadata?: Record<string, any>
): Promise<TranzakPaymentResponse> {
  const apiUrl = getTranzakApiUrl();
  const token = await getTranzakAuthToken();

  const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  
  const requestBody: TranzakPaymentRequest = {
    amount,
    currency,
    description: description || `Paiement KAMER KASH PME - ${amount} ${currency}`,
    redirectUrl: redirectUrl || `${appUrl}/payment/success`,
    cancelUrl: cancelUrl || `${appUrl}/payment/failure`,
    metadata,
  };

  try {
    const response = await fetch(`${apiUrl}${TRANZAK_CONFIG.ENDPOINTS.COLLECTIONS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create payment request' }));
      throw new Error(error.message || 'Failed to create payment request');
    }

    const data: TranzakPaymentResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Tranzak payment request error:', error);
    throw error;
  }
}

/**
 * Vérifie le statut d'une demande de paiement
 */
export async function getTranzakPaymentStatus(requestId: string): Promise<TranzakPaymentStatus> {
  const apiUrl = getTranzakApiUrl();
  const token = await getTranzakAuthToken();

  try {
    const response = await fetch(`${apiUrl}${TRANZAK_CONFIG.ENDPOINTS.COLLECTIONS}/${requestId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to get payment status' }));
      throw new Error(error.message || 'Failed to get payment status');
    }

    const data: TranzakPaymentStatus = await response.json();
    return data;
  } catch (error) {
    console.error('Tranzak payment status error:', error);
    throw error;
  }
}

/**
 * Réinitialise le cache du token (utile pour les tests ou en cas d'erreur)
 */
export function clearTranzakTokenCache(): void {
  tokenCache = null;
}
