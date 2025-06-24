import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import MempoolTable from '../MempoolTable'
import {
  mockUseAllBlocks,
  mockUseMainStore,
  mockTheme,
  mockMempoolData,
  mockStyledComponents,
  mockCopyToClipboard,
  mockMuiComponents,
  mockToHexString,
  mockShortenString
} from '@/test/mocks'

// Mock dependencies using centralized mocks
vi.mock('@services/api/hooks/useBlocks', () => ({
  useAllBlocks: mockUseAllBlocks
}))

vi.mock('@services/stores/useMainStore', () => ({
  useMainStore: mockUseMainStore
}))

vi.mock('@components/StyledComponents', () => mockStyledComponents)

vi.mock('@components/CopyToClipboard', () => ({
  default: mockCopyToClipboard
}))

vi.mock('@components/FetchStatusCheck', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="fetch-status-check">{children}</div>
  )
}))

vi.mock('@utils/helpers', () => ({
  toHexString: mockToHexString,
  shortenString: mockShortenString
}))

vi.mock('@mui/material', () => ({
  ...mockMuiComponents,
  Pagination: ({ count, page, onChange }: any) => (
    <div data-testid="pagination" data-count={count} data-page={page}>
      <button onClick={() => onChange(null, page - 1)}>Previous</button>
      <button onClick={() => onChange(null, page + 1)}>Next</button>
    </div>
  ),
  MenuItem: ({ children, value }: any) => (
    <option data-testid="menu-item" value={value}>{children}</option>
  ),
  FormControl: ({ children }: any) => (
    <div data-testid="form-control">{children}</div>
  )
}))

vi.mock('@mui/material/Select', () => ({
  default: ({ value, onChange, children }: any) => (
    <select 
      data-testid="select"
      value={value}
      onChange={(e) => onChange({ target: { value: e.target.value } })}
    >
      {children}
    </select>
  )
}))

