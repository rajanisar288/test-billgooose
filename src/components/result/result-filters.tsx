'use client';

import { useSyncExternalStore } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

type CompareService = 'energy' | 'broadband';

type CompareFlowDetails = {
  service?: CompareService;

  postcode?: string;
  address?: string;

  serviceType?: string;
  paymentMethod?: string;

  currentProvider?: string;
  stillInContract?: string;
};

const BROADBAND_TEMPORARY_PRICE = '£25.90/month';

const WARNING_ICON = '/images/info-circle.png';

/* =========================================================
   STORAGE
========================================================= */

function getCompareFlowSnapshot(): string {
  try {
    return sessionStorage.getItem('compareFlowDetails') ?? '';
  } catch {
    return '';
  }
}

function getCompareFlowServerSnapshot(): string {
  return '';
}

function subscribeToCompareFlow(callback: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === 'compareFlowDetails') {
      callback();
    }
  };

  window.addEventListener('storage', handleStorage);

  window.addEventListener('billgoose-compare-flow-changed', callback);

  return () => {
    window.removeEventListener('storage', handleStorage);

    window.removeEventListener('billgoose-compare-flow-changed', callback);
  };
}

/* =========================================================
   LABEL HELPERS
========================================================= */

function getEnergyServiceLabel(value?: string): string {
  switch (value) {
    case 'electricity-only':
      return 'Electricity only';

    case 'dual-fuel':
      return 'Gas & Electricity (Dual Fuel)';

    default:
      return value || 'Gas & Electricity (Dual Fuel)';
  }
}

function getPaymentMethodLabel(value?: string): string {
  switch (value) {
    case 'monthly-direct-debit':
      return 'Monthly Direct Debit';

    case 'prepayment':
      return 'Pre Payment';

    default:
      return value || 'Pre Payment';
  }
}

