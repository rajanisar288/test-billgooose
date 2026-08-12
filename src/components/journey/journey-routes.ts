export const JOURNEY_ROUTES = {
  1: '/steps/personal-details-form',
  2: '/steps/contract-date-form',
  3: '/steps/household-form',
  4: '/steps/payment-details-form',
} as const;

export type JourneyStep = keyof typeof JOURNEY_ROUTES;

export const TOTAL_JOURNEY_STEPS = 4;

export function getJourneyRoute(step: number): string {
  if (step <= 1) {
    return JOURNEY_ROUTES[1];
  }

  if (step >= TOTAL_JOURNEY_STEPS) {
    return JOURNEY_ROUTES[4];
  }

  return JOURNEY_ROUTES[step as JourneyStep];
}

export function getPreviousJourneyRoute(currentStep: number): string {
  if (currentStep <= 1) {
    return '/compare';
  }

  return getJourneyRoute(currentStep - 1);
}

export function getJourneyStepFromPathname(pathname: string): number {
  const normalizedPathname =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  switch (normalizedPathname) {
    case JOURNEY_ROUTES[2]:
      return 2;

    case JOURNEY_ROUTES[3]:
      return 3;

    case JOURNEY_ROUTES[4]:
      return 4;

    case JOURNEY_ROUTES[1]:
    default:
      return 1;
  }
}
