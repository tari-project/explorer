import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import MempoolWidget from '../MempoolWidget'
import {
  mockUseAllBlocks,
  mockUseMainStore,
  mockTheme,
  mockMempoolData,
  mockStyledComponents,
  mockCopyToClipboard,
  mockInnerHeading,
  mockMuiComponents,
  mockToHexString,
  mockShortenString,
  mockFormatTimestamp
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

vi.mock('@components/InnerHeading', () => ({
  default: mockInnerHeading
}))

vi.mock('@utils/helpers', () => ({
  toHexString: mockToHexString,
  shortenString: mockShortenString,
  formatTimestamp: mockFormatTimestamp
}))

vi.mock('@mui/material', () => mockMuiComponents)

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

describe('MempoolWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Mobile View', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(true) // isMobile = true
    })

    it('should render mobile loading state', () => {
      mockUseAllBlocks.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      )

      const skeletons = screen.getAllByTestId('skeleton')
      expect(skeletons).toHaveLength(5) // mobileCount
      skeletons.forEach(skeleton => {
        expect(skeleton).toHaveAttribute('data-height', '300')
        expect(skeleton).toHaveAttribute('data-variant', 'rounded')
      })
    })

    it('should render mobile error state', () => {
      const errorMessage = 'Failed to load mempool'
      mockUseAllBlocks.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: { message: errorMessage }
      })

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      )

      expect(screen.getByTestId('transparent-bg')).toBeInTheDocument()
      const alert = screen.getByTestId('alert')
      expect(alert).toHaveAttribute('data-severity', 'error')
      expect(alert).toHaveAttribute('data-variant', 'outlined')
      expect(alert).toHaveTextContent(errorMessage)
    })

    it('should render mobile mempool data', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockMempoolData,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      )

      // Check for mempool count in heading
      const heading = screen.getByTestId('inner-heading')
      expect(heading).toHaveTextContent('Mempool (2)')

      // Check for formatted timestamps
      expect(screen.getByText('formatted_1640995200')).toBeInTheDocument()
      expect(screen.getByText('formatted_1640995260')).toBeInTheDocument()

      // Check for fee data
      expect(screen.getByText('1000')).toBeInTheDocument()
      expect(screen.getByText('1500')).toBeInTheDocument()
    })

    it('should render empty mempool state', () => {
      mockUseAllBlocks.mockReturnValue({
        data: { mempool: [] },
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      )

      const heading = screen.getByTestId('inner-heading')
      expect(heading).toHaveTextContent('Mempool (0)')
    })

    it('should limit mobile display to 5 transactions', () => {
      const manyTransactions = {
        mempool: Array.from({ length: 10 }, (_, i) => ({
          id: i,
          excess_sig: { signature: `signature_${i}` },
          fee_per_gram: 1000 + i * 100,
          timestamp: 1640995200 + i * 60
        }))
      }

      mockUseAllBlocks.mockReturnValue({
        data: manyTransactions,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      )

      const heading = screen.getByTestId('inner-heading')
      expect(heading).toHaveTextContent('Mempool (10)')

      // Should only display 5 transactions in mobile view
      const feeLabels = screen.getAllByText('Fee per Gram')
      expect(feeLabels).toHaveLength(5)
    })
  })

  describe('Desktop View', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false) // isMobile = false
    })

    it('should render desktop loading state', () => {
      mockUseAllBlocks.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      )

      const skeletons = screen.getAllByTestId('skeleton')
      expect(skeletons).toHaveLength(7) // desktopCount + 2
      skeletons.forEach(skeleton => {
        expect(skeleton).toHaveAttribute('data-height', '60')
        expect(skeleton).toHaveAttribute('data-variant', 'rounded')
      })
    })

    it('should render desktop error state', () => {
      const errorMessage = 'Network error'
      mockUseAllBlocks.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: { message: errorMessage }
      })

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      )

      const transparentBg = screen.getByTestId('transparent-bg')
      expect(transparentBg).toHaveAttribute('data-height', '850px')
      
      const alert = screen.getByTestId('alert')
      expect(alert).toHaveTextContent(errorMessage)
    })

    it('should render desktop table headers', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockMempoolData,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <MempoolWidget />
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
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      )

      // Check copy to clipboard components
      const copyComponents = screen.getAllByTestId('copy-to-clipboard')
      expect(copyComponents[0]).toHaveAttribute('data-copy', 'hex_mock_signature_1')
      expect(copyComponents[1]).toHaveAttribute('data-copy', 'hex_mock_signature_2')

      // Check for fee data
      expect(screen.getByText('1000')).toBeInTheDocument()
      expect(screen.getByText('1500')).toBeInTheDocument()

      // Check for timestamps
      expect(screen.getByText('formatted_1640995200')).toBeInTheDocument()
      expect(screen.getByText('formatted_1640995260')).toBeInTheDocument()
    })

    it('should limit desktop display to 5 transactions', () => {
      const manyTransactions = {
        mempool: Array.from({ length: 10 }, (_, i) => ({
          id: i,
          excess_sig: { signature: `signature_${i}` },
          fee_per_gram: 1000 + i * 100,
          timestamp: 1640995200 + i * 60
        }))
      }

      mockUseAllBlocks.mockReturnValue({
        data: manyTransactions,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      )

      // Should only display 5 transactions in desktop view
      const copyComponents = screen.getAllByTestId('copy-to-clipboard')
      expect(copyComponents).toHaveLength(5)
    })
  })

  describe('Common functionality', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false) // desktop by default
    })

    it('should use theme spacing', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockMempoolData,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      )

      expect(mockTheme.spacing).toHaveBeenCalled()
    })

    it('should handle null mempool gracefully', () => {
      mockUseAllBlocks.mockReturnValue({
        data: { mempool: null },
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      )

      const heading = screen.getByTestId('inner-heading')
      expect(heading).toHaveTextContent('Mempool (0)')
    })

    it('should call helper functions with correct parameters', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockMempoolData,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      )

      // Helper functions should be called
      expect(mockToHexString).toHaveBeenCalledWith('mock_signature_1')
      expect(mockToHexString).toHaveBeenCalledWith('mock_signature_2')
      expect(mockFormatTimestamp).toHaveBeenCalledWith(1640995200)
      expect(mockFormatTimestamp).toHaveBeenCalledWith(1640995260)
    })
  })
})