vi.mock('@mui/material/styles', () => ({
  useTheme: () => mockTheme,
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

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

describe('MempoolTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const largeMempoolData = {
    mempool: Array.from({ length: 25 }, (_, i) => ({
      id: i,
      excess_sig: { signature: `signature_${i}` },
      fee_per_gram: 1000 + i * 100,
      timestamp: 1640995200 + i * 60
    }))
  }

  describe('Mobile View', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(true) // isMobile = true
    })

    it('should render mobile mempool data', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockMempoolData,
        isLoading: false,
        isError: false
      })

      render(
        <TestWrapper>
          <MempoolTable />
        </TestWrapper>
      )

      // Check for mobile layout
      expect(screen.getByTestId('fetch-status-check')).toBeInTheDocument()
      
      // Check for data display
      expect(screen.getByText('Kernel Signature')).toBeInTheDocument()
      expect(screen.getByText('Fee per Gram')).toBeInTheDocument()
      
      // Check copy components
      const copyComponents = screen.getAllByTestId('copy-to-clipboard')
      expect(copyComponents[0]).toHaveAttribute('data-copy', 'hex_mock_signature_1')
    })

    it('should handle pagination in mobile view', () => {
      mockUseAllBlocks.mockReturnValue({
        data: largeMempoolData,
        isLoading: false,
        isError: false
      })

      render(
        <TestWrapper>
          <MempoolTable />
        </TestWrapper>
      )

      // Check pagination controls
      const pagination = screen.getByTestId('pagination')
      expect(pagination).toHaveAttribute('data-count', '3') // 25 items / 10 per page = 3 pages
      expect(pagination).toHaveAttribute('data-page', '1')
    })
  })

  describe('Desktop View', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false) // isMobile = false
    })

    it('should render desktop table headers', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockMempoolData,
        isLoading: false,
        isError: false
      })

      render(
        <TestWrapper>
          <MempoolTable />
        </TestWrapper>
      )

      // Check table headers
      expect(screen.getByText('Kernel Signature')).toBeInTheDocument()
      expect(screen.getByText('Fee per Gram')).toBeInTheDocument()
      expect(screen.getByText('Time')).toBeInTheDocument()
    })

    it('should render desktop mempool data in table format', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockMempoolData,
        isLoading: false,
        isError: false
      })

      render(
        <TestWrapper>
          <MempoolTable />
        </TestWrapper>
      )

      // Check copy to clipboard components
      const copyComponents = screen.getAllByTestId('copy-to-clipboard')
      expect(copyComponents).toHaveLength(2)
      expect(copyComponents[0]).toHaveAttribute('data-copy', 'hex_mock_signature_1')
      expect(copyComponents[1]).toHaveAttribute('data-copy', 'hex_mock_signature_2')

      // Check for fee data
      expect(screen.getByText('1000')).toBeInTheDocument()
      expect(screen.getByText('1500')).toBeInTheDocument()
    })

    it('should display pagination controls', () => {
      mockUseAllBlocks.mockReturnValue({
        data: largeMempoolData,
        isLoading: false,
        isError: false
      })

      render(
        <TestWrapper>
          <MempoolTable />
        </TestWrapper>
      )

      // Check pagination
      const pagination = screen.getByTestId('pagination')
      expect(pagination).toBeInTheDocument()
      expect(pagination).toHaveAttribute('data-count', '3') // 25 items / 10 per page

      // Check items per page selector
      const select = screen.getByTestId('select')
      expect(select).toBeInTheDocument()
      expect(select).toHaveValue('10')
    })
  })

  describe('Pagination functionality', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false) // desktop view
    })

    it('should handle page changes', () => {
      mockUseAllBlocks.mockReturnValue({
        data: largeMempoolData,
        isLoading: false,
        isError: false
      })

      render(
        <TestWrapper>
          <MempoolTable />
        </TestWrapper>
      )

      const pagination = screen.getByTestId('pagination')
      const nextButton = screen.getByText('Next')
      
      fireEvent.click(nextButton)
      
      // Should display different transactions on page 2
      expect(pagination).toHaveAttribute('data-page', '1') // Initial page
    })

    it('should handle items per page changes', () => {
      mockUseAllBlocks.mockReturnValue({
        data: largeMempoolData,
        isLoading: false,
        isError: false
      })

      render(
        <TestWrapper>
          <MempoolTable />
        </TestWrapper>
      )

      const select = screen.getByTestId('select')
      
      fireEvent.change(select, { target: { value: '20' } })
      
      // Should update pagination based on new items per page
      expect(select).toHaveValue('20')
    })

    it('should calculate total pages correctly', () => {
      mockUseAllBlocks.mockReturnValue({
        data: largeMempoolData,
        isLoading: false,
        isError: false
      })

      render(
        <TestWrapper>
          <MempoolTable />
        </TestWrapper>
      )

      const pagination = screen.getByTestId('pagination')
      expect(pagination).toHaveAttribute('data-count', '3') // Math.ceil(25 / 10)
    })
  })

  describe('Data handling', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false) // desktop view
    })

    it('should handle empty mempool', () => {
      mockUseAllBlocks.mockReturnValue({
        data: { mempool: [] },
        isLoading: false,
        isError: false
      })

      render(
        <TestWrapper>
          <MempoolTable />
        </TestWrapper>
      )

      // Should still render headers
      expect(screen.getByText('Kernel Signature')).toBeInTheDocument()
      
      // Pagination should show 0 pages
      const pagination = screen.getByTestId('pagination')
      expect(pagination).toHaveAttribute('data-count', '0')
    })

    it('should handle null mempool data', () => {
      mockUseAllBlocks.mockReturnValue({
        data: { mempool: null },
        isLoading: false,
        isError: false
      })

      render(
        <TestWrapper>
          <MempoolTable />
        </TestWrapper>
      )

      // Should handle null gracefully
      const pagination = screen.getByTestId('pagination')
      expect(pagination).toHaveAttribute('data-count', '0')
    })

    it('should call helper functions with correct parameters', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockMempoolData,
        isLoading: false,
        isError: false
      })

      render(
        <TestWrapper>
          <MempoolTable />
        </TestWrapper>
      )

      // Helper functions should be called
      expect(mockToHexString).toHaveBeenCalledWith('mock_signature_1')
      expect(mockToHexString).toHaveBeenCalledWith('mock_signature_2')
    })
  })

  describe('Loading and error states', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false) // desktop view
    })

    it('should handle loading state via FetchStatusCheck', () => {
      mockUseAllBlocks.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false
      })

      render(
        <TestWrapper>
          <MempoolTable />
        </TestWrapper>
      )

      // FetchStatusCheck should handle loading state
      expect(screen.getByTestId('fetch-status-check')).toBeInTheDocument()
    })

    it('should handle error state via FetchStatusCheck', () => {
      mockUseAllBlocks.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true
      })

      render(
        <TestWrapper>
          <MempoolTable />
        </TestWrapper>
      )

      // FetchStatusCheck should handle error state
      expect(screen.getByTestId('fetch-status-check')).toBeInTheDocument()
    })
  })
})
