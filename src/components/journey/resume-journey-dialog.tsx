'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { ArrowRight, LoaderCircle, RotateCcw } from 'lucide-react';

import { getDefaultJourney } from '@/components/loadConfig';
import { storeJourney, storePartnerConfig } from '@/constants/shared';
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

type StorageSnapshot = {
  journey: unknown;
  journeyId: string | null;
};

function readPersistedJourney(): unknown {
  try {
    const stored = localStorage.getItem('journey-storage');
    if (!stored) return null;

    const parsed = JSON.parse(stored) as { state?: { journey?: unknown }; journey?: unknown };
    return parsed.state?.journey ?? parsed.journey ?? parsed;
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

export default function ResumeJourneyDialog({ journeyId }: { journeyId?: string }) {
  const router = useRouter();
  const { journey, clearJourney, setJourney } = useJourneyStore();
  const [resolvedJourneyId, setResolvedJourneyId] = useState('');
  const [activeAction, setActiveAction] = useState<Action | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [storageSnapshot, setStorageSnapshot] = useState<StorageSnapshot | null>(null);

  useEffect(() => {
    const storedJourney = readPersistedJourney();
    const fromPath = getResumeJourneyIdFromPath(window.location.pathname);

    // Browser storage is unavailable during server rendering.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResolvedJourneyId(journeyId || fromPath);
    setStorageSnapshot({
      journey: storedJourney,
      journeyId: localStorage.getItem(storeJourney) ?? getJourneyId(storedJourney),
    });
  }, [journeyId]);

  const persistedJourney = journey ?? storageSnapshot?.journey;
  const storedJourneyId = storageSnapshot?.journeyId ?? getJourneyId(journey);
  const hasDifferentJourney = Boolean(storedJourneyId && storedJourneyId !== resolvedJourneyId);
  const isBusy = activeAction !== null;

  const activateJourney = (nextJourney: unknown) => {
    clearJourney();
    clearJourneyStorage();

    const nextJourneyId = getJourneyId(nextJourney) ?? resolvedJourneyId;
    localStorage.setItem(storeJourney, nextJourneyId);
    setJourney(nextJourney);
  };

  const continueEmailJourney = async () => {
    if (isBusy) return;
    setActiveAction('email');
    setErrorMessage('');

    try {
      const response = await journeyApi.getJourney(resolvedJourneyId);
      const emailJourney = response.data;

      if (!emailJourney) throw new Error('Journey details were not returned by the API.');

      activateJourney(emailJourney);
      router.replace(getSafeJourneyUrl(emailJourney.lastUrl));
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setActiveAction(null);
    }
  };

  const continueExistingJourney = async () => {
    if (isBusy || !storedJourneyId) return;
    setActiveAction('existing');
    setErrorMessage('');

    try {
      let existingJourney = persistedJourney;

      if (!existingJourney || getJourneyId(existingJourney) !== storedJourneyId) {
        const response = await journeyApi.getJourney(storedJourneyId);
        existingJourney = response.data;
        if (existingJourney) setJourney(existingJourney);
      }

      const lastUrl = (existingJourney as { lastUrl?: unknown } | null)?.lastUrl;
      router.replace(getSafeJourneyUrl(lastUrl));
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
      router.replace('/');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setActiveAction(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071A2B]/55 px-4 py-8 backdrop-blur-[2px]"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-journey-title"
        aria-describedby="resume-journey-description"
        className="w-full max-w-[560px] rounded-2xl border border-[#EAECF0] bg-white p-6 shadow-[0_24px_70px_rgba(7,26,43,0.24)] sm:p-8"
      >
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#E6F4F2] text-[#00897B]">
          <RotateCcw
            aria-hidden="true"
            className="h-6 w-6"
          />
        </div>

        <h1
          id="resume-journey-title"
          className="font-red-hat-display text-2xl font-semibold text-[#101828] sm:text-[28px]"
        >
          Resume your journey
        </h1>
        <p
          id="resume-journey-description"
          className="mt-3 font-red-hat-display text-sm leading-6 text-[#667085] sm:text-base"
        >
          {hasDifferentJourney
            ? 'You already have another journey on this device. Choose which journey you would like to continue.'
            : 'Your saved journey is ready. You can continue where you left off or start again.'}
        </p>

        {errorMessage && (
          <p
            role="alert"
            className="mt-5 rounded-lg border border-[#FDA29B] bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318]"
          >
            {errorMessage}
          </p>
        )}

        <div className="mt-7 flex flex-col gap-3">
          <ActionButton
            label={
              hasDifferentJourney ? 'Continue with the email journey' : 'Continue with this journey'
            }
            loading={activeAction === 'email'}
            disabled={isBusy || !resolvedJourneyId}
            primary
            onClick={continueEmailJourney}
          />

          {hasDifferentJourney && (
            <ActionButton
              label="Continue with the existing journey"
              loading={activeAction === 'existing'}
              disabled={isBusy}
              onClick={continueExistingJourney}
            />
          )}

          <ActionButton
            label="Create a new journey"
            loading={activeAction === 'new'}
            disabled={isBusy}
            onClick={createNewJourney}
          />
        </div>
      </section>
    </div>
  );
}

type ActionButtonProps = {
  label: string;
  loading: boolean;
  disabled: boolean;
  primary?: boolean;
  onClick: () => void;
};

function ActionButton({ label, loading, disabled, primary = false, onClick }: ActionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:text-base ${
        primary
          ? 'border-[#00897B] bg-[#00897B] text-white hover:bg-[#00796D]'
          : 'border-[#D0D5DD] bg-white text-[#0C3354] hover:bg-[#F9FAFB]'
      }`}
    >
      {loading ? (
        <LoaderCircle
          aria-hidden="true"
          className="h-5 w-5 animate-spin"
        />
      ) : (
        <ArrowRight
          aria-hidden="true"
          className="h-5 w-5"
        />
      )}
      <span>{label}</span>
    </button>
  );
}
