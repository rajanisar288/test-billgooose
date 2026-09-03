export const JOURNEY_ROUTES = {
  1: '/steps/personal-details-form',
  2: '/steps/contract-date-form',
  3: '/steps/household-form',
  4: '/steps/electric-vehicle-form',
  5: '/steps/payment-details-form',
} as const;

// export const BROADBAND_JOURNEY_ROUTES = {
//   1: '/steps/personal-details-form',
//   2: '/steps/contract-date-form',
//   3: '/steps/household-form',
//   4: '/steps/payment-details-form',
// } as const;

export const INSURANCE_JOURNEY_ROUTES = {
  1: '/steps/personal-details-form',
  2: '/steps/policy-details',
  3: '/steps/house-details',
} as const;

export type JourneyService = 'energy' | 'broadband' | 'insurance';

export const ENERGY_TOTAL_JOURNEY_STEPS = 5;
export const BROADBAND_TOTAL_JOURNEY_STEPS = 4;
export const INSURANCE_TOTAL_JOURNEY_STEPS = 3;

/* =========================================================
   GET TOTAL STEPS
========================================================= */

export function getTotalJourneySteps(service: JourneyService): number {
  if (service === 'insurance') {
    return INSURANCE_TOTAL_JOURNEY_STEPS;
  }

  return service === 'broadband' ? BROADBAND_TOTAL_JOURNEY_STEPS : ENERGY_TOTAL_JOURNEY_STEPS;
}

/* =========================================================
   GET ROUTE
========================================================= */

export function getJourneyRoute(step: number, service: JourneyService = 'energy'): string {
  if (service === 'insurance') {
    if (step <= 1) {
      return INSURANCE_JOURNEY_ROUTES[1];
    }

    if (step >= INSURANCE_TOTAL_JOURNEY_STEPS) {
      return INSURANCE_JOURNEY_ROUTES[3];
    }

    return INSURANCE_JOURNEY_ROUTES[step as keyof typeof INSURANCE_JOURNEY_ROUTES];
  }

  // if (service === 'broadband') {
  //   if (step <= 1) {
  //     return BROADBAND_JOURNEY_ROUTES[1];
  //   }

  //   if (step >= BROADBAND_TOTAL_JOURNEY_STEPS) {
  //     return BROADBAND_JOURNEY_ROUTES[4];
  //   }

  //   return BROADBAND_JOURNEY_ROUTES[step as keyof typeof BROADBAND_JOURNEY_ROUTES];
  // }

  if (step <= 1) {
    return JOURNEY_ROUTES[1];
  }

  if (step >= ENERGY_TOTAL_JOURNEY_STEPS) {
    return JOURNEY_ROUTES[5];
  }

  return JOURNEY_ROUTES[step as keyof typeof JOURNEY_ROUTES];
}

/* =========================================================
   PREVIOUS ROUTE
========================================================= */

export function getPreviousJourneyRoute(
  currentStep: number,
  service: JourneyService = 'energy',
): string {
  if (currentStep <= 1) {
    return `/compare?service=${service}`;
  }

  return getJourneyRoute(currentStep - 1, service);
}

/* =========================================================
   NEXT ROUTE
========================================================= */

export function getNextJourneyRoute(
  currentStep: number,
  service: JourneyService = 'energy',
): string {
  return getJourneyRoute(currentStep + 1, service);
}

/* =========================================================
   GET STEP FROM PATHNAME
========================================================= */

export function getJourneyStepFromPathname(
  pathname: string,
  service: JourneyService = 'energy',
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

  // if (service === 'broadband') {
  //   switch (normalizedPathname) {
  //     case BROADBAND_JOURNEY_ROUTES[2]:
  //       return 2;

  //     case BROADBAND_JOURNEY_ROUTES[3]:
  //       return 3;

  //     case BROADBAND_JOURNEY_ROUTES[4]:
  //       return 4;

  //     case BROADBAND_JOURNEY_ROUTES[1]:
  //     default:
  //       return 1;
  //   }
  // }

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
