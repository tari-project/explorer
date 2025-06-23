import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import BlockWidget from '../BlockWidget'

// Mock components and dependencies
vi.mock('@components/StyledComponents', () => ({
  TypographyData: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="typography-data">{children}</div>
  ),
  TransparentBg: ({ children, height }: { children: React.ReactNode; height?: string }) => (
    <div data-testid="transparent-bg" data-height={height}>{children}</div>
  )
}))

vi.mock('@components/CopyToClipboard', () => ({
  default: ({ copy }: { copy: string }) => (
    <div data-testid="copy-to-clipboard" data-copy={copy}>Copy</div>
  )
}))

// Mock MUI components
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
  Skeleton: ({ variant, height }: any) => (
    <div data-testid="skeleton" data-variant={variant} data-height={height}>Loading...</div>
  ),
  Alert: ({ severity, variant, children }: any) => (
    <div data-testid="alert" data-severity={severity} data-variant={variant}>
      {children}
    </div>
  )
}))

// Mock Link from react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a data-testid="link" data-to={to}>{children}</a>
  ),
  MemoryRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Mock helper functions
vi.mock('@utils/helpers', () => ({
  toHexString: vi.fn((data) => `hex_${data}`),
  shortenString: vi.fn((str, start, end) => `${str.substring(0, start)}...${str.substring(str.length - end)}`),
  formatTimestamp: vi.fn((timestamp) => `formatted_${timestamp}`),
  powCheck: vi.fn((algo) => `pow_${algo}`)
}))

// Mock API hook
vi.mock('@services/api/hooks/useBlocks', () => ({
  useAllBlocks: vi.fn()
}))

// Mock store
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

