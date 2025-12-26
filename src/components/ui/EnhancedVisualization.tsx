// Enhanced Visualization component with multiple modes

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

type VisualizationMode = 'bars' | 'wave' | 'spectrum' | 'oscilloscope' | 'circle';

interface EnhancedVisualizationProps {
  isPlaying: boolean;
  className?: string;
  barCount?: number;
  mode?: VisualizationMode;
  onModeChange?: (mode: VisualizationMode) => void;
}

const MODES: VisualizationMode[] = ['bars', 'wave', 'spectrum', 'oscilloscope', 'circle'];

export function EnhancedVisualization({
  isPlaying,
  className,
  barCount = 20,
  mode = 'bars',
  onModeChange,
}: EnhancedVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<number[]>(Array(barCount).fill(0));
  const animationRef = useRef<number | undefined>(undefined);
  const phaseRef = useRef(0);

  // Generate pseudo-random audio data based on time
  const generateData = useCallback(() => {
    const time = Date.now() / 1000;
    phaseRef.current += 0.1;
    
    return Array(barCount).fill(0).map((_, i) => {
      // Create more realistic audio-like patterns
      const bass = Math.sin(time * 2 + i * 0.1) * 30 + 30;
      const mid = Math.sin(time * 4 + i * 0.3) * 20 + 20;
      const high = Math.sin(time * 8 + i * 0.5) * 15 + 15;
      const noise = Math.random() * 10;
      
      // Different frequency distribution
      const freqWeight = i < barCount / 3 ? bass : i < barCount * 2 / 3 ? mid : high;
      
      return Math.max(5, Math.min(100, freqWeight + noise));
    });
  }, [barCount]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) {
      setData(Array(barCount).fill(2));
      return;
    }

    const intervalId = setInterval(() => {
      setData(prev => {
        const newData = generateData();
        return prev.map((v, i) => v + (newData[i] - v) * 0.3);
      });
    }, 50);

    return () => {
      clearInterval(intervalId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, generateData, barCount]);

  // Canvas rendering for advanced modes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = false;

    if (mode === 'wave') {
      ctx.beginPath();
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 1;

      data.forEach((value, i) => {
        const x = (i / data.length) * width;
        const y = height / 2 + Math.sin(phaseRef.current + i * 0.2) * (value / 100) * (height / 2 - 2);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    } else if (mode === 'oscilloscope') {
      ctx.beginPath();
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 1;

      for (let i = 0; i < width; i++) {
        const dataIndex = Math.floor((i / width) * data.length);
        const value = data[dataIndex] || 0;
        const y = height / 2 + Math.sin(phaseRef.current * 3 + i * 0.08) * (value / 100) * (height / 2);
        
        if (i === 0) {
          ctx.moveTo(i, y);
        } else {
          ctx.lineTo(i, y);
        }
      }

      ctx.stroke();
    } else if (mode === 'circle') {
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 3;

      data.forEach((value, i) => {
        const angle = (i / data.length) * Math.PI * 2 - Math.PI / 2;
        const barLength = (value / 100) * radius * 0.7;
        
        const x1 = centerX + Math.cos(angle) * radius * 0.3;
        const y1 = centerY + Math.sin(angle) * radius * 0.3;
        const x2 = centerX + Math.cos(angle) * (radius * 0.3 + barLength);
        const y2 = centerY + Math.sin(angle) * (radius * 0.3 + barLength);

        const intensity = value / 100;
        ctx.strokeStyle = intensity > 0.7 ? '#ff0000' : intensity > 0.4 ? '#ffff00' : '#00ff00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });
    } else if (mode === 'spectrum') {
      const barWidth = Math.floor(width / data.length);
      
      data.forEach((value, i) => {
        const barHeight = Math.floor((value / 100) * height);
        const x = i * barWidth;
        const y = height - barHeight;

        // Classic spectrum gradient
        const gradient = ctx.createLinearGradient(x, height, x, y);
        gradient.addColorStop(0, '#00ff00');
        gradient.addColorStop(0.6, '#ffff00');
        gradient.addColorStop(1, '#ff0000');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 1, barHeight);
      });
    }
  }, [data, mode]);

  const handleClick = () => {
    if (onModeChange) {
      const currentIndex = MODES.indexOf(mode);
      const nextIndex = (currentIndex + 1) % MODES.length;
      onModeChange(MODES[nextIndex]);
    }
  };

  // Classic Winamp bars mode uses divs with pixel-perfect styling
  if (mode === 'bars') {
    return (
      <div 
        className={cn(
          'visualization flex items-end gap-px h-[38px] cursor-pointer bg-black p-[2px]',
          className
        )}
        onClick={handleClick}
        title="Click to change visualization mode"
        style={{
          border: '1px solid',
          borderColor: '#000 #3a3a3a #3a3a3a #000',
        }}
      >
        {data.map((height, index) => {
          const normalizedHeight = Math.max(2, height);
          const segments = Math.floor(normalizedHeight / 8);
          
          return (
            <div
              key={index}
              className="flex-1 flex flex-col-reverse gap-px"
              style={{ height: '100%' }}
            >
              {Array.from({ length: Math.min(segments, 12) }).map((_, segIndex) => {
                const isTop = segIndex >= 10;
                const isMid = segIndex >= 6;
                return (
                  <div
                    key={segIndex}
                    className="w-full"
                    style={{
                      height: '2px',
                      backgroundColor: isTop ? '#ff0000' : isMid ? '#ffff00' : '#00ff00',
                      boxShadow: isTop ? '0 0 2px #ff0000' : isMid ? '0 0 2px #ffff00' : '0 0 2px #00ff00',
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  // Other modes use canvas
  return (
    <canvas
      ref={canvasRef}
      width={180}
      height={38}
      className={cn('cursor-pointer bg-black', className)}
      onClick={handleClick}
      title="Click to change visualization mode"
      style={{
        border: '1px solid',
        borderColor: '#000 #3a3a3a #3a3a3a #000',
        imageRendering: 'pixelated',
      }}
    />
  );
}

export { type VisualizationMode };
