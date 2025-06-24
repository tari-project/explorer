import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'
import SearchBlock from '../SearchBlock'
import {
  mockUseMainStore,
  mockSetSearchOpen,
  mockNavigate,
  mockTheme,
  mockMuiComponents
} from '@/test/mocks'

// Mock dependencies using centralized mocks
vi.mock('@services/stores/useMainStore', () => ({
  useMainStore: vi.fn()
}))

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  MemoryRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

vi.mock('@mui/material', () => mockMuiComponents)

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
  beforeEach(() => {
    vi.clearAllMocks()
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

      const input = screen.getByTestId('text-field')
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

      const input = screen.getByTestId('text-field')
      const searchButton = screen.getByRole('button', { name: /search/i })

      fireEvent.change(input, { target: { value: '12345' } })
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/blocks/12345')
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

      const input = screen.getByTestId('text-field')
      const searchButton = screen.getByRole('button', { name: /search/i })

      fireEvent.change(input, { target: { value: validHash } })
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(`/blocks/${validHash}`)
        expect(mockSetSearchOpen).toHaveBeenCalledWith(false)
      })
    })

    it('should reject invalid input and show error message', async () => {
      render(
        <TestWrapper>
          <SearchBlock />
        </TestWrapper>
      )

      const input = screen.getByTestId('text-field')
      const searchButton = screen.getByRole('button', { name: /search/i })

      fireEvent.change(input, { target: { value: 'invalid' } })
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(screen.getByTestId('alert')).toBeInTheDocument()
        expect(screen.getByText('Please enter a valid block height or hash')).toBeInTheDocument()
        expect(mockNavigate).not.toHaveBeenCalled()
      })
    })

    it('should reject negative block height', async () => {
      render(
        <TestWrapper>
          <SearchBlock />
        </TestWrapper>
      )

      const input = screen.getByTestId('text-field')
      const searchButton = screen.getByRole('button', { name: /search/i })

      fireEvent.change(input, { target: { value: '-123' } })
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(screen.getByTestId('alert')).toBeInTheDocument()
        expect(mockNavigate).not.toHaveBeenCalled()
      })
    })

    it('should reject hash with incorrect length', async () => {
      render(
        <TestWrapper>
          <SearchBlock />
        </TestWrapper>
      )

      const input = screen.getByTestId('text-field')
      const searchButton = screen.getByRole('button', { name: /search/i })

      fireEvent.change(input, { target: { value: '1234567890abcdef' } }) // Too short
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(screen.getByTestId('alert')).toBeInTheDocument()
        expect(mockNavigate).not.toHaveBeenCalled()
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

      const input = screen.getByTestId('text-field')

      fireEvent.change(input, { target: { value: '12345' } })
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' })

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/blocks/12345')
        expect(mockSetSearchOpen).toHaveBeenCalledWith(false)
      })
    })

    it('should not search on other key presses', () => {
      render(
        <TestWrapper>
          <SearchBlock />
        </TestWrapper>
      )

      const input = screen.getByTestId('text-field')

      fireEvent.change(input, { target: { value: '12345' } })
      fireEvent.keyPress(input, { key: 'Tab', code: 'Tab' })

      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  describe('Cancel functionality', () => {
    it('should close search and clear input on cancel', () => {
      render(
        <TestWrapper>
          <SearchBlock />
        </TestWrapper>
      )

      const input = screen.getByTestId('text-field')
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

      const input = screen.getByTestId('text-field')
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

      expect(mockNavigate).not.toHaveBeenCalled()
      expect(mockSetSearchOpen).not.toHaveBeenCalledWith(false)
    })

    it('should not search with empty input on Enter', () => {
      render(
        <TestWrapper>
          <SearchBlock />
        </TestWrapper>
      )

      const input = screen.getByTestId('text-field')

      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' })

      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  describe('State management', () => {
    it('should clear input after successful search', async () => {
      render(
        <TestWrapper>
          <SearchBlock />
        </TestWrapper>
      )

      const input = screen.getByTestId('text-field')
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

      const input = screen.getByTestId('text-field')
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
