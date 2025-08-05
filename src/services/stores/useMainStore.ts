import { create } from 'zustand';

interface Store {
  showMobileMenu: boolean;
  setShowMobileMenu: (showMobileMenu: boolean) => void;
  showDownloadModal: boolean;
  setShowDownloadModal: (showDownloadModal: boolean) => void;
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (searchOpen: boolean) => void;
  isLinux: boolean;
  setIsLinux: (isLinux: boolean) => void;
}

export const useMainStore = create<Store>()((set) => ({
  showMobileMenu: false,
  setShowMobileMenu: (showMobileMenu: boolean) => set({ showMobileMenu }),
  showDownloadModal: false,
  setShowDownloadModal: (showDownloadModal: boolean) =>
    set({ showDownloadModal }),
  isMobile: false,
  setIsMobile: (isMobile: boolean) => set({ isMobile }),
  searchOpen: false,
  setSearchOpen: (searchOpen: boolean) => set({ searchOpen }),
  isLinux: false,
  setIsLinux: (isLinux: boolean) => set({ isLinux }),
}));
