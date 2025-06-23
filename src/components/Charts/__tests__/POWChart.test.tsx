import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import POWChart from '../POWChart'

// Mock ECharts
vi.mock('echarts-for-react', () => ({
  default: ({ option, style, ...props }: any) => (
    <div 
      data-testid="echarts" 
      data-option={JSON.stringify(option)}
      style={style}
      {...props}
    >
      POW Chart
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

describe('POWChart', () => {
  let mockUseAllBlocks: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const { useAllBlocks } = await import('@services/api/hooks/useBlocks')
    mockUseAllBlocks = vi.mocked(useAllBlocks)
  })

  const mockPowData = {
    algoSplit: {
      moneroRx10: 45,
      moneroRx20: 30,
      moneroRx50: 20,
      moneroRx100: 15,
      sha3X10: 25,
      sha3X20: 20,
      sha3X50: 15,
      sha3X100: 10,
      tariRx10: 35,
      tariRx20: 25,
      tariRx50: 20,
      tariRx100: 15
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
        <POWChart />
      </TestWrapper>
    )

    expect(screen.getByTestId('transparent-bg')).toBeInTheDocument()
    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('skeleton')).toHaveAttribute('data-variant', 'rounded')
    expect(screen.getByTestId('skeleton')).toHaveAttribute('data-height', '400')
  })

  it('should render error state', () => {
    const errorMessage = 'Failed to load POW data'
    mockUseAllBlocks.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { message: errorMessage }
    })

    render(
      <TestWrapper>
        <POWChart />
      </TestWrapper>
    )

    expect(screen.getByTestId('transparent-bg')).toBeInTheDocument()
    const alert = screen.getByTestId('alert')
    expect(alert).toHaveAttribute('data-severity', 'error')
    expect(alert).toHaveAttribute('data-variant', 'outlined')
    expect(alert).toHaveTextContent(errorMessage)
  })

  it('should render pie chart with POW data', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockPowData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <POWChart />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    expect(chart).toBeInTheDocument()
    
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')
    expect(option.series).toBeDefined()
    expect(option.series[0].type).toBe('pie')
    expect(option.series[0].data).toHaveLength(3) // Monero, Sha3, Tari
  })

  it('should calculate percentages correctly', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockPowData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <POWChart />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')
    
    const pieData = option.series[0].data
    
    // Check that percentages add up to 100%
    const totalPercentage = pieData.reduce((sum: number, item: any) => sum + item.value, 0)
    expect(totalPercentage).toBe(100)
    
    // Check individual algorithm data
    expect(pieData[0].name).toBe('RandomX')
    expect(pieData[1].name).toBe('Sha3')
    expect(pieData[2].name).toBe('TariRandomX')
  })

  it('should configure chart with proper options', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockPowData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <POWChart />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')

    // Check basic chart configuration
    expect(option.animation).toBe(false)
    
    // Check tooltip configuration
    expect(option.tooltip.trigger).toBe('item')
    expect(option.tooltip.confine).toBe(true)

    // Check legend configuration
    expect(option.legend).toBeDefined()
    expect(option.legend.orient).toBe('horizontal')
    expect(option.legend.bottom).toBe('10%')

    // Check series configuration
    expect(option.series[0].type).toBe('pie')
    expect(option.series[0].center).toEqual(['50%', '40%'])
    expect(option.series[0].label.show).toBe(true)
  })

  it('should use correct colors for pie segments', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockPowData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <POWChart />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')
    
    const pieData = option.series[0].data
    
    // Check that each segment has a color from chartColor
    expect(pieData[0].itemStyle.color).toBe('#4ECDC4') // chartColor[1] for RandomX
    expect(pieData[1].itemStyle.color).toBe('#45B7D1') // chartColor[2] for Sha3
    expect(pieData[2].itemStyle.color).toBe('#FFA07A') // chartColor[3] for TariRandomX
  })

  it('should handle chart dimensions and styling', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockPowData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <POWChart />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    expect(chart.style.height).toBe('400px')
    expect(chart.style.width).toBe('100%')
  })

  it('should handle zero values gracefully', () => {
    const zeroData = {
      algoSplit: {
        moneroRx10: 0,
        moneroRx20: 0,
        moneroRx50: 0,
        moneroRx100: 0,
        sha3X10: 100,
        sha3X20: 0,
        sha3X50: 0,
        sha3X100: 0,
        tariRx10: 0,
        tariRx20: 0,
        tariRx50: 0,
        tariRx100: 0
      }
    }

    mockUseAllBlocks.mockReturnValue({
      data: zeroData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <POWChart />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')
    
    const pieData = option.series[0].data
    
    // Should still show all three categories even if some are 0%
    expect(pieData).toHaveLength(3)
    expect(pieData[1].value).toBe(100) // Only Sha3 should have 100%
    expect(pieData[0].value).toBe(0) // RandomX should be 0%
    expect(pieData[2].value).toBe(0) // TariRandomX should be 0%
  })

  it('should handle missing data gracefully', () => {
    mockUseAllBlocks.mockReturnValue({
      data: {},
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <POWChart />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    expect(chart).toBeInTheDocument()
    
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')
    expect(option.series[0].data).toHaveLength(3)
    
    // Should default to 0 values when data is missing
    const pieData = option.series[0].data
    pieData.forEach((item: any) => {
      expect(item.value).toBe(0)
    })
  })

  it('should format labels correctly', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockPowData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <POWChart />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')
    
    // Check label configuration
    expect(option.series[0].label.show).toBe(true)
    expect(option.series[0].label.formatter).toBeDefined()
    
    // Check emphasis configuration
    expect(option.series[0].emphasis.label.show).toBe(true)
    expect(option.series[0].emphasis.label.fontSize).toBe(20)
    expect(option.series[0].emphasis.label.fontWeight).toBe('bold')
  })
})
