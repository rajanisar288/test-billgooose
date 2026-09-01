'use client';

import { useCallback, useEffect } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { ArrowRight, X } from 'lucide-react';

import type {
  FeaturedBroadbandPlan,
  ResultPlan,
  StandardPlan,
} from '@/components/result/plan.types';
import data from '@/data/content.json';

type BroadbandSwitchModalProps = {
  isOpen: boolean;
  selectedPlan: StandardPlan | null;
  recommendedPlans: ResultPlan[];
  onClose: () => void;

  /*
   * Bundle-specific behavior.
   *
   * Normal Energy/Broadband behavior remains unchanged
   * when this is false.
   */
  bundleFlow?: boolean;
};

export default function BroadbandSwitchModal({
  isOpen,
  selectedPlan,
  recommendedPlans,
  onClose,
  bundleFlow = false,
}: BroadbandSwitchModalProps) {
  const router = useRouter();

  const { plans } = data.resultPage;

  const featuredBroadband = data.resultPage.plans.items.find(
    (plan) => plan.type === 'featured-broadband',
  );

  const backgroundImage =
    featuredBroadband && 'featured' in featuredBroadband && featuredBroadband.featured
      ? featuredBroadband.featured.backgroundImage
      : '/images/bg-card-2.png';

  /* =========================================================
     CLOSE
  ========================================================= */

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  /* =========================================================
     BUNDLE → REVIEW DETAILS
  ========================================================= */

  const handleBundleContinue = useCallback(() => {
    if (!selectedPlan) {
      return;
    }

    /*
     * Preserve the Energy plan currently displayed/selected
     * by the Bundle user.
     */
    sessionStorage.setItem(
      'journeySelectedPlan',
      JSON.stringify({
        ...selectedPlan,
        service: 'energy',
      }),
    );

    /*
     * Keep the service and Bundle context available through
     * Review Details and Payment.
     */
    sessionStorage.setItem('billgooseJourneyService', 'energy');

    sessionStorage.setItem('billgooseJourneyFlow', 'bundle');

    onClose();

    router.push('/review-your-details?service=energy&flow=bundle');
  }, [onClose, router, selectedPlan]);

  /* =========================================================
     MODAL EFFECTS
  ========================================================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;

      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleClose]);

  /* =========================================================
     NO PLAN
  ========================================================= */

  if (!selectedPlan) {
    return null;
  }

  return (
    <div
      className={`
        fixed
        inset-0
        z-[160]

        flex
        items-center
        justify-center

        bg-black/40

        px-3
        py-4

        transition-opacity
        duration-200

        sm:px-5

        ${isOpen ? 'visible opacity-100' : 'invisible pointer-events-none opacity-0'}
      `}
      aria-hidden={!isOpen}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          handleClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="broadband-switch-modal-title"
        className={`
          flex
          max-h-[calc(100dvh-24px)]
          w-full
          max-w-[512px]
          flex-col

          overflow-hidden

          rounded-[14px]

          bg-white

          shadow-[0px_24px_48px_-12px_rgba(16,24,40,0.28)]

          transition-all
          duration-200

          sm:rounded-[16px]

          ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-2 scale-[0.98]'}
        `}
      >
        {/* =====================================================
            TOP BANNER
        ====================================================== */}
        <header
          className="
            relative

            h-[145px]
            shrink-0

            overflow-hidden

            px-5
            pb-4
            pt-5

            sm:h-[161px]
            sm:px-6
            sm:pb-5
            sm:pt-5
          "
        >
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            aria-hidden="true"
            className="
              object-cover
              object-center
            "
          />

          <div
            aria-hidden="true"
            className="
              absolute
              inset-0

              bg-black/30
            "
          />

          <div
            className="
              relative
              z-10

              flex
              h-full
              flex-col
              items-start
            "
          >
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close broadband recommendation"
              className="
                absolute
                right-0
                top-0

                flex
                h-7
                w-7

                items-center
                justify-center

                rounded-full

                bg-white

                text-[#0C3354]

                shadow-[0px_1px_2px_rgba(16,24,40,0.10)]

                transition-transform

                hover:scale-105

                sm:h-8
                sm:w-8
              "
            >
              <X
                aria-hidden="true"
                className="
                  h-4
                  w-4
                "
                strokeWidth={2}
              />
            </button>

            <p
              className="
                font-red-hat-display

                text-[10px]
                font-[467]
                uppercase
                leading-[16px]
                tracking-[0]

                text-white

                sm:text-[12px]
                sm:leading-[19.5px]
              "
            >
              Before you switch
            </p>

            <h2
              id="broadband-switch-modal-title"
              className="
                mt-1

                max-w-[255px]

                font-red-hat-display

                text-[18px]
                font-[645]
                leading-[20px]
                tracking-[0]

                text-white

                sm:max-w-[280px]
                sm:text-[20px]
                sm:leading-[21.75px]
              "
            >
              Most customers also
              <br />
              save on broadband
            </h2>

            <div
              className="
                mt-auto

                inline-flex
                min-h-[26px]
                max-w-full

                items-center
                gap-2

                rounded-full

                bg-white/20

                px-3
                py-1.5

                backdrop-blur-[2px]

                sm:min-h-[28px]
              "
            >
              <Image
                src="/images/selected-plan-span-icon.png"
                alt=""
                width={12}
                height={12}
                aria-hidden="true"
                className="
                  h-3
                  w-3
                  shrink-0

                  object-contain
                "
              />

              <span
                className="
                  truncate

                  font-inter

                  text-[10px]
                  font-medium
                  leading-[14px]

                  text-white

                  sm:text-[12px]
                  sm:leading-4
                "
              >
                87% of energy switchers also compare broadband
              </span>
            </div>
          </div>
        </header>

        {/* =====================================================
            BODY
        ====================================================== */}
        <div
          className="
            min-h-0
            flex-1

            overflow-y-auto

            px-4
            pb-4
            pt-4

            sm:px-5
          "
        >
          {/* =================================================
              SELECTED ENERGY PLAN
          ================================================== */}
          <ModalPlanCard
            plan={selectedPlan}
            savingIcon={plans.savingIcon}
            selected
          />

          {/* =================================================
              BROADBAND SUGGESTIONS
          ================================================== */}
          <p
            className="
              mb-3
              mt-4

              font-red-hat-display
              text-[13px]
              font-[550]
              leading-[20px]
              tracking-[0]

              text-[#101828]

              sm:text-[14px]
              sm:leading-[21.75px]
            "
          >
            Top broadband deals in your area:
          </p>

          <div className="space-y-2.5">
            {recommendedPlans.slice(0, 3).map((plan) => (
              <ModalPlanCard
                key={plan.id}
                plan={plan}
                savingIcon={plans.savingIcon}
              />
            ))}
          </div>

          {/* =================================================
              COMPARE ALL BROADBAND
          ================================================== */}
          <button
            type="button"
            onClick={() => {
              /*
               * Bundle:
               *
               * Do not start another Broadband compare journey.
               * The user has already completed the Bundle
               * qualification journey.
               *
               * Proceed to Review Your Details.
               */
              if (bundleFlow) {
                handleBundleContinue();
                return;
              }

              /*
               * Existing non-Bundle behavior.
               */
              onClose();

              router.push('/compare?service=broadband');
            }}
            className="
              mt-5

              inline-flex
              h-[48px]
              w-full

              items-center
              justify-center

              gap-3

              rounded-full

              border
              border-[#00897B]

              bg-[#00897B]

              px-5

              font-red-hat-display
              text-[13px]
              font-bold
              leading-5

              text-white

              shadow-[0px_1px_2px_rgba(16,24,40,0.05)]

              transition-colors

              hover:bg-[#00796D]

              sm:h-[50px]
              sm:text-[14px]
            "
          >
            <Image
              src={plans.wifiIcon}
              alt=""
              width={15}
              height={12}
              aria-hidden="true"
              className="
                h-[12px]
                w-[15px]
                shrink-0

                object-contain
              "
            />

            <span>Compare All Broadband</span>

            <ArrowRight
              aria-hidden="true"
              className="
                h-4
                w-4
                shrink-0
              "
              strokeWidth={2.5}
            />
          </button>

          {/* =================================================
              CONTINUE ENERGY ONLY
          ================================================== */}
          <button
            type="button"
            onClick={() => {
              /*
               * Bundle:
               * both modal actions now proceed to Review.
               */
              if (bundleFlow) {
                handleBundleContinue();
                return;
              }

              /*
               * Existing Energy behavior.
               */
              sessionStorage.setItem('journeySelectedPlan', JSON.stringify(selectedPlan));

              onClose();

              router.push('/review-your-details');
            }}
            className="
              mt-3

              flex
              h-9
              w-full

              items-center
              justify-center

              font-red-hat-display

              text-[12px]
              font-[550]
              leading-[18px]

              text-[#475467]

              transition-colors

              hover:text-[#0C3354]

              sm:text-[13px]
            "
          >
            Continue with Energy only
          </button>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   PLAN ROW
========================================================= */

type ModalPlanCardProps = {
  plan: StandardPlan | FeaturedBroadbandPlan;
  savingIcon: string;
  selected?: boolean;
};

function ModalPlanCard({ plan, savingIcon, selected = false }: ModalPlanCardProps) {
  return (
    <article
      className={`
        flex
        min-h-[64px]
        w-full

        items-center
        justify-between

        gap-2.5

        rounded-[10px]

        border

        px-2
        py-[7px]

        sm:min-h-[68px]
        sm:gap-3
        sm:rounded-[11px]
        sm:p-2

        lg:h-[74px]
        lg:min-h-[74px]
        lg:w-full
        lg:max-w-[472px]
        lg:gap-3
        lg:rounded-[12px]
        lg:p-2

        ${
          selected
            ? `
              border-[#D1FADF]
              bg-[#F6FEF9]
            `
            : `
              border-[#EAECF0]
              bg-white
            `
        }
      `}
    >
      <div
        className="
          flex
          min-w-0
          flex-1

          items-center

          gap-2

          sm:gap-2.5

          lg:gap-3
        "
      >
        <div
          className="
            flex
            h-[44px]
            w-[44px]
            shrink-0

            items-center
            justify-center

            rounded-[8px]

            border
            border-[#EAECF0]

            bg-white

            sm:h-[48px]
            sm:w-[48px]

            lg:h-[56px]
            lg:w-[56px]
            lg:rounded-[9px]
          "
        >
          <Image
            src={plan.logo}
            alt={plan.logoAlt}
            width={48}
            height={48}
            className="
              h-[32px]
              w-[32px]

              object-contain

              sm:h-[36px]
              sm:w-[36px]

              lg:h-[42px]
              lg:w-[42px]
            "
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className="
              truncate

              font-red-hat-display
              text-[11px]
              font-extrabold
              leading-[15px]
              tracking-[0]

              text-[#101828]

              sm:text-[12px]
              sm:leading-[17px]

              lg:text-[13px]
              lg:leading-[18px]
            "
          >
            {plan.provider}
          </h3>

          <p
            className="
              mt-[1px]
              truncate

              font-red-hat-display
              text-[8px]
              font-medium
              leading-[12px]
              tracking-[0]

              text-[#667085]

              sm:text-[9px]
              sm:leading-[13px]

              lg:text-[10px]
              lg:leading-[14px]
            "
          >
            {plan.description}
          </p>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div
          className="
            flex
            items-baseline
            justify-end

            gap-[1px]
          "
        >
          <span
            className="
              font-red-hat-display
              text-[14px]
              font-extrabold
              leading-[17px]

              text-[#101828]

              sm:text-[15px]

              lg:text-[17px]
              lg:leading-[20px]
            "
          >
            {plan.price}
          </span>

          <span
            className="
              font-red-hat-display
              text-[8px]
              font-medium
              leading-[11px]

              text-[#667085]

              sm:text-[9px]

              lg:text-[10px]
              lg:leading-[13px]
            "
          >
            {plan.pricePeriod}
          </span>
        </div>

        <span
          className="
            mt-[3px]

            inline-flex
            min-h-[16px]

            items-center

            gap-[3px]

            rounded-full

            bg-[#ECFDF3]

            px-[5px]
            py-[1px]

            font-red-hat-display
            text-[7.5px]
            font-extrabold
            leading-[10px]

            text-[#027A48]

            sm:text-[8px]

            lg:min-h-[18px]
            lg:px-[6px]
            lg:text-[9px]
            lg:leading-[12px]
          "
        >
          <Image
            src={savingIcon}
            alt=""
            width={10}
            height={10}
            aria-hidden="true"
            className="
              h-[8px]
              w-[8px]
              shrink-0

              object-contain

              lg:h-[10px]
              lg:w-[10px]
            "
          />

          {plan.saving}
        </span>
      </div>
    </article>
  );
}
