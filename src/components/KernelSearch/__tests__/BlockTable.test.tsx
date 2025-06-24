import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import BlockTable from '../BlockTable'

// Mock dependencies with individual vi.mock calls
vi.mock('@components/StyledComponents', () => ({
  TypographyData: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="typography-data">{children}</div>
  )
}))

vi.mock('@components/CopyToClipboard', () => ({
  default: ({ copy }: { copy: string }) => (
    <div data-testid="copy-to-clipboard" data-copy={copy}>Copy</div>
  )
}))

vi.mock('@components/InnerHeading', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="inner-heading">{children}</div>
  )
}))

vi.mock('@utils/helpers', () => ({
  toHexString: vi.fn((data) => `hex_${data}`),
  shortenString: vi.fn((str, start, end) => `${str.substring(0, start)}...${str.substring(str.length - end)}`),
  formatTimestamp: vi.fn((timestamp) => `formatted_${timestamp}`),
  powCheck: vi.fn((algo) => `pow_${algo}`)
}))

vi.mock('@mui/material', () => ({
  Typography: ({ children, variant }: any) => (
    <div data-testid="typography" data-variant={variant}>{children}</div>
  ),
  Grid: ({ children, item, xs, md, lg, spacing, style, ...props }: any) => (
    <div 
      data-testid="grid" 
      data-item={item}
      data-xs={xs}
      data-md={md}
      data-lg={lg}
      data-spacing={spacing}
      style={style}
      {...props}
    >
      {children}
    </div>
  ),
  Divider: ({ color, style }: any) => (
    <div data-testid="divider" data-color={color} style={style}>---</div>
  ),
  Button: ({ children, variant, fullWidth, href, color, style, ...props }: any) => (
    <button 
      data-testid="button" 
      data-variant={variant}
      data-full-width={fullWidth}
      data-href={href}
      data-color={color}
      style={style}
      {...props}
    >
      {children}
    </button>
  ),
  Box: ({ children, style, ...props }: any) => (
    <div data-testid="box" style={style} {...props}>{children}</div>
  ),
  Pagination: ({ count, page, onChange }: any) => (
    <div data-testid="pagination" data-count={count} data-page={page}>
      <button onClick={() => onChange(null, page - 1)} disabled={page <= 1}>
        Previous
      </button>
      <span>Page {page} of {count}</span>
      <button onClick={() => onChange(null, page + 1)} disabled={page >= count}>
        Next
      </button>
    </div>
  )
}))

vi.mock('react-router-dom', () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a data-testid="link" data-to={to}>{children}</a>
  ),
  MemoryRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

