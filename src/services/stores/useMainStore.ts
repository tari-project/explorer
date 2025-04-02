import { create } from 'zustand';

interface Store {
  showMobileMenu: boolean;
  setShowMobileMenu: (showMobileMenu: boolean) => void;
  showDownloadModal: boolean;
  setShowDownloadModal: (showDownloadModal: boolean) => void;
}

export const useMainStore = create<Store>()((set) => ({
  showMobileMenu: false,
  setShowMobileMenu: (showMobileMenu: boolean) => set({ showMobileMenu }),
  showDownloadModal: false,
  setShowDownloadModal: (showDownloadModal: boolean) =>
    set({ showDownloadModal }),
}));
