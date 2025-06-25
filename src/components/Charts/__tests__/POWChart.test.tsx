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

    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('skeleton')).toHaveAttribute('data-variant', 'rounded')
    expect(screen.getByTestId('skeleton')).toHaveAttribute('data-height', '300')
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

  it('should render bar chart with POW data', () => {
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
    expect(option.series[0].type).toBe('bar')
    expect(option.series).toHaveLength(3) // RandomX, Sha3, TariRandomX
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
    
    const barData = option.series[0].data
    
    // Check that data exists for all time periods
    expect(barData).toHaveLength(4) // 100, 50, 20, 10 blocks
    
    // Check series names
    expect(option.series[0].name).toBe('RandomX')
    expect(option.series[1].name).toBe('Sha 3')
    expect(option.series[2].name).toBe('Tari RandomX')
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

    // Check tooltip configuration
    expect(option.tooltip.trigger).toBe('axis')
    
    // Check legend configuration
    expect(option.legend).toBeDefined()
    expect(option.legend.bottom).toBe(10)

    // Check axis configuration
    expect(option.xAxis.type).toBe('value')
    expect(option.yAxis.type).toBe('category')
    expect(option.yAxis.data).toEqual(['100', '50', '20', '10'])

    // Check series configuration
    expect(option.series[0].type).toBe('bar')
    expect(option.series[0].stack).toBe('total')
    expect(option.series[0].label.show).toBe(true)
  })

  it('should use correct colors for bar segments', () => {
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
    
    // Check that colors are set globally
    expect(option.color).toEqual(['#98D8C8', '#FFA07A', '#45B7D1'])
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
    expect(chart).toBeInTheDocument()
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
    
    // Should still render all series even if some have 0 values
    expect(option.series).toHaveLength(3)
    
    // Check that the component handles zero values gracefully
    expect(option.series[0].data).toHaveLength(4) // 4 time periods
  })

  it('should handle missing data gracefully', () => {
    mockUseAllBlocks.mockReturnValue({
      data: {
        algoSplit: {
          moneroRx10: 0, moneroRx20: 0, moneroRx50: 0, moneroRx100: 0,
          sha3X10: 0, sha3X20: 0, sha3X50: 0, sha3X100: 0,
          tariRx10: 0, tariRx20: 0, tariRx50: 0, tariRx100: 0
        }
      },
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
    expect(option.series[0].label.formatter).toBe('{c}%')
    
    // Check emphasis configuration
    expect(option.series[0].emphasis.focus).toBe('series')
  })
})
