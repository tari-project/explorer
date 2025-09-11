import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { MockInstance } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StatsBox from '../StatsBox/StatsBox';
import { lightTheme } from '@theme/themes';

// Mock the useAllBlocks hook
vi.mock('@services/api/hooks/useBlocks', () => ({
  useAllBlocks: vi.fn(() => ({
    data: {
      blockTimes: {
        series: [1.5, 2.2, 1.8, 2.1, 1.9, 2.0, 1.7, 2.3, 1.6, 2.4],
      },
      currentMoneroRandomxHashRate: 12345678901234,
      currentSha3xHashRate: 9876543210987,
      currentTariRandomxHashRate: 5432109876543,
      tipInfo: {
        metadata: {
          best_block_height: 123456,
        },
      },
    },
    isLoading: false,
    error: null,
  })),
}));

// Mock formatHash and formatC29 utilities
vi.mock('@utils/helpers', () => ({
  formatHash: vi.fn((hashRate: number) => {
    if (hashRate >= 1e12) return `${(hashRate / 1e12).toFixed(1)}TH/s`;
    if (hashRate >= 1e9) return `${(hashRate / 1e9).toFixed(1)}GH/s`;
    if (hashRate >= 1e6) return `${(hashRate / 1e6).toFixed(1)}MH/s`;
    if (hashRate >= 1e3) return `${(hashRate / 1e3).toFixed(1)}KH/s`;
    return `${hashRate}H/s`;
  }),
  formatC29: vi.fn((hashRateGps: number, precision: number = 0) => {
    if (hashRateGps >= 1000) {
      return `${(hashRateGps / 1000).toFixed(precision)}Kg`;
    }
    return `${hashRateGps.toFixed(precision)}g`;
  }),
}));

// Mock StatsDesktop and StatsMobile components
vi.mock('../StatsBox/StatsDesktop/StatsDesktop', () => ({
  default: ({
    moneroHashRate,
    tariRandomXHashRate,
    shaHashRate,
    averageBlockTime,
    blockHeight,
  }: {
    moneroHashRate?: string | number;
    tariRandomXHashRate?: string | number;
    shaHashRate?: string | number;
    averageBlockTime?: string | number;
    blockHeight?: string | number;
  }) => (
    <div data-testid="stats-desktop">
      <span data-testid="monero-hash-rate">{moneroHashRate}</span>
      <span data-testid="tari-random-x-hash-rate">{tariRandomXHashRate}</span>
      <span data-testid="sha-hash-rate">{shaHashRate}</span>
      <span data-testid="average-block-time">{averageBlockTime}</span>
      <span data-testid="block-height">{blockHeight}</span>
    </div>
  ),
}));

