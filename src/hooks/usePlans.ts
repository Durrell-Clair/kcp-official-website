import { useState, useEffect } from 'react';
import { getPlans, getPlanByName, getPlanById, type PlanFromDB } from '@/services/plans.service';

export interface UsePlansReturn {
  plans: PlanFromDB[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function usePlans(): UsePlansReturn {
  const [plans, setPlans] = useState<PlanFromDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPlans = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPlans();
      setPlans(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch plans');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return {
    plans,
    isLoading,
    error,
    refetch: fetchPlans,
  };
}

export interface UsePlanReturn {
  plan: PlanFromDB | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function usePlan(planName: string | null): UsePlanReturn {
  const [plan, setPlan] = useState<PlanFromDB | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPlan = async () => {
    if (!planName) {
      setPlan(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getPlanByName(planName);
      setPlan(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch plan');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [planName]);

  return {
    plan,
    isLoading,
    error,
    refetch: fetchPlan,
  };
}

export function usePlanById(planId: string | null): UsePlanReturn {
  const [plan, setPlan] = useState<PlanFromDB | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPlan = async () => {
    if (!planId) {
      setPlan(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getPlanById(planId);
      setPlan(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch plan');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [planId]);

  return {
    plan,
    isLoading,
    error,
    refetch: fetchPlan,
  };
}
