import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import Kernels from '../Kernels';
import { lightTheme } from '@theme/themes';

// Mock API hooks
const mockUseGetBlockByHeightOrHash = vi.fn();
const mockUseGetPaginatedData = vi.fn();

vi.mock('@services/api/hooks/useBlocks', () => ({
  useGetBlockByHeightOrHash: () => mockUseGetBlockByHeightOrHash(),
  useGetPaginatedData: (
    blockHeight: string,
    type: string,
    startIndex: number,
    endIndex: number
  ) => mockUseGetPaginatedData(blockHeight, type, startIndex, endIndex),
}));

// Mock components
vi.mock('../GenerateAccordion', () => ({
  default: ({ adjustedIndex, tabName, items, isHighlighted }: any) => (
    <div
      data-testid={`accordion-${adjustedIndex}`}
      data-highlighted={isHighlighted ? 'true' : 'false'}
    >
      <span data-testid="tab-name">{tabName}</span>
      <span data-testid="adjusted-index">{adjustedIndex}</span>
      <span data-testid="items-count">{items.length}</span>
    </div>
  ),
}));

vi.mock('@components/FetchStatusCheck', () => ({
  default: ({ isLoading, isError, errorMessage }: any) => (
    <div data-testid="fetch-status">
      {isLoading && <span data-testid="loading">Loading...</span>}
      {isError && <span data-testid="error">{errorMessage}</span>}
    </div>
  ),
}));

vi.mock('@components/InnerHeading', () => ({
  default: ({
    children,
    icon,
  }: {
    children: React.ReactNode;
    icon?: React.ReactNode;
  }) => (
    <h2 data-testid="inner-heading">
      {icon}
      {children}
    </h2>
  ),
}));

// Mock data structures
vi.mock('../Data/Inputs', () => ({
  inputItems: vi.fn((content) => [
    { label: 'Input Hash', value: content.hash || 'test-hash' },
    { label: 'Input Amount', value: content.amount || '100' },
  ]),
}));

vi.mock('../Data/Outputs', () => ({
  outputItems: vi.fn((content) => [
    { label: 'Output Hash', value: content.hash || 'test-hash' },
    { label: 'Output Amount', value: content.amount || '200' },
  ]),
}));

vi.mock('../Data/Kernels', () => ({
  kernelItems: vi.fn((content) => [
    { label: 'Kernel Hash', value: content.hash || 'test-hash' },
    { label: 'Kernel Signature', value: content.signature || 'test-sig' },
  ]),
}));

