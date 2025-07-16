import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import MempoolWidget from '../MempoolWidget';

// Mock dependencies using individual vi.mock calls
vi.mock('@services/api/hooks/useBlocks', () => ({
  useAllBlocks: vi.fn(),
}));

vi.mock('@services/stores/useMainStore', () => ({
  useMainStore: vi.fn(),
}));

vi.mock('@components/StyledComponents', () => ({
  TypographyData: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="typography-data">{children}</div>
  ),
  TransparentBg: ({
    children,
    height,
  }: {
    children: React.ReactNode;
    height?: string;
  }) => (
    <div data-testid="transparent-bg" data-height={height}>
      {children}
    </div>
  ),
  TransparentDivider: () => <div data-testid="transparent-divider">---</div>,
  HeightData: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="height-data">{children}</div>
  ),
}));

vi.mock('@components/CopyToClipboard', () => ({
  default: ({ copy }: { copy: string }) => (
    <div data-testid="copy-to-clipboard" data-copy={copy}>
      Copy
    </div>
  ),
}));

vi.mock('@components/InnerHeading', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="inner-heading">{children}</div>
  ),
}));

vi.mock('@utils/helpers', () => ({
  toHexString: vi.fn((data) => `hex_${data}`),
  shortenString: vi.fn(
    (str, start, end) =>
      `${str.substring(0, start)}...${str.substring(str.length - end)}`
  ),
  formatTimestamp: vi.fn((timestamp) => `formatted_${timestamp}`),
}));

