import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getPaymentById,
  getPaymentByTranzakRequestId,
  getPaymentsByUserId,
  type Payment,
} from '@/services/payment.service';

export interface UsePaymentReturn {
  payment: Payment | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function usePayment(paymentId: string | null): UsePaymentReturn {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPayment = async () => {
    if (!paymentId) {
      setPayment(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getPaymentById(paymentId);
      setPayment(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch payment');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayment();
  }, [paymentId]);

  return {
    payment,
    isLoading,
    error,
    refetch: fetchPayment,
  };
}

export function usePaymentByRequestId(requestId: string | null): UsePaymentReturn {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPayment = async () => {
    if (!requestId) {
      setPayment(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getPaymentByTranzakRequestId(requestId);
      setPayment(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch payment');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayment();
  }, [requestId]);

  return {
    payment,
    isLoading,
    error,
    refetch: fetchPayment,
  };
}

export interface UseUserPaymentsReturn {
  payments: Payment[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useUserPayments(): UseUserPaymentsReturn {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPayments = async () => {
    if (!user) {
      setPayments([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getPaymentsByUserId(user.id);
      setPayments(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch payments');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user]);

  return {
    payments,
    isLoading,
    error,
    refetch: fetchPayments,
  };
}
