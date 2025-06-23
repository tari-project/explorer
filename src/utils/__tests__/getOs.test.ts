import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getOS } from '../getOs'

// Mock window.navigator
const mockNavigator = (userAgent: string, platform: string) => {
  Object.defineProperty(window, 'navigator', {
    value: {
      userAgent,
      platform,
    },
    writable: true,
  })
}

describe('getOS', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('MacOS detection', () => {
    it('should detect MacIntel', () => {
      mockNavigator('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'MacIntel')
      expect(getOS()).toBe('MacOS')
    })

    it('should detect Macintosh', () => {
      mockNavigator('Mozilla/5.0 (Macintosh)', 'Macintosh')
      expect(getOS()).toBe('MacOS')
    })

    it('should detect MacPPC', () => {
      mockNavigator('Mozilla/5.0 (Macintosh)', 'MacPPC')
      expect(getOS()).toBe('MacOS')
    })

    it('should detect Mac68K', () => {
      mockNavigator('Mozilla/5.0 (Macintosh)', 'Mac68K')
      expect(getOS()).toBe('MacOS')
    })
  })

  describe('iOS detection', () => {
    it('should detect iPhone', () => {
      mockNavigator('Mozilla/5.0 (iPhone)', 'iPhone')
      expect(getOS()).toBe('iOS')
    })

    it('should detect iPad', () => {
      mockNavigator('Mozilla/5.0 (iPad)', 'iPad')
      expect(getOS()).toBe('iOS')
    })

    it('should detect iPod', () => {
      mockNavigator('Mozilla/5.0 (iPod)', 'iPod')
      expect(getOS()).toBe('iOS')
    })
  })

  describe('Windows detection', () => {
    it('should detect Win32', () => {
      mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Win32')
      expect(getOS()).toBe('Windows')
    })

    it('should detect Win64', () => {
      mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Win64')
      expect(getOS()).toBe('Windows')
    })

    it('should detect Windows', () => {
      mockNavigator('Mozilla/5.0 (Windows NT 10.0)', 'Windows')
      expect(getOS()).toBe('Windows')
    })

    it('should detect WinCE', () => {
      mockNavigator('Mozilla/5.0 (Windows CE)', 'WinCE')
      expect(getOS()).toBe('Windows')
    })
  })

  describe('Android detection', () => {
    it('should detect Android from userAgent', () => {
      mockNavigator('Mozilla/5.0 (Linux; Android 11)', 'Linux armv7l')
      expect(getOS()).toBe('Android')
    })

    it('should detect Android regardless of platform', () => {
      mockNavigator('Mozilla/5.0 (Linux; Android 11)', 'Unknown')
      expect(getOS()).toBe('Android')
    })
  })

  describe('Linux detection', () => {
    it('should detect Linux from platform', () => {
      mockNavigator('Mozilla/5.0 (X11; Linux x86_64)', 'Linux x86_64')
      expect(getOS()).toBe('Linux')
    })

    it('should detect Linux i686', () => {
      mockNavigator('Mozilla/5.0 (X11; Linux i686)', 'Linux i686')
      expect(getOS()).toBe('Linux')
    })
  })

  describe('Unknown OS', () => {
    it('should return unknown for unrecognized OS', () => {
      mockNavigator('Mozilla/5.0 (FreeBSD)', 'FreeBSD')
      expect(getOS()).toBe('unknown')
    })

    it('should return unknown for empty values', () => {
      mockNavigator('', '')
      expect(getOS()).toBe('unknown')
    })
  })

  describe('Priority order', () => {
    it('should prioritize iOS over Linux when both match', () => {
      mockNavigator('Mozilla/5.0 (iPhone; Linux)', 'iPhone')
      expect(getOS()).toBe('iOS')
    })

    it('should prioritize Android over Linux when both match', () => {
      mockNavigator('Mozilla/5.0 (Linux; Android 11)', 'Linux x86_64')
      expect(getOS()).toBe('Android')
    })

    it('should prioritize platform-based detection for Mac', () => {
      mockNavigator('Mozilla/5.0 (compatible)', 'MacIntel')
      expect(getOS()).toBe('MacOS')
    })
  })
})