vi.mock('../StatsBox/StatsMobile/StatsMobile', () => ({
  default: ({
    moneroHashRate,
    shaHashRate,
    tariRandomXHashRate,
    averageBlockTime,
    blockHeight,
  }: {
    moneroHashRate?: string | number;
    shaHashRate?: string | number;
    tariRandomXHashRate?: string | number;
    averageBlockTime?: string | number;
    blockHeight?: string | number;
  }) => (
    <div data-testid="stats-mobile">
      <span data-testid="monero-hash-rate-mobile">{moneroHashRate}</span>
      <span data-testid="sha-hash-rate-mobile">{shaHashRate}</span>
      <span data-testid="tari-random-x-hash-rate-mobile">
        {tariRandomXHashRate}
      </span>
      <span data-testid="average-block-time-mobile">{averageBlockTime}</span>
      <span data-testid="block-height-mobile">{blockHeight}</span>
    </div>
  ),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
};

describe('StatsBox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render desktop variant with formatted statistics', () => {
    render(
      <TestWrapper>
        <StatsBox variant="desktop" />
      </TestWrapper>
    );

    expect(screen.getByTestId('stats-desktop')).toBeInTheDocument();
    expect(screen.getByTestId('monero-hash-rate')).toHaveTextContent(
      '12.3TH/s'
    );
    expect(screen.getByTestId('tari-random-x-hash-rate')).toHaveTextContent(
      '5.4TH/s'
    );
    expect(screen.getByTestId('sha-hash-rate')).toHaveTextContent('9.9TH/s');
    expect(screen.getByTestId('average-block-time')).toHaveTextContent('4m');
    expect(screen.getByTestId('block-height')).toHaveTextContent('123,456');
  });

  it('should render mobile variant with formatted statistics', () => {
    render(
      <TestWrapper>
        <StatsBox variant="mobile" />
      </TestWrapper>
    );

    expect(screen.getByTestId('stats-mobile')).toBeInTheDocument();
    expect(screen.getByTestId('monero-hash-rate-mobile')).toHaveTextContent(
      '12.3TH/s'
    );
    expect(
      screen.getByTestId('tari-random-x-hash-rate-mobile')
    ).toHaveTextContent('5.4TH/s');
    expect(screen.getByTestId('sha-hash-rate-mobile')).toHaveTextContent(
      '9.9TH/s'
    );
    expect(screen.getByTestId('average-block-time-mobile')).toHaveTextContent(
      '4m'
    );
    expect(screen.getByTestId('block-height-mobile')).toHaveTextContent(
      '123,456'
    );
  });

  it('should calculate average block time correctly', async () => {
    const { useAllBlocks } = await import('@services/api/hooks/useBlocks');

    (useAllBlocks as unknown as MockInstance).mockReturnValue({
      data: {
        blockTimes: {
          series: [2.0, 2.0, 2.0, 2.0, 2.0], // exact 2 minute average
        },
        currentMoneroRandomxHashRate: 1000000000000,
        currentSha3xHashRate: 1000000000000,
        currentTariRandomxHashRate: 1000000000000,
        tipInfo: {
          metadata: {
            best_block_height: 100000,
          },
        },
      },
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <StatsBox variant="desktop" />
      </TestWrapper>
    );

    // Average of 2.0 + target time of 2 = 4 minutes
    expect(screen.getByTestId('average-block-time')).toHaveTextContent('4m');
  });

  it('should handle missing block times data gracefully', async () => {
    const { useAllBlocks } = await import('@services/api/hooks/useBlocks');

    (useAllBlocks as unknown as MockInstance).mockReturnValue({
      data: {
        blockTimes: {
          series: [],
        },
        currentMoneroRandomxHashRate: 1000000000000,
        currentSha3xHashRate: 1000000000000,
        currentTariRandomxHashRate: 1000000000000,
        tipInfo: {
          metadata: {
            best_block_height: 100000,
          },
        },
      },
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <StatsBox variant="desktop" />
      </TestWrapper>
    );

    // Should not crash with empty series
    expect(screen.getByTestId('stats-desktop')).toBeInTheDocument();
  });

  it('should handle missing hash rate data with defaults', async () => {
    const { useAllBlocks } = await import('@services/api/hooks/useBlocks');

    (useAllBlocks as unknown as MockInstance).mockReturnValue({
      data: {
        blockTimes: {
          series: [2.0, 2.0, 2.0],
        },
        // Missing hash rate fields
        tipInfo: {
          metadata: {
            best_block_height: 100000,
          },
        },
      },
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <StatsBox variant="desktop" />
      </TestWrapper>
    );

    // Should handle missing data with defaults (0)
    expect(screen.getByTestId('monero-hash-rate')).toHaveTextContent('0H/s');
    expect(screen.getByTestId('tari-random-x-hash-rate')).toHaveTextContent(
      '0H/s'
    );
    expect(screen.getByTestId('sha-hash-rate')).toHaveTextContent('0H/s');
  });

  it('should format hash rates with appropriate units', async () => {
    const { useAllBlocks } = await import('@services/api/hooks/useBlocks');

    // Test different magnitudes
    (useAllBlocks as unknown as MockInstance).mockReturnValue({
      data: {
        blockTimes: {
          series: [2.0],
        },
        currentMoneroRandomxHashRate: 1500, // KH/s
        currentSha3xHashRate: 2500000, // MH/s
        currentTariRandomxHashRate: 3500000000, // GH/s
        tipInfo: {
          metadata: {
            best_block_height: 100000,
          },
        },
      },
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <StatsBox variant="desktop" />
      </TestWrapper>
    );

    expect(screen.getByTestId('monero-hash-rate')).toHaveTextContent('1.5KH/s');
    expect(screen.getByTestId('sha-hash-rate')).toHaveTextContent('2.5MH/s');
    expect(screen.getByTestId('tari-random-x-hash-rate')).toHaveTextContent(
      '3.5GH/s'
    );
  });

  it('should format block height with thousands separators', async () => {
    const { useAllBlocks } = await import('@services/api/hooks/useBlocks');

    (useAllBlocks as unknown as MockInstance).mockReturnValue({
      data: {
        blockTimes: {
          series: [2.0],
        },
        currentMoneroRandomxHashRate: 1000000000000,
        currentSha3xHashRate: 1000000000000,
        currentTariRandomxHashRate: 1000000000000,
        tipInfo: {
          metadata: {
            best_block_height: 1234567,
          },
        },
      },
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <StatsBox variant="desktop" />
      </TestWrapper>
    );

    expect(screen.getByTestId('block-height')).toHaveTextContent('1,234,567');
  });

  it('should handle null or undefined data gracefully', async () => {
    const { useAllBlocks } = await import('@services/api/hooks/useBlocks');

    (useAllBlocks as unknown as MockInstance).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <StatsBox variant="desktop" />
      </TestWrapper>
    );

    // Should not crash with null data
    expect(screen.getByTestId('stats-desktop')).toBeInTheDocument();
  });

  it('should pass all required props to desktop component', () => {
    render(
      <TestWrapper>
        <StatsBox variant="desktop" />
      </TestWrapper>
    );

    const desktopComponent = screen.getByTestId('stats-desktop');
    expect(desktopComponent).toBeInTheDocument();

    // All stat fields should be present
    expect(screen.getByTestId('monero-hash-rate')).toBeInTheDocument();
    expect(screen.getByTestId('tari-random-x-hash-rate')).toBeInTheDocument();
    expect(screen.getByTestId('sha-hash-rate')).toBeInTheDocument();
    expect(screen.getByTestId('average-block-time')).toBeInTheDocument();
    expect(screen.getByTestId('block-height')).toBeInTheDocument();
  });

  it('should pass all required props to mobile component', () => {
    render(
      <TestWrapper>
        <StatsBox variant="mobile" />
      </TestWrapper>
    );

    const mobileComponent = screen.getByTestId('stats-mobile');
    expect(mobileComponent).toBeInTheDocument();

    // All stat fields should be present
    expect(screen.getByTestId('monero-hash-rate-mobile')).toBeInTheDocument();
    expect(
      screen.getByTestId('tari-random-x-hash-rate-mobile')
    ).toBeInTheDocument();
    expect(screen.getByTestId('sha-hash-rate-mobile')).toBeInTheDocument();
    expect(screen.getByTestId('average-block-time-mobile')).toBeInTheDocument();
    expect(screen.getByTestId('block-height-mobile')).toBeInTheDocument();
  });
});
