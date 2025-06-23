import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import MobileHeader from '../MobileHeader'
import { lightTheme } from '@theme/themes'
import { useMainStore } from '@services/stores/useMainStore'

// Mock the store hook
const mockSetShowMobileMenu = vi.fn()

vi.mock('@services/stores/useMainStore', () => ({
  useMainStore: vi.fn()
}))

// Mock child components
vi.mock('../MobileMenuButton/MobileMenuButton', () => ({
  default: () => <button data-testid="mobile-menu-button">Menu</button>
}))

vi.mock('../MinersCTA/MinersCTA', () => ({
  default: ({ theme, buttonText, noBackground, minersOnly, buttonOnly }: any) => (
    <div 
      data-testid="miners-cta"
      data-theme={theme}
      data-button-text={buttonText}
      data-no-background={noBackground ? 'true' : 'false'}
      data-miners-only={minersOnly ? 'true' : 'false'}
      data-button-only={buttonOnly ? 'true' : 'false'}
    >
      {minersOnly ? 'Miners Only CTA' : buttonOnly ? 'Button Only CTA' : 'Full CTA'}
    </div>
  )
}))

// Mock the actual MinersCTA path more specifically
vi.mock('../../MinersCTA/MinersCTA', () => ({
  default: ({ theme, buttonText, noBackground, minersOnly, buttonOnly }: any) => (
    <div 
      data-testid="miners-cta"
      data-theme={theme}
      data-button-text={buttonText}
      data-no-background={noBackground ? 'true' : 'false'}
      data-miners-only={minersOnly ? 'true' : 'false'}
      data-button-only={buttonOnly ? 'true' : 'false'}
    >
      {minersOnly ? 'Miners Only CTA' : buttonOnly ? 'Button Only CTA' : 'Full CTA'}
    </div>
  )
}))

vi.mock('@components/SocialLinks/SocialLinks', () => ({
  SocialIconButtons: () => <div data-testid="social-icon-buttons">Social Icons</div>
}))

vi.mock('../MobileNavigation/MobileNavigation', () => ({
  default: () => <nav data-testid="mobile-navigation">Mobile Navigation</nav>
}))

vi.mock('@components/Search/AdvancedSearch', () => ({
  default: () => <div data-testid="advanced-search">Advanced Search</div>
}))

