// Equalizer store

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EQUALIZER_PRESETS, EqualizerPreset } from '@/types';

interface EqualizerStore {
  isEnabled: boolean;
  bands: number[];
  preampGain: number;
  currentPreset: string | null;

  // Actions
  setEnabled: (enabled: boolean) => void;
  toggleEnabled: () => void;
  setBandGain: (index: number, gain: number) => void;
  setAllBands: (bands: number[]) => void;
  setPreampGain: (gain: number) => void;
  applyPreset: (preset: EqualizerPreset) => void;
  reset: () => void;
}

const defaultBands = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export const useEqualizerStore = create<EqualizerStore>()(
  persist(
    (set) => ({
      isEnabled: true,
      bands: [...defaultBands],
      preampGain: 0,
      currentPreset: 'Flat',

      setEnabled: (enabled) => set({ isEnabled: enabled }),

      toggleEnabled: () => set((state) => ({ isEnabled: !state.isEnabled })),

      setBandGain: (index, gain) =>
        set((state) => {
          const newBands = [...state.bands];
          newBands[index] = Math.max(-12, Math.min(12, gain));
          return { bands: newBands, currentPreset: null };
        }),

      setAllBands: (bands) =>
        set({
          bands: bands.map((g) => Math.max(-12, Math.min(12, g))),
          currentPreset: null,
        }),

      setPreampGain: (gain) =>
        set({ preampGain: Math.max(-12, Math.min(12, gain)) }),

      applyPreset: (preset) =>
        set({
          bands: [...preset.bands],
          currentPreset: preset.name,
        }),

      reset: () =>
        set({
          bands: [...defaultBands],
          preampGain: 0,
          currentPreset: 'Flat',
        }),
    }),
    {
      name: 'youamp-equalizer-storage',
    }
  )
);

// Helper hook to get preset by name
export const getPresetByName = (name: string): EqualizerPreset | undefined => {
  return EQUALIZER_PRESETS.find((p) => p.name === name);
};
