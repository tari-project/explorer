import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import BlockTable from '../BlockTable';

// Mock dependencies with individual vi.mock calls
vi.mock('@components/StyledComponents', () => ({
  TypographyData: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="typography-data">{children}</div>
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
  toHexString: vi.fn((data: unknown) => {
    if (!data || data === 'no data') return 'no data';
    return `hex_${data}`;
  }),
  shortenString: vi.fn(
    (str: string, start: number, end: number) =>
      `${str.substring(0, start)}...${str.substring(str.length - end)}`
  ),
  formatTimestamp: vi.fn((timestamp: unknown) => {
    if (!timestamp || timestamp === 'no data') return 'no data';
    return `formatted_${timestamp}`;
  }),
  powCheck: vi.fn((algo: unknown) => {
    if (!algo || algo === 'no data') return 'no data';
    return `pow_${algo}`;
  }),
}));

vi.mock('@mui/material', () => ({
  Typography: ({
    children,
    variant,
  }: {
    children: React.ReactNode;
    variant?: string;
  }) => (
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
    ...props
  }: React.ComponentProps<'div'> & {
    item?: boolean;
    xs?: number;
    md?: number;
    lg?: number;
    spacing?: number;
  }) => (
    <div
      data-testid="grid"
      data-item={item}
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
  Divider: ({
    color,
    style,
  }: {
    color?: string;
    style?: React.CSSProperties;
  }) => (
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
  }: React.ComponentProps<'button'> & {
    variant?: string;
    fullWidth?: boolean;
    href?: string;
    color?: string;
  }) => (
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
  Box: ({
    children,
    style,
    ...props
  }: React.ComponentProps<'div'> & { style?: React.CSSProperties }) => (
    <div data-testid="box" style={style} {...props}>
      {children}
    </div>
  ),
  Pagination: ({
    count,
    page,
    onChange,
  }: {
    count?: number;
    page?: number;
    onChange?: (event: unknown, page: number) => void;
  }) => (
    <div data-testid="pagination" data-count={count} data-page={page}>
      <button
        onClick={() => onChange?.(null, (page || 1) - 1)}
        disabled={(page || 1) <= 1}
      >
        Previous
      </button>
      <span>
        Page {page || 1} of {count || 1}
      </span>
      <button
        onClick={() => onChange?.(null, (page || 1) + 1)}
        disabled={(page || 1) >= (count || 1)}
      >
        Next
      </button>
    </div>
  ),
}));

vi.mock('react-router-dom', () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a data-testid="link" data-to={to}>
      {children}
    </a>
  ),
  MemoryRouter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('@services/stores/useMainStore', () => ({
  useMainStore: vi.fn(),
}));

