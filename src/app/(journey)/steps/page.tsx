import { redirect } from 'next/navigation';

import { JOURNEY_ROUTES } from '@/components/journey/journey-routes';

export default function StepsPage() {
  redirect(JOURNEY_ROUTES[1]);
}
