'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { ArrowRight, LoaderCircle, Mail, Plus, TabletSmartphone } from 'lucide-react';

import { getDefaultJourney } from '@/components/loadConfig';
import { storeJourney, storePartnerConfig } from '@/constants/shared';
import type { Journey } from '@/interfaces/shared';
import { journeyApi } from '@/lib/api/endpoints/journey.api';
import { partnerConfigApi } from '@/lib/api/endpoints/partnerConfig';
import {
  clearJourneyStorage,
  getJourneyId,
  getResumeJourneyIdFromPath,
  getSafeJourneyUrl,
} from '@/lib/journey-storage';
import { useJourneyStore } from '@/store/journeyStore';

type Action = 'email' | 'existing' | 'new';

function readPersistedJourney(): Journey | null {
  try {
    const stored = localStorage.getItem('journey-storage');
    if (!stored) return null;

    const parsed = JSON.parse(stored) as { state?: { journey?: Journey }; journey?: Journey };
    return parsed.state?.journey ?? parsed.journey ?? null;
  } catch {
    return null;
  }
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message) return message;
  }

  return 'We could not resume this journey. Please try again.';
}

function formatJourneyTitle(journeyObj?: any): string {
  const service = (journeyObj?.serviceType || '').toLowerCase();
  if (service === 'billpackage' || service === 'bundle-bills') {
    return 'Bundle Bills Comparison';
  }
  if (service.includes('broadband')) {
    return 'Broadband Comparison';
  }
  if (service.includes('insurance')) {
    return 'Insurance Comparison';
  }
  if (service.includes('sim')) {
    return 'SIM Only Comparison';
  }
  return 'Energy Comparison';
}

