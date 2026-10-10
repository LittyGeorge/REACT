import { create } from 'zustand';

interface UiState {
  isMobileNavigationOpen: boolean;
  toggleMobileNavigation: () => void;
  closeMobileNavigation: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isMobileNavigationOpen: false,
  toggleMobileNavigation: () => set((state) => ({ isMobileNavigationOpen: !state.isMobileNavigationOpen })),
  closeMobileNavigation: () => set({ isMobileNavigationOpen: false }),
}));
