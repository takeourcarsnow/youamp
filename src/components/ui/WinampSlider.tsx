// Winamp-style Slider component

'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface WinampSliderProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  trackClassName?: string;
  thumbClassName?: string;
  showFill?: boolean;
}

export function WinampSlider({
  value,
  min = 0,
  max = 100,
  onChange,
  orientation = 'horizontal',
  className,
  trackClassName,
  thumbClassName,
  showFill = true,
}: WinampSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const calculateValue = useCallback(
    (clientX: number, clientY: number) => {
      if (!trackRef.current) return value;

      const rect = trackRef.current.getBoundingClientRect();
      let percentage: number;

      if (orientation === 'horizontal') {
        percentage = (clientX - rect.left) / rect.width;
      } else {
        // Vertical: top is max, bottom is min
        percentage = 1 - (clientY - rect.top) / rect.height;
      }

      percentage = Math.max(0, Math.min(1, percentage));
      return Math.round(min + percentage * (max - min));
    },
    [min, max, orientation, value]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      const newValue = calculateValue(e.clientX, e.clientY);
      onChange(newValue);
    },
    [calculateValue, onChange]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const newValue = calculateValue(e.clientX, e.clientY);
      onChange(newValue);
    },
    [isDragging, calculateValue, onChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const percentage = ((value - min) / (max - min)) * 100;

  const isVertical = orientation === 'vertical';

  return (
    <div
      ref={trackRef}
      className={cn(
        'winamp-slider',
        isVertical ? 'winamp-slider-vertical' : 'winamp-slider-horizontal',
        className
      )}
      onMouseDown={handleMouseDown}
    >
      {/* Track */}
      <div className={cn('winamp-slider-track', trackClassName)}>
        {/* Fill */}
        {showFill && (
          <div
            className="winamp-slider-fill"
            style={
              isVertical
                ? { height: `${percentage}%`, bottom: 0 }
                : { width: `${percentage}%` }
            }
          />
        )}
      </div>

      {/* Thumb */}
      <div
        className={cn('winamp-slider-thumb', thumbClassName)}
        style={
          isVertical
            ? { bottom: `${percentage}%`, transform: 'translateY(50%)' }
            : { left: `${percentage}%`, transform: 'translateX(-50%)' }
        }
      />
    </div>
  );
}
