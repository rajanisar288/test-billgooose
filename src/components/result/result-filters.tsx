'use client';

import { useMemo, useSyncExternalStore } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import data from '@/data/content.json';

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

type CompareServiceItem = {
  id: string;
  label: string;
  icon: string;
  alt: string;
};

const BROADBAND_TEMPORARY_PRICE = '£25.90/month';

const WARNING_ICON = '/images/info-circle.png';

const SAVING_ICON = '/images/percentage-icon.png';

const BUNDLE_ICON = '/images/bundle-icon.png';

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
   SIM ONLY HELPERS
========================================================= */

function getServiceLabel(id: string, alt: string): string {
  const value = `${id} ${alt}`.toLowerCase();

  if (value.includes('broadband')) {
    return 'Broadband';
  }

  if (value.includes('mobile')) {
    return 'Mobile';
  }

  if (value.includes('insurance') || value.includes('shield')) {
    return 'Insurance';
  }

  if (value.includes('credit') || value.includes('card')) {
    return 'Credit Cards';
  }

  if (value.includes('energy') || value.includes('electric')) {
    return 'Energy';
  }

  return alt;
}

function getServiceHref(label: string): string {
  switch (label) {
    case 'Broadband':
      return '/compare?service=broadband';

    case 'Mobile':
      return '/compare?service=mobile';

    case 'Insurance':
      return '/compare?service=insurance';

    case 'Credit Cards':
      return '/compare?service=credit-cards';

    case 'Energy':
      return '/compare?service=energy';

    default:
      return '/compare';
  }
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ResultFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestedService = searchParams.get('service');

  const isSimOnly = requestedService === 'sim-only';

  const isMobile = requestedService === 'mobile';

  const showSimpleResultBar = isSimOnly || isMobile;

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

  // const address = details.address || '19 Masons Way, Wallyford, Musselburgh EH21 8BF';
  const address =
    typeof details.address === 'string'
      ? details.address
      : '19 Masons Way, Wallyford, Musselburgh EH21 8BF';

  const handleEdit = () => {
    router.push(`/compare?service=${service}`);
  };

  /* =========================================================
     SIM ONLY ALSO COMPARE SERVICES
  ========================================================= */

  const simOnlyCompareServices = useMemo<CompareServiceItem[]>(() => {
    const services = data.resultPage.hero.services.map((serviceItem) => ({
      id: serviceItem.id,

      label: getServiceLabel(serviceItem.id, serviceItem.alt),

      icon: serviceItem.icon,

      alt: serviceItem.alt,
    }));

    return services.filter((serviceItem) =>
      ['Broadband', 'Mobile', 'Insurance', 'Credit Cards'].includes(serviceItem.label),
    );
  }, []);

  return (
    <section
      className="
        relative
        z-20

        mx-auto

        w-full
        max-w-[1390px]

        px-4

        pb-3
        pt-4

        min-[390px]:px-5

        sm:px-6
        sm:pb-4
        sm:pt-5

        md:px-8
        md:pb-5
        md:pt-6

        lg:-mt-[52px]
        lg:mb-[50px]
        lg:px-0
        lg:pb-0
        lg:pt-0
        lg:w-[calc(100%-80px)]

        xl:-mt-[66px]
        xl:mb-[50px]
      "
    >
      {/* =====================================================
          SIM ONLY

          Same container across every breakpoint.
      ====================================================== */}
      {showSimpleResultBar ? (
        <div
          className="
            w-full

            overflow-hidden

            rounded-[14px]

            border
            border-[#EAECF0]

            bg-white

            shadow-[0px_6px_18px_rgba(16,24,40,0.08)]

            sm:rounded-[16px]

            xl:rounded-[18px]
          "
        >
          {/* =================================================
              SAVING ROW
          ================================================== */}
          <div
            className="
              flex
              min-h-[38px]
              w-full

              items-center

              border-b
              border-[#ABEFC6]

              bg-[#F6FEF9]

              px-3
              py-2

              sm:min-h-[42px]
              sm:px-4

              lg:min-h-[45px]

              xl:px-5
            "
          >
            <div
              className="
                flex
                min-w-0

                items-start

                gap-1.5

                sm:items-center
              "
            >
              <Image
                src={SAVING_ICON}
                alt=""
                width={14}
                height={14}
                aria-hidden="true"
                className="
                  mt-[2px]

                  h-[13px]
                  w-[13px]
                  shrink-0

                  object-contain

                  sm:mt-0
                  sm:h-[14px]
                  sm:w-[14px]
                "
              />

              <p
                className="
                  min-w-0

                  font-red-hat-display

                  text-[10px]
                  font-[467]
                  leading-[15px]

                  text-[#079455]

                  min-[390px]:text-[11px]
                  min-[390px]:leading-4

                  sm:text-[12px]
                  sm:leading-[18px]

                  md:text-[13px]
                  md:leading-5

                  xl:text-[14px]
                "
              >
                <strong
                  className="
                    font-[645]
                  "
                >
                  You could save up to £580/yr
                </strong>{' '}
                by switching to the best deal below
              </p>
            </div>
          </div>

          {/* =================================================
              ALSO COMPARE
          ================================================== */}
          <div
            className="
              flex
              w-full

              flex-col

              gap-2.5

              px-3
              py-3

              min-[390px]:px-4

              sm:flex-row
              sm:flex-wrap
              sm:items-center
              sm:gap-2

              md:px-5
              md:py-4

              lg:min-h-[62px]
              lg:flex-nowrap
              lg:px-5
              lg:py-0

              xl:px-6
            "
          >
            <span
              className="
                shrink-0

                whitespace-nowrap

                font-red-hat-display

                text-[11px]
                font-[550]
                leading-4

                text-[#667085]

                sm:mr-1
                sm:text-[12px]

                md:text-[13px]

                xl:text-[14px]
              "
            >
              Also compare:
            </span>

            {/* SERVICES */}
            <div
              className="
                flex
                min-w-0

                flex-wrap

                items-center

                gap-1.5

                sm:gap-2
              "
            >
              {simOnlyCompareServices.map((serviceItem) => (
                <Link
                  key={serviceItem.id}
                  href={getServiceHref(serviceItem.label)}
                  className="
                      inline-flex
                      h-[27px]
                      shrink-0

                      items-center
                      justify-center

                      gap-1

                      rounded-[6px]

                      border
                      border-[#EAECF0]

                      bg-white

                      px-[5px]

                      shadow-[0px_1px_2px_rgba(16,24,40,0.04)]

                      transition-colors

                      hover:bg-[#F9FAFB]

                      sm:h-[29px]
                      sm:gap-1.5
                      sm:px-[6px]

                      lg:h-[30px]
                    "
                >
                  <span
                    className="
                        flex
                        h-[17px]
                        w-[17px]
                        shrink-0

                        items-center
                        justify-center

                        overflow-hidden

                        rounded-[3px]

                        bg-[#F2F4F7]

                        sm:h-[19px]
                        sm:w-[19px]

                        lg:h-[20px]
                        lg:w-[20px]
                      "
                  >
                    <Image
                      src={serviceItem.icon}
                      alt={serviceItem.alt}
                      width={18}
                      height={18}
                      className="
                          h-[15px]
                          w-[15px]

                          object-contain

                          sm:h-[17px]
                          sm:w-[17px]

                          lg:h-[18px]
                          lg:w-[18px]
                        "
                    />
                  </span>

                  <span
                    className="
                        whitespace-nowrap

                        font-red-hat-display

                        text-[9px]
                        font-[550]
                        leading-4

                        text-[#344054]

                        min-[390px]:text-[10px]

                        sm:text-[11px]

                        xl:text-[13px]
                      "
                  >
                    {serviceItem.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* DIVIDER - desktop */}
            <span
              aria-hidden="true"
              className="
                hidden

                h-[27px]
                w-px
                shrink-0

                bg-[#EAECF0]

                lg:mx-2
                lg:block

                xl:mx-4
              "
            />

            {/* BUNDLE */}
            <Link
              href="/compare?service=energy&flow=bundle"
              className="
                inline-flex
                w-fit
                shrink-0

                items-center

                gap-1.5

                whitespace-nowrap

                font-red-hat-display

                text-[11px]
                font-[550]
                leading-5

                text-[#1570EF]

                transition-colors

                hover:text-[#175CD3]

                sm:ml-1
                sm:text-[12px]

                md:text-[13px]

                lg:ml-0
                lg:text-[14px]

                xl:text-[16px]
              "
            >
              <Image
                src={BUNDLE_ICON}
                alt=""
                width={13}
                height={16}
                aria-hidden="true"
                className="
                  h-[13px]
                  w-[11px]
                  shrink-0

                  object-contain

                  md:h-[15px]
                  md:w-[12px]

                  lg:h-4
                  lg:w-[13px]
                "
              />
              Bundle &amp; save up to £820/yr
            </Link>
          </div>
        </div>
      ) : (
        /* =====================================================
           ENERGY / BROADBAND / BUNDLE

           Same editable-information container on
           mobile, tablet and desktop.
        ====================================================== */
        <div
          className="
            overflow-hidden

            rounded-[14px]

            border
            border-[#EAECF0]

            bg-white

            p-3

            shadow-[0px_6px_18px_rgba(16,24,40,0.08)]

            sm:rounded-[16px]
            sm:p-4

            xl:rounded-[18px]
            xl:p-5
          "
        >
          {/* =================================================
              DETAILS CARDS

              Mobile: stacked
              Tablet: 3 columns
              Desktop: existing 3 columns
          ================================================== */}
          <div
            className="
              grid
              grid-cols-1

              gap-2.5

              sm:gap-3

              md:grid-cols-3

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

          {/* =================================================
              WARNING
          ================================================== */}
          <div
            className="
              mt-3

              flex
              min-h-[48px]

              items-start

              gap-2

              rounded-[9px]

              border
              border-[#FEC84B]

              bg-[#FFFAEB]

              px-3
              py-2.5

              sm:mt-4
              sm:gap-2.5
              sm:rounded-[10px]
              sm:px-4
              sm:py-3
            "
          >
            <Image
              src={WARNING_ICON}
              alt=""
              width={18}
              height={18}
              aria-hidden="true"
              className="
                mt-[1px]

                h-[15px]
                w-[15px]
                shrink-0

                object-contain

                sm:h-[18px]
                sm:w-[18px]
              "
            />

            <p
              className="
                min-w-0

                font-inter

                text-[9px]
                font-[660]
                leading-[14px]

                text-[#B54708]

                min-[390px]:text-[10px]
                min-[390px]:leading-[15px]

                sm:text-[11px]
                sm:leading-[17px]

                md:text-[12px]
                md:leading-[18px]

                xl:text-[13.5px]
                xl:leading-5
              "
            >
              {isBroadband ? (
                <>
                  From 1 October 2026, the energy price cap will rise by 4% for a typical Direct
                  Debit household. The temporary removal of VAT on electricity until 31 March 2027
                  is reflected in this increase. See if switching could help you save even more.
                </>
              ) : (
                <>
                  From 1 October 2026, the energy price cap will rise by 4% for a typical Direct
                  Debit household. The temporary removal of VAT on electricity until 31 March 2027
                  is reflected in this increase. See if switching could help you save even more.{' '}
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
      )}
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
        min-h-[70px]

        items-start
        justify-between

        gap-3

        rounded-[9px]

        border
        border-[#EAECF0]

        bg-[#FCFCFD]

        px-3
        py-2.5

        min-[390px]:min-h-[74px]

        sm:min-h-[80px]
        sm:rounded-[10px]
        sm:px-4
        sm:py-3

        md:min-h-[84px]
        md:gap-2
        md:px-3

        lg:min-h-[92px]
        lg:gap-4
        lg:px-4
        lg:py-3

        xl:min-h-[96px]
        xl:px-5
        xl:py-4
      "
    >
      {/* TEXT */}
      <div
        className="
          min-w-0
          flex-1
        "
      >
        <p
          className="
            font-inter

            text-[10px]
            font-semibold
            leading-[15px]

            text-[#101828]

            sm:text-[11px]
            sm:leading-[17px]

            md:text-[10px]

            lg:text-[12px]
            lg:leading-[18px]

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

            text-[11px]
            font-[660]
            leading-[16px]

            text-[#475467]

            sm:text-[12px]
            sm:leading-[18px]

            md:text-[11px]

            lg:text-[13px]
            lg:leading-5

            xl:text-[14px]
            xl:leading-[22px]
          "
        >
          {value}
        </p>
      </div>

      {/* EDIT */}
      <button
        type="button"
        onClick={onEdit}
        className="
          shrink-0

          font-inter

          text-[10px]
          font-semibold
          leading-[15px]

          text-[#00897B]

          transition-colors

          hover:text-[#00796D]

          sm:text-[11px]

          md:text-[10px]

          lg:text-[12px]
          lg:leading-[18px]

          xl:text-[13px]
          xl:leading-5
        "
      >
        Edit
      </button>
    </article>
  );
}