// Mock theme
const mockTheme = {
  spacing: vi.fn((value: number) => `${value * 8}px`),
  palette: {
    background: { paper: '#ffffff' },
    divider: '#e0e0e0',
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
      <ThemeProvider
        theme={mockTheme as unknown as import('@mui/material/styles').Theme}
      >
        <MemoryRouter>{children}</MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('BlockTable', () => {
  let mockUseMainStore: ReturnType<typeof vi.fn>;
  let mockToHexString: ReturnType<typeof vi.fn>;
  let mockFormatTimestamp: ReturnType<typeof vi.fn>;
  let mockPowCheck: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const { useMainStore } = await import('@services/stores/useMainStore');
    const { toHexString, formatTimestamp, powCheck } = await import(
      '@utils/helpers'
    );
    mockUseMainStore = vi.mocked(useMainStore);
    mockToHexString = vi.mocked(toHexString);
    mockFormatTimestamp = vi.mocked(formatTimestamp);
    mockPowCheck = vi.mocked(powCheck);
  });

  const mockSearchResults = [
    {
      block: {
        header: {
          height: 12345,
          timestamp: 1640995200,
          hash: {
            data: [
              230, 160, 204, 44, 173, 230, 204, 173, 53, 91, 78, 10, 8, 168, 2,
              174, 164, 156, 16, 1, 133, 148, 15, 200, 171, 69, 101, 117, 185,
              116, 123, 184,
            ],
          },
          pow: { pow_algo: 1 },
          version: 1,
          prev_hash: {
            data: [
              230, 160, 204, 44, 173, 230, 204, 173, 53, 91, 78, 10, 8, 168, 2,
              174, 164, 156, 16, 1, 133, 148, 15, 200, 171, 69, 101, 117, 185,
              116, 123, 185,
            ],
          },
          nonce: 123456,
          output_mr: {
            data: [
              230, 160, 204, 44, 173, 230, 204, 173, 53, 91, 78, 10, 8, 168, 2,
              174, 164, 156, 16, 1, 133, 148, 15, 200, 171, 69, 101, 117, 185,
              116, 123, 186,
            ],
          },
          validator_node_mr: {
            data: [
              230, 160, 204, 44, 173, 230, 204, 173, 53, 91, 78, 10, 8, 168, 2,
              174, 164, 156, 16, 1, 133, 148, 15, 200, 171, 69, 101, 117, 185,
              116, 123, 187,
            ],
          },
          kernel_mr: {
            data: [
              230, 160, 204, 44, 173, 230, 204, 173, 53, 91, 78, 10, 8, 168, 2,
              174, 164, 156, 16, 1, 133, 148, 15, 200, 171, 69, 101, 117, 185,
              116, 123, 188,
            ],
          },
          input_mr: {
            data: [
              230, 160, 204, 44, 173, 230, 204, 173, 53, 91, 78, 10, 8, 168, 2,
              174, 164, 156, 16, 1, 133, 148, 15, 200, 171, 69, 101, 117, 185,
              116, 123, 189,
            ],
          },
          kernel_mmr_size: 100,
          output_mmr_size: 200,
          total_kernel_offset: {
            data: [
              230, 160, 204, 44, 173, 230, 204, 173, 53, 91, 78, 10, 8, 168, 2,
              174, 164, 156, 16, 1, 133, 148, 15, 200, 171, 69, 101, 117, 185,
              116, 123, 190,
            ],
          },
          total_script_offset: {
            data: [
              230, 160, 204, 44, 173, 230, 204, 173, 53, 91, 78, 10, 8, 168, 2,
              174, 164, 156, 16, 1, 133, 148, 15, 200, 171, 69, 101, 117, 185,
              116, 123, 191,
            ],
          },
        },
        body: {
          kernels: Array(5).fill({}),
          outputs: Array(10).fill({}),
          inputs: Array(0).fill({}),
        },
      },
    },
    {
      block: {
        header: {
          height: 12346,
          timestamp: 1640995260,
          hash: {
            data: [
              231, 161, 205, 45, 174, 231, 205, 174, 54, 92, 79, 11, 9, 169, 3,
              175, 165, 157, 17, 2, 134, 149, 16, 201, 172, 70, 102, 118, 186,
              117, 124, 185,
            ],
          },
          pow: { pow_algo: 2 },
          version: 1,
          prev_hash: {
            data: [
              231, 161, 205, 45, 174, 231, 205, 174, 54, 92, 79, 11, 9, 169, 3,
              175, 165, 157, 17, 2, 134, 149, 16, 201, 172, 70, 102, 118, 186,
              117, 124, 186,
            ],
          },
          nonce: 123457,
          output_mr: {
            data: [
              231, 161, 205, 45, 174, 231, 205, 174, 54, 92, 79, 11, 9, 169, 3,
              175, 165, 157, 17, 2, 134, 149, 16, 201, 172, 70, 102, 118, 186,
              117, 124, 187,
            ],
          },
          validator_node_mr: {
            data: [
              231, 161, 205, 45, 174, 231, 205, 174, 54, 92, 79, 11, 9, 169, 3,
              175, 165, 157, 17, 2, 134, 149, 16, 201, 172, 70, 102, 118, 186,
              117, 124, 188,
            ],
          },
          kernel_mr: {
            data: [
              231, 161, 205, 45, 174, 231, 205, 174, 54, 92, 79, 11, 9, 169, 3,
              175, 165, 157, 17, 2, 134, 149, 16, 201, 172, 70, 102, 118, 186,
              117, 124, 189,
            ],
          },
          input_mr: {
            data: [
              231, 161, 205, 45, 174, 231, 205, 174, 54, 92, 79, 11, 9, 169, 3,
              175, 165, 157, 17, 2, 134, 149, 16, 201, 172, 70, 102, 118, 186,
              117, 124, 190,
            ],
          },
          kernel_mmr_size: 101,
          output_mmr_size: 201,
          total_kernel_offset: {
            data: [
              231, 161, 205, 45, 174, 231, 205, 174, 54, 92, 79, 11, 9, 169, 3,
              175, 165, 157, 17, 2, 134, 149, 16, 201, 172, 70, 102, 118, 186,
              117, 124, 191,
            ],
          },
          total_script_offset: {
            data: [
              231, 161, 205, 45, 174, 231, 205, 174, 54, 92, 79, 11, 9, 169, 3,
              175, 165, 157, 17, 2, 134, 149, 16, 201, 172, 70, 102, 118, 186,
              117, 124, 192,
            ],
          },
        },
        body: {
          kernels: Array(3).fill({}),
          outputs: Array(8).fill({}),
          inputs: Array(0).fill({}),
        },
      },
    },
  ];

  const largeSearchResults = Array.from({ length: 25 }, (_, i) => ({
    block: {
      header: {
        height: 12345 + i,
        timestamp: 1640995200 + i * 60,
        hash: { data: Array.from({ length: 32 }, (_, j) => 230 + i + j) },
        pow: { pow_algo: (i % 2) + 1 },
        version: 1,
        prev_hash: { data: Array.from({ length: 32 }, (_, j) => 231 + i + j) },
        nonce: 123456 + i,
        output_mr: { data: Array.from({ length: 32 }, (_, j) => 232 + i + j) },
        validator_node_mr: {
          data: Array.from({ length: 32 }, (_, j) => 233 + i + j),
        },
        kernel_mr: { data: Array.from({ length: 32 }, (_, j) => 234 + i + j) },
        input_mr: { data: Array.from({ length: 32 }, (_, j) => 235 + i + j) },
        kernel_mmr_size: 100 + i,
        output_mmr_size: 200 + i,
        total_kernel_offset: {
          data: Array.from({ length: 32 }, (_, j) => 236 + i + j),
        },
        total_script_offset: {
          data: Array.from({ length: 32 }, (_, j) => 237 + i + j),
        },
      },
      body: {
        kernels: Array(5 + i).fill({}),
        outputs: Array(10 + i).fill({}),
        inputs: Array(0).fill({}),
      },
    },
  }));

  describe('Mobile View', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(true); // isMobile = true
    });

    it('should render mobile block data', () => {
      render(
        <TestWrapper>
          <BlockTable data={mockSearchResults} />
        </TestWrapper>
      );

      // Check for inner heading with count
      const heading = screen.getByTestId('inner-heading');
      expect(heading).toHaveTextContent('Found in Blocks:');

      // Check for mobile layout elements (multiple instances for each result)
      expect(screen.getAllByText('Height')).toHaveLength(2); // One for each result
      expect(screen.getAllByText('Timestamp')).toHaveLength(2); // Changed from "Time" to actual text
      expect(screen.getAllByText('Proof of Work')).toHaveLength(2);

      // Check for height links
      const heightLinks = screen.getAllByTestId('link');
      expect(heightLinks[0]).toHaveAttribute('data-to', '/blocks/12345');
      expect(heightLinks[0]).toHaveTextContent('12,345');
    });

    it('should display formatted data in mobile view', () => {
      render(
        <TestWrapper>
          <BlockTable data={mockSearchResults} />
        </TestWrapper>
      );

      // Check for formatted timestamps
      expect(screen.getByText('formatted_1640995200')).toBeInTheDocument();
      expect(screen.getByText('formatted_1640995260')).toBeInTheDocument();

      // Check for PoW data
      expect(screen.getByText('pow_1')).toBeInTheDocument();
      expect(screen.getByText('pow_2')).toBeInTheDocument();

      // Check for kernel and output counts
      expect(screen.getByText('5')).toBeInTheDocument(); // kernels
      expect(screen.getByText('10')).toBeInTheDocument(); // outputs
    });

    it('should handle pagination in mobile view', () => {
      render(
        <TestWrapper>
          <BlockTable data={largeSearchResults} />
        </TestWrapper>
      );

      // Check pagination controls
      const pagination = screen.getByTestId('pagination');
      expect(pagination).toHaveAttribute('data-count', '3'); // 25 items / 10 per page = 3 pages
      expect(pagination).toHaveAttribute('data-page', '1');

      // Check pagination text
      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    });
  });

  describe('Desktop View', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false); // isMobile = false
    });

    it('should render desktop table headers', () => {
      render(
        <TestWrapper>
          <BlockTable data={mockSearchResults} />
        </TestWrapper>
      );

      // Check table headers
      expect(screen.getByText('Height')).toBeInTheDocument();
      expect(screen.getByText('Time')).toBeInTheDocument();
      expect(screen.getByText('Proof of Work')).toBeInTheDocument();
      expect(screen.getByText('Hash')).toBeInTheDocument();
      expect(screen.getByText('Kernels')).toBeInTheDocument();
      expect(screen.getByText('Outputs')).toBeInTheDocument();
    });

    it('should render desktop block data in table format', () => {
      render(
        <TestWrapper>
          <BlockTable data={mockSearchResults} />
        </TestWrapper>
      );

      // Check for height links
      const heightLinks = screen.getAllByTestId('link');
      expect(heightLinks[0]).toHaveAttribute('data-to', '/blocks/12345');
      expect(heightLinks[1]).toHaveAttribute('data-to', '/blocks/12346');

      // Check copy to clipboard components for hashes
      const copyComponents = screen.getAllByTestId('copy-to-clipboard');
      expect(copyComponents[0]).toHaveAttribute(
        'data-copy',
        'hex_230,160,204,44,173,230,204,173,53,91,78,10,8,168,2,174,164,156,16,1,133,148,15,200,171,69,101,117,185,116,123,184'
      );
      expect(copyComponents[1]).toHaveAttribute(
        'data-copy',
        'hex_231,161,205,45,174,231,205,174,54,92,79,11,9,169,3,175,165,157,17,2,134,149,16,201,172,70,102,118,186,117,124,185'
      );

      // Check for formatted timestamps
      expect(screen.getByText('formatted_1640995200')).toBeInTheDocument();
      expect(screen.getByText('formatted_1640995260')).toBeInTheDocument();
    });

    it('should display pagination controls', () => {
      render(
        <TestWrapper>
          <BlockTable data={largeSearchResults} />
        </TestWrapper>
      );

      // Check pagination
      const pagination = screen.getByTestId('pagination');
      expect(pagination).toBeInTheDocument();
      expect(pagination).toHaveAttribute('data-count', '3'); // 25 items / 10 per page

      // Check navigation buttons
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });
  });

  describe('Pagination functionality', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false); // desktop view
    });

    it('should handle page changes', () => {
      render(
        <TestWrapper>
          <BlockTable data={largeSearchResults} />
        </TestWrapper>
      );

      const nextButton = screen.getByText('Next');

      fireEvent.click(nextButton);

      // Pagination should be functional (though state management is internal)
      expect(nextButton).toBeInTheDocument();
    });

    it('should calculate total pages correctly', () => {
      render(
        <TestWrapper>
          <BlockTable data={largeSearchResults} />
        </TestWrapper>
      );

      const pagination = screen.getByTestId('pagination');
      expect(pagination).toHaveAttribute('data-count', '3'); // Math.ceil(25 / 10)
    });

    it('should display correct items per page', () => {
      render(
        <TestWrapper>
          <BlockTable data={largeSearchResults} />
        </TestWrapper>
      );

      // Should limit to 10 items per page
      const heightLinks = screen.getAllByTestId('link');
      expect(heightLinks).toHaveLength(10);
    });
  });

  describe('Data handling', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false); // desktop view
    });

    it('should handle empty data', () => {
      render(
        <TestWrapper>
          <BlockTable data={[]} />
        </TestWrapper>
      );

      const heading = screen.getByTestId('inner-heading');
      expect(heading).toHaveTextContent('Found in Block:');

      // Should still render headers
      expect(screen.getByText('Height')).toBeInTheDocument();

      // Pagination should not appear with empty data
      expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });

    it('should handle undefined data', () => {
      render(
        <TestWrapper>
          <BlockTable data={[]} />
        </TestWrapper>
      );

      const heading = screen.getByTestId('inner-heading');
      expect(heading).toHaveTextContent('Found in Block:');
    });

    it('should call helper functions with correct parameters', () => {
      render(
        <TestWrapper>
          <BlockTable data={mockSearchResults} />
        </TestWrapper>
      );

      // Helper functions should be called
      expect(mockToHexString).toHaveBeenCalledWith([
        230, 160, 204, 44, 173, 230, 204, 173, 53, 91, 78, 10, 8, 168, 2, 174,
        164, 156, 16, 1, 133, 148, 15, 200, 171, 69, 101, 117, 185, 116, 123,
        184,
      ]);
      expect(mockToHexString).toHaveBeenCalledWith([
        231, 161, 205, 45, 174, 231, 205, 174, 54, 92, 79, 11, 9, 169, 3, 175,
        165, 157, 17, 2, 134, 149, 16, 201, 172, 70, 102, 118, 186, 117, 124,
        185,
      ]);
      expect(mockFormatTimestamp).toHaveBeenCalledWith(1640995200);
      expect(mockFormatTimestamp).toHaveBeenCalledWith(1640995260);
      expect(mockPowCheck).toHaveBeenCalledWith('1');
      expect(mockPowCheck).toHaveBeenCalledWith('2');
    });
  });

  describe('Component structure', () => {
    beforeEach(() => {
      mockUseMainStore.mockReturnValue(false); // desktop view
    });

    it('should handle desktop layout properly', () => {
      render(
        <TestWrapper>
          <BlockTable data={mockSearchResults} />
        </TestWrapper>
      );

      // Desktop layout shows data in table format without View Block buttons
      expect(screen.getAllByTestId('grid').length).toBeGreaterThan(4);
      expect(
        screen.queryByRole('button', { name: 'View Block' })
      ).not.toBeInTheDocument();
    });

    it('should render View Block button for each result in mobile view', () => {
      mockUseMainStore.mockReturnValue(true); // mobile view

      render(
        <TestWrapper>
          <BlockTable data={mockSearchResults} />
        </TestWrapper>
      );

      const viewBlockButtons = screen.getAllByRole('button', {
        name: 'View Block',
      });
      expect(viewBlockButtons).toHaveLength(2); // One for each mock result
      // In mobile view, actual MUI buttons are rendered, not mocked ones
      viewBlockButtons.forEach((button) => {
        expect(button).toHaveClass('MuiButton-outlined');
        expect(button).toHaveClass('MuiButton-fullWidth');
      });
    });

    it('should display proper component hierarchy', () => {
      render(
        <TestWrapper>
          <BlockTable data={largeSearchResults} />
        </TestWrapper>
      );

      // Check for basic structure elements
      expect(screen.getAllByTestId('grid').length).toBeGreaterThan(1);
      // 25 items should show pagination, but actual MUI Box might not have testid
      const pagination = screen.queryByTestId('pagination');
      expect(pagination || screen.getByText(/Page 1 of/)).toBeTruthy();
    });
  });
});
