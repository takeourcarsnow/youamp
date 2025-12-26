// Visualization display component

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface VisualizationProps {
  isPlaying: boolean;
  className?: string;
  barCount?: number;
}

export function Visualization({
  isPlaying,
  className,
  barCount = 20,
}: VisualizationProps) {
  const [bars, setBars] = useState<number[]>(Array(barCount).fill(0));
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isPlaying) {
      setBars(Array(barCount).fill(0));
      return;
    }

    const animate = () => {
      setBars((prev) =>
        prev.map(() => {
          const target = Math.random() * 100;
          return target;
        })
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    // Slower animation
    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map((current) => {
          const target = Math.random() * 100;
          // Smooth transition
          return current + (target - current) * 0.3;
        })
      );
    }, 100);

    return () => {
      clearInterval(interval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, barCount]);

  return (
    <div className={cn('visualization flex items-end gap-[2px] h-[40px]', className)}>
      {bars.map((height, index) => (
        <div
          key={index}
          className="visualization-bar flex-1 bg-gradient-to-t from-[#00ff00] via-[#aaff00] to-[#ff0000] transition-all duration-100"
          style={{ height: `${Math.max(2, height)}%` }}
        />
      ))}
    </div>
  );
}
