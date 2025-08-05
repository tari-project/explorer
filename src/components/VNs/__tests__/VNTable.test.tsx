import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, type Theme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import VNTable from '../VNTable';

// Apply centralized mocks
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

vi.mock('@components/InnerHeading', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="inner-heading">{children}</div>
  ),
}));

vi.mock('@mui/material', () => ({
  Typography: ({ children, variant, color, ...props }: React.ComponentProps<'div'> & { variant?: string; color?: string }) => (
    <div
      data-testid="typography"
      data-variant={variant}
      data-color={color}
      {...props}
    >
      {children}
    </div>
  ),
  Grid: ({ children, item, xs, md, lg, spacing, container, ...props }: React.ComponentProps<'div'> & { item?: boolean; xs?: number; md?: number; lg?: number; spacing?: number; container?: boolean }) => (
    <div
      data-testid="grid"
      data-item={item}
      data-xs={xs}
      data-md={md}
      data-lg={lg}
      data-spacing={spacing}
      data-container={container}
      {...props}
    >
      {children}
    </div>
  ),
  Skeleton: ({ variant, height, width }: { variant?: string; height?: string | number; width?: string | number }) => (
    <div
      data-testid="skeleton"
      data-variant={variant}
      data-height={height || '200'}
      data-width={width}
    >
      Loading...
    </div>
  ),
  Alert: ({ severity, variant, children }: { severity?: string; variant?: string; children?: React.ReactNode }) => (
    <div data-testid="alert" data-severity={severity} data-variant={variant}>
      {children}
    </div>
  ),
  Divider: ({ color, style }: { color?: string; style?: React.CSSProperties }) => (
    <div data-testid="divider" data-color={color} style={style}>
      ---
    </div>
  ),
}));

