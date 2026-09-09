'use client';

import { useSyncExternalStore } from 'react';

import data from '@/data/content.json';

import { type JourneyFlow, type JourneyService } from './journey-routes';

function getJourneyContextSnapshot(): string {
  if (typeof window === 'undefined') {
    return 'energy:energy';
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const urlService = urlParams.get('service');
    const urlFlow = urlParams.get('flow');

    if (urlService === 'insurance') {
      return 'insurance:insurance';
    }

    if (urlService === 'broadband') {
      return 'broadband:broadband';
    }

    if (urlFlow === 'bundle' || urlService === 'bundle-bills') {
      return 'energy:bundle';
    }

    if (urlService === 'energy') {
      return 'energy:energy';
    }

    const storedService = sessionStorage.getItem('billgooseJourneyService');
    const storedFlow = sessionStorage.getItem('billgooseJourneyFlow');

    if (storedService === 'insurance' || storedFlow === 'insurance') {
      return 'insurance:insurance';
    }

    if (storedService === 'broadband' || storedFlow === 'broadband') {
      return 'broadband:broadband';
    }

    if (storedFlow === 'bundle' || storedFlow === 'bundle-bills' || storedService === 'bundle-bills') {
      return 'energy:bundle';
    }

    const rawStorage = localStorage.getItem('journey-storage');
    const serviceType = rawStorage ? JSON.parse(rawStorage)?.state?.journey?.serviceType : null;

    if (serviceType === 'billPackage' || serviceType === 'bundle-bills') {
      return 'energy:bundle';
    }

    if (serviceType === 'insurance') {
      return 'insurance:insurance';
    }

    if (serviceType === 'broadband') {
      return 'broadband:broadband';
    }

    return 'energy:energy';
  } catch {
    return 'energy:energy';
  }
}

function getJourneyContextServerSnapshot(): string {
  return 'energy:energy';
}

function subscribeToJourneyContext(callback: () => void) {
  if (typeof window === 'undefined') return () => {};

  window.addEventListener('storage', callback);
  window.addEventListener('popstate', callback);
  window.addEventListener('billgoose-compare-flow-changed', callback);
  window.addEventListener('billgoose-journey-service-changed', callback);

  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('popstate', callback);
    window.removeEventListener('billgoose-compare-flow-changed', callback);
    window.removeEventListener('billgoose-journey-service-changed', callback);
  };
}

export type StepData = {
  number: number;
  title: string;
  description: string;
};

export function useJourneyStepInfo(stepNumber: number) {
  const snapshot = useSyncExternalStore(
    subscribeToJourneyContext,
    getJourneyContextSnapshot,
    getJourneyContextServerSnapshot,
  );

  const [service, flow] = snapshot.split(':') as [JourneyService, JourneyFlow];
  const { sidebar } = data.journey;

  const isBundle = flow === 'bundle';
  const steps: StepData[] =
    service === 'insurance'
      ? sidebar.insuranceSteps
      : isBundle
        ? sidebar.bundleSteps
        : service === 'broadband'
          ? sidebar.broadbandSteps
          : sidebar.energySteps;

  const totalSteps = steps.length;
  const currentStep = Math.min(Math.max(1, stepNumber), totalSteps);
  const currentStepData = steps[currentStep - 1] ?? {
    number: currentStep,
    title: '',
    description: '',
  };

  return {
    service,
    flow,
    isBundle,
    steps,
    totalSteps,
    currentStep,
    currentStepData,
  };
}