describe('BlockWidget', () => {
  let mockUseAllBlocks: any
  let mockUseMainStore: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const { useAllBlocks } = await import('@services/api/hooks/useBlocks')
    const { useMainStore } = await import('@services/stores/useMainStore')
    mockUseAllBlocks = vi.mocked(useAllBlocks)
    mockUseMainStore = vi.mocked(useMainStore)
  })

  const mockBlockData = {
    headers: [
      {
        height: 12345,
        timestamp: 1640995200,
        pow: { pow_algo: 1 },
        hash: { data: 'block_hash_1' },
        kernels: 5,
        outputs: 10
      },
      {
        height: 12346,
        timestamp: 1640995260,
        pow: { pow_algo: 2 },
        hash: { data: 'block_hash_2' },
        kernels: 3,
        outputs: 8
      }
    ]
  }

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
          <BlockWidget />
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
      const errorMessage = 'Failed to load blocks'
      mockUseAllBlocks.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: { message: errorMessage }
      })

      render(
        <TestWrapper>
          <BlockWidget />
        </TestWrapper>
      )

      expect(screen.getByTestId('transparent-bg')).toBeInTheDocument()
      const alert = screen.getByTestId('alert')
      expect(alert).toHaveAttribute('data-severity', 'error')
      expect(alert).toHaveAttribute('data-variant', 'outlined')
      expect(alert).toHaveTextContent(errorMessage)
    })

    it('should render mobile block data', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockBlockData,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <BlockWidget />
        </TestWrapper>
      )

      // Check for block height links
      const heightLinks = screen.getAllByTestId('link')
      expect(heightLinks[0]).toHaveAttribute('data-to', '/blocks/12345')
      expect(heightLinks[0]).toHaveTextContent('12345')

      // Check for formatted timestamps
      expect(screen.getByText('formatted_1640995200')).toBeInTheDocument()

      // Check for PoW data
      expect(screen.getByText('pow_1')).toBeInTheDocument()

      // Check for kernels and outputs
      expect(screen.getByText('5')).toBeInTheDocument() // kernels
      expect(screen.getByText('10')).toBeInTheDocument() // outputs

      // Check for View All Blocks button
      const viewAllButton = screen.getByRole('button', { name: 'View All Blocks' })
      expect(viewAllButton).toHaveAttribute('data-href', '/blocks/')
      expect(viewAllButton).toHaveAttribute('data-color', 'secondary')
      expect(viewAllButton).toHaveAttribute('data-variant', 'contained')
    })

    it('should limit mobile display to 5 blocks', () => {
      const manyBlocks = {
        headers: Array.from({ length: 10 }, (_, i) => ({
          height: 12345 + i,
          timestamp: 1640995200 + i * 60,
          pow: { pow_algo: 1 },
          hash: { data: `block_hash_${i}` },
          kernels: 5,
          outputs: 10
        }))
      }

      mockUseAllBlocks.mockReturnValue({
        data: manyBlocks,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <BlockWidget />
        </TestWrapper>
      )

      // Should only display 5 blocks in mobile view
      const heightLabels = screen.getAllByText('Height')
      expect(heightLabels).toHaveLength(5)
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
          <BlockWidget />
        </TestWrapper>
      )

      const skeletons = screen.getAllByTestId('skeleton')
      expect(skeletons).toHaveLength(11) // desktopCount + 2
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
          <BlockWidget />
        </TestWrapper>
      )

      const transparentBg = screen.getByTestId('transparent-bg')
      expect(transparentBg).toHaveAttribute('data-height', '850px')
      
      const alert = screen.getByTestId('alert')
      expect(alert).toHaveTextContent(errorMessage)
    })

    it('should render desktop table headers', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockBlockData,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <BlockWidget />
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
      mockUseAllBlocks.mockReturnValue({
        data: mockBlockData,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <BlockWidget />
        </TestWrapper>
      )

      // Check for height links
      const heightLinks = screen.getAllByTestId('link')
      expect(heightLinks[0]).toHaveAttribute('data-to', '/blocks/12345')
      expect(heightLinks[1]).toHaveAttribute('data-to', '/blocks/12346')

      // Check copy to clipboard components
      const copyComponents = screen.getAllByTestId('copy-to-clipboard')
      expect(copyComponents[0]).toHaveAttribute('data-copy', 'hex_block_hash_1')
      expect(copyComponents[1]).toHaveAttribute('data-copy', 'hex_block_hash_2')

      // Check dividers
      const dividers = screen.getAllByTestId('divider')
      expect(dividers.length).toBeGreaterThan(0)
    })

    it('should limit desktop display to 9 blocks', () => {
      const manyBlocks = {
        headers: Array.from({ length: 15 }, (_, i) => ({
          height: 12345 + i,
          timestamp: 1640995200 + i * 60,
          pow: { pow_algo: 1 },
          hash: { data: `block_hash_${i}` },
          kernels: 5,
          outputs: 10
        }))
      }

      mockUseAllBlocks.mockReturnValue({
        data: manyBlocks,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <BlockWidget />
        </TestWrapper>
      )

      // Should only display 9 blocks in desktop view
      const heightLinks = screen.getAllByTestId('link')
      expect(heightLinks).toHaveLength(9) // Only 9 height links for blocks
    })
  })

  describe('Common functionality', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false) // desktop by default
    })

    it('should use theme spacing', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockBlockData,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <BlockWidget />
        </TestWrapper>
      )

      expect(mockTheme.spacing).toHaveBeenCalledWith(3)
    })

    it('should handle empty data gracefully', () => {
      mockUseAllBlocks.mockReturnValue({
        data: { headers: [] },
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <BlockWidget />
        </TestWrapper>
      )

      // Should still render View All Blocks button
      expect(screen.getByRole('button', { name: 'View All Blocks' })).toBeInTheDocument()
    })

    it('should call helper functions with correct parameters', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockBlockData,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <BlockWidget />
        </TestWrapper>
      )

      // Helper functions should be called with the mocked return values
      expect(screen.getByText('hex_block_hash_1')).toBeInTheDocument()
      expect(screen.getByText('formatted_1640995200')).toBeInTheDocument()
      expect(screen.getByText('pow_1')).toBeInTheDocument()
    })
  })
})
