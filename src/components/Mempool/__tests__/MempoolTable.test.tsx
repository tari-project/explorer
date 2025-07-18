import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import MempoolTable from '../MempoolTable';

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
}));

vi.mock('@components/CopyToClipboard', () => ({
  default: ({ copy }: { copy: string }) => (
    <div data-testid="copy-to-clipboard" data-copy={copy}>
      Copy
    </div>
  ),
}));

vi.mock('@components/FetchStatusCheck', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="fetch-status-check">{children}</div>
  ),
}));

vi.mock('@utils/helpers', () => ({
  toHexString: vi.fn((data) => `hex_${data}`),
  shortenString: vi.fn(
    (str, start, end) =>
      `${str.substring(0, start)}...${str.substring(str.length - end)}`
  ),
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
    xs,
    md,
    lg,
    spacing,
    style,
    container,
    ...props
  }: any) => (
    <div
      data-testid="grid"
      data-item={item}
      data-xs={xs}
      data-md={md}
      data-lg={lg}
      data-spacing={spacing}
      style={style}
      // Do not pass 'container' prop to div to avoid React warning
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
  Pagination: ({ count, page, onChange }: any) => (
    <div data-testid="pagination" data-count={count} data-page={page}>
      <button onClick={() => onChange(null, page - 1)}>Previous</button>
      <button onClick={() => onChange(null, page + 1)}>Next</button>
    </div>
  ),
  MenuItem: ({ children, value }: any) => (
    <option data-testid="menu-item" value={value}>
      {children}
    </option>
  ),
  FormControl: ({ children }: any) => (
    <div data-testid="form-control">{children}</div>
  ),
}));

vi.mock('@mui/material/Select', () => ({
  default: ({ value, onChange, children }: any) => (
    <select
      data-testid="select"
      value={value}
      onChange={(e) => onChange({ target: { value: e.target.value } })}
    >
      {children}
    </select>
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

describe('MempoolTable', () => {
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

  const largeMempoolData = {
    mempool: Array.from({ length: 25 }, (_, i) => ({
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

  describe('Mobile View', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(true); // isMobile = true
    });

    it('should render mobile mempool data', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockMempoolData,
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <MempoolTable />
        </TestWrapper>
      );

      // Check for data display - use getAllByText since there are multiple elements
      expect(screen.getAllByText('Excess')).toHaveLength(2); // One for each transaction
      expect(screen.getAllByText('Total Fees')).toHaveLength(2);

      // Check copy components
      const copyComponents = screen.getAllByTestId('copy-to-clipboard');
      expect(copyComponents[0]).toHaveAttribute(
        'data-copy',
        'hex_mock_signature_1'
      );
    });

    it('should handle pagination in mobile view', () => {
      mockUseAllBlocks.mockReturnValue({
        data: largeMempoolData,
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <MempoolTable />
        </TestWrapper>
      );

      // Check pagination controls
      const pagination = screen.getByTestId('pagination');
      expect(pagination).toHaveAttribute('data-count', '3'); // 25 items / 10 per page = 3 pages
      expect(pagination).toHaveAttribute('data-page', '1');
    });
  });

  describe('Desktop View', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false); // isMobile = false
    });

    it('should render desktop table headers', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockMempoolData,
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <MempoolTable />
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
      });

      render(
        <TestWrapper>
          <MempoolTable />
        </TestWrapper>
      );

      // Check copy to clipboard components
      const copyComponents = screen.getAllByTestId('copy-to-clipboard');
      expect(copyComponents).toHaveLength(2);
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
    });

    it('should display pagination controls', () => {
      mockUseAllBlocks.mockReturnValue({
        data: largeMempoolData,
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <MempoolTable />
        </TestWrapper>
      );

      // Check pagination
      const pagination = screen.getByTestId('pagination');
      expect(pagination).toBeInTheDocument();
      expect(pagination).toHaveAttribute('data-count', '3'); // 25 items / 10 per page

      // Check items per page selector
      const select = screen.getByTestId('select');
      expect(select).toBeInTheDocument();
      expect(select).toHaveValue('10');
    });
  });

  describe('Pagination functionality', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false); // desktop view
    });

    it('should handle page changes', () => {
      mockUseAllBlocks.mockReturnValue({
        data: largeMempoolData,
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <MempoolTable />
        </TestWrapper>
      );

      const pagination = screen.getByTestId('pagination');
      const nextButton = screen.getByText('Next');

      fireEvent.click(nextButton);

      // Should be on page 2 after clicking next
      expect(pagination).toHaveAttribute('data-page', '2');
    });

    it('should handle items per page changes', () => {
      mockUseAllBlocks.mockReturnValue({
        data: largeMempoolData,
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <MempoolTable />
        </TestWrapper>
      );

      const select = screen.getByTestId('select');

      fireEvent.change(select, { target: { value: '20' } });

      // Should update pagination based on new items per page
      expect(select).toHaveValue('20');
    });

    it('should calculate total pages correctly', () => {
      mockUseAllBlocks.mockReturnValue({
        data: largeMempoolData,
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <MempoolTable />
        </TestWrapper>
      );

      const pagination = screen.getByTestId('pagination');
      expect(pagination).toHaveAttribute('data-count', '3'); // Math.ceil(25 / 10)
    });
  });

  describe('Data handling', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false); // desktop view
    });

    it('should handle empty mempool', () => {
      mockUseAllBlocks.mockReturnValue({
        data: { mempool: [] },
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <MempoolTable />
        </TestWrapper>
      );

      // Should show empty state alert
      expect(screen.getByTestId('alert')).toHaveTextContent('Mempool is empty');
    });

    it('should handle null mempool data', () => {
      mockUseAllBlocks.mockReturnValue({
        data: { mempool: null },
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <MempoolTable />
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
      });

      render(
        <TestWrapper>
          <MempoolTable />
        </TestWrapper>
      );

      // Helper functions should be called
      expect(mockToHexString).toHaveBeenCalledWith('mock_signature_1');
      expect(mockToHexString).toHaveBeenCalledWith('mock_signature_2');
    });
  });

  describe('Loading and error states', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false); // desktop view
    });

    it('should handle loading state via FetchStatusCheck', () => {
      mockUseAllBlocks.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
      });

      render(
        <TestWrapper>
          <MempoolTable />
        </TestWrapper>
      );

      // FetchStatusCheck should handle loading state
      expect(screen.getByTestId('fetch-status-check')).toBeInTheDocument();
    });

    it('should handle error state via FetchStatusCheck', () => {
      mockUseAllBlocks.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
      });

      render(
        <TestWrapper>
          <MempoolTable />
        </TestWrapper>
      );

      // FetchStatusCheck should handle error state
      expect(screen.getByTestId('fetch-status-check')).toBeInTheDocument();
    });
  });
});