// Mock assets
vi.mock('@assets/images/tari-gem.svg', () => ({
  default: 'mocked-tari-gem.svg'
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={lightTheme}>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

describe('MobileHeader', () => {
  beforeEach(() => {
    mockSetShowMobileMenu.mockClear()
    // Reset document body overflow
    document.body.style.overflow = 'auto'
    
    // Set up default mock behavior
    ;(useMainStore as any).mockImplementation((selector) => {
      const state = {
        showMobileMenu: false,
        setShowMobileMenu: mockSetShowMobileMenu
      }
      return selector(state)
    })
  })

  afterEach(() => {
    document.body.style.overflow = 'auto'
  })

  it('should render mobile header with logo and miners CTA', () => {
    render(
      <TestWrapper>
        <MobileHeader />
      </TestWrapper>
    )

    expect(screen.getByAltText('Tari Logo')).toBeInTheDocument()
    expect(screen.getByTestId('miners-cta')).toBeInTheDocument()
    expect(screen.getByTestId('advanced-search')).toBeInTheDocument()
    expect(screen.getByTestId('mobile-menu-button')).toBeInTheDocument()
  })

  it('should render miners CTA with correct props for main display', () => {
    render(
      <TestWrapper>
        <MobileHeader />
      </TestWrapper>
    )

    const minersCTA = screen.getAllByTestId('miners-cta')[0]
    expect(minersCTA).toHaveAttribute('data-theme', 'dark')
    expect(minersCTA).toHaveAttribute('data-button-text', 'Download Tari Universe')
    expect(minersCTA).toHaveAttribute('data-no-background', 'true')
    expect(minersCTA).toHaveAttribute('data-miners-only', 'true')
    expect(minersCTA).toHaveTextContent('Miners Only CTA')
  })

  it('should set showMobileMenu to false on mount', () => {
    render(
      <TestWrapper>
        <MobileHeader />
      </TestWrapper>
    )

    expect(mockSetShowMobileMenu).toHaveBeenCalledWith(false)
  })

  it('should handle body overflow when mobile menu is open', () => {
    // Mock showMobileMenu as true
    ;(useMainStore as any).mockImplementation((selector) => {
      const state = {
        showMobileMenu: true,
        setShowMobileMenu: mockSetShowMobileMenu
      }
      return selector(state)
    })

    render(
      <TestWrapper>
        <MobileHeader />
      </TestWrapper>
    )

    expect(document.body.style.overflow).toBe('hidden')
  })

  it('should reset body overflow when mobile menu is closed', () => {
    // Using mocked useMainStore
    
    // Start with menu open
    ;(useMainStore as any).mockImplementation((selector) => {
      const state = {
        showMobileMenu: true,
        setShowMobileMenu: mockSetShowMobileMenu
      }
      return selector(state)
    })

    const { rerender } = render(
      <TestWrapper>
        <MobileHeader />
      </TestWrapper>
    )

    expect(document.body.style.overflow).toBe('hidden')

    // Close menu
    ;(useMainStore as any).mockImplementation((selector) => {
      const state = {
        showMobileMenu: false,
        setShowMobileMenu: mockSetShowMobileMenu
      }
      return selector(state)
    })

    rerender(
      <TestWrapper>
        <MobileHeader />
      </TestWrapper>
    )

    expect(document.body.style.overflow).toBe('auto')
  })

  it('should show mobile menu when showMobileMenu is true', () => {
    // Using mocked useMainStore
    
    ;(useMainStore as any).mockImplementation((selector) => {
      const state = {
        showMobileMenu: true,
        setShowMobileMenu: mockSetShowMobileMenu
      }
      return selector(state)
    })

    render(
      <TestWrapper>
        <MobileHeader />
      </TestWrapper>
    )

    expect(screen.getByTestId('mobile-navigation')).toBeInTheDocument()
    expect(screen.getByTestId('social-icon-buttons')).toBeInTheDocument()
    
    // Should have button-only miners CTA in the menu
    const minersCTAs = screen.getAllByTestId('miners-cta')
    const menuMinersCTA = minersCTAs.find(cta => 
      cta.getAttribute('data-button-only') === 'true'
    )
    expect(menuMinersCTA).toBeInTheDocument()
    expect(menuMinersCTA).toHaveTextContent('Button Only CTA')
  })

  it('should not show mobile menu when showMobileMenu is false', () => {
    render(
      <TestWrapper>
        <MobileHeader />
      </TestWrapper>
    )

    expect(screen.queryByTestId('mobile-navigation')).not.toBeInTheDocument()
    expect(screen.queryByTestId('social-icon-buttons')).not.toBeInTheDocument()
  })

  it('should render logo as a link to home', () => {
    render(
      <TestWrapper>
        <MobileHeader />
      </TestWrapper>
    )

    const logoLink = screen.getByRole('link', { hidden: true })
    expect(logoLink).toHaveAttribute('href', '/')
    
    const logoImg = screen.getByAltText('Tari Logo')
    expect(logoImg).toHaveAttribute('src', 'mocked-tari-gem.svg')
  })

  it('should apply correct logo styling', () => {
    render(
      <TestWrapper>
        <MobileHeader />
      </TestWrapper>
    )

    const logoImg = screen.getByAltText('Tari Logo')
    expect(logoImg).toHaveStyle({
      scale: '0.85',
      transformOrigin: 'left',
      paddingTop: '5px'
    })
  })

  it('should render both miners CTA variants correctly', () => {
    // Using mocked useMainStore
    
    ;(useMainStore as any).mockImplementation((selector) => {
      const state = {
        showMobileMenu: true,
        setShowMobileMenu: mockSetShowMobileMenu
      }
      return selector(state)
    })

    render(
      <TestWrapper>
        <MobileHeader />
      </TestWrapper>
    )

    const minersCTAs = screen.getAllByTestId('miners-cta')
    expect(minersCTAs).toHaveLength(2)

    // Header CTA (miners only)
    const headerCTA = minersCTAs[0]
    expect(headerCTA).toHaveAttribute('data-miners-only', 'true')
    expect(headerCTA).toHaveAttribute('data-button-only', 'false')

    // Menu CTA (button only)
    const menuCTA = minersCTAs[1]
    expect(menuCTA).toHaveAttribute('data-button-only', 'true')
    expect(menuCTA).toHaveAttribute('data-miners-only', 'false')
  })

  it('should have correct component layout structure', () => {
    render(
      <TestWrapper>
        <MobileHeader />
      </TestWrapper>
    )

    // Should have both the wrapper and the conditional menu
    expect(screen.getByTestId('miners-cta')).toBeInTheDocument()
    expect(screen.getByTestId('advanced-search')).toBeInTheDocument()
    expect(screen.getByTestId('mobile-menu-button')).toBeInTheDocument()
  })

  it('should handle isExpanded state correctly', () => {
    render(
      <TestWrapper>
        <MobileHeader />
      </TestWrapper>
    )

    // isExpanded is hardcoded to false in the component
    // Logo should be visible when not expanded
    expect(screen.getByAltText('Tari Logo')).toBeInTheDocument()
    expect(screen.getByTestId('miners-cta')).toBeInTheDocument()
  })

  it('should apply correct theme to miners CTA components', () => {
    // Using mocked useMainStore
    
    ;(useMainStore as any).mockImplementation((selector) => {
      const state = {
        showMobileMenu: true,
        setShowMobileMenu: mockSetShowMobileMenu
      }
      return selector(state)
    })

    render(
      <TestWrapper>
        <MobileHeader />
      </TestWrapper>
    )

    const minersCTAs = screen.getAllByTestId('miners-cta')
    minersCTAs.forEach(cta => {
      expect(cta).toHaveAttribute('data-theme', 'dark')
    })
  })
})