vi.mock('@/utils/searchFunctions', () => ({
  kernelSearch: vi.fn((nonce, signature, data) => {
    if (!nonce && !signature) return null;
    return data.findIndex(
      (item: any) =>
        (nonce && item.nonce === nonce) ||
        (signature && item.signature === signature)
    );
  }),
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
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter>{children}</MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('Kernels', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockBlockData = {
    body: {
      inputs_length: 5,
      outputs_length: 10,
      kernels_length: 3,
    },
  };

  const mockPaginatedData = {
    body: {
      data: [
        { hash: 'item1-hash', amount: '100', nonce: 'n1', signature: 's1' },
        { hash: 'item2-hash', amount: '200', nonce: 'n2', signature: 's2' },
      ],
    },
  };

  it('renders kernels with correct title and count', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({ data: mockBlockData });
    mockUseGetPaginatedData.mockReturnValue({
      data: mockPaginatedData,
      isFetching: false,
      isError: false,
    });
    render(
      <TestWrapper>
        <Kernels blockHeight="123" type="kernels" itemsPerPage={2} />
      </TestWrapper>
    );
    expect(screen.getByTestId('inner-heading')).toHaveTextContent(
      'Kernels (3)'
    );
    expect(screen.getByTestId('accordion-1')).toBeInTheDocument();
    expect(screen.getByTestId('accordion-2')).toBeInTheDocument();
    expect(screen.getAllByTestId(/^accordion-/)).toHaveLength(2);
  });

  it('renders inputs with correct title', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({ data: mockBlockData });
    mockUseGetPaginatedData.mockReturnValue({
      data: mockPaginatedData,
      isFetching: false,
      isError: false,
    });
    render(
      <TestWrapper>
        <Kernels blockHeight="123" type="inputs" itemsPerPage={2} />
      </TestWrapper>
    );
    expect(screen.getByTestId('inner-heading')).toHaveTextContent('Inputs (5)');
  });

  it('renders outputs with correct title', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({ data: mockBlockData });
    mockUseGetPaginatedData.mockReturnValue({
      data: mockPaginatedData,
      isFetching: false,
      isError: false,
    });
    render(
      <TestWrapper>
        <Kernels blockHeight="123" type="outputs" itemsPerPage={2} />
      </TestWrapper>
    );
    expect(screen.getByTestId('inner-heading')).toHaveTextContent(
      'Outputs (10)'
    );
  });

  it('shows loading state', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({ data: mockBlockData });
    mockUseGetPaginatedData.mockReturnValue({
      data: null,
      isFetching: true,
      isError: false,
    });
    render(
      <TestWrapper>
        <Kernels blockHeight="123" type="kernels" itemsPerPage={2} />
      </TestWrapper>
    );
    expect(screen.getByTestId('fetch-status')).toBeInTheDocument();
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading...');
  });

  it('shows error state', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({ data: mockBlockData });
    mockUseGetPaginatedData.mockReturnValue({
      data: null,
      isFetching: false,
      isError: true,
    });
    render(
      <TestWrapper>
        <Kernels blockHeight="123" type="kernels" itemsPerPage={2} />
      </TestWrapper>
    );
    expect(screen.getByTestId('fetch-status')).toBeInTheDocument();
    expect(screen.getByTestId('error')).toHaveTextContent('Error');
  });

  it('shows pagination when needed', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({ data: mockBlockData });
    mockUseGetPaginatedData.mockReturnValue({
      data: mockPaginatedData,
      isFetching: false,
      isError: false,
    });
    render(
      <TestWrapper>
        <Kernels blockHeight="123" type="kernels" itemsPerPage={2} />
      </TestWrapper>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('does not show pagination if all items fit on one page', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: { body: { kernels_length: 2 } },
    });
    mockUseGetPaginatedData.mockReturnValue({
      data: mockPaginatedData,
      isFetching: false,
      isError: false,
    });
    render(
      <TestWrapper>
        <Kernels blockHeight="123" type="kernels" itemsPerPage={5} />
      </TestWrapper>
    );
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('handles zero items gracefully', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: { body: { kernels_length: 0 } },
    });
    mockUseGetPaginatedData.mockReturnValue({
      data: { body: { data: [] } },
      isFetching: false,
      isError: false,
    });
    render(
      <TestWrapper>
        <Kernels blockHeight="123" type="kernels" itemsPerPage={5} />
      </TestWrapper>
    );
    expect(screen.getByTestId('inner-heading')).toHaveTextContent(
      'Kernels (0)'
    );
    expect(screen.queryByTestId(/^accordion-/)).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('handles missing block data gracefully', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({ data: null });
    mockUseGetPaginatedData.mockReturnValue({
      data: mockPaginatedData,
      isFetching: false,
      isError: false,
    });
    render(
      <TestWrapper>
        <Kernels blockHeight="123" type="kernels" itemsPerPage={5} />
      </TestWrapper>
    );
    expect(screen.getByTestId('inner-heading')).toHaveTextContent(
      'Kernels (0)'
    );
  });

  it('shows and hides search UI for kernels', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({ data: mockBlockData });
    mockUseGetPaginatedData.mockReturnValue({
      data: mockPaginatedData,
      isFetching: false,
      isError: false,
    });
    render(
      <TestWrapper>
        <Kernels blockHeight="123" type="kernels" itemsPerPage={2} />
      </TestWrapper>
    );
    // Search icon button should be present
    expect(
      screen.getByLabelText(/Show search|Hide search/)
    ).toBeInTheDocument();
    // Click to show search
    fireEvent.click(screen.getByLabelText(/Show search|Hide search/));
    expect(
      screen.getByText(/Search for a kernel by nonce or signature/)
    ).toBeInTheDocument();
    // Click to hide search
    fireEvent.click(screen.getByLabelText(/Show search|Hide search/));
    expect(
      screen.queryByText(/Search for a kernel by nonce or signature/)
    ).not.toBeInTheDocument();
  });

  it('highlights found kernel after search', async () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({ data: mockBlockData });
    mockUseGetPaginatedData.mockImplementation((type, start, end) => {
      if (type === 'kernels' && start === 0 && end === 3) {
        return {
          data: {
            body: {
              data: [
                { nonce: 'n1', signature: 's1' },
                { nonce: 'n2', signature: 's2' },
                { nonce: 'n3', signature: 's3' },
              ],
            },
          },
          isFetching: false,
          isError: false,
        };
      }
      return {
        data: mockPaginatedData,
        isFetching: false,
        isError: false,
      };
    });
    render(
      <TestWrapper>
        <Kernels blockHeight="123" type="kernels" itemsPerPage={2} />
      </TestWrapper>
    );
    // Show search UI
    fireEvent.click(screen.getByLabelText(/Show search|Hide search/));
    // Enter a nonce that exists
    fireEvent.change(screen.getByLabelText('Nonce'), {
      target: { value: 'n2' },
    });
    fireEvent.click(screen.getByText('Search'));
    await waitFor(() => {
      // The highlighted accordion should be present
      const highlighted = screen
        .getAllByTestId(/^accordion-/)
        .find((el) => el.getAttribute('data-highlighted') === 'true');
      expect(highlighted).toBeDefined();
    });
  });
});
