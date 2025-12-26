// Main App component

'use client';

import React from 'react';
import { MenuBar, Desktop } from '@/components/layout';
import { useKeyboardShortcuts } from '@/hooks';
import { useUIStore } from '@/store';
import { cn } from '@/lib/utils';

export function App() {
  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  const { theme } = useUIStore();

  return (
    <div className={cn('app', theme === 'light' && 'light-theme')}>
      <MenuBar />
      <Desktop />
    </div>
  );
}