function getProviderLabel(value?: string): string {
  if (!value) {
    return 'Not selected';
  }

  const labels: Record<string, string> = {
    bt: 'BT',
    sky: 'Sky',
    'virgin-media': 'Virgin Media',
    talktalk: 'TalkTalk',
    plusnet: 'Plusnet',
    vodafone: 'Vodafone',
    other: 'Other',
  };

  return labels[value] ?? value;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ResultFilters() {
  const router = useRouter();

  const snapshot = useSyncExternalStore(
    subscribeToCompareFlow,
    getCompareFlowSnapshot,
    getCompareFlowServerSnapshot,
  );

  let details: CompareFlowDetails = {
    service: 'energy',
  };

  if (snapshot) {
    try {
      details = JSON.parse(snapshot) as CompareFlowDetails;
    } catch {
      details = {
        service: 'energy',
      };
    }
  }

  const service: CompareService = details.service === 'broadband' ? 'broadband' : 'energy';

  const isBroadband = service === 'broadband';

  const address = details.address || '19 Masons Way, Wallyford, Musselburgh EH21 8BF';

  const handleEdit = () => {
    router.push(`/compare?service=${service}`);
  };

  return (
    <section
      className="
        relative
        z-20

        mx-auto

        hidden
        w-[calc(100%-80px)]
        max-w-[1390px]

        lg:-mt-[52px]
        lg:mb-[50px]
        lg:block

        xl:-mt-[66px]
        xl:mb-[50px]
        xl:w-[calc(100%-80px)]
      "
    >
      <div
        className="
          overflow-hidden

          rounded-[16px]

          border
          border-[#EAECF0]

          bg-white

          p-4

          shadow-[0px_6px_18px_rgba(16,24,40,0.08)]

          xl:rounded-[18px]
          xl:p-5
        "
      >
        {/* =====================================================
            DETAILS CARDS
        ====================================================== */}
        <div
          className="
            grid
            grid-cols-3

            gap-3

            xl:gap-4
          "
        >
          {/* ADDRESS */}
          <ResultInformationCard
            title="Your address"
            value={address}
            onEdit={handleEdit}
          />

          {/* ENERGY / BROADBAND */}
          {isBroadband ? (
            <ResultInformationCard
              title="Current provider"
              value={getProviderLabel(details.currentProvider)}
              onEdit={handleEdit}
            />
          ) : (
            <ResultInformationCard
              title="Selected service"
              value={getEnergyServiceLabel(details.serviceType)}
              onEdit={handleEdit}
            />
          )}

          {/* PAYMENT / PRICE */}
          {isBroadband ? (
            <ResultInformationCard
              title="Current package"
              value={BROADBAND_TEMPORARY_PRICE}
              onEdit={handleEdit}
            />
          ) : (
            <ResultInformationCard
              title="Payment method"
              value={getPaymentMethodLabel(details.paymentMethod)}
              onEdit={handleEdit}
            />
          )}
        </div>

        {/* =====================================================
            WARNING
        ====================================================== */}
        <div
          className="
            mt-4

            flex
            min-h-[52px]

            items-start

            gap-2.5

            rounded-[10px]

            border
            border-[#FEC84B]

            bg-[#FFFAEB]

            px-4
            py-3
          "
        >
          {/* WARNING ICON */}
          <Image
            src={WARNING_ICON}
            alt=""
            width={18}
            height={18}
            aria-hidden="true"
            className="
              mt-[1px]

              h-[18px]
              w-[18px]
              shrink-0

              object-contain
            "
          />

          <p
            className="
              min-w-0

              font-inter
              text-[12px]
              font-normal
              leading-[18px]

              text-[#B54708]

              xl:text-[13px]
              xl:leading-5
            "
          >
            {isBroadband ? (
              <>
                From 1 October 2026, the energy price cap will rise by 4% for a typical Direct Debit
                household. The temporary removal of VAT on electricity until 31 March 2027 is
                reflected in this increase. See if switching could help you save even more.
              </>
            ) : (
              <>
                From 1 October 2026, the energy price cap will rise by 4% for a typical Direct Debit
                household. The temporary removal of VAT on electricity until 31 March 2027 is
                reflected in this increase. See if switching could help you save even more.{' '}
                <button
                  type="button"
                  className="
                    inline

                    font-inter
                    font-extrabold

                    text-[#B54708]

                    underline
                    decoration-solid
                    underline-offset-2
                  "
                >
                  Learn more
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   INFORMATION CARD
========================================================= */

type ResultInformationCardProps = {
  title: string;
  value: string;
  onEdit: () => void;
};

function ResultInformationCard({ title, value, onEdit }: ResultInformationCardProps) {
  return (
    <article
      className="
        flex
        min-h-[92px]

        items-start
        justify-between

        gap-4

        rounded-[10px]

        border
        border-[#EAECF0]

        bg-[#FCFCFD]

        px-4
        py-3

        xl:min-h-[96px]
        xl:px-5
        xl:py-4
      "
    >
      {/* =====================================================
          TEXT
      ====================================================== */}
      <div className="min-w-0 flex-1">
        <p
          className="
            font-inter

            text-[12px]
            font-semibold
            leading-[18px]
            tracking-[0]

            text-[#101828]

            xl:text-[13px]
            xl:leading-5
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1

            line-clamp-2

            font-inter

            text-[13px]
            font-normal
            leading-5
            tracking-[0]

            text-[#475467]

            xl:text-[14px]
            xl:leading-[22px]
          "
        >
          {value}
        </p>
      </div>

      {/* =====================================================
          EDIT
      ====================================================== */}
      <button
        type="button"
        onClick={onEdit}
        className="
          shrink-0

          font-inter

          text-[12px]
          font-semibold
          leading-[18px]
          tracking-[0]

          text-[#00897B]

          transition-colors

          hover:text-[#00796D]

          xl:text-[13px]
          xl:leading-5
        "
      >
        Edit
      </button>
    </article>
  );
}
