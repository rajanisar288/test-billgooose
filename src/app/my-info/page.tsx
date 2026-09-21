'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Compass,
  Settings,
  UserRound,
} from 'lucide-react';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import BackendErrorAlert from '@/components/common/BackendErrorAlert';
import { InlineSpinner } from '@/components/common/FullPageLoader';
import Header from '@/components/marketing/Header';
import LiveChatWidget from '@/components/marketing/LiveChatWidget';
import { humanizeLabel } from '@/components/result/result-labels';
import { storeJourney } from '@/constants/shared';
import data from '@/data/content.json';
import { journeyApi } from '@/lib/api/endpoints/journey.api';
import { useJourneyStore } from '@/store/journeyStore';

/* =========================================================
   TYPES
========================================================= */

type SignedInUser = {
  email?: string;
  signedIn?: boolean;
};

type JourneyService = 'energy' | 'broadband';

type JourneyProgress = {
  service?: JourneyService;
  currentStep?: number;
  totalSteps?: number;
  progress?: number;
  route?: string;
  stepTitle?: string;
  stepDescription?: string;
};

type StoredDeal = {
  id?: string;
  provider?: string;
  title?: string;
  description?: string;
  logo?: string;
  logoAlt?: string;
  price?: string;
  pricePeriod?: string;
  contract?: string;
  service?: JourneyService | 'mobile' | 'sim';
  status?: string;
};

type AccountSnapshot = {
  user: string;
  journey: string;
  purchasedDeals: string;
  selectedPlan: string;
};

type AccountTab = 'deals' | 'journeys' | 'settings';

/* =========================================================
   STORAGE
========================================================= */

function getAccountSnapshot(): string {
  try {
    const snapshot: AccountSnapshot = {
      user: sessionStorage.getItem('billgooseSignedInUser') ?? '',

      journey: sessionStorage.getItem('billgooseJourneyProgress') ?? '',

      /*
       * Later, when your API exists, this can be populated
       * from the backend.
       *
       * For now this supports an array saved as:
       * billgoosePurchasedDeals
       */
      purchasedDeals: sessionStorage.getItem('billgoosePurchasedDeals') ?? '',

      /*
       * Your current journey already stores the selected plan
       * using this key, so we also support it as a fallback.
       */
      selectedPlan: sessionStorage.getItem('journeySelectedPlan') ?? '',
    };

    return JSON.stringify(snapshot);
  } catch {
    return JSON.stringify({
      user: '',
      journey: '',
      purchasedDeals: '',
      selectedPlan: '',
    });
  }
}

function getAccountServerSnapshot(): string {
  return JSON.stringify({
    user: '',
    journey: '',
    purchasedDeals: '',
    selectedPlan: '',
  });
}

function subscribeToAccount(callback: () => void) {
  const handleStorage = () => {
    callback();
  };

  const handleAuth = () => {
    callback();
  };

  const handleJourney = () => {
    callback();
  };

  const handleDeals = () => {
    callback();
  };

  window.addEventListener('storage', handleStorage);

  window.addEventListener('billgoose-auth-changed', handleAuth);

  window.addEventListener('billgoose-journey-progress-changed', handleJourney);

  window.addEventListener('billgoose-deals-changed', handleDeals);

  return () => {
    window.removeEventListener('storage', handleStorage);

    window.removeEventListener('billgoose-auth-changed', handleAuth);

    window.removeEventListener('billgoose-journey-progress-changed', handleJourney);

    window.removeEventListener('billgoose-deals-changed', handleDeals);
  };
}

/* =========================================================
   PAGE
========================================================= */

