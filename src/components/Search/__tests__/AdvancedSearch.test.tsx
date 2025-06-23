import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { BrowserRouter } from 'react-router-dom'
import AdvancedSearch from '../AdvancedSearch'
import { lightTheme } from '@theme/themes'

// Mock the store hook
const mockSetSearchOpen = vi.fn()
vi.mock('@services/stores/useMainStore', () => ({
  useMainStore: vi.fn((selector) => {
    const state = {
      searchOpen: false,
      setSearchOpen: mockSetSearchOpen
    }
    return selector(state)
  })
}))

// Mock child components
vi.mock('../SearchBlock', () => ({
  default: () => <div data-testid="search-block">Block Search Component</div>
}))

vi.mock('../SearchKernel', () => ({
  default: () => <div data-testid="search-kernel">Kernel Search Component</div>
}))

vi.mock('@components/InnerHeading', () => ({
  default: ({ children, icon, borderBottom }: any) => (
    <div data-testid="inner-heading" data-border-bottom={borderBottom}>
      {icon}
      <h2>{children}</h2>
    </div>
  )
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider theme={lightTheme}>
      {children}
    </ThemeProvider>
  </BrowserRouter>
)

describe('AdvancedSearch', () => {
  beforeEach(() => {
    mockSetSearchOpen.mockClear()
  })

  it('should render search icon button when dialog is closed', () => {
    render(
      <TestWrapper>
        <AdvancedSearch />
      </TestWrapper>
    )

    const searchButton = screen.getByRole('button', { name: /search/i })
    expect(searchButton).toBeInTheDocument()
  })

  it('should open search dialog when search button is clicked', () => {
    render(
      <TestWrapper>
        <AdvancedSearch />
      </TestWrapper>
    )

    const searchButton = screen.getByRole('button', { name: /search/i })
    fireEvent.click(searchButton)

    expect(mockSetSearchOpen).toHaveBeenCalledWith(true)
  })

  it('should display dialog content when search is open', () => {
    const { useMainStore } = require('@services/stores/useMainStore')
    
    useMainStore.mockImplementation((selector) => {
      const state = {
        searchOpen: true,
        setSearchOpen: mockSetSearchOpen
      }
      return selector(state)
    })

    render(
      <TestWrapper>
        <AdvancedSearch />
      </TestWrapper>
    )

    expect(screen.getByText('Search For')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /block/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /kernel/i })).toBeInTheDocument()
  })

  it('should default to block search type', () => {
    const { useMainStore } = require('@services/stores/useMainStore')
    
    useMainStore.mockImplementation((selector) => {
      const state = {
        searchOpen: true,
        setSearchOpen: mockSetSearchOpen
      }
      return selector(state)
    })

    render(
      <TestWrapper>
        <AdvancedSearch />
      </TestWrapper>
    )

    const blockRadio = screen.getByRole('radio', { name: /block/i })
    expect(blockRadio).toBeChecked()
    expect(screen.getByTestId('search-block')).toBeInTheDocument()
  })

  it('should switch to kernel search when kernel radio is selected', () => {
    const { useMainStore } = require('@services/stores/useMainStore')
    
    useMainStore.mockImplementation((selector) => {
      const state = {
        searchOpen: true,
        setSearchOpen: mockSetSearchOpen
      }
      return selector(state)
    })

    render(
      <TestWrapper>
        <AdvancedSearch />
      </TestWrapper>
    )

    const kernelRadio = screen.getByRole('radio', { name: /kernel/i })
    fireEvent.click(kernelRadio)

    expect(kernelRadio).toBeChecked()
    expect(screen.getByTestId('search-kernel')).toBeInTheDocument()
    expect(screen.queryByTestId('search-block')).not.toBeInTheDocument()
  })

  it('should close dialog when close button is clicked', () => {
    const { useMainStore } = require('@services/stores/useMainStore')
    
    useMainStore.mockImplementation((selector) => {
      const state = {
        searchOpen: true,
        setSearchOpen: mockSetSearchOpen
      }
      return selector(state)
    })

    render(
      <TestWrapper>
        <AdvancedSearch />
      </TestWrapper>
    )

    const closeButton = screen.getByRole('button', { name: /close search/i })
    fireEvent.click(closeButton)

    expect(mockSetSearchOpen).toHaveBeenCalledWith(false)
  })

  it('should close dialog when clicking outside (onClose)', () => {
    const { useMainStore } = require('@services/stores/useMainStore')
    
    useMainStore.mockImplementation((selector) => {
      const state = {
        searchOpen: true,
        setSearchOpen: mockSetSearchOpen
      }
      return selector(state)
    })

    render(
      <TestWrapper>
        <AdvancedSearch />
      </TestWrapper>
    )

    // Simulate clicking outside the dialog
    const dialog = screen.getByRole('dialog')
    fireEvent.keyDown(dialog, { key: 'Escape' })

    expect(mockSetSearchOpen).toHaveBeenCalledWith(false)
  })

  it('should render correct dialog properties', () => {
    const { useMainStore } = require('@services/stores/useMainStore')
    
    useMainStore.mockImplementation((selector) => {
      const state = {
        searchOpen: true,
        setSearchOpen: mockSetSearchOpen
      }
      return selector(state)
    })

    render(
      <TestWrapper>
        <AdvancedSearch />
      </TestWrapper>
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    
    // Dialog should be fullWidth and maxWidth sm
    expect(dialog.closest('.MuiDialog-root')).toBeInTheDocument()
  })

  it('should handle search type state changes correctly', () => {
    const { useMainStore } = require('@services/stores/useMainStore')
    
    useMainStore.mockImplementation((selector) => {
      const state = {
        searchOpen: true,
        setSearchOpen: mockSetSearchOpen
      }
      return selector(state)
    })

    render(
      <TestWrapper>
        <AdvancedSearch />
      </TestWrapper>
    )

    // Start with block selected
    expect(screen.getByTestId('search-block')).toBeInTheDocument()
    
    // Switch to kernel
    fireEvent.click(screen.getByRole('radio', { name: /kernel/i }))
    expect(screen.getByTestId('search-kernel')).toBeInTheDocument()
    
    // Switch back to block
    fireEvent.click(screen.getByRole('radio', { name: /block/i }))
    expect(screen.getByTestId('search-block')).toBeInTheDocument()
  })

  it('should pass correct props to InnerHeading', () => {
    const { useMainStore } = require('@services/stores/useMainStore')
    
    useMainStore.mockImplementation((selector) => {
      const state = {
        searchOpen: true,
        setSearchOpen: mockSetSearchOpen
      }
      return selector(state)
    })

    render(
      <TestWrapper>
        <AdvancedSearch />
      </TestWrapper>
    )

    const innerHeading = screen.getByTestId('inner-heading')
    expect(innerHeading).toHaveAttribute('data-border-bottom', 'false')
    expect(screen.getByText('Search For')).toBeInTheDocument()
  })

  it('should have correct radio group structure', () => {
    const { useMainStore } = require('@services/stores/useMainStore')
    
    useMainStore.mockImplementation((selector) => {
      const state = {
        searchOpen: true,
        setSearchOpen: mockSetSearchOpen
      }
      return selector(state)
    })

    render(
      <TestWrapper>
        <AdvancedSearch />
      </TestWrapper>
    )

    const radioGroup = screen.getByRole('radiogroup')
    expect(radioGroup).toBeInTheDocument()
    expect(radioGroup).toHaveAttribute('name', 'search-type')
    
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(2)
  })

  it('should not render dialog content when search is closed', () => {
    render(
      <TestWrapper>
        <AdvancedSearch />
      </TestWrapper>
    )

    expect(screen.queryByText('Search For')).not.toBeInTheDocument()
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
    expect(screen.queryByTestId('search-block')).not.toBeInTheDocument()
  })

  it('should use correct theme provider', () => {
    render(
      <TestWrapper>
        <AdvancedSearch />
      </TestWrapper>
    )

    const searchButton = screen.getByRole('button', { name: /search/i })
    expect(searchButton).toBeInTheDocument()
    
    // Theme should be applied (this tests that ThemeProvider is used)
    expect(searchButton.closest('.MuiIconButton-root')).toBeInTheDocument()
  })

  it('should have correct icon button attributes', () => {
    render(
      <TestWrapper>
        <AdvancedSearch />
      </TestWrapper>
    )

    const searchButton = screen.getByRole('button', { name: /search/i })
    expect(searchButton).toHaveAttribute('aria-label', 'search')
  })
})
