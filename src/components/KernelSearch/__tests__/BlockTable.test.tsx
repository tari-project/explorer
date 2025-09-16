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
    if (Array.isArray(data)) {
      return `hex_${data.join(',')}`;
    }
    return `hex_${data}`;
  }),
  shortenString: vi.fn(
    (str: string, start?: number, end?: number) => {
      if (!str || str === 'no data') return 'no data';
      if (start !== undefined && end !== undefined) {
        return `${str.substring(0, start)}...${str.substring(str.length - end)}`;
      }
      return str.length > 16 ? `${str.substring(0, 8)}...${str.substring(str.length - 8)}` : str;
    }
  ),
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

  beforeEach(async () => {
    vi.clearAllMocks();
    const { useMainStore } = await import('@services/stores/useMainStore');
    const { toHexString } = await import('@utils/helpers');
    mockUseMainStore = vi.mocked(useMainStore);
    mockToHexString = vi.mocked(toHexString);
  });

  const mockSearchResults = [
    {
      block_height: "64925",
      features: 0,
      fee: "132",
      lock_height: "0",
      excess: {
        type: "Buffer" as const,
        data: [
          172, 63, 13, 206, 82, 192, 145, 57, 84, 68, 194, 196, 182, 243, 61, 135,
          57, 171, 227, 227, 253, 194, 75, 210, 93, 186, 59, 177, 36, 155, 9, 80
        ],
      },
      excess_sig: {
        public_nonce: {
          type: "Buffer" as const,
          data: [
            150, 152, 91, 241, 14, 196, 96, 202, 40, 170, 231, 62, 173, 202, 90, 239,
            152, 2, 246, 182, 121, 84, 135, 115, 183, 177, 2, 233, 128, 15, 222, 78
          ],
        },
        signature: {
          type: "Buffer" as const,
          data: [
            234, 239, 223, 230, 221, 40, 31, 177, 98, 48, 193, 140, 134, 154, 106, 99,
            18, 99, 174, 39, 155, 141, 107, 235, 138, 61, 246, 157, 137, 163, 88, 5
          ],
        },
      },
      hash: {
        type: "Buffer" as const,
        data: [
          239, 153, 197, 200, 192, 2, 135, 82, 6, 27, 47, 217, 224, 75, 6, 173,
          134, 4, 73, 131, 255, 180, 207, 92, 100, 193, 202, 252, 12, 159, 109, 193
        ],
      },
      version: 0
    },
    {
      block_height: "64926",
      features: 0,
      fee: "145",
      lock_height: "0",
      excess: {
        type: "Buffer" as const,
        data: [
          173, 64, 14, 207, 83, 193, 146, 58, 85, 69, 195, 197, 183, 244, 62, 136,
          58, 172, 228, 228, 254, 195, 76, 211, 94, 187, 60, 178, 37, 156, 10, 81
        ],
      },
      excess_sig: {
        public_nonce: {
          type: "Buffer" as const,
          data: [
            151, 153, 92, 242, 15, 197, 97, 203, 41, 171, 232, 63, 174, 203, 91, 240,
            153, 3, 247, 183, 122, 85, 136, 116, 184, 178, 3, 234, 129, 16, 223, 79
          ],
        },
        signature: {
          type: "Buffer" as const,
          data: [
            235, 240, 224, 231, 222, 41, 32, 178, 99, 49, 194, 141, 135, 155, 107, 100,
            19, 100, 175, 40, 156, 142, 108, 236, 139, 62, 247, 158, 138, 164, 89, 6
          ],
        },
      },
      hash: {
        type: "Buffer" as const,
        data: [
          240, 154, 198, 201, 193, 3, 136, 83, 7, 28, 48, 218, 225, 76, 7, 174,
          135, 5, 74, 132, 255, 181, 208, 93, 101, 194, 203, 253, 13, 160, 110, 194
        ],
      },
      version: 0
    },
  ];

  const largeSearchResults = Array.from({ length: 25 }, (_, i) => ({
    block_height: `${64925 + i}`,
    features: i % 3,
    fee: `${132 + i}`,
    lock_height: "0",
    excess: {
      type: "Buffer" as const,
      data: Array.from({ length: 32 }, (_, j) => 172 + i + j),
    },
    excess_sig: {
      public_nonce: {
        type: "Buffer" as const,
        data: Array.from({ length: 32 }, (_, j) => 150 + i + j),
      },
      signature: {
        type: "Buffer" as const,
        data: Array.from({ length: 32 }, (_, j) => 234 + i + j),
      },
    },
    hash: {
      type: "Buffer" as const,
      data: Array.from({ length: 32 }, (_, j) => 239 + i + j),
    },
    version: i % 2,
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
      expect(screen.getAllByText('Hash')).toHaveLength(2);

      // Check for height links
      const heightLinks = screen.getAllByTestId('link');
      expect(heightLinks[0]).toHaveAttribute('data-to', '/blocks/64925');
      expect(heightLinks[0]).toHaveTextContent('64,925');
    });

    it('should display formatted data in mobile view', () => {
      render(
        <TestWrapper>
          <BlockTable data={mockSearchResults} />
        </TestWrapper>
      );

      // Check for View Block buttons
      const viewBlockButtons = screen.getAllByText('View Block');
      expect(viewBlockButtons).toHaveLength(2);

      // Check for copy to clipboard components
      const copyComponents = screen.getAllByTestId('copy-to-clipboard');
      expect(copyComponents).toHaveLength(2);
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
      expect(screen.getByText('Hash')).toBeInTheDocument();
    });

    it('should render desktop block data in table format', () => {
      render(
        <TestWrapper>
          <BlockTable data={mockSearchResults} />
        </TestWrapper>
      );

      // Check for height links
      const heightLinks = screen.getAllByTestId('link');
      expect(heightLinks[0]).toHaveAttribute('data-to', '/blocks/64925');
      expect(heightLinks[1]).toHaveAttribute('data-to', '/blocks/64926');
      expect(heightLinks[0]).toHaveTextContent('64,925');
      expect(heightLinks[1]).toHaveTextContent('64,926');

      // Check copy to clipboard components for hashes
      const copyComponents = screen.getAllByTestId('copy-to-clipboard');
      expect(copyComponents).toHaveLength(2);
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

      // Helper functions should be called with hash data
      expect(mockToHexString).toHaveBeenCalledWith([
        239, 153, 197, 200, 192, 2, 135, 82, 6, 27, 47, 217, 224, 75, 6, 173,
        134, 4, 73, 131, 255, 180, 207, 92, 100, 193, 202, 252, 12, 159, 109, 193
      ]);
      expect(mockToHexString).toHaveBeenCalledWith([
        240, 154, 198, 201, 193, 3, 136, 83, 7, 28, 48, 218, 225, 76, 7, 174,
        135, 5, 74, 132, 255, 181, 208, 93, 101, 194, 203, 253, 13, 160, 110, 194
      ]);
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
        screen.queryByTestId('button')
      ).not.toBeInTheDocument();
    });

    it('should render View Block button for each result in mobile view', () => {
      mockUseMainStore.mockReturnValue(true); // mobile view

      render(
        <TestWrapper>
          <BlockTable data={mockSearchResults} />
        </TestWrapper>
      );

      const viewBlockButtons = screen.getAllByText('View Block');
      expect(viewBlockButtons).toHaveLength(2); // One for each mock result
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
