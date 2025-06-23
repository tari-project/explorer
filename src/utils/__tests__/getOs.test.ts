import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getOS } from '../getOs'

// Mock navigator
const mockNavigator = {
  userAgent: '',
  platform: ''
}

Object.defineProperty(window, 'navigator', {
  value: mockNavigator,
  writable: true
})

describe('getOS', () => {
  beforeEach(() => {
    // Reset navigator mocks
    mockNavigator.userAgent = ''
    mockNavigator.platform = ''
  })

  it('should detect MacOS platforms', () => {
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
    
    macosPlatforms.forEach(platform => {
      mockNavigator.platform = platform
      expect(getOS()).toBe('MacOS')
    })
  })

  it('should detect iOS platforms', () => {
    const iosPlatforms = ['iPhone', 'iPad', 'iPod']
    
    iosPlatforms.forEach(platform => {
      mockNavigator.platform = platform
      expect(getOS()).toBe('iOS')
    })
  })

  it('should detect Windows platforms', () => {
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
    
    windowsPlatforms.forEach(platform => {
      mockNavigator.platform = platform
      expect(getOS()).toBe('Windows')
    })
  })

  it('should detect Android from userAgent', () => {
    mockNavigator.platform = 'Linux'
    mockNavigator.userAgent = 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36'
    expect(getOS()).toBe('Android')
  })

  it('should detect Linux from platform', () => {
    mockNavigator.platform = 'Linux'
    mockNavigator.userAgent = 'Mozilla/5.0 (X11; Linux x86_64)'
    expect(getOS()).toBe('Linux')
  })

  it('should return unknown for unrecognized platform', () => {
    mockNavigator.platform = 'SomeUnknownPlatform'
    mockNavigator.userAgent = 'Some unknown user agent'
    expect(getOS()).toBe('unknown')
  })

  it('should prioritize platform checks over userAgent for Android', () => {
    // Android in userAgent but iOS in platform should return iOS
    mockNavigator.platform = 'iPhone'
    mockNavigator.userAgent = 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36'
    expect(getOS()).toBe('iOS')
  })

  it('should handle empty navigator values', () => {
    mockNavigator.platform = ''
    mockNavigator.userAgent = ''
    expect(getOS()).toBe('unknown')
  })
})