function formatJourneyDate(dateStr?: string): string {
  if (!dateStr) {
    const today = new Date();
    return today.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) {
      return dateStr;
    }
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

type ResumeJourneyDialogProps = {
  journeyId?: string;
  deviceJourney?: Journey | null;
  onClose?: () => void;
};

export default function ResumeJourneyDialog({
  journeyId,
  deviceJourney: initialDeviceJourney,
  onClose,
}: ResumeJourneyDialogProps) {
  const router = useRouter();
  const { journey, clearJourney, setJourney } = useJourneyStore();
  const [resolvedJourneyId, setResolvedJourneyId] = useState('');
  const [emailJourney, setEmailJourney] = useState<Journey | null>(null);
  const [deviceJourney, setDeviceJourney] = useState<Journey | null>(initialDeviceJourney ?? null);
  const [activeAction, setActiveAction] = useState<Action | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);

  useEffect(() => {
    const fromPath = getResumeJourneyIdFromPath(window.location.pathname);
    const targetId = journeyId || fromPath;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResolvedJourneyId(targetId);

    if (!initialDeviceJourney) {
      const persisted = readPersistedJourney() ?? (journey as Journey | null);
      setDeviceJourney(persisted);
    }
  }, [journeyId, initialDeviceJourney, journey]);

  useEffect(() => {
    if (!resolvedJourneyId) return;

    let isMounted = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoadingEmail(true);

    journeyApi
      .getJourney(resolvedJourneyId)
      .then((res) => {
        if (isMounted && res.data) {
          setEmailJourney(res.data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to load email journey:', err);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingEmail(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [resolvedJourneyId]);

  const isBusy = activeAction !== null || isLoadingEmail;

  const activateJourney = (nextJourney: unknown, targetJourneyId?: string) => {
    clearJourney();
    clearJourneyStorage();

    const nextJourneyId = getJourneyId(nextJourney) ?? targetJourneyId ?? resolvedJourneyId;
    if (nextJourneyId) {
      localStorage.setItem(storeJourney, nextJourneyId);
    }
    setJourney(nextJourney);
  };

  const continueEmailJourney = async () => {
    if (isBusy) return;
    setActiveAction('email');
    setErrorMessage('');

    try {
      let targetJourney = emailJourney;
      if (!targetJourney && resolvedJourneyId) {
        const response = await journeyApi.getJourney(resolvedJourneyId);
        targetJourney = response.data;
      }

      if (!targetJourney) throw new Error('Journey details were not returned by the API.');

      activateJourney(targetJourney, resolvedJourneyId);
      onClose?.();
      router.replace(getSafeJourneyUrl(targetJourney.lastUrl));
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setActiveAction(null);
    }
  };

  const continueExistingJourney = async () => {
    if (isBusy) return;
    setActiveAction('existing');
    setErrorMessage('');

    try {
      const targetJourney = deviceJourney ?? (journey as Journey | null);
      if (targetJourney) {
        activateJourney(targetJourney);
        onClose?.();
        router.replace(getSafeJourneyUrl(targetJourney.lastUrl));
      } else {
        onClose?.();
        router.replace('/');
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setActiveAction(null);
    }
  };

  const createNewJourney = async () => {
    if (isBusy) return;
    setActiveAction('new');
    setErrorMessage('');
    clearJourney();
    clearJourneyStorage();

    try {
      const [configResponse, journeyResponse] = await Promise.all([
        partnerConfigApi.getConfig(),
        journeyApi.createJourney(getDefaultJourney()),
      ]);
      const newJourney = journeyResponse.data;
      const newJourneyId = getJourneyId(newJourney);

      if (!newJourney || !newJourneyId) throw new Error('No journey ID received from API.');

      localStorage.setItem(storePartnerConfig, JSON.stringify(configResponse.data));
      localStorage.setItem(storeJourney, newJourneyId);
      setJourney(newJourney);
      onClose?.();
      router.replace('/');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setActiveAction(null);
    }
  };

  // Determine which cards to show
  const showEmailCard = Boolean(resolvedJourneyId || emailJourney);
  const showDeviceCard = Boolean(
    deviceJourney &&
    (!showEmailCard ||
      (getJourneyId(deviceJourney) && getJourneyId(deviceJourney) !== resolvedJourneyId)),
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071A2B]/55 p-4 backdrop-blur-[2px] sm:p-6"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-journey-title"
        className="max-h-[min(620px,85vh)] w-full max-w-[540px] overflow-y-auto overscroll-contain rounded-[24px] border border-[#EAECF0] bg-white p-6 shadow-[0_24px_70px_rgba(7,26,43,0.24)] sm:p-8 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#D0D5DD] [&::-webkit-scrollbar-track]:bg-transparent"
      >
        <h1
          id="resume-journey-title"
          className="font-red-hat-display text-2xl font-semibold text-[#101828] sm:text-[28px]"
        >
          Which comparison would you like to continue?
        </h1>
        <p
          id="resume-journey-description"
          className="my-3 font-red-hat-display text-sm leading-6 text-[#667085] sm:text-base"
        >
          {!showDeviceCard
            ? 'You already have another journey on this device. Choose which journey you would like to continue.'
            : 'Your saved journey is ready. You can continue where you left off or start again.'}
        </p>

        {errorMessage && (
          <p
            role="alert"
            className="mb-4 rounded-lg border border-[#FDA29B] bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318]"
          >
            {errorMessage}
          </p>
        )}

        <div className="flex flex-col gap-3.5 sm:gap-4">
          {/* =====================================================
              CARD 1: OPENED FROM YOUR EMAIL
          ====================================================== */}
          {showEmailCard && (
            <div className="rounded-[18px] border border-[#EAECF0] bg-white p-5 shadow-sm transition-all sm:p-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-[#ECFDF3] px-3 py-1 font-inter text-[12px] font-semibold text-[#027A48]">
                  Opened from your email
                </span>
                <Mail className="h-5 w-5 text-[#667085]" />
              </div>

              <div className="mt-3.5">
                <h3 className="font-red-hat-display text-[18px] font-extrabold text-[#101828] sm:text-[20px]">
                  {formatJourneyTitle(emailJourney)}
                </h3>
                <p className="mt-1 font-inter text-[13px] text-[#667085] sm:text-[14px]">
                  Last updated:{' '}
                  {formatJourneyDate(
                    (emailJourney as any)?.updatedAtUtc ||
                      (emailJourney as any)?.generatedAtUtc ||
                      (emailJourney as any)?.createdAtUtc,
                  )}
                </p>
              </div>

              <button
                type="button"
                disabled={isBusy}
                onClick={continueEmailJourney}
                className="mt-5 flex h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#00897B] px-5 font-red-hat-display text-[14px] font-bold text-white shadow-sm transition-colors hover:bg-[#00796D] disabled:opacity-60 sm:h-[46px] sm:text-[15px]"
              >
                {activeAction === 'email' ? (
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span>Continue this comparison</span>
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* =====================================================
              CARD 2: SAVED ON THIS DEVICE
          ====================================================== */}
          {showDeviceCard && (
            <div className="rounded-[18px] border border-[#EAECF0] bg-white p-5 shadow-sm transition-all sm:p-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-[#F2F4F7] px-3 py-1 font-inter text-[12px] font-semibold text-[#344054]">
                  Saved on this device
                </span>
                <TabletSmartphone className="h-5 w-5 text-[#667085]" />
              </div>

              <div className="mt-3.5">
                <h3 className="font-red-hat-display text-[18px] font-extrabold text-[#101828] sm:text-[20px]">
                  {formatJourneyTitle(deviceJourney)}
                </h3>
                <p className="mt-1 font-inter text-[13px] text-[#667085] sm:text-[14px]">
                  Last updated:{' '}
                  {formatJourneyDate(
                    (deviceJourney as any)?.updatedAtUtc ||
                      (deviceJourney as any)?.generatedAtUtc ||
                      (deviceJourney as any)?.createdAtUtc,
                  )}
                </p>
              </div>

              <button
                type="button"
                disabled={isBusy}
                onClick={continueExistingJourney}
                className="mt-5 flex h-[44px] w-full items-center justify-center gap-2 rounded-full border border-[#D0D5DD] bg-white px-5 font-red-hat-display text-[14px] font-bold text-[#344054] transition-colors hover:bg-[#F9FAFB] disabled:opacity-60 sm:h-[46px] sm:text-[15px]"
              >
                {activeAction === 'existing' ? (
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span>Continue this comparison</span>
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* =====================================================
              CARD 3: START A NEW COMPARISON
          ====================================================== */}
          <button
            type="button"
            disabled={isBusy}
            onClick={createNewJourney}
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[16px] border border-[#D0D5DD] bg-white p-4 font-red-hat-display text-[15px] font-bold text-[#00897B] transition-colors hover:border-[#00897B] hover:bg-[#F9FAFB] disabled:opacity-60 sm:h-[56px] sm:text-[16px]"
          >
            {activeAction === 'new' ? (
              <LoaderCircle className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Plus className="h-5 w-5 stroke-[2.5]" />
                <span>Start a new comparison</span>
              </>
            )}
          </button>
        </div>

        {/* Footer Note */}
        <p className="mt-4 text-center font-inter text-[13px] text-[#667085]">
          Your other saved comparison won’t be deleted
        </p>
      </section>
    </div>
  );
}
