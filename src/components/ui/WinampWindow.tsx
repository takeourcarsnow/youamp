// Winamp-style Window Frame component

'use client';

import React, { ReactNode } from 'react';
import { useDraggable } from '@/hooks';
import { WindowPosition } from '@/types';
import { cn } from '@/lib/utils';

interface WinampWindowProps {
  title: string;
  children: ReactNode;
  className?: string;
  position: WindowPosition;
  onPositionChange?: (position: WindowPosition) => void;
  onClose?: () => void;
  onMinimize?: () => void;
  showShade?: boolean;
  onShade?: () => void;
  isShaded?: boolean;
  width?: number;
  extraButtons?: ReactNode;
}

export function WinampWindow({
  title,
  children,
  className,
  position,
  onPositionChange,
  onClose,
  onMinimize,
  showShade = false,
  onShade,
  isShaded = false,
  width = 275,
  extraButtons,
}: WinampWindowProps) {
  const { position: currentPosition, isDragging, handleMouseDown } = useDraggable({
    initialPosition: position,
    onPositionChange,
    bounds: { minX: 0, minY: 0 },
  });

  return (
    <div
      className={cn(
        'absolute winamp-window',
        isDragging && 'cursor-grabbing',
        className
      )}
      style={{
        left: currentPosition.x,
        top: currentPosition.y,
        width,
        zIndex: isDragging ? 1000 : 1,
      }}
    >
      {/* Title Bar */}
      <div
        className="winamp-titlebar flex items-center justify-between cursor-grab select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <span className="winamp-title truncate">{title}</span>
        </div>
        <div className="flex items-center gap-0.5">
          {extraButtons}
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="winamp-button w-[9px] h-[9px]"
              title="Minimize"
            >
              <span className="text-[8px] leading-none">_</span>
            </button>
          )}
          {showShade && onShade && (
            <button
              onClick={onShade}
              className="winamp-button w-[9px] h-[9px]"
              title={isShaded ? 'Unshade' : 'Shade'}
            >
              <span className="text-[8px] leading-none">{isShaded ? '□' : '▬'}</span>
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="winamp-button winamp-close w-[9px] h-[9px]"
              title="Close"
            >
              <span className="text-[8px] leading-none">×</span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {!isShaded && <div className="winamp-content">{children}</div>}
    </div>
  );
}
