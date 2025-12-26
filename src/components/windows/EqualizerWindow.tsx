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
      title="EQUALIZER"
      position={equalizerWindow.position}
      onPositionChange={(pos) => setWindowPosition('equalizerWindow', pos)}
      onClose={() => toggleWindow('equalizerWindow')}
      width={275}
    >
      <div className="equalizer-content">
        {/* Header with enable toggle and presets */}
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#3a3a3a]">
          <button
            onClick={toggleEnabled}
            className={cn(
              'mode-button text-[7px] w-8',
              isEnabled && 'mode-button-active'
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
            className="winamp-select text-[8px] w-[90px]"
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
            className="mode-button text-[7px] w-10"
          >
            RESET
          </button>
        </div>

        {/* EQ Graph Background */}
        <div 
          className="eq-graph relative mb-2 p-1"
          style={{
            background: '#000',
            border: '1px solid',
            borderColor: '#000 #3a3a3a #3a3a3a #000',
          }}
        >
          {/* Grid lines */}
          <div className="absolute inset-1 pointer-events-none">
            {[0, 25, 50, 75, 100].map((y) => (
              <div
                key={y}
                className="absolute w-full border-t border-[#1a3a1a]"
                style={{ top: `${y}%` }}
              />
            ))}
          </div>

          {/* EQ Bands */}
          <div className="flex items-end justify-between relative z-10 h-[70px]">
            {/* Preamp */}
            <div className="flex flex-col items-center">
              <WinampSlider
                value={preampGain + 12}
                min={0}
                max={24}
                onChange={(v) => setPreampGain(v - 12)}
                orientation="vertical"
                className="h-[60px]"
                showFill={false}
              />
              <span className="text-[6px] text-[#00aa00] mt-0.5 font-bold">PRE</span>
            </div>

            <div className="w-px h-[65px] bg-[#3a3a3a] mx-1" />

            {/* Frequency bands */}
            {bands.map((gain, index) => (
              <div key={index} className="flex flex-col items-center">
                <WinampSlider
                  value={gain + 12}
                  min={0}
                  max={24}
                  onChange={(v) => setBandGain(index, v - 12)}
                  orientation="vertical"
                  className={cn('h-[60px]', !isEnabled && 'opacity-40')}
                  showFill={false}
                />
                <span className="text-[6px] text-[#00aa00] mt-0.5 font-bold">
                  {EQUALIZER_FREQUENCIES[index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scale indicators */}
        <div className="flex justify-between px-1">
          <span className="text-[7px] text-[#00aa00] font-bold">+12dB</span>
          <span className="text-[7px] text-[#00aa00] font-bold">0dB</span>
          <span className="text-[7px] text-[#00aa00] font-bold">-12dB</span>
        </div>
      </div>
    </WinampWindow>
  );
}
