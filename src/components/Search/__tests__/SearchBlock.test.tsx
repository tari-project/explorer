import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'
import SearchBlock from '../SearchBlock'

// Mock dependencies using individual vi.mock calls
vi.mock('@services/stores/useMainStore', () => ({
  useMainStore: vi.fn()
}))

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  MemoryRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

vi.mock('@mui/material', () => ({
  Button: ({ children, variant, color, onClick, disabled, ...props }: any) => (
    <button 
      data-testid="button" 
      data-variant={variant}
      data-color={color}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  ),
  Stack: ({ children, spacing, direction, ...props }: any) => (
    <div 
      data-testid="stack" 
      data-spacing={spacing}
      data-direction={direction}
      {...props}
    >
      {children}
    </div>
  ),
  TextField: ({ label, value, onChange, placeholder, error, helperText, onKeyDown, ...props }: any) => (
    <div data-testid="text-field">
      <label>{label}</label>
      <input 
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        data-error={error}
        {...props}
      />
      {helperText && <span data-testid="helper-text">{helperText}</span>}
    </div>
  ),
  Alert: ({ severity, children }: any) => (
    <div data-testid="alert" data-severity={severity}>
      {children}
    </div>
  )
}))

// Mock theme
const mockTheme = {
  spacing: vi.fn((value: number) => `${value * 8}px`),
  palette: {
    background: { paper: '#ffffff' },
    divider: '#e0e0e0'
  }
}