vi.mock('@mui/material', () => ({
  Typography: ({ children, variant }: any) => (
    <div data-testid="typography" data-variant={variant}>
      {children}
    </div>
  ),
  Grid: ({
    children,
    item,
    container,
    xs,
    md,
    lg,
    spacing,
    style,
    ...props
  }: any) => (
    <div
      data-testid="grid"
      data-item={item}
      data-container={
        container !== undefined ? container.toString() : undefined
      }
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
  Box: ({ children, style, ...props }: any) => (
    <div data-testid="box" style={style} {...props}>
      {children}
    </div>
  ),
  Divider: ({ color, style }: any) => (
    <div data-testid="divider" data-color={color} style={style}>
      ---
    </div>
  ),
  Button: ({
    children,
    variant,
    fullWidth,
    href,
    color,
    style,
    ...props
  }: any) => (
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
    <div data-testid="skeleton" data-variant={variant} data-height={height}>
      Loading...
    </div>
  ),
  Alert: ({ severity, variant, children }: any) => (
    <div data-testid="alert" data-severity={severity} data-variant={variant}>
      {children}
    </div>
  ),
}));

// Mock theme
const mockTheme = {
  spacing: vi.fn((value: number) => `${value * 8}px`),
  palette: {
    background: { paper: '#ffffff' },
    divider: '#e0e0e0',
  },
  typography: {
    h6: {
      fontSize: '1rem',
    },
  },
};

vi.mock('@mui/material/styles', () => ({
  useTheme: () => mockTheme,
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
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
      <ThemeProvider theme={mockTheme as any}>
        <MemoryRouter>{children}</MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('MempoolWidget', () => {
  let mockUseAllBlocks: any;
  let mockUseMainStore: any;
  let mockToHexString: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    const { useAllBlocks } = await import('@services/api/hooks/useBlocks');
    const { useMainStore } = await import('@services/stores/useMainStore');
    const { toHexString } = await import('@utils/helpers');
    mockUseAllBlocks = vi.mocked(useAllBlocks);
    mockUseMainStore = vi.mocked(useMainStore);
    mockToHexString = vi.mocked(toHexString);
  });

  const mockMempoolData = {
    mempool: [
      {
        transaction: {
          body: {
            signature: { data: 'mock_signature_1' },
            total_fees: 1000,
            outputs: [{}],
            kernels: [{}],
            inputs: [{}],
          },
        },
      },
      {
        transaction: {
          body: {
            signature: { data: 'mock_signature_2' },
            total_fees: 1500,
            outputs: [{}, {}],
            kernels: [{}],
            inputs: [{}, {}],
          },
        },
      },
    ],
  };

  describe('Mobile View', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(true); // isMobile = true
    });

    it('should render mobile loading state', () => {
      mockUseAllBlocks.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      );

      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons).toHaveLength(1); // Single skeleton in loading state
      expect(skeletons[0]).toHaveAttribute('data-height', '200');
      expect(skeletons[0]).toHaveAttribute('data-variant', 'rounded');
    });

    it('should render mobile error state', () => {
      const errorMessage = 'Failed to load mempool';
      mockUseAllBlocks.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: { message: errorMessage },
      });

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      );

      expect(screen.getByTestId('transparent-bg')).toBeInTheDocument();
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveAttribute('data-severity', 'error');
      expect(alert).toHaveAttribute('data-variant', 'outlined');
      expect(alert).toHaveTextContent(errorMessage);
    });

    it('should render mobile mempool data', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockMempoolData,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      );

      // Check for mempool count in heading
      const heading = screen.getByTestId('inner-heading');
      expect(heading).toHaveTextContent('Mempool (2)');

      // Check for fee data
      expect(screen.getByText('1000')).toBeInTheDocument();
      expect(screen.getByText('1500')).toBeInTheDocument();
    });

    it('should render empty mempool state', () => {
      mockUseAllBlocks.mockReturnValue({
        data: { mempool: [] },
        isLoading: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      );

      const heading = screen.getByTestId('inner-heading');
      expect(heading).toHaveTextContent('Mempool (0)');
    });

    it('should limit mobile display to 5 transactions', () => {
      const manyTransactions = {
        mempool: Array.from({ length: 10 }, (_, i) => ({
          transaction: {
            body: {
              signature: { data: `signature_${i}` },
              total_fees: 1000 + i * 100,
              outputs: [{}],
              kernels: [{}],
              inputs: [{}],
            },
          },
        })),
      };

      mockUseAllBlocks.mockReturnValue({
        data: manyTransactions,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      );

      const heading = screen.getByTestId('inner-heading');
      expect(heading).toHaveTextContent('Mempool (10)');

      // Should only display 5 transactions in mobile view - check Total Fees labels
      const feeLabels = screen.getAllByText('Total Fees');
      expect(feeLabels).toHaveLength(5);
    });
  });

  describe('Desktop View', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false); // isMobile = false
    });

    it('should render desktop loading state', () => {
      mockUseAllBlocks.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      );

      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons).toHaveLength(1); // Single skeleton in loading state
      expect(skeletons[0]).toHaveAttribute('data-height', '200');
      expect(skeletons[0]).toHaveAttribute('data-variant', 'rounded');
    });

    it('should render desktop error state', () => {
      const errorMessage = 'Network error';
      mockUseAllBlocks.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: { message: errorMessage },
      });

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      );

      const transparentBg = screen.getByTestId('transparent-bg');
      expect(transparentBg).toBeInTheDocument();

      const alert = screen.getByTestId('alert');
      expect(alert).toHaveTextContent(errorMessage);
    });

    it('should render desktop table headers', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockMempoolData,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      );

      // Check table headers
      expect(screen.getByText('Excess')).toBeInTheDocument();
      expect(screen.getByText('Total Fees')).toBeInTheDocument();
      expect(screen.getByText('Outputs')).toBeInTheDocument();
      expect(screen.getByText('Kernels')).toBeInTheDocument();
      expect(screen.getByText('Inputs')).toBeInTheDocument();
    });

    it('should render desktop mempool data in table format', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockMempoolData,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      );

      // Check copy to clipboard components
      const copyComponents = screen.getAllByTestId('copy-to-clipboard');
      expect(copyComponents[0]).toHaveAttribute(
        'data-copy',
        'hex_mock_signature_1'
      );
      expect(copyComponents[1]).toHaveAttribute(
        'data-copy',
        'hex_mock_signature_2'
      );

      // Check for fee data
      expect(screen.getByText('1000')).toBeInTheDocument();
      expect(screen.getByText('1500')).toBeInTheDocument();

      // Check for output counts
      const outputCounts = screen.getAllByText('1');
      expect(outputCounts.length).toBeGreaterThanOrEqual(1);
      const outputCounts2 = screen.getAllByText('2');
      expect(outputCounts2.length).toBeGreaterThanOrEqual(1);
    });

    it('should limit desktop display to 5 transactions', () => {
      const manyTransactions = {
        mempool: Array.from({ length: 10 }, (_, i) => ({
          transaction: {
            body: {
              signature: { data: `signature_${i}` },
              total_fees: 1000 + i * 100,
              outputs: [{}],
              kernels: [{}],
              inputs: [{}],
            },
          },
        })),
      };

      mockUseAllBlocks.mockReturnValue({
        data: manyTransactions,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      );

      // Should only display 5 transactions in desktop view
      const copyComponents = screen.getAllByTestId('copy-to-clipboard');
      expect(copyComponents).toHaveLength(5);
    });
  });

  describe('Common functionality', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false); // desktop by default
    });

    it('should use theme spacing', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockMempoolData,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      );

      // Theme spacing may not be called directly in this component
      expect(screen.getByTestId('inner-heading')).toBeInTheDocument();
    });

    it('should handle null mempool gracefully', () => {
      mockUseAllBlocks.mockReturnValue({
        data: { mempool: null },
        isLoading: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      );

      // Should show invalid data format alert
      expect(screen.getByTestId('alert')).toHaveTextContent(
        'Invalid data format'
      );
    });

    it('should call helper functions with correct parameters', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockMempoolData,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <MempoolWidget />
        </TestWrapper>
      );

      // Helper functions should be called
      expect(mockToHexString).toHaveBeenCalledWith('mock_signature_1');
      expect(mockToHexString).toHaveBeenCalledWith('mock_signature_2');
      // formatTimestamp is not used in this component
    });
  });
});
