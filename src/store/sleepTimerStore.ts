// Sleep Timer Store

import { create } from 'zustand';

interface SleepTimerStore {
  // State
  isActive: boolean;
  remainingMinutes: number;
  totalMinutes: number;
  timerId: NodeJS.Timeout | null;
  
  // Actions
  startTimer: (minutes: number) => void;
  stopTimer: () => void;
  tick: () => void;
  setTimerId: (id: NodeJS.Timeout | null) => void;
}

export const useSleepTimerStore = create<SleepTimerStore>((set, get) => ({
  isActive: false,
  remainingMinutes: 0,
  totalMinutes: 0,
  timerId: null,
  
  startTimer: (minutes) => {
    const { timerId } = get();
    if (timerId) {
      clearInterval(timerId);
    }
    
    set({
      isActive: true,
      remainingMinutes: minutes,
      totalMinutes: minutes,
    });
  },
  
  stopTimer: () => {
    const { timerId } = get();
    if (timerId) {
      clearInterval(timerId);
    }
    
    set({
      isActive: false,
      remainingMinutes: 0,
      totalMinutes: 0,
      timerId: null,
    });
  },
  
  tick: () => {
    const { remainingMinutes } = get();
    if (remainingMinutes <= 1) {
      get().stopTimer();
    } else {
      set({ remainingMinutes: remainingMinutes - 1 });
    }
  },
  
  setTimerId: (id) => set({ timerId: id }),
}));