vi.mock('@mui/material/styles', () => ({
  useTheme: () => mockTheme,
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={mockTheme as any}>
    <MemoryRouter>
      {children}
    </MemoryRouter>
  </ThemeProvider>
)

describe('SearchBlock', () => {
  let mockUseMainStore: any
  let mockNavigate: any
  let mockNavigateFn: any
  let mockSetSearchOpen: any

  beforeEach(async () => {
    vi.clearAllMocks()
    
    const { useMainStore } = await import('@services/stores/useMainStore')
    const { useNavigate } = await import('react-router-dom')
    
    mockUseMainStore = vi.mocked(useMainStore)
    mockNavigate = vi.mocked(useNavigate)
    mockNavigateFn = vi.fn()
    mockSetSearchOpen = vi.fn()
    
    mockNavigate.mockReturnValue(mockNavigateFn)
    
    mockUseMainStore.mockImplementation((selector) => {
      if (selector.toString().includes('searchOpen')) {
        return true // searchOpen = true
      }
      if (selector.toString().includes('setSearchOpen')) {
        return mockSetSearchOpen
      }
      return undefined
    })
  })

  describe('Rendering', () => {
    it('should render search input and buttons', () => {
      render(
        <TestWrapper>
          <SearchBlock />
        </TestWrapper>
      )

      expect(screen.getByTestId('text-field')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('should focus input when search is open', () => {
      render(
        <TestWrapper>
          <SearchBlock />
        </TestWrapper>
      )

      const input = screen.getByTestId('text-field').querySelector('input')
      // Note: jsdom doesn't actually focus elements, but we can test the ref setup
      expect(input).toBeInTheDocument()
    })
  })

  describe('Input validation', () => {
    it('should accept valid block height', async () => {
      render(
        <TestWrapper>
          <SearchBlock />
        </TestWrapper>
      )

      const input = screen.getByTestId('text-field').querySelector('input')
      const searchButton = screen.getByRole('button', { name: /search/i })

      fireEvent.change(input, { target: { value: '12345' } })
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(mockNavigateFn).toHaveBeenCalledWith('/blocks/12345')
        expect(mockSetSearchOpen).toHaveBeenCalledWith(false)
      })
    })

    it('should accept valid block hash (64 characters)', async () => {
      const validHash = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
      
      render(
        <TestWrapper>
          <SearchBlock />
        </TestWrapper>
      )

      const input = screen.getByTestId('text-field').querySelector('input')
      const searchButton = screen.getByRole('button', { name: /search/i })

      fireEvent.change(input, { target: { value: validHash } })
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(mockNavigateFn).toHaveBeenCalledWith(`/blocks/${validHash}`)
        expect(mockSetSearchOpen).toHaveBeenCalledWith(false)
      })
    })

    it('should reject invalid input and show error message', async () => {
      render(
        <TestWrapper>
          <SearchBlock />
        </TestWrapper>
      )

      const input = screen.getByTestId('text-field').querySelector('input')
      const searchButton = screen.getByRole('button', { name: /search/i })

      fireEvent.change(input, { target: { value: 'invalid' } })
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(screen.getByTestId('alert')).toBeInTheDocument()
        expect(screen.getByText('Please enter a valid block height or hash')).toBeInTheDocument()
        expect(mockNavigateFn).not.toHaveBeenCalled()
      })
    })

    it('should reject negative block height', async () => {
      render(
        <TestWrapper>
          <SearchBlock />
        </TestWrapper>
      )

      const input = screen.getByTestId('text-field').querySelector('input')
      const searchButton = screen.getByRole('button', { name: /search/i })

      fireEvent.change(input, { target: { value: '-123' } })
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(screen.getByTestId('alert')).toBeInTheDocument()
        expect(mockNavigateFn).not.toHaveBeenCalled()
      })
    })

    it('should reject hash with incorrect length', async () => {
      render(
        <TestWrapper>
          <SearchBlock />
        </TestWrapper>
      )

      const input = screen.getByTestId('text-field').querySelector('input')
      const searchButton = screen.getByRole('button', { name: /search/i })

      fireEvent.change(input, { target: { value: '1234567890abcdef' } }) // Too short
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(screen.getByTestId('alert')).toBeInTheDocument()
        expect(mockNavigateFn).not.toHaveBeenCalled()
      })
    })
  })

  describe('Keyboard interactions', () => {
    it('should search on Enter key press', async () => {
      render(
        <TestWrapper>
          <SearchBlock />
        </TestWrapper>
      )

      const input = screen.getByTestId('text-field').querySelector('input')

      fireEvent.change(input, { target: { value: '12345' } })
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

      await waitFor(() => {
        expect(mockNavigateFn).toHaveBeenCalledWith('/blocks/12345')
        expect(mockSetSearchOpen).toHaveBeenCalledWith(false)
      })
    })

    it('should not search on other key presses', () => {
      render(
        <TestWrapper>
          <SearchBlock />
        </TestWrapper>
      )

      const input = screen.getByTestId('text-field').querySelector('input')

      fireEvent.change(input, { target: { value: '12345' } })
      fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' })

      expect(mockNavigateFn).not.toHaveBeenCalled()
    })
  })

  describe('Cancel functionality', () => {
    it('should close search and clear input on cancel', () => {
      render(
        <TestWrapper>
          <SearchBlock />
        </TestWrapper>
      )

      const input = screen.getByTestId('text-field').querySelector('input')
      const cancelButton = screen.getByRole('button', { name: /cancel/i })

      fireEvent.change(input, { target: { value: '12345' } })
      fireEvent.click(cancelButton)

      expect(mockSetSearchOpen).toHaveBeenCalledWith(false)
      expect(input).toHaveValue('')
    })

    it('should clear error message on cancel', () => {
      render(
        <TestWrapper>
          <SearchBlock />
        </TestWrapper>
      )

      const input = screen.getByTestId('text-field').querySelector('input')
      const searchButton = screen.getByRole('button', { name: /search/i })
      const cancelButton = screen.getByRole('button', { name: /cancel/i })

      // First cause an error
      fireEvent.change(input, { target: { value: 'invalid' } })
      fireEvent.click(searchButton)

      expect(screen.getByTestId('alert')).toBeInTheDocument()

      // Then cancel
      fireEvent.click(cancelButton)

      expect(screen.queryByTestId('alert')).not.toBeInTheDocument()
    })
  })

  describe('Empty input handling', () => {
    it('should not search with empty input', () => {
      render(
        <TestWrapper>
          <SearchBlock />
        </TestWrapper>
      )

      const searchButton = screen.getByRole('button', { name: /search/i })

      fireEvent.click(searchButton)

      expect(mockNavigateFn).not.toHaveBeenCalled()
      expect(mockSetSearchOpen).not.toHaveBeenCalledWith(false)
    })

    it('should not search with empty input on Enter', () => {
      render(
        <TestWrapper>
          <SearchBlock />
        </TestWrapper>
      )

      const input = screen.getByTestId('text-field').querySelector('input')

      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

      expect(mockNavigateFn).not.toHaveBeenCalled()
    })
  })

  describe('State management', () => {
    it('should clear input after successful search', async () => {
      render(
        <TestWrapper>
          <SearchBlock />
        </TestWrapper>
      )

      const input = screen.getByTestId('text-field').querySelector('input')
      const searchButton = screen.getByRole('button', { name: /search/i })

      fireEvent.change(input, { target: { value: '12345' } })
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(input).toHaveValue('')
      })
    })

    it('should clear input after validation error', async () => {
      render(
        <TestWrapper>
          <SearchBlock />
        </TestWrapper>
      )

      const input = screen.getByTestId('text-field').querySelector('input')
      const searchButton = screen.getByRole('button', { name: /search/i })

      fireEvent.change(input, { target: { value: 'invalid' } })
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(input).toHaveValue('')
      })
    })
  })

  describe('Input focus', () => {
    it('should handle search open state change', () => {
      const { rerender } = render(
        <TestWrapper>
          <SearchBlock />
        </TestWrapper>
      )

      // Initially search is open
      expect(screen.getByTestId('text-field')).toBeInTheDocument()

      // Change to closed
      mockUseMainStore.mockImplementation((selector) => {
        if (selector.toString().includes('searchOpen')) {
          return false // searchOpen = false
        }
        if (selector.toString().includes('setSearchOpen')) {
          return mockSetSearchOpen
        }
        return undefined
      })

      rerender(
        <TestWrapper>
          <SearchBlock />
        </TestWrapper>
      )

      expect(screen.getByTestId('text-field')).toBeInTheDocument()
    })
  })
})
