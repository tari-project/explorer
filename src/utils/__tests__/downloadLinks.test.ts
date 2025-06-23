import { describe, it, expect } from 'vitest'
import { DOWNLOAD_LINKS } from '../downloadLinks'

describe('downloadLinks', () => {
  it('should have correct Windows download link', () => {
    expect(DOWNLOAD_LINKS.windows).toBe('https://airdrop.tari.com/api/miner/download/windows')
  })

  it('should have correct Mac download link', () => {
    expect(DOWNLOAD_LINKS.mac).toBe('https://airdrop.tari.com/api/miner/download/macos')
  })

  it('should have correct Linux download link', () => {
    expect(DOWNLOAD_LINKS.linux).toBe('https://airdrop.tari.com/api/miner/download/linux')
  })

  it('should have correct default link', () => {
    expect(DOWNLOAD_LINKS.default).toBe('https://airdrop.tari.com/')
  })

  it('should have all required properties', () => {
    expect(DOWNLOAD_LINKS).toHaveProperty('windows')
    expect(DOWNLOAD_LINKS).toHaveProperty('mac')
    expect(DOWNLOAD_LINKS).toHaveProperty('linux')
    expect(DOWNLOAD_LINKS).toHaveProperty('default')
  })

  it('should have valid URLs', () => {
    Object.values(DOWNLOAD_LINKS).forEach(url => {
      expect(() => new URL(url)).not.toThrow()
      expect(url).toMatch(/^https:\/\//)
    })
  })

  it('should maintain object structure', () => {
    // Test that the object structure is preserved and contains expected keys
    expect(Object.keys(DOWNLOAD_LINKS)).toHaveLength(4)
    expect(DOWNLOAD_LINKS).toEqual({
      windows: 'https://airdrop.tari.com/api/miner/download/windows',
      mac: 'https://airdrop.tari.com/api/miner/download/macos',
      linux: 'https://airdrop.tari.com/api/miner/download/linux',
      default: 'https://airdrop.tari.com/',
    })
  })
})
