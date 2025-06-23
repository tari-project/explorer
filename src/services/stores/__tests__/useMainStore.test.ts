import { describe, it, expect, beforeEach } from 'vitest'
import { useMainStore } from '../useMainStore'

describe('useMainStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useMainStore.setState({
      showMobileMenu: false,
      showDownloadModal: false,
      isMobile: false,
      searchOpen: false
    })
  })

  describe('showMobileMenu', () => {
    it('should have initial state as false', () => {
      const { showMobileMenu } = useMainStore.getState()
      expect(showMobileMenu).toBe(false)
    })

    it('should toggle showMobileMenu to true', () => {
      const { setShowMobileMenu } = useMainStore.getState()
      setShowMobileMenu(true)
      
      const { showMobileMenu } = useMainStore.getState()
      expect(showMobileMenu).toBe(true)
    })

    it('should toggle showMobileMenu to false', () => {
      const { setShowMobileMenu } = useMainStore.getState()
      setShowMobileMenu(true)
      setShowMobileMenu(false)
      
      const { showMobileMenu } = useMainStore.getState()
      expect(showMobileMenu).toBe(false)
    })
  })

  describe('showDownloadModal', () => {
    it('should have initial state as false', () => {
      const { showDownloadModal } = useMainStore.getState()
      expect(showDownloadModal).toBe(false)
    })

    it('should set showDownloadModal to true', () => {
      const { setShowDownloadModal } = useMainStore.getState()
      setShowDownloadModal(true)
      
      const { showDownloadModal } = useMainStore.getState()
      expect(showDownloadModal).toBe(true)
    })

    it('should set showDownloadModal to false', () => {
      const { setShowDownloadModal } = useMainStore.getState()
      setShowDownloadModal(true)
      setShowDownloadModal(false)
      
      const { showDownloadModal } = useMainStore.getState()
      expect(showDownloadModal).toBe(false)
    })
  })

  describe('isMobile', () => {
    it('should have initial state as false', () => {
      const { isMobile } = useMainStore.getState()
      expect(isMobile).toBe(false)
    })

    it('should set isMobile to true', () => {
      const { setIsMobile } = useMainStore.getState()
      setIsMobile(true)
      
      const { isMobile } = useMainStore.getState()
      expect(isMobile).toBe(true)
    })

    it('should set isMobile to false', () => {
      const { setIsMobile } = useMainStore.getState()
      setIsMobile(true)
      setIsMobile(false)
      
      const { isMobile } = useMainStore.getState()
      expect(isMobile).toBe(false)
    })
  })

  describe('searchOpen', () => {
    it('should have initial state as false', () => {
      const { searchOpen } = useMainStore.getState()
      expect(searchOpen).toBe(false)
    })

    it('should set searchOpen to true', () => {
      const { setSearchOpen } = useMainStore.getState()
      setSearchOpen(true)
      
      const { searchOpen } = useMainStore.getState()
      expect(searchOpen).toBe(true)
    })

    it('should set searchOpen to false', () => {
      const { setSearchOpen } = useMainStore.getState()
      setSearchOpen(true)
      setSearchOpen(false)
      
      const { searchOpen } = useMainStore.getState()
      expect(searchOpen).toBe(false)
    })
  })

  describe('multiple state updates', () => {
    it('should handle multiple simultaneous state updates', () => {
      const { setShowMobileMenu, setShowDownloadModal, setIsMobile, setSearchOpen } = useMainStore.getState()
      
      setShowMobileMenu(true)
      setShowDownloadModal(true)
      setIsMobile(true)
      setSearchOpen(true)
      
      const state = useMainStore.getState()
      expect(state.showMobileMenu).toBe(true)
      expect(state.showDownloadModal).toBe(true)
      expect(state.isMobile).toBe(true)
      expect(state.searchOpen).toBe(true)
    })

    it('should maintain independent state for each property', () => {
      const { setShowMobileMenu, setShowDownloadModal, setIsMobile, setSearchOpen } = useMainStore.getState()
      
      setShowMobileMenu(true)
      setShowDownloadModal(false)
      setIsMobile(true)
      setSearchOpen(false)
      
      const state = useMainStore.getState()
      expect(state.showMobileMenu).toBe(true)
      expect(state.showDownloadModal).toBe(false)
      expect(state.isMobile).toBe(true)
      expect(state.searchOpen).toBe(false)
    })
  })

  describe('store interface', () => {
    it('should have all required properties and methods', () => {
      const state = useMainStore.getState()
      
      // Check properties exist
      expect(state).toHaveProperty('showMobileMenu')
      expect(state).toHaveProperty('showDownloadModal')
      expect(state).toHaveProperty('isMobile')
      expect(state).toHaveProperty('searchOpen')
      
      // Check setters exist and are functions
      expect(state).toHaveProperty('setShowMobileMenu')
      expect(state).toHaveProperty('setShowDownloadModal')
      expect(state).toHaveProperty('setIsMobile')
      expect(state).toHaveProperty('setSearchOpen')
      
      expect(typeof state.setShowMobileMenu).toBe('function')
      expect(typeof state.setShowDownloadModal).toBe('function')
      expect(typeof state.setIsMobile).toBe('function')
      expect(typeof state.setSearchOpen).toBe('function')
    })

    it('should have correct types for boolean properties', () => {
      const state = useMainStore.getState()
      
      expect(typeof state.showMobileMenu).toBe('boolean')
      expect(typeof state.showDownloadModal).toBe('boolean')
      expect(typeof state.isMobile).toBe('boolean')
      expect(typeof state.searchOpen).toBe('boolean')
    })
  })

  describe('store reactivity', () => {
    it('should allow subscription to state changes', () => {
      let callCount = 0
      let lastState: any = null
      
      const unsubscribe = useMainStore.subscribe((state) => {
        callCount++
        lastState = state
      })
      
      const { setShowMobileMenu } = useMainStore.getState()
      setShowMobileMenu(true)
      
      expect(callCount).toBe(1)
      expect(lastState?.showMobileMenu).toBe(true)
      
      unsubscribe()
    })
  })
})
