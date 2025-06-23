import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import BlockTimes from '../BlockTimes'

// Mock ECharts
vi.mock('echarts-for-react', () => ({
  default: ({ option, style, ...props }: any) => (
    <div 
      data-testid="echarts" 
      data-option={JSON.stringify(option)}
      style={style}
      {...props}
    >
      ECharts Component
    </div>
  )
}))

// Mock components
vi.mock('@components/StyledComponents', () => ({
  TransparentBg: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="transparent-bg">{children}</div>
  )
}))

// Mock MUI components
vi.mock('@mui/material', () => ({
  Alert: ({ severity, variant, children }: any) => (
    <div data-testid="alert" data-severity={severity} data-variant={variant}>
      {children}
    </div>
  ),
  Skeleton: ({ variant, height }: any) => (
    <div data-testid="skeleton" data-variant={variant} data-height={height}>
      Loading...
    </div>
  ),
  Typography: ({ children, variant }: any) => (
    <div data-testid="typography" data-variant={variant}>{children}</div>
  ),
  Box: ({ children, ...props }: any) => (
    <div data-testid="box" {...props}>{children}</div>
  )
}))

// Mock API hook
vi.mock('@services/api/hooks/useBlocks', () => ({
  useAllBlocks: vi.fn()
}))

// Mock theme and colors
const mockTheme = {
  spacing: vi.fn((value: number) => `${value * 8}px`),
  palette: {
    mode: 'light',
    text: {
      primary: '#000000'
    },
    grey: {
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e'
    }
  }
}

vi.mock('@mui/material/styles', () => ({
  useTheme: () => mockTheme,
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

vi.mock('@theme/colors', () => ({
  chartColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
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
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

describe('BlockTimes', () => {
  let mockUseAllBlocks: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const { useAllBlocks } = await import('@services/api/hooks/useBlocks')
    mockUseAllBlocks = vi.mocked(useAllBlocks)
  })

  const mockBlockData = {
    tipInfo: {
      metadata: {
        best_block_height: 100000
      }
    },
    blockTimes: {
      series: [
        [99940, 1.5],
        [99941, 2.1],
        [99942, 1.8],
        [99943, 2.3],
        [99944, 1.9]
      ]
    },
    moneroTimes: {
      series: [
        [99940, 1.2],
        [99941, 1.8],
        [99942, 1.5]
      ]
    },
    shaTimes: {
      series: [
        [99940, 2.1],
        [99941, 2.5],
        [99942, 2.2]
      ]
    }
  }

  it('should render loading state', () => {
    mockUseAllBlocks.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <BlockTimes type="All" targetTime={2} />
      </TestWrapper>
    )

    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('skeleton')).toHaveAttribute('data-variant', 'rounded')
    expect(screen.getByTestId('skeleton')).toHaveAttribute('data-height', '300')
  })

  it('should render error state', () => {
    const errorMessage = 'Failed to load block times'
    mockUseAllBlocks.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { message: errorMessage }
    })

    render(
      <TestWrapper>
        <BlockTimes type="All" targetTime={2} />
      </TestWrapper>
    )

    expect(screen.getByTestId('transparent-bg')).toBeInTheDocument()
    const alert = screen.getByTestId('alert')
    expect(alert).toHaveAttribute('data-severity', 'error')
    expect(alert).toHaveAttribute('data-variant', 'outlined')
    expect(alert).toHaveTextContent(errorMessage)
  })

  it('should render chart for All type', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockBlockData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <BlockTimes type="All" targetTime={2} />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    expect(chart).toBeInTheDocument()
    
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')
    expect(option.series).toBeDefined()
    expect(option.xAxis).toBeDefined()
    expect(option.yAxis).toBeDefined()
    expect(option.tooltip).toBeDefined()
    expect(option.dataZoom).toBeDefined()
    
    // Check that it uses the blockTimes series for "All" type  
    expect(option.series[0].data).toEqual(["299940,1.5", "299941,2.1", "299942,1.8", "299943,2.3", "299944,1.9"])
  })

  it('should render chart for RandomX type', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockBlockData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <BlockTimes type="RandomX" targetTime={2} />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    expect(chart).toBeInTheDocument()
    
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')
    expect(option.series[0].data).toEqual(["299940,1.2", "299941,1.8", "299942,1.5"])
  })

  it('should render chart for Sha3 type', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockBlockData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <BlockTimes type="Sha3" targetTime={2} />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    expect(chart).toBeInTheDocument()
    
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')
    expect(option.series[0].data).toEqual(["299940,2.1", "299941,2.5", "299942,2.2"])
  })

  it('should configure chart with proper options', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockBlockData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <BlockTimes type="All" targetTime={2} />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')

    // Check basic chart configuration
    expect(option.animation).toBe(false)
    expect(option.grid).toBeDefined()
    expect(option.grid.left).toBe('2%')
    expect(option.grid.right).toBe('2%')
    expect(option.grid.bottom).toBe('20%')

    // Check tooltip configuration
    expect(option.tooltip.trigger).toBe('axis')

    // Check dataZoom configuration
    expect(option.dataZoom).toHaveLength(2)
    expect(option.dataZoom[0].type).toBe('slider')
    expect(option.dataZoom[1].type).toBe('inside')

    // Check series configuration
    expect(option.series[0].type).toBe('line')
    expect(option.series[0].smooth).toBe(false)
  })

  it('should handle chart dimensions and styling', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockBlockData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <BlockTimes type="All" targetTime={2} />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    expect(chart).toBeInTheDocument()
  })

  it('should handle missing or empty data gracefully', () => {
    mockUseAllBlocks.mockReturnValue({
      data: {
        tipInfo: { metadata: { best_block_height: 100000 } },
        blockTimes: { series: [] },
        moneroTimes: { series: [] },
        shaTimes: { series: [] }
      },
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <BlockTimes type="All" targetTime={2} />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    expect(chart).toBeInTheDocument()
    
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')
    expect(option.series[0].data).toEqual([])
  })

  it('should use correct color for RandomX type', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockBlockData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <BlockTimes type="RandomX" targetTime={2} />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')
    expect(option.color).toBe('#45B7D1') // chartColor[2]
  })

  it('should use correct color for Sha3 type', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockBlockData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <BlockTimes type="Sha3" targetTime={2} />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')
    expect(option.color).toBe('#FFA07A') // chartColor[3]
  })

  it('should configure axis properly', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockBlockData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <BlockTimes type="All" targetTime={2} />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')

    // Check X axis (category for block numbers)
    expect(option.xAxis.type).toBe('category')
    expect(option.xAxis.inverse).toBe(true)

    // Check Y axis (value for time)
    expect(option.yAxis.type).toBe('value')
    expect(option.yAxis.min).toBe(0)
  })

  it('should set proper chart name based on type', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockBlockData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <BlockTimes type="RandomX" targetTime={2} />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')
    expect(option.series[0].name).toBe('RandomX')
  })
})
