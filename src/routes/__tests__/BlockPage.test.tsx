import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import BlockPage from '../BlockPage';

// Mock child components
vi.mock('@components/Blocks/BlockInfo', () => ({
  default: () => <div>BlockInfo</div>,
}));
vi.mock('@components/Blocks/BlockRewards', () => ({
  default: () => <div>BlockRewards</div>,
}));
vi.mock('@components/Blocks/Kernels', () => ({
  default: () => <div>Kernels</div>,
}));
vi.mock('@components/Blocks/Outputs', () => ({
  default: () => <div>Outputs</div>,
}));
vi.mock('@components/Blocks/BlockParts', () => ({
  default: () => <div>BlockParts</div>,
}));
vi.mock('@components/FetchStatusCheck', () => ({
  default: (props: { isError?: boolean; isLoading?: boolean; errorMessage?: string }) => (
    <div>
      FetchStatusCheck{' '}
      {props.isError ? 'Error' : props.isLoading ? 'Loading' : ''}
      {props.errorMessage ? ` ${props.errorMessage}` : ''}
    </div>
  ),
}));

// Mock useGetBlockByHeightOrHash
const { mockUseGetBlockByHeightOrHash } = vi.hoisted(() => {
  return { mockUseGetBlockByHeightOrHash: vi.fn() };
});
vi.mock('@services/api/hooks/useBlocks', () => ({
  useGetBlockByHeightOrHash: mockUseGetBlockByHeightOrHash,
}));

const renderWithProviders = (route = '/block/123') => {
  const queryClient = new QueryClient();
  const theme = createTheme();
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={[route]}>
          <BlockPage />
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('BlockPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      isLoading: true,
      isError: false,
      error: null,
    });
    renderWithProviders();
    expect(screen.getByText(/FetchStatusCheck Loading/)).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      isLoading: false,
      isError: true,
      error: { message: 'Test error' },
    });
    renderWithProviders();
    expect(screen.getByText(/FetchStatusCheck Error/)).toBeInTheDocument();
    expect(screen.getByText(/Test error/)).toBeInTheDocument();
  });

  it('renders block details when loaded', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      isLoading: false,
      isError: false,
      error: null,
    });
    renderWithProviders();
    expect(screen.getByText('BlockInfo')).toBeInTheDocument();
    expect(screen.getByText('BlockRewards')).toBeInTheDocument();
    expect(screen.getByText('Kernels')).toBeInTheDocument();
    expect(screen.getByText('Outputs')).toBeInTheDocument();
    expect(screen.getByText('BlockParts')).toBeInTheDocument();
  });

  it('uses blockHeight from route', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      isLoading: false,
      isError: false,
      error: null,
    });
    renderWithProviders('/block/999');
    expect(screen.getByText('BlockInfo')).toBeInTheDocument();
    // The blockHeight is passed to BlockInfo, but since it's mocked, we just check render
  });
});
