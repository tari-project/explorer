import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import TransactionsWidget from '../TransactionsWidget';

// Mock hooks
const mockUseAllBlocks = vi.fn();
const mockUseGetBlockByHeightOrHash = vi.fn();
const mockUseMainStore = vi.fn();

vi.mock('@services/api/hooks/useBlocks', () => ({
  useAllBlocks: () => mockUseAllBlocks(),
  useGetBlockByHeightOrHash: () => mockUseGetBlockByHeightOrHash(),
}));
vi.mock('@services/stores/useMainStore', () => ({
  useMainStore: () => mockUseMainStore(),
}));

// Mock child components
vi.mock('@components/FetchStatusCheck', () => ({
  default: () => <div>FetchStatusCheck</div>,
}));
vi.mock('@components/StyledComponents', () => ({
  GradientPaper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('@components/DotLoader', () => ({
  default: () => <div>DotLoader</div>,
}));
vi.mock('./images/icon-txns-1.svg', () => 'icon-txns-1.svg');
vi.mock('./images/icon-txns-2.svg', () => 'icon-txns-2.svg');
vi.mock('./TransactionsWidget.styles', () => ({
  NumberTypography: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  Line: () => <div>Line</div>,
  IconWrapper: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));
vi.mock('@utils/helpers', () => ({
  formatNumber: (n: number) => n.toLocaleString(),
}));

describe('TransactionsWidget', () => {
  const blocks = { headers: [{ height: 1000, kernel_mmr_size: 2000 }] };
  const blockStart = { header: { kernel_mmr_size: 1200 } };

  beforeEach(() => {
    mockUseMainStore.mockReturnValue(false); // isMobile
    mockUseAllBlocks.mockReturnValue({
      data: blocks,
      isLoading: false,
      isError: false,
      error: null,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: true,
      isFetched: true,
      isFetchedAfterMount: true,
      isPending: false,
      isPlaceholderData: false,
      isRefetching: false,
      isStale: false,
      isPaused: false,
      refetch: vi.fn(),
      remove: vi.fn(),
      status: 'success',
      fetchStatus: 'idle',
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
    });
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: blockStart,
      isLoading: false,
      isError: false,
      error: null,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: true,
      isFetched: true,
      isFetchedAfterMount: true,
      isPending: false,
      isPlaceholderData: false,
      isRefetching: false,
      isStale: false,
      isPaused: false,
      refetch: vi.fn(),
      remove: vi.fn(),
      status: 'success',
      fetchStatus: 'idle',
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders desktop view with correct values', () => {
    mockUseMainStore.mockReturnValue(false);
    render(<TransactionsWidget />);
    expect(screen.getAllByText('Transactions').length).toBeGreaterThan(0);
    expect(screen.getByText(/Last 24 Hours/i)).toBeInTheDocument();
    expect(screen.getByText(/All Time/i)).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument(); // 2000-1200-720
    expect(screen.getByText('1,000')).toBeInTheDocument(); // 2000-1000-0
  });

  it('renders mobile view with correct values', () => {
    mockUseMainStore.mockReturnValue(true);
    render(<TransactionsWidget />);
    expect(screen.getAllByText('Transactions').length).toBeGreaterThan(0);
    expect(screen.getByText(/Last 24 Hours/i)).toBeInTheDocument();
    expect(screen.getByText(/All Time/i)).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
  });

  it('shows loader when loading', () => {
    mockUseAllBlocks.mockReturnValue({
      ...mockUseAllBlocks(),
      isLoading: true,
      isSuccess: false,
      status: 'loading',
    });
    render(<TransactionsWidget />);
    expect(screen.getAllByText('DotLoader').length).toBeGreaterThan(0);
  });

  it('shows error UI when error', () => {
    mockUseAllBlocks.mockReturnValue({
      ...mockUseAllBlocks(),
      isError: true,
      isSuccess: false,
      status: 'error',
    });
    render(<TransactionsWidget />);
    expect(screen.getByText('FetchStatusCheck')).toBeInTheDocument();
  });
});
