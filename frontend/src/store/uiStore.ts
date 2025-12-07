import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isFocusModeEnabled: boolean;
  toggleSidebar: () => void;
  toggleFocusMode: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isFocusModeEnabled: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleFocusMode: () => set((state) => {
    const enabled = !state.isFocusModeEnabled;
    if (typeof document !== 'undefined') {
      if (enabled) {
        document.body.classList.add('focus-mode');
      } else {
        document.body.classList.remove('focus-mode');
      }
    }
    return { isFocusModeEnabled: enabled };
  }),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}));
