/* eslint-disable @typescript-eslint/no-explicit-any, no-console */

// store/journeyStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface JourneyStore {
  journey: any | null;
  setJourney: (data: any) => void;
  updateJourney: (data: Partial<any>) => void;
  clearJourney: () => void;
}

export const useJourneyStore = create<JourneyStore>()(
  persist(
    (set) => ({
      journey: null,
      setJourney: (data) => {
        console.log('🔄 Setting journey in store:', data);
        set({ journey: data });
      },
      updateJourney: (data) =>
        set((state) => {
          const updated = state.journey ? { ...state.journey, ...data } : null;
          console.log('🔄 Updating journey:', updated);
          return { journey: updated };
        }),
      clearJourney: () => {
        console.log('🗑️ Clearing journey');
        set({ journey: null });
      },
    }),
    {
      name: 'journey-storage', // unique name for localStorage
    },
  ),
);