export default function MyInfoPage() {
  const router = useRouter();

  const { footer2 } = data;

  const [activeTab, setActiveTab] = useState<AccountTab>('deals');
  const [customerJourneys, setCustomerJourneys] = useState<any[]>([]);
  const [isLoadingJourneys, setIsLoadingJourneys] = useState<boolean>(false);
  const [continuingJourneyId, setContinuingJourneyId] = useState<string | null>(null);
  const [journeyError, setJourneyError] = useState<{ id: string; message: string } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    async function fetchCustomerJourneys() {
      setIsLoadingJourneys(true);
      try {
        const response = await journeyApi.getCustomerJourneys({ page: currentPage, pageSize });
        const responseData = response?.data;
        const list =
          responseData?.items ||
          responseData?.data ||
          (Array.isArray(responseData) ? responseData : []);
        setCustomerJourneys(Array.isArray(list) ? list : []);

        const total =
          responseData?.total ??
          responseData?.totalCount ??
          responseData?.count ??
          (Array.isArray(list) ? list.length : 0);
        const calculatedPages = responseData?.totalPages ?? Math.ceil(total / pageSize) ?? 1;

        setTotalCount(total);
        setTotalPages(calculatedPages > 0 ? calculatedPages : 1);
      } catch (err: any) {
        console.error('❌ Failed to fetch customer journeys:', err);
      } finally {
        setIsLoadingJourneys(false);
      }
    }

    fetchCustomerJourneys();
  }, [currentPage, pageSize]);

  async function handleContinueJourney(jItem: any) {
    const journeyId = jItem.id || jItem.uuid;

    if (!journeyId) {
      if (jItem.lastUrl) {
        router.push(jItem.lastUrl);
      }
      return;
    }

    setContinuingJourneyId(journeyId);
    setJourneyError(null);

    try {
      const response = await journeyApi.getJourney(jItem?.journeyReference);
      const journeyData = response?.data || response;

      if (journeyData) {
        if (journeyData.id || journeyId) {
          localStorage.setItem(storeJourney, journeyData.id || journeyId);
        }
        useJourneyStore.getState().setJourney(journeyData);

        const targetUrl = journeyData.lastUrl || jItem.lastUrl || '/';
        router.push(targetUrl);
      } else if (jItem.lastUrl) {
        router.push(jItem.lastUrl);
      }
    } catch (err: any) {
      console.error('❌ Failed to fetch journey details:', err);
      setJourneyError({
        id: journeyId,
        message: err?.data?.error || 'Failed to fetch journey details. Please try again.',
      });
    } finally {
      setContinuingJourneyId(null);
    }
  }

  const snapshot = useSyncExternalStore(
    subscribeToAccount,
    getAccountSnapshot,
    getAccountServerSnapshot,
  );

  let user: SignedInUser = {};
  let journey: JourneyProgress | null = null;
  let deals: StoredDeal[] = [];

  try {
    const parsed = JSON.parse(snapshot) as AccountSnapshot;

    if (parsed.user) {
      user = JSON.parse(parsed.user) as SignedInUser;
    }

    if (parsed.journey) {
      journey = JSON.parse(parsed.journey) as JourneyProgress;
    }

    /*
     * Prefer the actual purchased-deals collection.
     */
    if (parsed.purchasedDeals) {
      const purchased = JSON.parse(parsed.purchasedDeals) as StoredDeal[];

      if (Array.isArray(purchased)) {
        deals = purchased;
      }
    }

    /*
     * Current frontend fallback:
     * If no purchased-deal collection exists yet, use the
     * plan the customer selected during the journey.
     */
    if (deals.length === 0 && parsed.selectedPlan) {
      const selected = JSON.parse(parsed.selectedPlan) as StoredDeal;

      deals = [selected];
    }
  } catch {
    user = {};
    journey = null;
    deals = [];
  }

  /* =========================================================
     COMPARE AGAIN
  ========================================================= */

  function handleCompareAgain(deal: StoredDeal) {
    const dealService = deal.service ?? journey?.service ?? 'energy';

    /*
     * Send the user back to the results/summary for the
     * appropriate category.
     *
     * The selected deal is kept so the results screen can
     * highlight/reuse it if needed.
     */
    sessionStorage.setItem('journeySelectedPlan', JSON.stringify(deal));

    sessionStorage.setItem(
      'compareFlowDetails',
      JSON.stringify({
        service: dealService,
      }),
    );

    router.push(`/result?service=${dealService}`);
  }

  return (
    <ProtectedRoute redirectTo="/">
      <main
        className="
          flex
          min-h-screen
          w-full
          flex-col

          bg-white
        "
      >
        <LiveChatWidget />
        {/* =====================================================
            DARK AREA
        ====================================================== */}
        <div
          className="
            w-full

            bg-[#0B2B43]
          "
        >
          {/* =================================================
              NAVBAR + BOTTOM BORDER
          ================================================== */}
          <div
            className="
              border-b
              border-white/10
            "
          >
            <Header />
          </div>

          {/* =================================================
              ACCOUNT / PROGRESS AREA
          ================================================== */}
          <section
            className="
      w-full

      px-4
      pb-[45px]
      pt-7

      sm:px-6
      sm:pt-9

      md:px-8

      lg:pt-10
    "
          >
            <div
              className="
                mx-auto
                w-full
                max-w-[920px]
              "
            >
              {/* ===============================================
                  USER
              ================================================ */}
              <div
                className="
                  flex
                  items-center

                  gap-4

                  sm:gap-5
                "
              >
                <div
                  className="
                    flex
                    h-[60px]
                    w-[60px]
                    shrink-0

                    items-center
                    justify-center

                    rounded-full

                    border
                    border-white/20

                    bg-[#00897B]

                    text-white

                    sm:h-[68px]
                    sm:w-[68px]

                    lg:h-[76px]
                    lg:w-[76px]
                  "
                >
                  <UserRound
                    aria-hidden="true"
                    className="
                      h-7
                      w-7

                      sm:h-8
                      sm:w-8

                      lg:h-[34px]
                      lg:w-[34px]
                    "
                    strokeWidth={1.8}
                  />
                </div>

                <div className="min-w-0">
                  <h1
                    className="
                      font-red-hat-display

                      text-[20px]
                      font-extrabold
                      leading-[27px]

                      text-white

                      sm:text-[23px]
                      sm:leading-[30px]

                      lg:text-[26px]
                      lg:leading-[34px]
                    "
                  >
                    SIGNED IN
                  </h1>

                  <p
                    className="
                      mt-0.5

                      max-w-[240px]
                      truncate

                      font-inter
                      text-[11px]
                      font-normal
                      leading-[17px]

                      text-[#D0D5DD]

                      sm:max-w-[350px]
                      sm:text-[12px]

                      lg:text-[13px]
                      lg:leading-[18px]
                    "
                  >
                    {user.email || 'Signed in'}
                  </p>

                  <span
                    className="
                      mt-2

                      inline-flex
                      items-center

                      gap-1.5

                      rounded-full

                      bg-white/10

                      px-2.5
                      py-1

                      font-inter
                      text-[9px]
                      font-medium

                      text-[#D0D5DD]

                      sm:text-[10px]
                    "
                  >
                    <CalendarDays
                      aria-hidden="true"
                      className="
                        h-3
                        w-3
                      "
                    />
                    Member
                  </span>
                </div>
              </div>

              {/* ===============================================
                  UNFINISHED JOURNEY
              ================================================ */}
              {/* {journey?.route && (
                <section
                  className="
                    mt-7

                    rounded-[14px]

                    bg-white

                    p-4

                    shadow-[0px_8px_24px_rgba(16,24,40,0.08)]

                    sm:mt-8
                    sm:rounded-[16px]
                    sm:p-5

                    lg:mt-9
                    lg:p-6
                  "
                > */}
              {/* =============================================
                      TOP
                  ============================================== */}
              {/* <div
                    className="
                      flex
                      flex-col

                      gap-4

                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >
                    <div
                      className="
                        flex
                        min-w-0
                        items-center

                        gap-3

                        sm:gap-4
                      "
                    > */}
              {/* SERVICE ICON */}
              {/* <div
                        className="
                          flex
                          h-[50px]
                          w-[50px]
                          shrink-0

                          items-center
                          justify-center

                          rounded-[10px]

                          border
                          border-[#00B1AA33]

                          bg-[linear-gradient(135deg,#E7F6F5_0%,#FFFFFF_100%)]

                          sm:h-[54px]
                          sm:w-[54px]

                          lg:h-[60px]
                          lg:w-[60px]
                          lg:rounded-[12px]
                          lg:border-[0.58px]
                        "
                      >
                        <Image
                          src={journeyIcon}
                          alt={isBroadband ? 'Broadband' : 'Energy'}
                          width={48}
                          height={48}
                          className="
                            h-[40px]
                            w-[40px]

                            object-contain

                            sm:h-[44px]
                            sm:w-[44px]

                            lg:h-[48px]
                            lg:w-[48px]
                          "
                        />
                      </div>

                      <div className="min-w-0">
                        <h2
                          className="
                            font-red-hat-display

                            text-[15px]
                            font-extrabold
                            leading-5

                            text-[#0C3354]

                            sm:text-[16px]

                            lg:text-[18px]
                            lg:leading-6
                          "
                        >
                          Continue compare {isBroadband ? 'broadband' : 'energy'}
                        </h2>

                        <p
                          className="
                            mt-1

                            font-inter
                            text-[11px]
                            font-normal
                            leading-[17px]

                            text-[#667085]

                            sm:text-[12px]

                            lg:text-[13px]
                            lg:leading-[18px]
                          "
                        >
                          {journey.stepDescription || `Continue your ${service} comparison`}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        router.push(continueRoute);
                      }}
                      className="
                        inline-flex
                        h-[42px]

                        shrink-0
                        items-center
                        justify-center

                        gap-2

                        rounded-full

                        bg-[#00897B]

                        px-5

                        font-red-hat-display
                        text-[12px]
                        font-bold

                        text-white

                        transition-colors

                        hover:bg-[#00796D]

                        sm:w-auto

                        lg:h-[44px]
                        lg:px-6
                        lg:text-[13px]
                      "
                    >
                      Continue
                      <ArrowRight
                        aria-hidden="true"
                        className="
                          h-4
                          w-4
                        "
                      />
                    </button>
                  </div> */}

              {/* =============================================
                      PROGRESS
                      NO DIVIDER/BORDER
                  ============================================== */}
              {/* <div
                    className="
                      mt-4

                      flex
                      items-center

                      gap-3

                      lg:mt-5
                      lg:gap-4
                    "
                  >
                    <div
                      className="
                        h-[7px]
                        min-w-0
                        flex-1

                        overflow-hidden

                        rounded-full

                        bg-[#EAECF0]

                        lg:h-2
                      "
                    >
                      <div
                        className="
                          h-full

                          rounded-full

                          bg-[#00897B]

                          transition-[width]
                          duration-300
                        "
                        style={{
                          width: `${Math.max(0, Math.min(100, progress))}%`,
                        }}
                      />
                    </div>

                    <span
                      className="
                        w-[44px]
                        shrink-0

                        text-right

                        font-red-hat-display

                        text-[14px]
                        font-[645]
                        leading-6

                        text-[#0C3354]

                        sm:text-[16px]
                        sm:leading-7

                        lg:w-[50px]
                        lg:text-[18px]
                        lg:leading-[36.4px]
                      "
                    >
                      {progress}%
                    </span>
                  </div>
                </section>
              )} */}

              {!journey?.route && <div className="h-[10px]" />}
            </div>
          </section>
        </div>

        {/* =====================================================
            WHITE ACCOUNT BODY
        ====================================================== */}
        <section
          className="
      flex-1
      w-full

      bg-[#F9F9F9]
    "
        >
          {/* =================================================
      TABS
  ================================================== */}
          <div
            className="
      border-b
      border-[#EAECF0]

      bg-white
    "
          >
            <div
              className="
        mx-auto
        flex
        w-full
        max-w-[920px]

        items-center
        gap-5

        px-4

        sm:px-6

        md:px-8
      "
            >
              <button
                type="button"
                onClick={() => {
                  setActiveTab('deals');
                }}
                className={`
          relative

          flex
          min-h-[48px]

          items-center

          font-red-hat-display
          text-[12px]

          transition-colors

          sm:min-h-[52px]
          sm:text-[13px]

          lg:text-[14px]

          ${
            activeTab === 'deals'
              ? `
                font-extrabold
                text-[#00897B]

                after:absolute
                after:bottom-0
                after:left-0
                after:right-0
                after:h-[2px]
                after:bg-[#00897B]
              `
              : `
                font-semibold
                text-[#667085]

                hover:text-[#0C3354]
              `
          }
        `}
              >
                My Deals
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('journeys');
                }}
                className={`
          relative

          flex
          min-h-[48px]

          items-center

          font-red-hat-display
          text-[12px]

          transition-colors

          sm:min-h-[52px]
          sm:text-[13px]

          lg:text-[14px]

          ${
            activeTab === 'journeys'
              ? `
                font-extrabold
                text-[#00897B]

                after:absolute
                after:bottom-0
                after:left-0
                after:right-0
                after:h-[2px]
                after:bg-[#00897B]
              `
              : `
                font-semibold
                text-[#667085]

                hover:text-[#0C3354]
              `
          }
        `}
              >
                My Journeys
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('settings');
                }}
                className={`
          relative

          flex
          min-h-[48px]

          items-center

          font-red-hat-display
          text-[12px]

          transition-colors

          sm:min-h-[52px]
          sm:text-[13px]

          lg:text-[14px]

          ${
            activeTab === 'settings'
              ? `
                font-extrabold
                text-[#00897B]

                after:absolute
                after:bottom-0
                after:left-0
                after:right-0
                after:h-[2px]
                after:bg-[#00897B]
              `
              : `
                font-semibold
                text-[#667085]

                hover:text-[#0C3354]
              `
          }
        `}
              >
                Settings
              </button>
            </div>
          </div>

          {/* =================================================
              TAB CONTENT
          ================================================== */}
          <div
            className="
              mx-auto
              w-full
              max-w-[920px]

              px-4
              pb-16
              pt-6

              sm:px-6
              sm:pt-7

              md:px-8

              lg:pb-24
              lg:pt-8
            "
          >
            {/* ===============================================
                MY DEALS
            ================================================ */}
            {activeTab === 'deals' && (
              <div>
                <h2
                  className="
                    font-red-hat-display

                    text-[20px]
                    font-extrabold
                    leading-[28px]

                    text-[#0C3354]

                    sm:text-[22px]

                    lg:text-[24px]
                    lg:leading-[32px]
                  "
                >
                  My Active Deals
                </h2>

                {deals.length > 0 ? (
                  <div
                    className="
                      mt-4

                      space-y-3

                      sm:mt-5
                      sm:space-y-4
                    "
                  >
                    {deals.map((deal, index) => (
                      <ActiveDealCard
                        key={deal.id ?? `${deal.provider}-${index}`}
                        deal={deal}
                        onCompareAgain={() => {
                          handleCompareAgain(deal);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className="
                      mt-4

                      rounded-[14px]

                      border
                      border-[#EAECF0]

                      bg-[#FCFCFD]

                      p-5

                      sm:mt-5
                      sm:p-6
                    "
                  >
                    <p
                      className="
                        font-red-hat-display

                        text-[14px]
                        font-semibold
                        leading-5

                        text-[#344054]
                      "
                    >
                      You don&apos;t have any active deals yet.
                    </p>

                    <p
                      className="
                        mt-1

                        font-inter
                        text-[12px]
                        font-normal
                        leading-[18px]

                        text-[#667085]
                      "
                    >
                      Any plans you complete through BillGoose will appear here.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ===============================================
                MY JOURNEYS
            ================================================ */}
            {activeTab === 'journeys' && (
              <div>
                <div className="flex items-center justify-between">
                  <h2
                    className="
                      font-red-hat-display

                      text-[20px]
                      font-extrabold
                      leading-[28px]

                      text-[#0C3354]

                      sm:text-[22px]

                      lg:text-[24px]
                      lg:leading-[32px]
                    "
                  >
                    My Journeys
                  </h2>

                  {totalCount > 0 && (
                    <span className="font-inter text-[12px] font-medium text-[#667085]">
                      Total: {totalCount}
                    </span>
                  )}
                </div>

                {isLoadingJourneys ? (
                  <div className="mt-4 p-5 text-center text-[#667085]">Loading journeys...</div>
                ) : customerJourneys.length > 0 ? (
                  <>
                    <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
                      {customerJourneys.map((j: any, index: number) => (
                        <article
                          key={j.id || j.uuid || index}
                          className="
                            flex
                            w-full
                            flex-col
                            gap-4
                            rounded-[14px]
                            border
                            border-[#EAECF0]
                            bg-white
                            p-4
                            shadow-[0px_1px_2px_rgba(16,24,40,0.03)]
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            sm:p-5
                            lg:min-h-[118px]
                            lg:rounded-[16px]
                          "
                        >
                          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                            <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-[10px] border border-[#EAECF0] bg-[#FCFCFD] sm:h-[64px] sm:w-[64px]">
                              <Compass className="h-6 w-6 text-[#00897B]" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-red-hat-display text-[16px] font-bold text-[#0C3354]">
                                {humanizeLabel(j.serviceType) || 'Customer Journey'}
                              </h3>
                              <p className="mt-1 font-inter text-[12px] text-[#667085]">
                                ID: {j.id || 'N/A'} • Status:{' '}
                                <span className="font-semibold text-[#00897B]">
                                  {humanizeLabel(j.status) || 'Active'}
                                </span>
                              </p>
                              {j.createdAt && (
                                <p className="font-inter text-[11px] text-[#98A2B3]">
                                  Created: {new Date(j.createdAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          {!['completed']?.includes(j.status) && (
                            <button
                              type="button"
                              disabled={continuingJourneyId === (j.id || j.uuid)}
                              onClick={() => handleContinueJourney(j)}
                              className="inline-flex h-[40px] items-center justify-center gap-2 rounded-full bg-[#00897B] px-4 font-red-hat-display text-[12px] font-bold text-white transition-colors hover:bg-[#00796D] disabled:opacity-50"
                            >
                              {continuingJourneyId === (j.id || j.uuid) ? (
                                <>
                                  <InlineSpinner className="h-4 w-4 text-white" />
                                  <span>Loading...</span>
                                </>
                              ) : (
                                <>
                                  <span>Continue Journey</span>
                                  <ArrowRight className="h-4 w-4" />
                                </>
                              )}
                            </button>
                          )}

                          {journeyError && journeyError.id === (j.id || j.uuid) && (
                            <BackendErrorAlert
                              error={journeyError.message}
                              className="w-full mt-2"
                            />
                          )}
                        </article>
                      ))}
                    </div>

                    {/* PAGINATION CONTROLS */}
                    {totalPages > 1 && (
                      <div className="mt-6 flex items-center justify-between border-t border-[#EAECF0] pt-4">
                        <button
                          type="button"
                          disabled={currentPage <= 1}
                          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#D0D5DD] px-3 py-1.5 font-inter text-[12px] font-medium text-[#344054] transition-colors hover:bg-gray-50 disabled:opacity-50"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </button>

                        <span className="font-inter text-[12px] font-medium text-[#344054]">
                          Page {currentPage} of {totalPages}
                        </span>

                        <button
                          type="button"
                          disabled={currentPage >= totalPages}
                          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#D0D5DD] px-3 py-1.5 font-inter text-[12px] font-medium text-[#344054] transition-colors hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mt-4 rounded-[14px] border border-[#EAECF0] bg-[#FCFCFD] p-5 sm:mt-5 sm:p-6">
                    <p className="font-red-hat-display text-[14px] font-semibold leading-5 text-[#344054]">
                      No journeys found.
                    </p>
                    <p className="mt-1 font-inter text-[12px] font-normal leading-[18px] text-[#667085]">
                      Your active and past comparison journeys will appear here.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ===============================================
                SETTINGS
            ================================================ */}
            {activeTab === 'settings' && (
              <div>
                <h2
                  className="
                    font-red-hat-display

                    text-[20px]
                    font-extrabold
                    leading-[28px]

                    text-[#0C3354]

                    sm:text-[22px]

                    lg:text-[24px]
                    lg:leading-[32px]
                  "
                >
                  Settings
                </h2>

                <div
                  className="
                    mt-4

                    rounded-[14px]

                    border
                    border-[#EAECF0]

                    bg-white

                    p-5

                    sm:mt-5
                    sm:p-6
                  "
                >
                  <div
                    className="
                      flex
                      items-start

                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0

                        items-center
                        justify-center

                        rounded-[10px]

                        bg-[#F2F4F7]

                        text-[#0C3354]
                      "
                    >
                      <Settings
                        aria-hidden="true"
                        className="
                          h-5
                          w-5
                        "
                      />
                    </div>

                    <div>
                      <p
                        className="
                          font-red-hat-display

                          text-[14px]
                          font-semibold
                          leading-5

                          text-[#101828]
                        "
                      >
                        Account settings
                      </p>

                      <p
                        className="
                          mt-1

                          font-inter
                          text-[12px]
                          font-normal
                          leading-[18px]

                          text-[#667085]
                        "
                      >
                        Account preferences will be available here when the account API is
                        connected.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            FOOTER 2
        ====================================================== */}
        <FooterTwo
          copyright={footer2.copyright}
          navigationAriaLabel={footer2.navigationAriaLabel}
          links={footer2.links}
        />
      </main>
    </ProtectedRoute>
  );
}

/* =========================================================
   ACTIVE DEAL CARD
========================================================= */

type ActiveDealCardProps = {
  deal: StoredDeal;
  onCompareAgain: () => void;
};

function ActiveDealCard({ deal, onCompareAgain }: ActiveDealCardProps) {
  const provider = deal.provider ?? deal.title ?? 'Selected Plan';

  const description = deal.description ?? deal.contract ?? 'Your selected BillGoose deal';

  const price = deal.price ?? '—';

  return (
    <article
      className="
        flex
        w-full

        flex-col

        gap-4

        rounded-[14px]

        border
        border-[#EAECF0]

        bg-white

        p-4

        shadow-[0px_1px_2px_rgba(16,24,40,0.03)]

        sm:flex-row
        sm:items-center
        sm:justify-between
        sm:p-5

        lg:min-h-[118px]
        lg:rounded-[16px]
      "
    >
      {/* =====================================================
          PLAN
      ====================================================== */}
      <div
        className="
          flex
          min-w-0

          items-center

          gap-3

          sm:gap-4
        "
      >
        <div
          className="
            flex
            h-[56px]
            w-[56px]
            shrink-0

            items-center
            justify-center

            overflow-hidden

            rounded-[10px]

            border
            border-[#EAECF0]

            bg-[#FCFCFD]

            sm:h-[64px]
            sm:w-[64px]
          "
        >
          {deal.logo ? (
            <Image
              src={deal.logo}
              alt={deal.logoAlt ?? provider}
              width={52}
              height={52}
              className="
                h-[48px]
                w-[48px]

                object-contain

                sm:h-[52px]
                sm:w-[52px]
              "
            />
          ) : (
            <UserRound
              aria-hidden="true"
              className="
                h-6
                w-6

                text-[#98A2B3]
              "
            />
          )}
        </div>

        <div className="min-w-0">
          <div
            className="
              flex
              flex-wrap
              items-center

              gap-2
            "
          >
            <h3
              className="
                truncate

                font-red-hat-display

                text-[15px]
                font-extrabold
                leading-5

                text-[#101828]

                sm:text-[16px]

                lg:text-[17px]
              "
            >
              {provider}
            </h3>

            <span
              className="
                inline-flex

                rounded-full

                bg-[#ECFDF3]

                px-2
                py-[2px]

                font-inter
                text-[9px]
                font-semibold

                text-[#027A48]

                sm:text-[10px]
              "
            >
              Active
            </span>
          </div>

          <p
            className="
              mt-1

              font-inter
              text-[11px]
              font-normal
              leading-[17px]

              text-[#667085]

              sm:text-[12px]
            "
          >
            {description}
          </p>

          {deal.service && (
            <p
              className="
                mt-[2px]

                capitalize

                font-inter
                text-[10px]
                font-normal
                leading-4

                text-[#667085]

                sm:text-[11px]
              "
            >
              {deal.service}
            </p>
          )}
        </div>
      </div>

      {/* =====================================================
          PRICE / CTA
      ====================================================== */}
      <div
        className="
          flex
          shrink-0

          items-center
          justify-between

          gap-4

          border-t
          border-[#F2F4F7]

          pt-3

          sm:flex-col
          sm:items-end
          sm:justify-center
          sm:border-t-0
          sm:pt-0

          lg:min-w-[155px]
        "
      >
        <div
          className="
            sm:text-right
          "
        >
          <p
            className="
              font-inter
              text-[8px]
              font-medium
              uppercase
              leading-3
              tracking-[0.04em]

              text-[#667085]

              sm:text-[9px]
            "
          >
            Estimated price
          </p>

          <p
            className="
              mt-[1px]

              font-red-hat-display

              text-[17px]
              font-extrabold
              leading-6

              text-[#101828]

              sm:text-[18px]
            "
          >
            {price}

            {deal.pricePeriod && (
              <span
                className="
                  ml-[2px]

                  font-inter
                  text-[9px]
                  font-normal

                  text-[#667085]
                "
              >
                {deal.pricePeriod}
              </span>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={onCompareAgain}
          className="
            inline-flex
            h-[36px]

            items-center
            justify-center

            gap-1.5

            rounded-full

            border
            border-[#D0D5DD]

            bg-white

            px-3.5

            font-red-hat-display
            text-[10px]
            font-bold

            text-[#0C3354]

            transition-colors

            hover:border-[#00897B]
            hover:text-[#00897B]

            sm:h-[38px]
            sm:text-[11px]

            lg:px-4
          "
        >
          <span>Compare again</span>

          <ArrowRight
            aria-hidden="true"
            className="
              h-3.5
              w-3.5
            "
          />
        </button>
      </div>
    </article>
  );
}

/* =========================================================
   FOOTER 2
========================================================= */

type FooterLink = {
  id: string;
  label: string;
  href: string;
};

type FooterTwoProps = {
  copyright: string;
  navigationAriaLabel: string;
  links: FooterLink[];
};

function FooterTwo({ copyright, navigationAriaLabel, links }: FooterTwoProps) {
  return (
    <footer
      className="
        mt-auto
        w-full

        border-t
        border-[#EAECF0]

        bg-white
      "
    >
      <div
        className="
          mx-auto

          flex
          w-full
          max-w-[1440px]

          flex-col
          items-center
          justify-between

          gap-3

          px-4
          py-4

          min-[390px]:px-5

          sm:px-6

          md:flex-row
          md:gap-6
          md:px-8

          lg:min-h-[66px]
          lg:px-10
          lg:py-3
        "
      >
        <p
          className="
            order-2

            font-inter
            text-[10px]
            font-normal
            leading-4

            text-[#101828]

            md:order-1

            lg:text-[12px]
          "
        >
          {copyright}
        </p>

        <nav
          aria-label={navigationAriaLabel}
          className="
            order-1

            flex
            flex-wrap

            items-center
            justify-center

            gap-2

            md:order-2
            md:justify-end

            lg:gap-3
          "
        >
          {links.map((link, index) => (
            <div
              key={link.id}
              className="
                  flex
                  items-center

                  gap-2

                  lg:gap-3
                "
            >
              <a
                href={link.href}
                className="
                    font-inter
                    text-[10px]
                    font-medium
                    leading-4

                    text-[#101828]

                    underline
                    underline-offset-2

                    transition-colors

                    hover:text-[#00897B]

                    lg:text-[12px]
                  "
              >
                {link.label}
              </a>

              {index < links.length - 1 && (
                <span
                  aria-hidden="true"
                  className="
                      text-[9px]

                      text-[#98A2B3]
                    "
                >
                  •
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
}
