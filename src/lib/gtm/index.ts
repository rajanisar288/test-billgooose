import { config } from '@/config';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export interface PageViewParams {
  page_path: string;
  page_title?: string;
  page_location?: string;
  [key: string]: unknown;
}

export interface JourneyStepParams {
  currentStep: number;
  totalSteps: number;
  service: string;
  journeyId?: string;
  [key: string]: unknown;
}

export interface QuoteResultsParams {
  service: string;
  count?: number;
  journeyId?: string;
  [key: string]: unknown;
}

export interface SelectPlanParams {
  planName: string;
  provider: string;
  service: string;
  price?: number | string;
  planId?: string;
  [key: string]: unknown;
}

export interface SwitchCompleteParams {
  orderId?: string;
  serviceType?: string;
  journeyId?: string;
  isBundle?: boolean;
  [key: string]: unknown;
}

/**
 * Returns the configured GTM container ID.
 */
export function getGtmId(): string {
  return config.gtm.id || process.env.NEXT_PUBLIC_GTM_ID || '';
}

/**
 * Checks if GTM is enabled and running in the browser.
 */
export function isGtmEnabled(): boolean {
  return typeof window !== 'undefined' && Boolean(getGtmId());
}

/**
 * Pushes raw event data into the global dataLayer array safely.
 */
export function pushToDataLayer(payload: Record<string, unknown>): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

/**
 * Tracks a page view event (used for initial load and SPA client-side route transitions).
 */
export function trackPageView({
  page_path,
  page_title,
  page_location,
  ...rest
}: PageViewParams): void {
  pushToDataLayer({
    event: 'page_view',
    page_path,
    page_title: page_title ?? (typeof document !== 'undefined' ? document.title : ''),
    page_location: page_location ?? (typeof window !== 'undefined' ? window.location.href : ''),
    ...rest,
  });
}

/**
 * Generic custom event dispatcher for GTM.
 */
export function trackCustomEvent(eventName: string, params: Record<string, unknown> = {}): void {
  pushToDataLayer({
    event: eventName,
    ...params,
  });
}

/**
 * Tracks progression through multi-step qualification forms.
 */
export function trackJourneyStep(params: JourneyStepParams): void {
  const { currentStep, totalSteps, service, journeyId, ...rest } = params;
  pushToDataLayer({
    event: 'journey_step',
    step_number: currentStep,
    total_steps: totalSteps,
    service_type: service,
    journey_id: journeyId,
    ...rest,
  });
}

/**
 * Tracks quote comparison results being rendered.
 */
export function trackQuoteResults(params: QuoteResultsParams): void {
  const { service, count, journeyId, ...rest } = params;
  pushToDataLayer({
    event: 'view_quote_results',
    service_type: service,
    quote_count: count,
    journey_id: journeyId,
    ...rest,
  });
}

/**
 * Tracks user selecting or inspecting a comparison plan.
 */
export function trackSelectPlan(params: SelectPlanParams): void {
  const { planName, provider, service, price, planId, ...rest } = params;
  pushToDataLayer({
    event: 'select_plan',
    plan_name: planName,
    provider,
    service_type: service,
    price,
    plan_id: planId,
    ...rest,
  });
}

/**
 * Tracks the final switch / payment completion.
 */
export function trackSwitchComplete(params: SwitchCompleteParams): void {
  const { orderId, serviceType, journeyId, isBundle, ...rest } = params;
  pushToDataLayer({
    event: 'switch_complete',
    order_id: orderId,
    service_type: serviceType,
    journey_id: journeyId,
    is_bundle: isBundle,
    ...rest,
  });
}
