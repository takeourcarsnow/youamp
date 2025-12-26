'use client';

import { App } from '@/components/App';
import { ThemeProvider } from '@/components/providers';

export default function Home() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
