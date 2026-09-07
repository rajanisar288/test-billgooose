'use client';

import { useState } from 'react';

import CurrentUsageHeader, {
  type UsagePeriod,
} from '@/components/current-usage/current-usage-header';
import CurrentUsageSummary from '@/components/current-usage/current-usage-summary';
import EstimatedPayment from '@/components/current-usage/estimated-payment';
import ImportantNotice from '@/components/current-usage/important-notice';
import PreferencesPanel from '@/components/current-usage/preferences-panel';
import StatusBar from '@/components/current-usage/status-bar';
import UsageCard from '@/components/current-usage/usage-card';
import UsageFooter from '@/components/current-usage/usage-footer';
import data from '@/data/content.json';

export default function CurrentUsagePage() {
  const { currentUsage } = data;
  const energyUsage = localStorage.getItem('energyUsage')
    ? JSON.parse(localStorage.getItem('energyUsage') || '{}')
    : null;

  // Shared between the Monthly/Annual toggle in the header and every
  // component that renders a usage figure (summary + the two usage cards).
  const [period, setPeriod] = useState<UsagePeriod>(
    (currentUsage.header.periods.defaultValue as UsagePeriod) ?? 'annual',
  );

  // Each card only renders when the energyUsage response says that fuel is
  // available for this journey - no hardcoded assumption that a given card
  // is always shown.
  const visibleUsageCards = currentUsage.usageCards.filter((card) => {
    const isGas = card.title.toLowerCase().includes('gas');
    const fuel = isGas ? energyUsage?.gas : energyUsage?.electricity;

    return fuel?.isAvailable === true;
  });

  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-[94px]">
      <StatusBar />

      <div
        className="
          mx-auto w-full max-w-[1440px]
          px-4 pb-8 pt-6

          sm:px-6
          sm:pt-8

          lg:px-8
          lg:pb-10
          lg:pt-9
        "
      >
        <CurrentUsageHeader
          period={period}
          onPeriodChange={setPeriod}
        />

        <div
          className="
            mt-6 grid grid-cols-1 gap-6

            xl:grid-cols-[minmax(0,872px)_minmax(340px,408px)]
            xl:items-stretch
            xl:justify-between
          "
        >
          <div className="min-w-0">
            <CurrentUsageSummary period={period} />

            <div
              className="
                mt-6 grid grid-cols-1 gap-4

                md:grid-cols-2

                lg:grid-cols-[424px_424px]
                lg:gap-6
              "
            >
              {visibleUsageCards.map((card) => (
                <UsageCard
                  key={card.id}
                  period={period}
                  title={card.title}
                  address={card.address}
                  unit={card.unit}
                  price={card.price}
                  buttonLabel={card.buttonLabel}
                  icon={card.icon}
                  iconAlt={card.iconAlt}
                  borderColor={card.borderColor}
                />
              ))}
            </div>

            <EstimatedPayment />

            <ImportantNotice />
          </div>

          <PreferencesPanel />
        </div>
      </div>

      <UsageFooter period={period} />
    </main>
  );
}
