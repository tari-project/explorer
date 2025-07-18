import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import React from 'react'
import MobileMenuButton from '../MobileMenuButton'
import { lightTheme } from '@theme/themes'

// Mock the useMainStore hook
const mockSetShowMobileMenu = vi.fn()
const mockUseMainStore = vi.fn()

vi.mock('@services/stores/useMainStore', () => ({
  useMainStore: (selector: any) => mockUseMainStore(selector)
}))

// Mock the styled components
vi.mock('../styles', () => ({
  Wrapper: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  IconContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="icon-container">{children}</div>
  ),
  Line: ({ variants, initial, animate, transition, ...props }: any) => (
    <div 
      data-testid="line" 
      data-animate={animate}
      data-initial={initial}
      {...props}
    />
  )
}))

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>
    {children}
  </ThemeProvider>
)

describe('MobileMenuButton', () => {
  beforeEach(() => {
    mockUseMainStore.mockClear()
    mockSetShowMobileMenu.mockClear()
  })

  it('should render with mobile menu closed', () => {
    mockUseMainStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        const state = { showMobileMenu: false, setShowMobileMenu: mockSetShowMobileMenu }
        return selector(state)
      }
      return false
    })

    render(
      <TestWrapper>
        <MobileMenuButton />
      </TestWrapper>
    )

    expect(screen.getByTestId('mobile-menu-button')).toBeInTheDocument()
    expect(screen.getByTestId('icon-container')).toBeInTheDocument()
    
    const lines = screen.getAllByTestId('line')
    expect(lines).toHaveLength(2)
    
    // Both lines should be in closed state
    lines.forEach(line => {
      expect(line).toHaveAttribute('data-animate', 'closed')
    })
  })

  it('should render with mobile menu open', () => {
    mockUseMainStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        const state = { showMobileMenu: true, setShowMobileMenu: mockSetShowMobileMenu }
        return selector(state)
      }
      return true
    })

    render(
      <TestWrapper>
        <MobileMenuButton />
      </TestWrapper>
    )

    const lines = screen.getAllByTestId('line')
    
    // Both lines should be in open state
    lines.forEach(line => {
      expect(line).toHaveAttribute('data-animate', 'open')
    })
  })

  it('should toggle mobile menu when clicked', () => {
    mockUseMainStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        const state = { showMobileMenu: false, setShowMobileMenu: mockSetShowMobileMenu }
        return selector(state)
      }
      return false
    })

    render(
      <TestWrapper>
        <MobileMenuButton />
      </TestWrapper>
    )

    const button = screen.getByTestId('mobile-menu-button')
    fireEvent.click(button)

    expect(mockSetShowMobileMenu).toHaveBeenCalledWith(true)
  })

  it('should close mobile menu when opened and clicked', () => {
    mockUseMainStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        const state = { showMobileMenu: true, setShowMobileMenu: mockSetShowMobileMenu }
        return selector(state)
      }
      return true
    })

    render(
      <TestWrapper>
        <MobileMenuButton />
      </TestWrapper>
    )

    const button = screen.getByTestId('mobile-menu-button')
    fireEvent.click(button)

    expect(mockSetShowMobileMenu).toHaveBeenCalledWith(false)
  })

  it('should have correct initial animation state', () => {
    mockUseMainStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        const state = { showMobileMenu: false, setShowMobileMenu: mockSetShowMobileMenu }
        return selector(state)
      }
      return false
    })

    render(
      <TestWrapper>
        <MobileMenuButton />
      </TestWrapper>
    )

    const lines = screen.getAllByTestId('line')
    
    lines.forEach(line => {
      expect(line).toHaveAttribute('data-initial', 'closed')
    })
  })

  it('should render two line elements for the hamburger icon', () => {
    mockUseMainStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        const state = { showMobileMenu: false, setShowMobileMenu: mockSetShowMobileMenu }
        return selector(state)
      }
      return false
    })

    render(
      <TestWrapper>
        <MobileMenuButton />
      </TestWrapper>
    )

    const lines = screen.getAllByTestId('line')
    expect(lines).toHaveLength(2)
  })

  it('should access showMobileMenu state correctly', () => {
    mockUseMainStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        const state = { showMobileMenu: false, setShowMobileMenu: mockSetShowMobileMenu }
        return selector(state)
      }
      return false
    })

    render(
      <TestWrapper>
        <MobileMenuButton />
      </TestWrapper>
    )

    // Should be called twice - once for showMobileMenu, once for setShowMobileMenu
    expect(mockUseMainStore).toHaveBeenCalledTimes(2)
  })

  it('should access setShowMobileMenu function correctly', () => {
    mockUseMainStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        const state = { showMobileMenu: false, setShowMobileMenu: mockSetShowMobileMenu }
        return selector(state)
      }
      return mockSetShowMobileMenu
    })

    render(
      <TestWrapper>
        <MobileMenuButton />
      </TestWrapper>
    )

    expect(mockUseMainStore).toHaveBeenCalledWith(expect.any(Function))
  })

  it('should render as a clickable button', () => {
    mockUseMainStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        const state = { showMobileMenu: false, setShowMobileMenu: mockSetShowMobileMenu }
        return selector(state)
      }
      return false
    })

    render(
      <TestWrapper>
        <MobileMenuButton />
      </TestWrapper>
    )

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('data-testid', 'mobile-menu-button')
  })

  it('should contain icon container within wrapper', () => {
    mockUseMainStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        const state = { showMobileMenu: false, setShowMobileMenu: mockSetShowMobileMenu }
        return selector(state)
      }
      return false
    })

    render(
      <TestWrapper>
        <MobileMenuButton />
      </TestWrapper>
    )

    const wrapper = screen.getByTestId('mobile-menu-button')
    const iconContainer = screen.getByTestId('icon-container')
    
    expect(wrapper).toContainElement(iconContainer)
  })

  it('should handle multiple clicks correctly', () => {
    mockUseMainStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        const state = { showMobileMenu: false, setShowMobileMenu: mockSetShowMobileMenu }
        return selector(state)
      }
      return false
    })

    render(
      <TestWrapper>
        <MobileMenuButton />
      </TestWrapper>
    )

    const button = screen.getByTestId('mobile-menu-button')
    
    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockSetShowMobileMenu).toHaveBeenCalledTimes(3)
    expect(mockSetShowMobileMenu).toHaveBeenNthCalledWith(1, true)
    expect(mockSetShowMobileMenu).toHaveBeenNthCalledWith(2, true) // Still true since state doesn't change
    expect(mockSetShowMobileMenu).toHaveBeenNthCalledWith(3, true)
  })
})