const mockTheme = {
  spacing: vi.fn((value: number) => `${value * 8}px`),
  palette: {
    background: { paper: '#ffffff' },
    divider: '#e0e0e0',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    error: { main: '#d32f2f' },
    text: { primary: '#000000', secondary: '#666666' },
  },
  typography: {
    h6: { fontSize: '1.25rem' },
  },
  breakpoints: {
    up: vi.fn(() => '(min-width:600px)'),
    down: vi.fn(() => '(max-width:599px)'),
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
      <ThemeProvider theme={mockTheme as unknown as Theme}>
        <MemoryRouter>{children}</MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('VNTable', () => {
  let mockUseAllBlocks: ReturnType<typeof vi.fn>;
  let mockUseMainStore: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const { useAllBlocks } = await import('@services/api/hooks/useBlocks');
    const { useMainStore } = await import('@services/stores/useMainStore');
    mockUseAllBlocks = vi.mocked(useAllBlocks);
    mockUseMainStore = vi.mocked(useMainStore);
  });

  const mockVNData = {
    activeVns: [
      {
        public_key: { data: 'Pubkey Data' },
        shard_key: { data: 'Shardkey Data' },
        committee: 'committee_1',
      },
      {
        public_key: { data: 'Pubkey Data' },
        shard_key: { data: 'Shardkey Data' },
        committee: 'committee_2',
      },
      {
        public_key: { data: 'Pubkey Data' },
        shard_key: { data: 'Shardkey Data' },
        committee: 'committee_3',
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
          <VNTable />
        </TestWrapper>
      );

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveAttribute('data-height', '200');
      expect(skeleton).toHaveAttribute('data-variant', 'rounded');
    });

    it('should render mobile error state', () => {
      const errorMessage = 'Failed to load VN data';
      mockUseAllBlocks.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: { message: errorMessage },
      });

      render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      );

      expect(screen.getByTestId('transparent-bg')).toBeInTheDocument();
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveAttribute('data-severity', 'error');
      expect(alert).toHaveAttribute('data-variant', 'outlined');
      expect(alert).toHaveTextContent(errorMessage);
    });

    it('should render mobile VN data', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockVNData,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      );

      // Check for heading
      const heading = screen.getByTestId('inner-heading');
      expect(heading).toHaveTextContent('Active Validator Nodes');

      // Check for VN data fields - should have multiple instances for each VN
      const publicKeyLabels = screen.getAllByText('Public Key');
      expect(publicKeyLabels.length).toBe(3); // mockVNData has 3 items

      // Check for data values - using actual data from mockVNData
      const pubkeyData = screen.getAllByText('Pubkey Data');
      const shardkeyData = screen.getAllByText('Shardkey Data');
      expect(pubkeyData.length).toBe(3); // Each VN has Pubkey Data
      expect(shardkeyData.length).toBe(3); // Each VN has Shardkey Data
    });

    it('should handle empty VN data', () => {
      mockUseAllBlocks.mockReturnValue({
        data: { activeVns: [] },
        isLoading: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      );

      const heading = screen.getByTestId('inner-heading');
      expect(heading).toHaveTextContent('Active Validator Nodes');

      // Should not render any VN data rows
      expect(screen.queryByText('Pubkey Data')).not.toBeInTheDocument();
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
          <VNTable />
        </TestWrapper>
      );

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveAttribute('data-height', '200');
      expect(skeleton).toHaveAttribute('data-variant', 'rounded');
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
          <VNTable />
        </TestWrapper>
      );

      const transparentBg = screen.getByTestId('transparent-bg');
      expect(transparentBg).toBeInTheDocument();

      const alert = screen.getByTestId('alert');
      expect(alert).toHaveTextContent(errorMessage);
    });

    it('should render desktop table headers', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockVNData,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      );

      // Check table headers - Desktop only shows Public Key and Shard Key headers
      expect(screen.getByText('Public Key')).toBeInTheDocument();
      expect(screen.getByText('Shard Key')).toBeInTheDocument();
    });

    it('should render desktop VN data in table format', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockVNData,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      );

      // Check for data display - multiple instances for each VN
      const pubkeyData = screen.getAllByText('Pubkey Data');
      const shardkeyData = screen.getAllByText('Shardkey Data');
      expect(pubkeyData.length).toBe(3); // Each VN has Pubkey Data
      expect(shardkeyData.length).toBe(3); // Each VN has Shardkey Data

      // Check for proper grid structure
      const grids = screen.getAllByTestId('grid');
      expect(grids.length).toBeGreaterThan(0);
    });
  });

  describe('Data handling', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false); // desktop view
    });

    it('should handle null activeVns data', () => {
      mockUseAllBlocks.mockReturnValue({
        data: { activeVns: null },
        isLoading: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      );

      // Should handle null gracefully
      const heading = screen.getByTestId('inner-heading');
      expect(heading).toHaveTextContent('Active Validator Nodes');
    });

    it('should handle undefined data', () => {
      mockUseAllBlocks.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      );

      // Should handle undefined data gracefully
      const heading = screen.getByTestId('inner-heading');
      expect(heading).toHaveTextContent('Active Validator Nodes');
    });

    it('should render multiple VN entries', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockVNData, // Use centralized mock with multiple entries
        isLoading: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      );

      // Should render data for all VNs - mockVNData has 3 entries
      const pubkeyLabels = screen.getAllByText('Public Key');
      const shardLabels = screen.getAllByText('Shard Key');

      // In desktop view, one header + no more labels (data is in TypographyData components)
      expect(pubkeyLabels.length).toBe(1); // Only the header
      expect(shardLabels.length).toBe(1); // Only the header

      // Check for data values
      const pubkeyData = screen.getAllByText('Pubkey Data');
      expect(pubkeyData.length).toBe(3); // 3 VN entries
    });
  });

  describe('Component structure', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false); // desktop view
    });

    it('should use proper grid spacing', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockVNData,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      );

      // Check that Grid components have proper spacing attribute
      const grids = screen.getAllByTestId('grid');
      const spacedGrids = grids.filter(
        (grid) => grid.getAttribute('data-spacing') === '2'
      );
      expect(spacedGrids.length).toBeGreaterThan(0);
    });

    it('should render proper container structure', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockVNData,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      );

      // Check for basic structure elements
      const grids = screen.getAllByTestId('grid');
      expect(grids.length).toBeGreaterThan(0);
    });

    it('should handle responsive display switching', () => {
      mockUseAllBlocks.mockReturnValue({
        data: mockVNData,
        isLoading: false,
        isError: false,
        error: null,
      });

      // Start with mobile
      mockUseMainStore.mockReturnValue(true);
      const { rerender } = render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      );

      expect(screen.getByTestId('inner-heading')).toBeInTheDocument();

      // Switch to desktop
      mockUseMainStore.mockReturnValue(false);
      rerender(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      );

      expect(screen.getByTestId('inner-heading')).toBeInTheDocument();
    });
  });

  describe('Loading states', () => {
    it('should handle loading state correctly in mobile', () => {
      mockUseMainStore.mockReturnValue(true); // mobile

      mockUseAllBlocks.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      );

      // Loading state should render skeleton
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toBeInTheDocument();
    });

    it('should handle loading state correctly in desktop', () => {
      mockUseMainStore.mockReturnValue(false); // desktop

      mockUseAllBlocks.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <VNTable />
        </TestWrapper>
      );

      // Loading state should render skeleton
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toBeInTheDocument();
    });
  });
});