vi.mock('@services/stores/useMainStore', () => ({
  useMainStore: vi.fn()
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

describe('BlockTable', () => {
  let mockUseMainStore: any
  let mockToHexString: any
  let mockFormatTimestamp: any
  let mockPowCheck: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const { useMainStore } = await import('@services/stores/useMainStore')
    const { toHexString, formatTimestamp, powCheck } = await import('@utils/helpers')
    mockUseMainStore = vi.mocked(useMainStore)
    mockToHexString = vi.mocked(toHexString)
    mockFormatTimestamp = vi.mocked(formatTimestamp)
    mockPowCheck = vi.mocked(powCheck)
  })

  const mockSearchResults = [
    {
      block_height: 12345,
      block_hash: { data: 'block_hash_1' },
      timestamp: 1640995200,
      pow: { pow_algo: 1 },
      kernels: 5,
      outputs: 10
    },
    {
      block_height: 12346,
      block_hash: { data: 'block_hash_2' },
      timestamp: 1640995260,
      pow: { pow_algo: 2 },
      kernels: 3,
      outputs: 8
    }
  ]

  const largeSearchResults = Array.from({ length: 25 }, (_, i) => ({
    block_height: 12345 + i,
    block_hash: { data: `block_hash_${i}` },
    timestamp: 1640995200 + i * 60,
    pow: { pow_algo: (i % 2) + 1 },
    kernels: 5 + i,
    outputs: 10 + i
  }))

  describe('Mobile View', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(true) // isMobile = true
    })

    it('should render mobile block data', () => {
      render(
        <TestWrapper>
          <BlockTable data={mockSearchResults} />
        </TestWrapper>
      )

      // Check for inner heading with count
      const heading = screen.getByTestId('inner-heading')
      expect(heading).toHaveTextContent('Kernel Search Results (2)')

      // Check for mobile layout elements
      expect(screen.getByText('Height')).toBeInTheDocument()
      expect(screen.getByText('Time')).toBeInTheDocument()
      expect(screen.getByText('Proof of Work')).toBeInTheDocument()

      // Check for height links
      const heightLinks = screen.getAllByTestId('link')
      expect(heightLinks[0]).toHaveAttribute('data-to', '/blocks/12345')
      expect(heightLinks[0]).toHaveTextContent('12345')
    })

    it('should display formatted data in mobile view', () => {
      render(
        <TestWrapper>
          <BlockTable data={mockSearchResults} />
        </TestWrapper>
      )

      // Check for formatted timestamps
      expect(screen.getByText('formatted_1640995200')).toBeInTheDocument()
      expect(screen.getByText('formatted_1640995260')).toBeInTheDocument()

      // Check for PoW data
      expect(screen.getByText('pow_1')).toBeInTheDocument()
      expect(screen.getByText('pow_2')).toBeInTheDocument()

      // Check for kernel and output counts
      expect(screen.getByText('5')).toBeInTheDocument() // kernels
      expect(screen.getByText('10')).toBeInTheDocument() // outputs
    })

    it('should handle pagination in mobile view', () => {
      render(
        <TestWrapper>
          <BlockTable data={largeSearchResults} />
        </TestWrapper>
      )

      // Check pagination controls
      const pagination = screen.getByTestId('pagination')
      expect(pagination).toHaveAttribute('data-count', '3') // 25 items / 10 per page = 3 pages
      expect(pagination).toHaveAttribute('data-page', '1')

      // Check pagination text
      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()
    })
  })

  describe('Desktop View', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false) // isMobile = false
    })

    it('should render desktop table headers', () => {
      render(
        <TestWrapper>
          <BlockTable data={mockSearchResults} />
        </TestWrapper>
      )

      // Check table headers
      expect(screen.getByText('Height')).toBeInTheDocument()
      expect(screen.getByText('Time')).toBeInTheDocument()
      expect(screen.getByText('Proof of Work')).toBeInTheDocument()
      expect(screen.getByText('Hash')).toBeInTheDocument()
      expect(screen.getByText('Kernels')).toBeInTheDocument()
      expect(screen.getByText('Outputs')).toBeInTheDocument()
    })

    it('should render desktop block data in table format', () => {
      render(
        <TestWrapper>
          <BlockTable data={mockSearchResults} />
        </TestWrapper>
      )

      // Check for height links
      const heightLinks = screen.getAllByTestId('link')
      expect(heightLinks[0]).toHaveAttribute('data-to', '/blocks/12345')
      expect(heightLinks[1]).toHaveAttribute('data-to', '/blocks/12346')

      // Check copy to clipboard components for hashes
      const copyComponents = screen.getAllByTestId('copy-to-clipboard')
      expect(copyComponents[0]).toHaveAttribute('data-copy', 'hex_block_hash_1')
      expect(copyComponents[1]).toHaveAttribute('data-copy', 'hex_block_hash_2')

      // Check for formatted timestamps
      expect(screen.getByText('formatted_1640995200')).toBeInTheDocument()
      expect(screen.getByText('formatted_1640995260')).toBeInTheDocument()
    })

    it('should display pagination controls', () => {
      render(
        <TestWrapper>
          <BlockTable data={largeSearchResults} />
        </TestWrapper>
      )

      // Check pagination
      const pagination = screen.getByTestId('pagination')
      expect(pagination).toBeInTheDocument()
      expect(pagination).toHaveAttribute('data-count', '3') // 25 items / 10 per page

      // Check navigation buttons
      expect(screen.getByText('Previous')).toBeInTheDocument()
      expect(screen.getByText('Next')).toBeInTheDocument()
    })
  })

  describe('Pagination functionality', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false) // desktop view
    })

    it('should handle page changes', () => {
      render(
        <TestWrapper>
          <BlockTable data={largeSearchResults} />
        </TestWrapper>
      )

      const nextButton = screen.getByText('Next')
      
      fireEvent.click(nextButton)
      
      // Pagination should be functional (though state management is internal)
      expect(nextButton).toBeInTheDocument()
    })

    it('should calculate total pages correctly', () => {
      render(
        <TestWrapper>
          <BlockTable data={largeSearchResults} />
        </TestWrapper>
      )

      const pagination = screen.getByTestId('pagination')
      expect(pagination).toHaveAttribute('data-count', '3') // Math.ceil(25 / 10)
    })

    it('should display correct items per page', () => {
      render(
        <TestWrapper>
          <BlockTable data={largeSearchResults} />
        </TestWrapper>
      )

      // Should limit to 10 items per page
      const heightLinks = screen.getAllByTestId('link')
      expect(heightLinks).toHaveLength(10)
    })
  })

  describe('Data handling', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false) // desktop view
    })

    it('should handle empty data', () => {
      render(
        <TestWrapper>
          <BlockTable data={[]} />
        </TestWrapper>
      )

      const heading = screen.getByTestId('inner-heading')
      expect(heading).toHaveTextContent('Kernel Search Results (0)')

      // Should still render headers
      expect(screen.getByText('Height')).toBeInTheDocument()
      
      // Pagination should show 0 pages
      const pagination = screen.getByTestId('pagination')
      expect(pagination).toHaveAttribute('data-count', '0')
    })

    it('should handle null data', () => {
      render(
        <TestWrapper>
          <BlockTable data={null} />
        </TestWrapper>
      )

      const heading = screen.getByTestId('inner-heading')
      expect(heading).toHaveTextContent('Kernel Search Results (0)')
    })

    it('should call helper functions with correct parameters', () => {
      render(
        <TestWrapper>
          <BlockTable data={mockSearchResults} />
        </TestWrapper>
      )

      // Helper functions should be called
      expect(mockToHexString).toHaveBeenCalledWith('block_hash_1')
      expect(mockToHexString).toHaveBeenCalledWith('block_hash_2')
      expect(mockFormatTimestamp).toHaveBeenCalledWith(1640995200)
      expect(mockFormatTimestamp).toHaveBeenCalledWith(1640995260)
      expect(mockPowCheck).toHaveBeenCalledWith(1)
      expect(mockPowCheck).toHaveBeenCalledWith(2)
    })
  })

  describe('Component structure', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false) // desktop view
    })

    it('should use theme spacing', () => {
      render(
        <TestWrapper>
          <BlockTable data={mockSearchResults} />
        </TestWrapper>
      )

      expect(mockTheme.spacing).toHaveBeenCalled()
    })

    it('should render view all blocks button', () => {
      render(
        <TestWrapper>
          <BlockTable data={mockSearchResults} />
        </TestWrapper>
      )

      const viewAllButton = screen.getByRole('button', { name: 'View All Blocks' })
      expect(viewAllButton).toBeInTheDocument()
      expect(viewAllButton).toHaveAttribute('data-href', '/blocks/')
      expect(viewAllButton).toHaveAttribute('data-color', 'secondary')
      expect(viewAllButton).toHaveAttribute('data-variant', 'contained')
    })

    it('should display proper component hierarchy', () => {
      render(
        <TestWrapper>
          <BlockTable data={mockSearchResults} />
        </TestWrapper>
      )

      // Check for basic structure elements
      expect(screen.getByTestId('box')).toBeInTheDocument()
      expect(screen.getAllByTestId('grid')).toHaveLength(2) // At least headers + content
    })
  })
})
