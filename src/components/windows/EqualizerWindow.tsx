// Equalizer Window

'use client';

import React from 'react';
import { WinampWindow, WinampSlider } from '@/components/ui';
import { useUIStore, useEqualizerStore } from '@/store';
import { EQUALIZER_FREQUENCIES, EQUALIZER_PRESETS } from '@/types';
import { cn } from '@/lib/utils';

export function EqualizerWindow() {
  const { equalizerWindow, setWindowPosition, toggleWindow } = useUIStore();
  const {
    isEnabled,
    bands,
    preampGain,
    currentPreset,
    toggleEnabled,
    setBandGain,
    setPreampGain,
    applyPreset,
    reset,
  } = useEqualizerStore();

  if (!equalizerWindow.isOpen) return null;

  return (
    <WinampWindow
      title="Equalizer"
      position={equalizerWindow.position}
      onPositionChange={(pos) => setWindowPosition('equalizerWindow', pos)}
      onClose={() => toggleWindow('equalizerWindow')}
      width={275}
    >
      <div className="equalizer-content">
        {/* Header with enable toggle and presets */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={toggleEnabled}
            className={cn(
              'px-2 py-1 text-xs rounded',
              isEnabled
                ? 'bg-[#00ff00]/20 text-[#00ff00]'
                : 'bg-gray-600/50 text-gray-400'
            )}
          >
            {isEnabled ? 'ON' : 'OFF'}
          </button>

          <select
            value={currentPreset || ''}
            onChange={(e) => {
              const preset = EQUALIZER_PRESETS.find((p) => p.name === e.target.value);
              if (preset) applyPreset(preset);
            }}
            className="bg-black/50 text-[#00ff00] text-xs px-2 py-1 rounded border border-[#00ff00]/30"
          >
            <option value="" disabled>
              Presets
            </option>
            {EQUALIZER_PRESETS.map((preset) => (
              <option key={preset.name} value={preset.name}>
                {preset.name}
              </option>
            ))}
          </select>

          <button
            onClick={reset}
            className="px-2 py-1 text-xs rounded bg-gray-600/50 text-gray-300 hover:bg-gray-500/50"
          >
            Reset
          </button>
        </div>

        {/* EQ Bands */}
        <div className="flex items-end gap-1">
          {/* Preamp */}
          <div className="flex flex-col items-center">
            <WinampSlider
              value={preampGain + 12}
              min={0}
              max={24}
              onChange={(v) => setPreampGain(v - 12)}
              orientation="vertical"
              className="h-[80px]"
              showFill={false}
            />
            <span className="text-[8px] text-[#00ff00] mt-1">PRE</span>
          </div>

          <div className="w-px h-[90px] bg-[#00ff00]/30 mx-1" />

          {/* Frequency bands */}
          {bands.map((gain, index) => (
            <div key={index} className="flex flex-col items-center">
              <WinampSlider
                value={gain + 12}
                min={0}
                max={24}
                onChange={(v) => setBandGain(index, v - 12)}
                orientation="vertical"
                className={cn('h-[80px]', !isEnabled && 'opacity-50')}
                showFill={false}
              />
              <span className="text-[8px] text-[#00ff00] mt-1">
                {EQUALIZER_FREQUENCIES[index]}
              </span>
            </div>
          ))}
        </div>

        {/* Scale indicators */}
        <div className="flex justify-between mt-2 px-2">
          <span className="text-[8px] text-[#00ff00]/60">+12dB</span>
          <span className="text-[8px] text-[#00ff00]/60">0dB</span>
          <span className="text-[8px] text-[#00ff00]/60">-12dB</span>
        </div>
      </div>
    </WinampWindow>
  );
}
