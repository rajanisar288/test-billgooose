'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

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
import {
  buildConsumptionPayload,
  type ConsumptionFormValues,
  type ConsumptionFuel,
} from '@/components/journey/modal/update-consumption-modal';
import data from '@/data/content.json';
import { useToast } from '@/hooks/useToast';
import { journeyApi } from '@/lib/api/endpoints/journey.api';
import { useJourneyStore } from '@/store/journeyStore';
import { getCurrentRelativeUrl } from '@/utils/helper';

type EnergyUsage = {
  gas?: { isAvailable?: boolean; annualConsumptionKwh?: number };
  electricity?: { isAvailable?: boolean; annualConsumptionKwh?: number };
  [key: string]: unknown;
};

export default function CurrentUsagePage() {
  const { currentUsage } = data;
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const { journey, setJourney } = useJourneyStore();
  const [energyUsage, setEnergyUsage] = useState<EnergyUsage | null>(null);
  const [editedConsumption, setEditedConsumption] = useState<
    Partial<Record<ConsumptionFuel, ConsumptionFormValues>>
  >({});
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    const storedUsage = localStorage.getItem('energyUsage');

    if (storedUsage) {
      try {
        // Hydrate browser-only usage data after the client mounts.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEnergyUsage(JSON.parse(storedUsage) as EnergyUsage);
      } catch {
        setEnergyUsage(null);
      }
    }
  }, []);

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

  const handleConsumptionSubmit = (fuel: ConsumptionFuel, values: ConsumptionFormValues) => {
    setEditedConsumption((current) => ({ ...current, [fuel]: values }));

    if (values.knowsMeterNumber || !values.knowsUsage) {
      return;
    }

    const annualConsumptionKwh = Number(values.usage) * (values.usagePeriod === 'monthly' ? 12 : 1);

    setEnergyUsage((current) => {
      if (!current) {
        return current;
      }

      const currentFuel = current[fuel] as Record<string, unknown> | undefined;

      return {
        ...current,
        [fuel]: {
          ...currentFuel,
          annualConsumptionKwh,
        },
      };
    });
  };

  const handleCompare = async () => {
    if (isComparing) {
      return;
    }

    const journeyId = journey?.id || journey?.journeyId || journey?.uuid;

    if (!journeyId) {
      showError('Journey ID is required. Please try again.');
      return;
    }

    setIsComparing(true);

    try {
      const consumption = Object.entries(editedConsumption).reduce<Record<string, unknown>>(
        (current, [fuel, values]) => {
          if (values) {
            Object.assign(
              current,
              buildConsumptionPayload(journeyId, fuel as ConsumptionFuel, values).consumption,
            );
          }

          return current;
        },
        {},
      );
      const journeyPayload = { ...(journey || {}) };

      delete journeyPayload.consumption;

      const updatedJourney = await journeyApi.createJourney({
        // ...journeyPayload,
        journeyId,
        uuid: journeyId,
        lastUrl: getCurrentRelativeUrl(),
        ...(Object.keys(consumption).length > 0 ? { consumption } : {}),
      });

      if (updatedJourney?.data) {
        setJourney(updatedJourney.data);
        if (Object.keys(consumption).length > 0) {
          showSuccess('Consumption details updated successfully.');
        }
      } else {
        showError('We could not update your consumption details. Please try again.');
        return;
      }

      localStorage.setItem('energyUsage', JSON.stringify(energyUsage || {}));
      router.push(`/result?service=${journey?.serviceType || 'energy'}`);
    } catch (error: any) {
      showError(error?.message);
    } finally {
      setIsComparing(false);
    }
  };

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
            <CurrentUsageSummary
              period={period}
              energyUsage={energyUsage}
              onCompare={handleCompare}
              isComparing={isComparing}
              onConsumptionSubmit={handleConsumptionSubmit}
            />

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
                  buttonLabel={card.buttonLabel}
                  icon={card.icon}
                  iconAlt={card.iconAlt}
                  borderColor={card.borderColor}
                  energyUsage={energyUsage}
                  onConsumptionSubmit={handleConsumptionSubmit}
                />
              ))}
            </div>

            <EstimatedPayment />

            <ImportantNotice />
          </div>

          <PreferencesPanel />
        </div>
      </div>

      <UsageFooter
        period={period}
        energyUsage={energyUsage}
        onCompare={handleCompare}
        isComparing={isComparing}
      />
    </main>
  );
}
