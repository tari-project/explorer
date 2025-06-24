import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import SearchKernelForm from '../SearchKernelForm'
import {
  mockUseSearchByKernel,
  mockTheme,
  mockStyledComponents,
  mockMuiComponents,
  mockKernelSearchData
} from '@/test/mocks'

// Mock dependencies using centralized mocks
vi.mock('@services/api/hooks/useBlocks', () => ({
  useSearchByKernel: mockUseSearchByKernel
}))

vi.mock('@components/StyledComponents', () => mockStyledComponents)

vi.mock('@components/FetchStatusCheck', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="fetch-status-check">{children}</div>
  )
}))

vi.mock('@components/KernelSearch/BlockTable', () => ({
  default: ({ data }: { data: any }) => (
    <div data-testid="block-table" data-count={data?.length || 0}>
      Block Table with {data?.length || 0} results
    </div>
  )
}))

vi.mock('@mui/material', () => mockMuiComponents)

vi.mock('@mui/material/styles', () => ({
  useTheme: () => mockTheme,
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Mock window.location.replace
Object.defineProperty(window, 'location', {
  value: {
    replace: vi.fn()
  },
  writable: true
})

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={mockTheme as any}>
        <MemoryRouter>
          {children}
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

describe('SearchKernelForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render form inputs and submit button', () => {
      mockUseSearchByKernel.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <SearchKernelForm />
        </TestWrapper>
      )

      expect(screen.getByTestId('text-field')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
    })

    it('should render both nonce and signature fields', () => {
      mockUseSearchByKernel.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <SearchKernelForm />
        </TestWrapper>
      )

      const textFields = screen.getAllByTestId('text-field')
      expect(textFields).toHaveLength(2) // Nonce and Signature fields
      expect(textFields[0]).toHaveAttribute('data-label', 'Nonce')
      expect(textFields[1]).toHaveAttribute('data-label', 'Signature')
    })
  })

  describe('Form submission', () => {
    it('should submit form with nonce and signature values', async () => {
      mockUseSearchByKernel.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <SearchKernelForm />
        </TestWrapper>
      )

      const textFields = screen.getAllByTestId('text-field')
      const nonceField = textFields[0]
      const signatureField = textFields[1]
      const submitButton = screen.getByRole('button', { name: /search/i })

      fireEvent.change(nonceField, { target: { value: 'test-nonce' } })
      fireEvent.change(signatureField, { target: { value: 'test-signature' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockUseSearchByKernel).toHaveBeenCalledWith(
          ['test-nonce'],
          ['test-signature']
        )
      })
    })

    it('should submit form on form submit event', async () => {
      mockUseSearchByKernel.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <SearchKernelForm />
        </TestWrapper>
      )

      const form = screen.getByTestId('box')
      const textFields = screen.getAllByTestId('text-field')

      fireEvent.change(textFields[0], { target: { value: 'test-nonce' } })
      fireEvent.change(textFields[1], { target: { value: 'test-signature' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(mockUseSearchByKernel).toHaveBeenCalledWith(
          ['test-nonce'],
          ['test-signature']
        )
      })
    })

    it('should handle empty form submission', () => {
      mockUseSearchByKernel.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <SearchKernelForm />
        </TestWrapper>
      )

      const submitButton = screen.getByRole('button', { name: /search/i })
      fireEvent.click(submitButton)

      // Should call with empty arrays when no input provided
      expect(mockUseSearchByKernel).toHaveBeenCalledWith([], [])
    })

    it('should handle partial form submission', async () => {
      mockUseSearchByKernel.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <SearchKernelForm />
        </TestWrapper>
      )

      const textFields = screen.getAllByTestId('text-field')
      const submitButton = screen.getByRole('button', { name: /search/i })

      // Only fill nonce field
      fireEvent.change(textFields[0], { target: { value: 'test-nonce' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockUseSearchByKernel).toHaveBeenCalledWith(
          ['test-nonce'],
          []
        )
      })
    })
  })

  describe('Search results handling', () => {
    it('should display BlockTable when results are available', () => {
      mockUseSearchByKernel.mockReturnValue({
        data: { items: mockKernelSearchData.results },
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <SearchKernelForm />
        </TestWrapper>
      )

      expect(screen.getByTestId('block-table')).toBeInTheDocument()
      expect(screen.getByTestId('block-table')).toHaveAttribute('data-count', '2')
    })

    it('should redirect for single result', async () => {
      const singleResult = {
        items: [{
          block: {
            header: {
              height: 12345
            }
          }
        }]
      }

      mockUseSearchByKernel.mockReturnValue({
        data: singleResult,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <SearchKernelForm />
        </TestWrapper>
      )

      const textFields = screen.getAllByTestId('text-field')
      const submitButton = screen.getByRole('button', { name: /search/i })

      fireEvent.change(textFields[0], { target: { value: 'test-nonce' } })
      fireEvent.change(textFields[1], { target: { value: 'test-signature' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(window.location.replace).toHaveBeenCalledWith(
          '/blocks/12345?nonce=test-nonce&signature=test-signature'
        )
      })
    })

    it('should not redirect for multiple results', () => {
      const multipleResults = {
        items: [
          { block: { header: { height: 12345 } } },
          { block: { header: { height: 12346 } } }
        ]
      }

      mockUseSearchByKernel.mockReturnValue({
        data: multipleResults,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <SearchKernelForm />
        </TestWrapper>
      )

      expect(window.location.replace).not.toHaveBeenCalled()
      expect(screen.getByTestId('block-table')).toBeInTheDocument()
    })

    it('should not redirect for empty results', () => {
      mockUseSearchByKernel.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <SearchKernelForm />
        </TestWrapper>
      )

      expect(window.location.replace).not.toHaveBeenCalled()
    })
  })

  describe('Loading and error states', () => {
    it('should handle loading state via FetchStatusCheck', () => {
      mockUseSearchByKernel.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <SearchKernelForm />
        </TestWrapper>
      )

      expect(screen.getByTestId('fetch-status-check')).toBeInTheDocument()
    })

    it('should handle error state via FetchStatusCheck', () => {
      mockUseSearchByKernel.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: { message: 'Search failed' }
      })

      render(
        <TestWrapper>
          <SearchKernelForm />
        </TestWrapper>
      )

      expect(screen.getByTestId('fetch-status-check')).toBeInTheDocument()
    })
  })

  describe('Input handling', () => {
    it('should update nonce field value', () => {
      mockUseSearchByKernel.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <SearchKernelForm />
        </TestWrapper>
      )

      const textFields = screen.getAllByTestId('text-field')
      const nonceField = textFields[0]

      fireEvent.change(nonceField, { target: { value: 'updated-nonce' } })

      expect(nonceField).toHaveValue('updated-nonce')
    })

    it('should update signature field value', () => {
      mockUseSearchByKernel.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <SearchKernelForm />
        </TestWrapper>
      )

      const textFields = screen.getAllByTestId('text-field')
      const signatureField = textFields[1]

      fireEvent.change(signatureField, { target: { value: 'updated-signature' } })

      expect(signatureField).toHaveValue('updated-signature')
    })
  })

  describe('Component structure', () => {
    it('should render within GradientPaper', () => {
      mockUseSearchByKernel.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <SearchKernelForm />
        </TestWrapper>
      )

      // GradientPaper is mocked as part of StyledComponents
      expect(screen.getByTestId('grid')).toBeInTheDocument()
    })

    it('should render form with proper structure', () => {
      mockUseSearchByKernel.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <SearchKernelForm />
        </TestWrapper>
      )

      // Check form structure
      expect(screen.getByTestId('box')).toBeInTheDocument() // Form container
      expect(screen.getAllByTestId('text-field')).toHaveLength(2) // Input fields
      expect(screen.getByRole('button')).toBeInTheDocument() // Submit button
    })
  })
})
