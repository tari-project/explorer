import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import React from 'react'
import HeaderBottom from '../HeaderBottom'
import { lightTheme } from '@theme/themes'

// Mock the useMainStore hook
const mockUseMainStore = vi.fn()
vi.mock('@services/stores/useMainStore', () => ({
  useMainStore: (selector: any) => mockUseMainStore(selector)
}))

// Mock StatsBox component
vi.mock('../../StatsBox/StatsBox', () => ({
  default: ({ variant }: { variant: string }) => (
    <div data-testid="stats-box" data-variant={variant}>
      StatsBox {variant}
    </div>
  )
}))

// Mock AdvancedSearch component
vi.mock('@components/Search/AdvancedSearch', () => ({
  default: () => (
    <div data-testid="advanced-search">AdvancedSearch</div>
  )
}))

// Mock the styles
vi.mock('../HeaderBottom.styles', () => ({
  StyledContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="styled-container">{children}</div>
  )
}))

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>
    {children}
  </ThemeProvider>
)

describe('HeaderBottom', () => {
  beforeEach(() => {
    mockUseMainStore.mockClear()
  })

  it('should render StatsBox and AdvancedSearch when not mobile', () => {
    mockUseMainStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({ isMobile: false })
      }
      return false
    })

    render(
      <TestWrapper>
        <HeaderBottom />
      </TestWrapper>
    )

    expect(screen.getByTestId('stats-box')).toBeInTheDocument()
    expect(screen.getByTestId('advanced-search')).toBeInTheDocument()
  })

  it('should not render StatsBox and AdvancedSearch when mobile', () => {
    mockUseMainStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({ isMobile: true })
      }
      return true
    })

    render(
      <TestWrapper>
        <HeaderBottom />
      </TestWrapper>
    )

    expect(screen.queryByTestId('stats-box')).not.toBeInTheDocument()
    expect(screen.queryByTestId('advanced-search')).not.toBeInTheDocument()
  })

  it('should render StyledContainer in both mobile and desktop modes', () => {
    mockUseMainStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({ isMobile: false })
      }
      return false
    })

    const { unmount } = render(
      <TestWrapper>
        <HeaderBottom />
      </TestWrapper>
    )

    expect(screen.getByTestId('styled-container')).toBeInTheDocument()

    // Unmount first render before testing mobile mode
    unmount()

    // Test mobile mode
    mockUseMainStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({ isMobile: true })
      }
      return true
    })

    render(
      <TestWrapper>
        <HeaderBottom />
      </TestWrapper>
    )

    expect(screen.getByTestId('styled-container')).toBeInTheDocument()
  })

  it('should pass correct variant to StatsBox', () => {
    mockUseMainStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({ isMobile: false })
      }
      return false
    })

    render(
      <TestWrapper>
        <HeaderBottom />
      </TestWrapper>
    )

    const statsBox = screen.getByTestId('stats-box')
    expect(statsBox).toHaveAttribute('data-variant', 'desktop')
    expect(screen.getByText('StatsBox desktop')).toBeInTheDocument()
  })

  it('should call useMainStore with state selector', () => {
    mockUseMainStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({ isMobile: false })
      }
      return false
    })

    render(
      <TestWrapper>
        <HeaderBottom />
      </TestWrapper>
    )

    expect(mockUseMainStore).toHaveBeenCalledWith(expect.any(Function))
  })

  it('should have correct component structure in desktop mode', () => {
    mockUseMainStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({ isMobile: false })
      }
      return false
    })

    render(
      <TestWrapper>
        <HeaderBottom />
      </TestWrapper>
    )

    const container = screen.getByTestId('styled-container')
    const statsBox = screen.getByTestId('stats-box')
    const advancedSearch = screen.getByTestId('advanced-search')

    expect(container).toContainElement(statsBox)
    expect(container).toContainElement(advancedSearch)
  })

  it('should render empty container in mobile mode', () => {
    mockUseMainStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({ isMobile: true })
      }
      return true
    })

    render(
      <TestWrapper>
        <HeaderBottom />
      </TestWrapper>
    )

    const container = screen.getByTestId('styled-container')
    expect(container).toBeInTheDocument()
    expect(container).toBeEmptyDOMElement()
  })

  it('should conditionally render based on isMobile state', () => {
    // Test desktop state
    mockUseMainStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({ isMobile: false })
      }
      return false
    })

    const { rerender } = render(
      <TestWrapper>
        <HeaderBottom />
      </TestWrapper>
    )

    expect(screen.getByTestId('stats-box')).toBeInTheDocument()
    expect(screen.getByTestId('advanced-search')).toBeInTheDocument()

    // Change to mobile state
    mockUseMainStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({ isMobile: true })
      }
      return true
    })

    rerender(
      <TestWrapper>
        <HeaderBottom />
      </TestWrapper>
    )

    expect(screen.queryByTestId('stats-box')).not.toBeInTheDocument()
    expect(screen.queryByTestId('advanced-search')).not.toBeInTheDocument()
  })

  it('should handle store selector correctly', () => {
    const mockSelector = vi.fn().mockReturnValue(false)
    mockUseMainStore.mockImplementation(mockSelector)

    render(
      <TestWrapper>
        <HeaderBottom />
      </TestWrapper>
    )

    expect(mockUseMainStore).toHaveBeenCalledWith(expect.any(Function))
  })
})
