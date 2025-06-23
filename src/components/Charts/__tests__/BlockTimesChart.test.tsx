import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import BlockTimesChart from '../BlockTimesChart'

// Mock ECharts
vi.mock('echarts-for-react', () => ({
  default: ({ option, style, ...props }: any) => (
    <div 
      data-testid="echarts" 
      data-option={JSON.stringify(option)}
      style={style}
      {...props}
    >
      Block Times Chart
    </div>
  )
}))

// Mock components
vi.mock('@components/InnerHeading', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="inner-heading">{children}</div>
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

describe('BlockTimesChart', () => {
  let mockUseAllBlocks: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const { useAllBlocks } = await import('@services/api/hooks/useBlocks')
    mockUseAllBlocks = vi.mocked(useAllBlocks)
  })

  const mockBlockTimesData = {
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
    headers: [
      { height: 99940 },
      { height: 99941 },
      { height: 99942 },
      { height: 99943 },
      { height: 99944 }
    ]
  }

  it('should render chart with data', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockBlockTimesData
    })

    render(
      <TestWrapper>
        <BlockTimesChart />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    expect(chart).toBeInTheDocument()
    expect(screen.getByTestId('inner-heading')).toBeInTheDocument()
    expect(screen.getByText('Block Times (Minutes)')).toBeInTheDocument()
  })

  it('should render line chart with block times data', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockBlockTimesData
    })

    render(
      <TestWrapper>
        <BlockTimesChart />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    expect(chart).toBeInTheDocument()
    
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')
    expect(option.series).toBeDefined()
    expect(option.series[0].type).toBe('line')
    expect(option.series).toHaveLength(1) // Only 'All' series
    expect(option.series[0].name).toBe('All')
  })

  it('should have proper chart configuration', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockBlockTimesData
    })

    render(
      <TestWrapper>
        <BlockTimesChart />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')

    // Check tooltip configuration
    expect(option.tooltip).toBeDefined()
    expect(option.tooltip.trigger).toBe('axis')
    
    // Check legend configuration
    expect(option.legend).toBeDefined()

    // Check axis configuration
    expect(option.xAxis.type).toBe('category')
    expect(option.yAxis.type).toBe('value')

    // Check series configuration
    expect(option.series[0].type).toBe('line')
    expect(option.series[0].smooth).toBe(true)
  })

  it('should generate proper x-axis labels', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockBlockTimesData
    })

    render(
      <TestWrapper>
        <BlockTimesChart />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')
    
    // Check x-axis data length matches the data length
    expect(option.xAxis.data).toHaveLength(20) // Default generateDataArray(20)
  })

  it('should handle empty data gracefully', () => {
    mockUseAllBlocks.mockReturnValue({
      data: null
    })

    render(
      <TestWrapper>
        <BlockTimesChart />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    expect(chart).toBeInTheDocument()
    
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')
    expect(option.series).toHaveLength(1)
  })

  it('should handle responsive design', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockBlockTimesData
    })

    render(
      <TestWrapper>
        <BlockTimesChart />
      </TestWrapper>
    )

    const chart = screen.getByTestId('echarts')
    const option = JSON.parse(chart.getAttribute('data-option') || '{}')
    
    // Check grid configuration for responsive layout
    expect(option.grid).toBeDefined()
  })
})
