import { useState, useCallback } from 'react';
import {
  createTranzakPaymentRequest,
  getTranzakPaymentStatus,
  type TranzakPaymentResponse,
  type TranzakPaymentStatus,
} from '@/services/tranzak.service';

export interface UseTranzakReturn {
  createPaymentRequest: (
    amount: number,
    currency?: string,
    description?: string,
    redirectUrl?: string,
    cancelUrl?: string,
    metadata?: Record<string, any>
  ) => Promise<TranzakPaymentResponse>;
  getPaymentStatus: (requestId: string) => Promise<TranzakPaymentStatus>;
  isLoading: boolean;
  error: Error | null;
}

export function useTranzak(): UseTranzakReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPaymentRequest = useCallback(
    async (
      amount: number,
      currency?: string,
      description?: string,
      redirectUrl?: string,
      cancelUrl?: string,
      metadata?: Record<string, any>
    ): Promise<TranzakPaymentResponse> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await createTranzakPaymentRequest(
          amount,
          currency,
          description,
          redirectUrl,
          cancelUrl,
          metadata
        );
        setIsLoading(false);
        return response;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create payment request');
        setError(error);
        setIsLoading(false);
        throw error;
      }
    },
    []
  );

  const getPaymentStatus = useCallback(async (requestId: string): Promise<TranzakPaymentStatus> => {
    setIsLoading(true);
    setError(null);
    try {
      const status = await getTranzakPaymentStatus(requestId);
      setIsLoading(false);
      return status;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get payment status');
      setError(error);
      setIsLoading(false);
      throw error;
    }
  }, []);

  return {
    createPaymentRequest,
    getPaymentStatus,
    isLoading,
    error,
  };
}
