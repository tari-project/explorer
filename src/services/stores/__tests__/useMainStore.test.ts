import { describe, it, expect, beforeEach } from 'vitest';
import { useMainStore } from '../useMainStore';

type Store = {
  showMobileMenu: boolean;
  setShowMobileMenu: (showMobileMenu: boolean) => void;
  showDownloadModal: boolean;
  setShowDownloadModal: (showDownloadModal: boolean) => void;
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (searchOpen: boolean) => void;
};

describe('useMainStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useMainStore.setState({
      showMobileMenu: false,
      showDownloadModal: false,
      isMobile: false,
      searchOpen: false,
    });
  });

  it('should have correct initial state', () => {
    const state = useMainStore.getState();

    expect(state.showMobileMenu).toBe(false);
    expect(state.showDownloadModal).toBe(false);
    expect(state.isMobile).toBe(false);
    expect(state.searchOpen).toBe(false);
  });

  it('should update showMobileMenu state', () => {
    const { setShowMobileMenu } = useMainStore.getState();

    setShowMobileMenu(true);
    expect(useMainStore.getState().showMobileMenu).toBe(true);

    setShowMobileMenu(false);
    expect(useMainStore.getState().showMobileMenu).toBe(false);
  });

  it('should update showDownloadModal state', () => {
    const { setShowDownloadModal } = useMainStore.getState();

    setShowDownloadModal(true);
    expect(useMainStore.getState().showDownloadModal).toBe(true);

    setShowDownloadModal(false);
    expect(useMainStore.getState().showDownloadModal).toBe(false);
  });

  it('should update isMobile state', () => {
    const { setIsMobile } = useMainStore.getState();

    setIsMobile(true);
    expect(useMainStore.getState().isMobile).toBe(true);

    setIsMobile(false);
    expect(useMainStore.getState().isMobile).toBe(false);
  });

  it('should update searchOpen state', () => {
    const { setSearchOpen } = useMainStore.getState();

    setSearchOpen(true);
    expect(useMainStore.getState().searchOpen).toBe(true);

    setSearchOpen(false);
    expect(useMainStore.getState().searchOpen).toBe(false);
  });

  it('should maintain independent state for each property', () => {
    const {
      setShowMobileMenu,
      setShowDownloadModal,
      setIsMobile,
      setSearchOpen,
    } = useMainStore.getState();

    setShowMobileMenu(true);
    setIsMobile(true);
    setShowDownloadModal(false);
    setSearchOpen(false);

    const state = useMainStore.getState();
    expect(state.showMobileMenu).toBe(true);
    expect(state.isMobile).toBe(true);
    expect(state.showDownloadModal).toBe(false);
    expect(state.searchOpen).toBe(false);
  });

  it('should allow multiple state updates', () => {
    const { setShowMobileMenu, setShowDownloadModal } = useMainStore.getState();

    setShowMobileMenu(true);
    setShowDownloadModal(true);

    const state = useMainStore.getState();
    expect(state.showMobileMenu).toBe(true);
    expect(state.showDownloadModal).toBe(true);
  });

  it('should provide all required setter functions', () => {
    const state = useMainStore.getState();

    expect(typeof state.setShowMobileMenu).toBe('function');
    expect(typeof state.setShowDownloadModal).toBe('function');
    expect(typeof state.setIsMobile).toBe('function');
    expect(typeof state.setSearchOpen).toBe('function');
  });

  it('should work with zustand selector pattern', () => {
    // Test that we can call selectors directly on the store state
    const state = useMainStore.getState();
    const showMobileMenu = (state: Store) => state.showMobileMenu;
    const setShowMobileMenu = (state: Store) => state.setShowMobileMenu;

    expect(showMobileMenu(state)).toBe(false);
    expect(typeof setShowMobileMenu(state)).toBe('function');
  });
});
