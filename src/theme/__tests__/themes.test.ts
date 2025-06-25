import { describe, it, expect, vi } from 'vitest'

// Mock MUI createTheme
vi.mock('@mui/material/styles', () => ({
  createTheme: vi.fn((config) => ({ ...config, type: 'theme' }))
}))

// Mock the tokens
vi.mock('../tokens', () => ({
  componentSettings: { components: {} },
  light: { palette: { mode: 'light' } },
  dark: { palette: { mode: 'dark' } }
}))

describe('themes', () => {
  it('should export lightTheme', async () => {
    const { lightTheme } = await import('../themes')
    expect(lightTheme).toBeDefined()
    expect(typeof lightTheme).toBe('object')
  })

  it('should export darkTheme', async () => {
    const { darkTheme } = await import('../themes')
    expect(darkTheme).toBeDefined()
    expect(typeof darkTheme).toBe('object')
  })

  it('should export both themes', async () => {
    const themes = await import('../themes')
    
    expect(themes.lightTheme).toBeDefined()
    expect(themes.darkTheme).toBeDefined()
  })

  it('should import required dependencies', async () => {
    // Test that the module imports work
    const tokens = await import('../tokens')
    const mui = await import('@mui/material/styles')
    
    expect(tokens.componentSettings).toBeDefined()
    expect(tokens.light).toBeDefined()
    expect(tokens.dark).toBeDefined()
    expect(mui.createTheme).toBeDefined()
  })

  it('should have theme objects with correct structure', async () => {
    const { lightTheme, darkTheme } = await import('../themes')
    
    expect(typeof lightTheme).toBe('object')
    expect(typeof darkTheme).toBe('object')
    expect(lightTheme.type).toBe('theme')
    expect(darkTheme.type).toBe('theme')
  })

  it('should test theme creation flow', async () => {
    // Import the module to trigger theme creation
    const module = await import('../themes')
    
    // Verify themes were created successfully
    expect(module.lightTheme).toBeTruthy()
    expect(module.darkTheme).toBeTruthy()
  })

  it('should have palette configuration', async () => {
    const { lightTheme, darkTheme } = await import('../themes')
    
    // Both themes should have palette property (merged from tokens)
    expect(lightTheme.palette).toBeDefined()
    expect(darkTheme.palette).toBeDefined()
    expect(lightTheme.palette.mode).toBe('light')
    expect(darkTheme.palette.mode).toBe('dark')
  })

  it('should have component settings', async () => {
    const { lightTheme, darkTheme } = await import('../themes')
    
    // Both themes should have components property
    expect(lightTheme.components).toBeDefined()
    expect(darkTheme.components).toBeDefined()
  })
})
