import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import HashRates from '../HashRates'

// Mock ECharts
vi.mock('echarts-for-react', () => ({
  default: ({ option, style, ...props }: any) => (
    <div 
      data-testid="echarts" 
      data-option={JSON.stringify(option)}
      style={style}
      {...props}
    >
      HashRates Chart
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
  )
}))

// Mock helper functions
vi.mock('@utils/helpers', () => ({
  formatHash: vi.fn((value: number) => `${value.toFixed(2)} TH/s`)
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

describe('HashRates', () => {
  let mockUseAllBlocks: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const { useAllBlocks } = await import('@services/api/hooks/useBlocks')
    mockUseAllBlocks = vi.mocked(useAllBlocks)
  })

  const mockHashRateData = {
    tipInfo: {
      metadata: {
        best_block_height: 100000
      }
    },
    moneroHashRate: {
      series: [
        [99800, 1500000000],
        [99801, 1520000000],
        [99802, 1480000000]
      ]
    },
    shaHashRate: {
      series: [
        [99800, 2500000000],
        [99801, 2520000000],
        [99802, 2480000000]
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
        <HashRates type="RandomX" />
      </TestWrapper>
    )

    expect(screen.getByTestId('transparent-bg')).toBeInTheDocument()
    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('skeleton')).toHaveAttribute('data-variant', 'rounded')
    expect(screen.getByTestId('skeleton')).toHaveAttribute('data-height', '400')
  })

  it('should render error state', () => {
    const errorMessage = 'Failed to load hash rates'
    mockUseAllBlocks.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { message: errorMessage }
    })

    render(
      <TestWrapper>
        <HashRates type="RandomX" />
      </TestWrapper>
    )

    expect(screen.getByTestId('transparent-bg')).toBeInTheDocument()
    const alert = screen.getByTestId('alert')
    expect(alert).toHaveAttribute('data-severity', 'error')
    expect(alert).toHaveAttribute('data-variant', 'outlined')
    expect(alert).toHaveTextContent(errorMessage)
  })

  it('should render chart for RandomX type', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockHashRateData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <HashRates type="RandomX" />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    expect(chart).toBeInTheDocument()
    
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')
    expect(option.series).toBeDefined()
    expect(option.series[0].name).toBe('RandomX')
    expect(option.series[0].lineStyle.color).toBe('#98D8C8') // chartColor[4]
  })

  it('should render chart for Sha3 type', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockHashRateData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <HashRates type="Sha3" />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    expect(chart).toBeInTheDocument()
    
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')
    expect(option.series[0].name).toBe('Sha3')
    expect(option.series[0].lineStyle.color).toBe('#FFA07A') // chartColor[3]
  })

  it('should render chart for TariRandomX type with default color', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockHashRateData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <HashRates type="TariRandomX" />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    expect(chart).toBeInTheDocument()
    
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')
    expect(option.series[0].name).toBe('TariRandomX')
    expect(option.series[0].lineStyle.color).toBe('#45B7D1') // chartColor[2] (default)
  })

  it('should configure chart with proper options', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockHashRateData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <HashRates type="RandomX" />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')

    // Check basic chart configuration
    expect(option.animation).toBe(false)
    expect(option.grid).toBeDefined()
    expect(option.grid.left).toBe('0%')
    expect(option.grid.right).toBe('10%')
    expect(option.grid.bottom).toBe('25%')

    // Check tooltip configuration
    expect(option.tooltip.trigger).toBe('axis')
    expect(option.tooltip.confine).toBe(true)

    // Check dataZoom configuration
    expect(option.dataZoom).toHaveLength(2)
    expect(option.dataZoom[0].type).toBe('slider')
    expect(option.dataZoom[1].type).toBe('inside')

    // Check series configuration
    expect(option.series[0].type).toBe('line')
    expect(option.series[0].smooth).toBe(true)
    expect(option.series[0].showSymbol).toBe(false)
  })

  it('should handle chart dimensions and styling', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockHashRateData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <HashRates type="RandomX" />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    expect(chart.style.height).toBe('400px')
    expect(chart.style.width).toBe('100%')
  })

  it('should configure axis properly', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockHashRateData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <HashRates type="RandomX" />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')

    // Check X axis (height)
    expect(option.xAxis.type).toBe('value')
    expect(option.xAxis.name).toBe('Height')
    expect(option.xAxis.nameLocation).toBe('middle')

    // Check Y axis (hash rate)
    expect(option.yAxis.type).toBe('value')
    expect(option.yAxis.name).toBe('Hash Rate')
    expect(option.yAxis.nameLocation).toBe('middle')
  })

  it('should handle missing or empty data gracefully', () => {
    mockUseAllBlocks.mockReturnValue({
      data: {
        tipInfo: { metadata: { best_block_height: 100000 } },
        moneroHashRate: { series: [] },
        shaHashRate: { series: [] }
      },
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <HashRates type="RandomX" />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    expect(chart).toBeInTheDocument()
    
    // Should still render chart even with empty data
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')
    expect(option.series).toBeDefined()
  })

  it('should use formatHash helper for tooltip formatting', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockHashRateData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <HashRates type="RandomX" />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')
    
    // Check that tooltip formatter is configured
    expect(option.tooltip.formatter).toBeDefined()
  })

  it('should set proper zoom configuration', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockHashRateData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <HashRates type="RandomX" />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')

    // Check dataZoom configuration
    const sliderZoom = option.dataZoom.find((zoom: any) => zoom.type === 'slider')
    const insideZoom = option.dataZoom.find((zoom: any) => zoom.type === 'inside')
    
    expect(sliderZoom).toBeDefined()
    expect(insideZoom).toBeDefined()
    expect(sliderZoom.start).toBeGreaterThanOrEqual(0)
    expect(sliderZoom.end).toBeLessThanOrEqual(100)
  })
})
