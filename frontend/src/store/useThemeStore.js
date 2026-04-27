import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme-storage');
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        if (parsed.state && parsed.state.isDarkMode !== undefined) {
          return parsed.state.isDarkMode;
        }
      } catch (e) {
        console.error('Error parsing theme storage', e);
      }
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return true; // Default to dark for SSR
};

const useThemeStore = create(
  persist(
    (set) => ({
      isDarkMode: getInitialTheme(),
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'theme-storage',
    }
  )
);

export default useThemeStore;
