import type { StandardPlan } from '@/components/result/plan.types';

export function readStoredSelectedPlans(): StandardPlan[] {
  if (typeof window === 'undefined') return [];

  try {
    const storedPlans = sessionStorage.getItem('journeySelectedPlans');
    if (storedPlans) return JSON.parse(storedPlans) as StandardPlan[];

    const storedPlan = sessionStorage.getItem('journeySelectedPlan');
    return storedPlan ? [JSON.parse(storedPlan) as StandardPlan] : [];
  } catch {
    return [];
  }
}

export function sumPlanPrices(plans: StandardPlan[], field: 'price' | 'annualPrice'): string {
  if (plans.length === 0) return '£0.00';

  const total = plans.reduce((sum, plan) => {
    const value = field === 'price' ? plan.price : (plan.annualPrice ?? plan.price);
    const amount = Number(value.replace(/[^\d.-]/g, ''));
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  return `£${total.toFixed(2)}`;
}
