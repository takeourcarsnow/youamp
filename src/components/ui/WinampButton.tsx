// Winamp-style Button component

'use client';

import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface WinampButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'small' | 'icon' | 'text';
  active?: boolean;
}

export function WinampButton({
  children,
  className,
  variant = 'default',
  active = false,
  disabled,
  ...props
}: WinampButtonProps) {
  return (
    <button
      className={cn(
        'winamp-button',
        variant === 'small' && 'winamp-button-small',
        variant === 'icon' && 'winamp-button-icon',
        variant === 'text' && 'winamp-button-text',
        active && 'winamp-button-active',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
