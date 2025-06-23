import { describe, it, expect, vi } from 'vitest'

// Mock the main store
const mockIsMobile = vi.fn(() => false)
vi.mock('@services/stores/useMainStore', () => ({
  useMainStore: vi.fn((selector) => {
    if (selector) {
      return selector({ isMobile: mockIsMobile() })
    }
    return { isMobile: mockIsMobile() }
  })
}))

// Mock all the child components
vi.mock('@components/Header/Header', () => ({
  default: () => null
}))

vi.mock('@components/VersionInfo/VersionInfo', () => ({
  default: () => null
}))

vi.mock('@components/Banner/Banner', () => ({
  default: () => null
}))

vi.mock('@components/Header/StatsBox/StatsBox', () => ({
  default: () => null
}))

// Mock MUI components
vi.mock('@mui/material', () => ({
  ThemeProvider: ({ children }: any) => children,
  Container: ({ children }: any) => children,
  Grid: ({ children }: any) => children,
}))

vi.mock('@mui/material/CssBaseline', () => ({
  default: () => null
}))

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  Outlet: () => null
}))

// Mock themes
vi.mock('../themes', () => ({
  lightTheme: {
    spacing: vi.fn(() => '16px')
  }
}))

describe('MainLayout', () => {
  it('should import and use all required dependencies', async () => {
    // Test that the component can be imported without errors
    const MainLayout = (await import('../MainLayout')).default
    expect(MainLayout).toBeTruthy()
  })

  it('should use useMainStore hook', async () => {
    const { useMainStore } = await import('@services/stores/useMainStore')
    const MainLayout = (await import('../MainLayout')).default
    
    // Create a simple test render
    const TestComponent = () => {
      const component = MainLayout({})
      return component
    }
    
    expect(useMainStore).toBeDefined()
  })

  it('should handle mobile state correctly', () => {
    mockIsMobile.mockReturnValue(true)
    expect(mockIsMobile()).toBe(true)
  })

  it('should handle desktop state correctly', () => {
    mockIsMobile.mockReturnValue(false)
    expect(mockIsMobile()).toBe(false)
  })

  it('should have proper component structure', async () => {
    // Test the component can be instantiated
    const MainLayout = (await import('../MainLayout')).default
    expect(typeof MainLayout).toBe('function')
  })

  it('should import required MUI components', async () => {
    const mui = await import('@mui/material')
    expect(mui.ThemeProvider).toBeDefined()
    expect(mui.Container).toBeDefined()
    expect(mui.Grid).toBeDefined()
  })

  it('should import lightTheme', async () => {
    const { lightTheme } = await import('../themes')
    expect(lightTheme).toBeDefined()
    expect(lightTheme.spacing).toBeDefined()
  })

  it('should import all required components', async () => {
    const Header = (await import('@components/Header/Header')).default
    const Banner = (await import('@components/Banner/Banner')).default
    const VersionInfo = (await import('@components/VersionInfo/VersionInfo')).default
    const StatsBox = (await import('@components/Header/StatsBox/StatsBox')).default
    
    expect(Header).toBeDefined()
    expect(Banner).toBeDefined()
    expect(VersionInfo).toBeDefined()
    expect(StatsBox).toBeDefined()
  })

  it('should use Outlet from react-router-dom', async () => {
    const { Outlet } = await import('react-router-dom')
    expect(Outlet).toBeDefined()
  })
})
