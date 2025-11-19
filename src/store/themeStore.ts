import { create } from 'zustand';

interface ThemeStore {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  isDark: typeof window !== 'undefined' ? document.documentElement.classList.contains('dark') : false,

  toggleTheme: () => {
    set((state) => {
      const newIsDark = !state.isDark;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
        if (newIsDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return { isDark: newIsDark };
    });
  },

  setTheme: (isDark) => {
    set({ isDark });
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },
}));
