export const JOURNEY_ROUTES = {
  1: '/steps/personal-details-form',
  2: '/steps/contract-date-form',
  3: '/steps/household-form',
  4: '/steps/electric-vehicle-form',
  5: '/steps/payment-details-form',
} as const;

export const BROADBAND_JOURNEY_ROUTES = {
  1: '/steps/personal-details-form',
  2: '/steps/contract-date-form',
  3: '/steps/household-form',
  4: '/steps/payment-details-form',
} as const;

export const INSURANCE_JOURNEY_ROUTES = {
  1: '/steps/personal-details-form',
  2: '/steps/policy-details',
  3: '/steps/house-details',
} as const;

export type JourneyService = 'energy' | 'broadband' | 'insurance' | 'bundle-bills';
export type JourneyFlow = 'energy' | 'broadband' | 'bundle' | 'insurance';

export const ENERGY_TOTAL_JOURNEY_STEPS = 4;
export const BUNDLE_TOTAL_JOURNEY_STEPS = 5;
export const BROADBAND_TOTAL_JOURNEY_STEPS = 4;
export const INSURANCE_TOTAL_JOURNEY_STEPS = 3;

/* =========================================================
   GET TOTAL STEPS
========================================================= */

export function getTotalJourneySteps(service: JourneyService = 'energy', flow?: string): number {
  if (flow === 'bundle' || service === 'bundle-bills') {
    return BUNDLE_TOTAL_JOURNEY_STEPS;
  }

  if (service === 'insurance') {
    return INSURANCE_TOTAL_JOURNEY_STEPS;
  }

  if (service === 'broadband') {
    return BROADBAND_TOTAL_JOURNEY_STEPS;
  }

  return ENERGY_TOTAL_JOURNEY_STEPS;
}

/* =========================================================
   GET ROUTE
========================================================= */

export function getJourneyRoute(
  step: number,
  service: JourneyService = 'energy',
  flow?: string,
): string {
  const isBundle = flow === 'bundle' || service === 'bundle-bills';

  if (service === 'insurance') {
    const baseRoute =
      step <= 1
        ? INSURANCE_JOURNEY_ROUTES[1]
        : step === 2
          ? INSURANCE_JOURNEY_ROUTES[2]
          : step == 3
            ? INSURANCE_JOURNEY_ROUTES[3]
            : '/result';
    return `${baseRoute}?service=insurance`;
  }

  if (service === 'broadband') {
    if (step <= 1) {
      return `${BROADBAND_JOURNEY_ROUTES[1]}?service=broadband`;
    }
    if (step >= BROADBAND_TOTAL_JOURNEY_STEPS) {
      return `${BROADBAND_JOURNEY_ROUTES[4]}?service=broadband`;
    }
    return `${BROADBAND_JOURNEY_ROUTES[step as keyof typeof BROADBAND_JOURNEY_ROUTES]}?service=broadband`;
  }

  const queryParams = isBundle ? '?service=energy&flow=bundle' : '?service=energy';

  if (step <= 1) {
    return `${JOURNEY_ROUTES[1]}${queryParams}`;
  }

  const maxStep = isBundle ? BUNDLE_TOTAL_JOURNEY_STEPS : ENERGY_TOTAL_JOURNEY_STEPS;
  if (step >= maxStep) {
    return isBundle ? `${JOURNEY_ROUTES[5]}${queryParams}` : `${JOURNEY_ROUTES[4]}${queryParams}`;
  }

  return `${JOURNEY_ROUTES[step as keyof typeof JOURNEY_ROUTES]}${queryParams}`;
}

/* =========================================================
   PREVIOUS ROUTE
========================================================= */

export function getPreviousJourneyRoute(
  currentStep: number,
  service: JourneyService = 'energy',
  flow?: string,
): string {
  const isBundle = flow === 'bundle' || service === 'bundle-bills';

  if (currentStep <= 1) {
    if (isBundle) {
      return '/compare?service=energy&flow=bundle';
    }
    return `/compare?service=${service}`;
  }

  return getJourneyRoute(currentStep - 1, service, flow);
}

/* =========================================================
   NEXT ROUTE
========================================================= */

export function getNextJourneyRoute(
  currentStep: number,
  service: JourneyService = 'energy',
  flow?: string,
): string {
  return getJourneyRoute(currentStep + 1, service, flow);
}

/* =========================================================
   GET STEP FROM PATHNAME
========================================================= */

export function getJourneyStepFromPathname(
  pathname: string,
  service: JourneyService = 'energy',
  flow?: string,
): number {
  const normalizedPathname =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  if (service === 'insurance') {
    switch (normalizedPathname) {
      case INSURANCE_JOURNEY_ROUTES[2]:
        return 2;
      case INSURANCE_JOURNEY_ROUTES[3]:
        return 3;
      case INSURANCE_JOURNEY_ROUTES[1]:
      default:
        return 1;
    }
  }

  if (service === 'broadband') {
    switch (normalizedPathname) {
      case INSURANCE_JOURNEY_ROUTES[2]:
        return 2;
      case BROADBAND_JOURNEY_ROUTES[3]:
        return 3;
      case BROADBAND_JOURNEY_ROUTES[4]:
        return 4;
      case BROADBAND_JOURNEY_ROUTES[1]:
      default:
        return 1;
    }
  }

  switch (normalizedPathname) {
    case JOURNEY_ROUTES[2]:
      return 2;
    case JOURNEY_ROUTES[3]:
      return 3;
    case JOURNEY_ROUTES[4]:
      return 4;
    case JOURNEY_ROUTES[5]:
      return 5;
    case JOURNEY_ROUTES[1]:
    default:
      return 1;
  }
}
