import { describe, it, expect } from 'vitest'
import { DOWNLOAD_LINKS } from '../downloadLinks'

describe('downloadLinks', () => {
  it('should have correct download URLs for all platforms', () => {
    expect(DOWNLOAD_LINKS.windows).toBe('https://airdrop.tari.com/api/miner/download/windows')
    expect(DOWNLOAD_LINKS.mac).toBe('https://airdrop.tari.com/api/miner/download/macos')
    expect(DOWNLOAD_LINKS.linux).toBe('https://airdrop.tari.com/api/miner/download/linux')
    expect(DOWNLOAD_LINKS.default).toBe('https://airdrop.tari.com/')
  })

  it('should have all required platform keys', () => {
    expect(DOWNLOAD_LINKS).toHaveProperty('windows')
    expect(DOWNLOAD_LINKS).toHaveProperty('mac')
    expect(DOWNLOAD_LINKS).toHaveProperty('linux')
    expect(DOWNLOAD_LINKS).toHaveProperty('default')
  })

  it('should export an object with string values', () => {
    Object.values(DOWNLOAD_LINKS).forEach(link => {
      expect(typeof link).toBe('string')
      expect(link.length).toBeGreaterThan(0)
    })
  })

  it('should have https URLs', () => {
    Object.values(DOWNLOAD_LINKS).forEach(link => {
      expect(link).toMatch(/^https:\/\//)
    })
  })
})
