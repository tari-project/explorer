import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import VNTable from '../VNTable'

// Mock dependencies using individual vi.mock calls
vi.mock('@services/api/hooks/useBlocks', () => ({
  useAllBlocks: vi.fn()
}))

vi.mock('@services/stores/useMainStore', () => ({
  useMainStore: vi.fn()
}))

vi.mock('@components/StyledComponents', () => ({
  TypographyData: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="typography-data">{children}</div>
  ),
  TransparentBg: ({ children, height }: { children: React.ReactNode; height?: string }) => (
    <div data-testid="transparent-bg" data-height={height}>{children}</div>
  )
}))

vi.mock('@components/InnerHeading', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="inner-heading">{children}</div>
  )
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
  Alert: ({ severity, variant, children }: any) => (
    <div data-testid="alert" data-severity={severity} data-variant={variant}>
      {children}
    </div>
  ),
  Skeleton: ({ variant, height }: any) => (
    <div data-testid="skeleton" data-variant={variant} data-height={height}>Loading...</div>
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

describe('VNTable', () => {
  let mockUseAllBlocks: any
  let mockUseMainStore: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const { useAllBlocks } = await import('@services/api/hooks/useBlocks')
    const { useMainStore } = await import('@services/stores/useMainStore')
    mockUseAllBlocks = vi.mocked(useAllBlocks)
    mockUseMainStore = vi.mocked(useMainStore)
  })

  const mockVNData = {
    headers: [
      {
        vn_nodes: [
          {
            public_key: 'vn_key_1',
            shard_key: 'shard_1',
            epoch: 1,
            committee: ['member1', 'member2']
          },
          {
            public_key: 'vn_key_2',
            shard_key: 'shard_2',
            epoch: 1,
            committee: ['member3', 'member4']
          }
        ]
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
          <VNTable />
        </TestWrapper>
      )

      const skeletons = screen.getAllByTestId('skeleton')
      expect(skeletons.length).toBeGreaterThan(0)
      skeletons.forEach(skeleton => {
        expect(skeleton).toHaveAttribute('data-height', '60')
        expect(skeleton).toHaveAttribute('data-variant', 'rounded')
      })
    })

    it('should render mobile error state', () => {
      const errorMessage = 'Failed to load VN data'
      mockUseAllBlocks.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: { message: errorMessage }
      })

      render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      )

      expect(screen.getByTestId('transparent-bg')).toBeInTheDocument()
      const alert = screen.getByTestId('alert')
      expect(alert).toHaveAttribute('data-severity', 'error')
      expect(alert).toHaveAttribute('data-variant', 'outlined')
      expect(alert).toHaveTextContent(errorMessage)
    })

    it('should render mobile VN data', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockVNData,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      )

      // Check for heading
      const heading = screen.getByTestId('inner-heading')
      expect(heading).toHaveTextContent('Active Validator Nodes')

      // Check for VN data fields
      expect(screen.getByText('Public Key')).toBeInTheDocument()
      expect(screen.getByText('Shard Key')).toBeInTheDocument()
      expect(screen.getByText('Committee')).toBeInTheDocument()

      // Check for data placeholders (since VN data structure might be simplified)
      expect(screen.getByText('Pubkey Data')).toBeInTheDocument()
      expect(screen.getByText('Shard Data')).toBeInTheDocument()
      expect(screen.getByText('Committee Data')).toBeInTheDocument()
    })

    it('should handle empty VN data', () => {
      mockUseAllBlocks.mockReturnValue({
        data: { activeVns: [] },
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      )

      const heading = screen.getByTestId('inner-heading')
      expect(heading).toHaveTextContent('Active Validator Nodes')

      // Should not render any VN data rows
      expect(screen.queryByText('Pubkey Data')).not.toBeInTheDocument()
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
          <VNTable />
        </TestWrapper>
      )

      const skeletons = screen.getAllByTestId('skeleton')
      expect(skeletons.length).toBeGreaterThan(0)
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
          <VNTable />
        </TestWrapper>
      )

      const transparentBg = screen.getByTestId('transparent-bg')
      expect(transparentBg).toHaveAttribute('data-height', '850px')
      
      const alert = screen.getByTestId('alert')
      expect(alert).toHaveTextContent(errorMessage)
    })

    it('should render desktop table headers', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockVNData,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      )

      // Check table headers
      expect(screen.getByText('Public Key')).toBeInTheDocument()
      expect(screen.getByText('Shard Key')).toBeInTheDocument()
      expect(screen.getByText('Committee')).toBeInTheDocument()
    })

    it('should render desktop VN data in table format', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockVNData,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      )

      // Check for data display
      expect(screen.getByText('Pubkey Data')).toBeInTheDocument()
      expect(screen.getByText('Shard Data')).toBeInTheDocument()
      expect(screen.getByText('Committee Data')).toBeInTheDocument()

      // Check for proper grid structure
      const grids = screen.getAllByTestId('grid')
      expect(grids.length).toBeGreaterThan(0)
    })
  })

  describe('Data handling', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false) // desktop view
    })

    it('should handle null activeVns data', () => {
      mockUseAllBlocks.mockReturnValue({
        data: { activeVns: null },
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      )

      // Should handle null gracefully
      const heading = screen.getByTestId('inner-heading')
      expect(heading).toHaveTextContent('Active Validator Nodes')
    })

    it('should handle undefined data', () => {
      mockUseAllBlocks.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      )

      // Should handle undefined data gracefully
      const heading = screen.getByTestId('inner-heading')
      expect(heading).toHaveTextContent('Active Validator Nodes')
    })

    it('should render multiple VN entries', () => {
      const multipleVNs = {
        activeVns: [
          { public_key: 'vn_key_1', shard_key: 'shard_1', committee: 'committee_1' },
          { public_key: 'vn_key_2', shard_key: 'shard_2', committee: 'committee_2' },
          { public_key: 'vn_key_3', shard_key: 'shard_3', committee: 'committee_3' }
        ]
      }

      mockUseAllBlocks.mockReturnValue({
        data: multipleVNs,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      )

      // Should render data for all VNs
      const pubkeyLabels = screen.getAllByText('Public Key')
      const shardLabels = screen.getAllByText('Shard Key')
      const committeeLabels = screen.getAllByText('Committee')

      // In mobile view, each VN has these labels
      expect(pubkeyLabels.length).toBeGreaterThan(0)
      expect(shardLabels.length).toBeGreaterThan(0)
      expect(committeeLabels.length).toBeGreaterThan(0)
    })
  })

  describe('Component structure', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false) // desktop view
    })

    it('should use theme spacing', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockVNData,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      )

      expect(mockTheme.spacing).toHaveBeenCalled()
    })

    it('should render proper container structure', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockVNData,
        isLoading: false,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      )

      // Check for basic structure elements
      const grids = screen.getAllByTestId('grid')
      expect(grids.length).toBeGreaterThan(0)
    })

    it('should handle responsive display switching', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockVNData,
        isLoading: false,
        isError: false,
        error: null
      })

      // Start with mobile
      mockUseMainStore.mockReturnValue(true)
      const { rerender } = render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      )

      expect(screen.getByTestId('inner-heading')).toBeInTheDocument()

      // Switch to desktop
      mockUseMainStore.mockReturnValue(false)
      rerender(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      )

      expect(screen.getByTestId('inner-heading')).toBeInTheDocument()
    })
  })

  describe('Loading states', () => {
    it('should handle loading state correctly in mobile', () => {
      mockUseMainStore.mockReturnValue(true) // mobile

      mockUseAllBlocks.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      )

      // Loading state should render skeletons
      const skeletons = screen.getAllByTestId('skeleton')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    it('should handle loading state correctly in desktop', () => {
      mockUseMainStore.mockReturnValue(false) // desktop

      mockUseAllBlocks.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        error: null
      })

      render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      )

      // Loading state should render skeletons
      const skeletons = screen.getAllByTestId('skeleton')
      expect(skeletons.length).toBeGreaterThan(0)
    })
  })
})
