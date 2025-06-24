import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

// Import centralized mocks first
import { 
  mockTheme, 
  mockKernelSearchData, 
  mockMuiComponents,
  mockGradientPaper,
  mockFetchStatusCheck,
  mockBlockTable
} from '../../../test/mocks'

// Mock dependencies using centralized mocks
vi.mock('@services/api/hooks/useBlocks', () => ({
  useSearchByKernel: vi.fn()
}))

vi.mock('@components/StyledComponents', () => ({
  GradientPaper: mockGradientPaper
}))

vi.mock('@components/FetchStatusCheck', () => ({
  default: mockFetchStatusCheck
}))

vi.mock('@components/KernelSearch/BlockTable', () => ({
  default: mockBlockTable
}))

vi.mock('@mui/material', () => ({
  ...mockMuiComponents
}))

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

import SearchKernelForm from '../SearchKernelForm'

// Test wrapper using established pattern
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
  let mockUseSearchByKernel: any
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(async () => {
    vi.clearAllMocks()
    user = userEvent.setup()
    const { useSearchByKernel } = await import('@services/api/hooks/useBlocks')
    mockUseSearchByKernel = vi.mocked(useSearchByKernel)
    
    // Mock location replace function
    vi.mocked(window.location.replace).mockClear()
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

      const textFields = screen.getAllByTestId('text-field')
      expect(textFields).toHaveLength(2)
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
      expect(screen.getByLabelText('Nonce')).toBeInTheDocument()
      expect(screen.getByLabelText('Signature')).toBeInTheDocument()
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

      const nonceInput = screen.getByLabelText('Nonce')
      const signatureInput = screen.getByLabelText('Signature')
      const submitButton = screen.getByRole('button', { name: /search/i })

      await user.type(nonceInput, 'test-nonce')
      await user.type(signatureInput, 'test-signature')
      await user.click(submitButton)

      // Should call useSearchByKernel with the submitted values
      expect(mockUseSearchByKernel).toHaveBeenCalledWith(['test-nonce'], ['test-signature'])
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
      const nonceInput = screen.getByLabelText('Nonce')
      const signatureInput = screen.getByLabelText('Signature')

      await user.type(nonceInput, 'test-nonce')
      await user.type(signatureInput, 'test-signature')
      
      // Submit via form submission
      await user.type(signatureInput, '{Enter}')

      expect(mockUseSearchByKernel).toHaveBeenCalledWith(['test-nonce'], ['test-signature'])
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

      const nonceInput = screen.getByLabelText('Nonce')
      const submitButton = screen.getByRole('button', { name: /search/i })

      // Only fill nonce field
      await user.type(nonceInput, 'test-nonce')
      await user.click(submitButton)

      // Should call with nonce but empty signature array
      expect(mockUseSearchByKernel).toHaveBeenCalledWith(['test-nonce'], [])
    })
  })

  describe('Search results handling', () => {
    it('should display BlockTable when results are available', async () => {
      mockUseSearchByKernel.mockReturnValue({
        data: mockKernelSearchData,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <SearchKernelForm />
        </TestWrapper>
      )

      // Submit form to trigger conditional rendering
      const submitButton = screen.getByRole('button', { name: /search/i })
      await user.click(submitButton)

      expect(screen.getByTestId('block-table')).toBeInTheDocument()
      expect(screen.getByTestId('block-table')).toHaveAttribute('data-items', mockKernelSearchData.items)
    })

    it('should redirect for single result', async () => {
      const singleResultData = {
        items: [{
          block: {
            header: {
              height: 12345
            }
          }
        }]
      }

      mockUseSearchByKernel.mockReturnValue({
        data: singleResultData,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <SearchKernelForm />
        </TestWrapper>
      )

      const nonceInput = screen.getByLabelText('Nonce')
      const signatureInput = screen.getByLabelText('Signature')
      const submitButton = screen.getByRole('button', { name: /search/i })

      await user.type(nonceInput, 'test-nonce')
      await user.type(signatureInput, 'test-signature')
      await user.click(submitButton)

      // Should redirect to block page
      expect(window.location.replace).toHaveBeenCalledWith(
        '/blocks/12345?nonce=test-nonce&signature=test-signature'
      )
    })

    it('should not redirect for multiple results', async () => {
      mockUseSearchByKernel.mockReturnValue({
        data: mockKernelSearchData, // Has 2 items
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <SearchKernelForm />
        </TestWrapper>
      )

      // Submit form to trigger conditional rendering
      const submitButton = screen.getByRole('button', { name: /search/i })
      await user.click(submitButton)

      expect(window.location.replace).not.toHaveBeenCalled()
      expect(screen.getByTestId('block-table')).toBeInTheDocument()
    })
  })

  describe('Loading and error states', () => {
    it('should handle loading state via FetchStatusCheck', async () => {
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

      // Submit form to trigger conditional rendering
      const submitButton = screen.getByRole('button', { name: /search/i })
      await user.click(submitButton)

      expect(screen.getByTestId('fetch-status-check')).toBeInTheDocument()
    })

    it('should handle error state via FetchStatusCheck', async () => {
      mockUseSearchByKernel.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: new Error('Search failed')
      })

      render(
        <TestWrapper>
          <SearchKernelForm />
        </TestWrapper>
      )

      // Submit form to trigger conditional rendering
      const submitButton = screen.getByRole('button', { name: /search/i })
      await user.click(submitButton)

      expect(screen.getByTestId('fetch-status-check')).toBeInTheDocument()
    })
  })

  describe('Input handling', () => {
    it('should update nonce field value', async () => {
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

      const nonceInput = screen.getByLabelText('Nonce')

      await user.type(nonceInput, 'updated-nonce')

      expect(nonceInput).toHaveValue('updated-nonce')
    })

    it('should update signature field value', async () => {
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

      const signatureInput = screen.getByLabelText('Signature')

      await user.type(signatureInput, 'updated-signature')

      expect(signatureInput).toHaveValue('updated-signature')
    })
  })
})
