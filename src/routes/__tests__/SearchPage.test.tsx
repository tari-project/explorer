import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import SearchPage from '../SearchPage';

// Mock components
vi.mock('@components/StyledComponents', () => ({
  GradientPaper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="gradient-paper">{children}</div>
  ),
}));

vi.mock('@components/FetchStatusCheck', () => ({
  default: ({ isError, isLoading, errorMessage }: any) => (
    <div data-testid="fetch-status-check">
      {isLoading && <div data-testid="loading">Loading...</div>}
      {isError && <div data-testid="error">{errorMessage}</div>}
    </div>
  ),
}));

vi.mock('@components/Search/PayRefTable', () => ({
  default: ({ data }: { data: any[] }) => (
    <div data-testid="payref-table" data-count={data.length}>
      PayRef Table
    </div>
  ),
}));

vi.mock('@components/Search/BlockTable', () => ({
  default: ({ data }: { data: any }) => (
    <div data-testid="block-table" data-height={data.height || 0}>
      Block Table
    </div>
  ),
}));

vi.mock('@mui/material', () => ({
  Alert: ({ children, ...props }: any) => (
    <div data-testid="alert" data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
  Grid: ({ children, ...props }: any) => (
    <div data-testid="grid" data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
}));

// Mock the API hooks
const mockUseSearchByPayref = vi.fn();
const mockUseGetBlockByHeightOrHash = vi.fn();
vi.mock('@services/api/hooks/useBlocks', () => ({
  useSearchByPayref: (...args: any[]) => mockUseSearchByPayref(...args),
  useGetBlockByHeightOrHash: (...args: any[]) =>
    mockUseGetBlockByHeightOrHash(...args),
}));

// Mock store
const setStatus = vi.fn();
const setMessage = vi.fn();
vi.mock('@services/stores/useSearchStatusStore', () => ({
  default: (selector: any) => selector({ setStatus, setMessage }),
}));

// Mock validateHash
vi.mock('@utils/helpers', () => ({
  validateHash: (hash: string) => hash === 'validhash',
}));

// Mock theme
const mockTheme = {
  spacing: vi.fn((value: number) => `${value * 8}px`),
  breakpoints: {
    down: vi.fn(() => 'media-query'),
  },
};

// Mock window.location.replace
const mockLocationReplace = vi.fn();
Object.defineProperty(window, 'location', {
  value: {
    replace: mockLocationReplace,
  },
  writable: true,
});

// Test wrapper component
const TestWrapper = ({
  children,
  initialEntries = ['/search?hash=validhash'],
}: {
  children: React.ReactNode;
  initialEntries?: string[];
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={mockTheme as any}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocationReplace.mockClear();
    setStatus.mockClear();
    setMessage.mockClear();
  });

  it('renders error for invalid hash', () => {
    render(
      <TestWrapper initialEntries={[`/search?hash=invalid`]}>
        <SearchPage />
      </TestWrapper>
    );
    expect(screen.getByTestId('alert')).toBeInTheDocument();
    expect(screen.getByText(/Invalid hash/i)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseSearchByPayref.mockReturnValue({
      data: null,
      isFetching: true,
      isError: false,
      isSuccess: false,
      error: null,
    });
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: null,
      isFetching: true,
      isError: false,
      isSuccess: false,
      error: null,
    });
    render(
      <TestWrapper>
        <SearchPage />
      </TestWrapper>
    );
    expect(screen.getByTestId('fetch-status-check')).toBeInTheDocument();
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading...');
  });

  it('shows error state when both searches fail', () => {
    mockUseSearchByPayref.mockReturnValue({
      data: { items: [] },
      isFetching: false,
      isError: true,
      isSuccess: false,
      error: { message: 'Payref error' },
    });
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: null,
      isFetching: false,
      isError: true,
      isSuccess: false,
      error: { message: 'Block error' },
    });
    render(
      <TestWrapper>
        <SearchPage />
      </TestWrapper>
    );
    expect(screen.getByTestId('fetch-status-check')).toBeInTheDocument();
    expect(screen.getByTestId('error')).toHaveTextContent('Payref error');
  });

  it('shows PayRefTable and redirects if one payref result', async () => {
    mockUseSearchByPayref.mockReturnValue({
      data: { items: [{ block_height: 42 }] },
      isFetching: false,
      isError: false,
      isSuccess: true,
      error: null,
    });
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: { header: { height: 42 } },
      isFetching: false,
      isError: false,
      isSuccess: true,
      error: null,
    });
    render(
      <TestWrapper>
        <SearchPage />
      </TestWrapper>
    );
    await waitFor(() => {
      expect(mockLocationReplace).toHaveBeenCalledWith(
        '/blocks/42?payref=validhash'
      );
    });
  });

  it('shows PayRefTable if multiple payref results', () => {
    mockUseSearchByPayref.mockReturnValue({
      data: { items: [{ block_height: 1 }, { block_height: 2 }] },
      isFetching: false,
      isError: false,
      isSuccess: true,
      error: null,
    });
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: { header: { height: 1 } },
      isFetching: false,
      isError: false,
      isSuccess: true,
      error: null,
    });
    render(
      <TestWrapper>
        <SearchPage />
      </TestWrapper>
    );
    expect(screen.getByTestId('payref-table')).toBeInTheDocument();
    expect(screen.getByTestId('payref-table')).toHaveAttribute(
      'data-count',
      '2'
    );
  });

  it('shows BlockTable and redirects if payref empty but block found', async () => {
    mockUseSearchByPayref.mockReturnValue({
      data: { items: [] },
      isFetching: false,
      isError: false,
      isSuccess: true,
      error: null,
    });
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: { header: { height: 99 }, height: 99 },
      isFetching: false,
      isError: false,
      isSuccess: true,
      error: null,
    });
    render(
      <TestWrapper>
        <SearchPage />
      </TestWrapper>
    );
    await waitFor(() => {
      expect(mockLocationReplace).toHaveBeenCalledWith('/blocks/99');
    });
  });

  it('shows BlockTable if block found and not redirecting', () => {
    mockUseSearchByPayref.mockReturnValue({
      data: { items: [] },
      isFetching: false,
      isError: false,
      isSuccess: true,
      error: null,
    });
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: { header: { height: 100 }, height: 100 },
      isFetching: false,
      isError: false,
      isSuccess: true,
      error: null,
    });
    render(
      <TestWrapper>
        <SearchPage />
      </TestWrapper>
    );
    expect(screen.getByTestId('block-table')).toBeInTheDocument();
    expect(screen.getByTestId('block-table')).toHaveAttribute(
      'data-height',
      '100'
    );
  });

  it('has proper grid and gradient paper structure', () => {
    mockUseSearchByPayref.mockReturnValue({
      data: { items: [] },
      isFetching: false,
      isError: false,
      isSuccess: true,
      error: null,
    });
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: { header: { height: 1 }, height: 1 },
      isFetching: false,
      isError: false,
      isSuccess: true,
      error: null,
    });
    render(
      <TestWrapper>
        <SearchPage />
      </TestWrapper>
    );
    expect(screen.getByTestId('grid')).toBeInTheDocument();
    expect(screen.getByTestId('gradient-paper')).toBeInTheDocument();
  });
});
