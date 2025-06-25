import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import BlockExplorerPage from '../BlockExplorerPage'

// Mock all the child components
vi.mock('@components/StyledComponents', () => ({
  GradientPaper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="gradient-paper">{children}</div>
  )
}))

vi.mock('@components/Mempool/MempoolWidget', () => ({
  default: () => <div data-testid="mempool-widget">Mempool Widget</div>
}))

vi.mock('@components/VNs/VNTable', () => ({
  default: () => <div data-testid="vn-table">VN Table</div>
}))

vi.mock('@components/Blocks/BlockWidget', () => ({
  default: () => <div data-testid="block-widget">Block Widget</div>
}))

vi.mock('@components/Charts/BlockTimes', () => ({
  default: ({ type, targetTime }: { type: string; targetTime: number }) => (
    <div data-testid="block-times" data-type={type} data-target-time={targetTime}>
      Block Times Chart
    </div>
  )
}))

vi.mock('@components/Charts/HashRates', () => ({
  default: ({ type }: { type: string }) => (
    <div data-testid="hash-rates" data-type={type}>
      Hash Rates Chart - {type}
    </div>
  )
}))

vi.mock('@components/Charts/POWChart', () => ({
  default: () => <div data-testid="pow-chart">POW Chart</div>
}))

vi.mock('@components/InnerHeading', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="inner-heading">{children}</div>
  )
}))

// Mock MUI components and theme
const mockTheme = {
  spacing: vi.fn((value: number) => `${value * 8}px`),
  breakpoints: {
    down: vi.fn(() => 'media-query')
  }
}

vi.mock('@mui/material/styles', () => ({
  useTheme: () => mockTheme,
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

vi.mock('@mui/material', () => ({
  Grid: ({ children, ...props }: any) => (
    <div data-testid="grid" data-props={JSON.stringify(props)}>
      {children}
    </div>
  )
}))

// Test wrapper component
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
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

describe('BlockExplorerPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render without crashing', () => {
    render(
      <TestWrapper>
        <BlockExplorerPage />
      </TestWrapper>
    )

    expect(screen.getAllByTestId('grid')[0]).toBeInTheDocument()
  })

  it('should render all main sections', () => {
    render(
      <TestWrapper>
        <BlockExplorerPage />
      </TestWrapper>
    )

    // Check for all main headings
    expect(screen.getByText('Recent Blocks')).toBeInTheDocument()
    expect(screen.getByText('Proof of Work Split')).toBeInTheDocument()
    expect(screen.getByText('Block Times (Minutes)')).toBeInTheDocument()
    expect(screen.getByText('Hash Rates')).toBeInTheDocument()
  })

  it('should render all child components', () => {
    render(
      <TestWrapper>
        <BlockExplorerPage />
      </TestWrapper>
    )

    // Check for all child components
    expect(screen.getByTestId('block-widget')).toBeInTheDocument()
    expect(screen.getByTestId('pow-chart')).toBeInTheDocument()
    expect(screen.getByTestId('mempool-widget')).toBeInTheDocument()
    expect(screen.getByTestId('vn-table')).toBeInTheDocument()
  })

  it('should render block times chart with correct props', () => {
    render(
      <TestWrapper>
        <BlockExplorerPage />
      </TestWrapper>
    )

    const blockTimesChart = screen.getByTestId('block-times')
    expect(blockTimesChart).toBeInTheDocument()
    expect(blockTimesChart).toHaveAttribute('data-type', 'All')
    expect(blockTimesChart).toHaveAttribute('data-target-time', '2')
  })

  it('should render all hash rate charts with correct types', () => {
    render(
      <TestWrapper>
        <BlockExplorerPage />
      </TestWrapper>
    )

    const hashRateCharts = screen.getAllByTestId('hash-rates')
    expect(hashRateCharts).toHaveLength(3)

    expect(hashRateCharts[0]).toHaveAttribute('data-type', 'RandomX')
    expect(hashRateCharts[1]).toHaveAttribute('data-type', 'Sha3')
    expect(hashRateCharts[2]).toHaveAttribute('data-type', 'TariRandomX')
  })

  it('should use theme spacing correctly', () => {
    render(
      <TestWrapper>
        <BlockExplorerPage />
      </TestWrapper>
    )

    expect(mockTheme.spacing).toHaveBeenCalledWith(4) // paddingTop
    expect(mockTheme.spacing).toHaveBeenCalledWith(6) // paddingBottom
    expect(mockTheme.spacing).toHaveBeenCalledWith(3) // gap
  })

  it('should render gradient papers', () => {
    render(
      <TestWrapper>
        <BlockExplorerPage />
      </TestWrapper>
    )

    const gradientPapers = screen.getAllByTestId('gradient-paper')
    expect(gradientPapers).toHaveLength(6) // 6 main sections (includes sub-grids)
  })

  it('should render inner headings', () => {
    render(
      <TestWrapper>
        <BlockExplorerPage />
      </TestWrapper>
    )

    const innerHeadings = screen.getAllByTestId('inner-heading')
    expect(innerHeadings).toHaveLength(4) // 4 sections with headings (mempool doesn't have one)
  })

  it('should have responsive grid layout', () => {
    render(
      <TestWrapper>
        <BlockExplorerPage />
      </TestWrapper>
    )

    const grids = screen.getAllByTestId('grid')
    expect(grids.length).toBeGreaterThan(1) // Container + item grids
  })

  it('should render with proper spacing and layout structure', () => {
    render(
      <TestWrapper>
        <BlockExplorerPage />
      </TestWrapper>
    )

    // Should have main container grid
    const containerGrid = screen.getAllByTestId('grid')[0]
    expect(containerGrid).toBeInTheDocument()

    // All sections should be properly contained
    expect(screen.getByTestId('block-widget')).toBeInTheDocument()
    expect(screen.getByTestId('pow-chart')).toBeInTheDocument()
    expect(screen.getByTestId('mempool-widget')).toBeInTheDocument()
    expect(screen.getByTestId('vn-table')).toBeInTheDocument()
  })
})
