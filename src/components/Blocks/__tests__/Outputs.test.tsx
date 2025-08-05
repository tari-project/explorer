import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import Outputs from '../Outputs';
import { lightTheme } from '@theme/themes';

interface AccordionProps {
  adjustedIndex: number;
  tabName: string;
  items: unknown[];
  isHighlighted: boolean;
}

interface FetchStatusProps {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}

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
  default: ({
    adjustedIndex,
    tabName,
    items,
    isHighlighted,
  }: AccordionProps) => (
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
  default: ({ isLoading, isError, errorMessage }: FetchStatusProps) => (
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

vi.mock('../Data/Outputs', () => ({
  outputItems: vi.fn((content) => [
    { label: 'Output Hash', value: content.hash || 'test-hash' },
    { label: 'Output Amount', value: content.amount || '200' },
  ]),
}));

vi.mock('@utils/searchFunctions', () => ({
  payrefSearch: vi.fn((payref: string, data: { hash: string }[]) => {
    if (!payref) return null;
    return data.findIndex((item: { hash: string }) => item.hash === payref);
  }),
}));

vi.mock('@components/Search/SearchPayRef', () => ({
  validatePayRefQuery: vi.fn((payref) => payref && payref.length === 64),
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

describe('Outputs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockBlockData = {
    body: {
      outputs_length: 10,
    },
  };

  const mockPaginatedData = {
    body: {
      data: [
        { hash: 'item1-hash', amount: '100' },
        { hash: 'item2-hash', amount: '200' },
      ],
    },
  };

  it('renders outputs with correct title and count', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({ data: mockBlockData });
    mockUseGetPaginatedData.mockReturnValue({
      data: mockPaginatedData,
      isFetching: false,
      isError: false,
    });
    render(
      <TestWrapper>
        <Outputs blockHeight="123" type="outputs" itemsPerPage={2} />
      </TestWrapper>
    );
    expect(screen.getByTestId('inner-heading')).toHaveTextContent(
      'Outputs (10)'
    );
    expect(screen.getByTestId('accordion-1')).toBeInTheDocument();
    expect(screen.getByTestId('accordion-2')).toBeInTheDocument();
    expect(screen.getAllByTestId(/^accordion-/)).toHaveLength(2);
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
        <Outputs blockHeight="123" type="outputs" itemsPerPage={2} />
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
        <Outputs blockHeight="123" type="outputs" itemsPerPage={2} />
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
        <Outputs blockHeight="123" type="outputs" itemsPerPage={2} />
      </TestWrapper>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('does not show pagination if all items fit on one page', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: { body: { outputs_length: 2 } },
    });
    mockUseGetPaginatedData.mockReturnValue({
      data: mockPaginatedData,
      isFetching: false,
      isError: false,
    });
    render(
      <TestWrapper>
        <Outputs blockHeight="123" type="outputs" itemsPerPage={5} />
      </TestWrapper>
    );
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('handles zero items gracefully', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: { body: { outputs_length: 0 } },
    });
    mockUseGetPaginatedData.mockReturnValue({
      data: { body: { data: [] } },
      isFetching: false,
      isError: false,
    });
    render(
      <TestWrapper>
        <Outputs blockHeight="123" type="outputs" itemsPerPage={5} />
      </TestWrapper>
    );
    expect(screen.getByTestId('inner-heading')).toHaveTextContent(
      'Outputs (0)'
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
        <Outputs blockHeight="123" type="outputs" itemsPerPage={5} />
      </TestWrapper>
    );
    expect(screen.getByTestId('inner-heading')).toHaveTextContent(
      'Outputs (0)'
    );
  });

  it('shows and hides search UI for outputs', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({ data: mockBlockData });
    mockUseGetPaginatedData.mockReturnValue({
      data: mockPaginatedData,
      isFetching: false,
      isError: false,
    });
    render(
      <TestWrapper>
        <Outputs blockHeight="123" type="outputs" itemsPerPage={2} />
      </TestWrapper>
    );
    // Search icon button should be present
    expect(
      screen.getByLabelText(/Show search|Hide search/)
    ).toBeInTheDocument();
    // Click to show search
    fireEvent.click(screen.getByLabelText(/Show search|Hide search/));
    expect(
      screen.getByLabelText('Search by Payment Reference (PayRef)')
    ).toBeInTheDocument();
    // Click to hide search
    fireEvent.click(screen.getByLabelText(/Show search|Hide search/));
    expect(
      screen.queryByLabelText('Search by Payment Reference (PayRef)')
    ).not.toBeInTheDocument();
  });

  it('shows error for invalid PayRef search', async () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({ data: mockBlockData });
    mockUseGetPaginatedData.mockReturnValue({
      data: mockPaginatedData,
      isFetching: false,
      isError: false,
    });
    render(
      <TestWrapper>
        <Outputs blockHeight="123" type="outputs" itemsPerPage={2} />
      </TestWrapper>
    );
    fireEvent.click(screen.getByLabelText(/Show search|Hide search/));
    fireEvent.change(
      screen.getByLabelText('Search by Payment Reference (PayRef)'),
      {
        target: { value: 'short' },
      }
    );
    fireEvent.click(screen.getByText('Search'));
    await waitFor(() => {
      expect(
        screen.getByText('Please enter a valid PayRef.')
      ).toBeInTheDocument();
    });
  });
});
