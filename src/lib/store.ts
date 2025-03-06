import { create } from 'zustand';
import { User, MoodEntry } from '../types/database';

interface AppState {
  user: User | null;
  moodEntries: MoodEntry[];
  darkMode: boolean;
  setUser: (user: User | null) => void;
  setMoodEntries: (entries: MoodEntry[]) => void;
  setDarkMode: (darkMode: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  moodEntries: [],
  darkMode: false,
  setUser: (user) => set({ user }),
  setMoodEntries: (entries) => set({ moodEntries: entries }),
  setDarkMode: (darkMode) => set({ darkMode }),
}));