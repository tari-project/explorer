import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HashRatesChart from '../HashRatesChart';

interface EChartsProps {
  option: unknown;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

interface Theme {
  spacing: (value: number) => string;
  palette: {
    mode: string;
    text: {
      primary: string;
    };
    grey: {
      300: string;
      400: string;
      500: string;
    };
    divider: string;
  };
}

// Mock ECharts
vi.mock('echarts-for-react', () => ({
  default: ({ option, style, ...props }: EChartsProps) => (
    <div
      data-testid="echarts"
      data-option={JSON.stringify(option)}
      style={style}
      {...props}
    >
      Hash Rates Chart
    </div>
  ),
}));

// Mock components
vi.mock('@components/InnerHeading', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="inner-heading">{children}</div>
  ),
}));

// Mock API hook
vi.mock('@services/api/hooks/useBlocks', () => ({
  useAllBlocks: vi.fn(),
}));

// Mock theme and colors
const mockTheme = {
  spacing: vi.fn((value: number) => `${value * 8}px`),
  palette: {
    mode: 'light',
    text: {
      primary: '#000000',
    },
    grey: {
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
    },
    divider: '#e0e0e0',
  },
};

vi.mock('@mui/material/styles', () => ({
  useTheme: () => mockTheme,
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('@theme/colors', () => ({
  chartColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
}));

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={mockTheme as Theme}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
};

describe('HashRatesChart', () => {
  let mockUseAllBlocks: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const { useAllBlocks } = await import('@services/api/hooks/useBlocks');
    mockUseAllBlocks = vi.mocked(useAllBlocks);
  });

  const mockHashRatesData = {
    tipInfo: {
      metadata: {
        best_block_height: 100000,
      },
    },
    totalHashRates: [1250000, 1350000, 1280000, 1420000, 1320000],
    moneroHashRates: [850000, 920000, 880000, 950000, 890000],
    shaHashRates: [400000, 430000, 400000, 470000, 430000],
    headers: [
      { height: 99940 },
      { height: 99941 },
      { height: 99942 },
      { height: 99943 },
      { height: 99944 },
    ],
  };

  it('should render chart with data', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockHashRatesData,
    });

    render(
      <TestWrapper>
        <HashRatesChart />
      </TestWrapper>
    );

    const chart = screen.getByTestId('echarts');
    expect(chart).toBeInTheDocument();
    expect(screen.getByTestId('inner-heading')).toBeInTheDocument();
    expect(screen.getByText('Hash Rates')).toBeInTheDocument();
  });

  it('should render line chart with hash rates data', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockHashRatesData,
    });

    render(
      <TestWrapper>
        <HashRatesChart />
      </TestWrapper>
    );

    const chart = screen.getByTestId('echarts');
    expect(chart).toBeInTheDocument();

    const option = JSON.parse(chart.getAttribute('data-option') || '{}');
    expect(option.series).toBeDefined();
    expect(option.series[0].type).toBe('line');
    expect(option.series).toHaveLength(3); // All, RandomX, Sha3X
  });

  it('should have proper chart configuration', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockHashRatesData,
    });

    render(
      <TestWrapper>
        <HashRatesChart />
      </TestWrapper>
    );

    const chart = screen.getByTestId('echarts');
    const option = JSON.parse(chart.getAttribute('data-option') || '{}');

    // Check tooltip configuration
    expect(option.tooltip).toBeDefined();
    expect(option.tooltip.trigger).toBe('axis');

    // Check legend configuration
    expect(option.legend).toBeDefined();

    // Check axis configuration
    expect(option.xAxis.type).toBe('category');
    expect(option.yAxis.type).toBe('value');

    // Check series configuration
    expect(option.series[0].type).toBe('line');
    expect(option.series[0].smooth).toBe(true);
  });

  it('should use correct series names and colors', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockHashRatesData,
    });

    render(
      <TestWrapper>
        <HashRatesChart />
      </TestWrapper>
    );

    const chart = screen.getByTestId('echarts');
    const option = JSON.parse(chart.getAttribute('data-option') || '{}');

    // Check series names
    expect(option.series[0].name).toBe('All');
    expect(option.series[1].name).toBe('RandomX');
    expect(option.series[2].name).toBe('Sha3X');

    // Check that colors are configured
    expect(option.color).toBeDefined();
  });

  it('should generate proper x-axis labels', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockHashRatesData,
    });

    render(
      <TestWrapper>
        <HashRatesChart />
      </TestWrapper>
    );

    const chart = screen.getByTestId('echarts');
    const option = JSON.parse(chart.getAttribute('data-option') || '{}');

    // Check x-axis data length
    expect(option.xAxis.data).toHaveLength(20); // Default generateDataArray(20)
  });

  it('should handle empty data gracefully', () => {
    mockUseAllBlocks.mockReturnValue({
      data: null,
    });

    render(
      <TestWrapper>
        <HashRatesChart />
      </TestWrapper>
    );

    const chart = screen.getByTestId('echarts');
    expect(chart).toBeInTheDocument();

    const option = JSON.parse(chart.getAttribute('data-option') || '{}');
    expect(option.series).toHaveLength(3);
  });

  it('should handle responsive design', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockHashRatesData,
    });

    render(
      <TestWrapper>
        <HashRatesChart />
      </TestWrapper>
    );

    const chart = screen.getByTestId('echarts');
    const option = JSON.parse(chart.getAttribute('data-option') || '{}');

    // Check grid configuration for responsive layout
    expect(option.grid).toBeDefined();
  });

  it('should handle hash rate data arrays', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockHashRatesData,
    });

    render(
      <TestWrapper>
        <HashRatesChart />
      </TestWrapper>
    );

    const chart = screen.getByTestId('echarts');
    const option = JSON.parse(chart.getAttribute('data-option') || '{}');

    // Check that data is passed to series
    expect(option.series[0].data).toEqual(mockHashRatesData.totalHashRates);
    expect(option.series[1].data).toEqual(mockHashRatesData.moneroHashRates);
    expect(option.series[2].data).toEqual(mockHashRatesData.shaHashRates);
  });
});
