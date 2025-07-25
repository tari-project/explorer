import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MempoolPage from '../MempoolPage';

// Mock components
vi.mock('@components/StyledComponents', () => ({
  GradientPaper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="gradient-paper">{children}</div>
  ),
}));

vi.mock('@components/Mempool/MempoolTable', () => ({
  default: () => <div data-testid="mempool-table">Mempool Table</div>,
}));

vi.mock('@mui/material', () => ({
  Grid: ({ children, ...props }: any) => (
    <div data-testid="grid" data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
}));

// Mock theme
const mockTheme = {
  spacing: vi.fn((value: number) => `${value * 8}px`),
  breakpoints: {
    down: vi.fn(() => 'media-query'),
  },
};

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={mockTheme as any}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
};

describe('MempoolPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(
      <TestWrapper>
        <MempoolPage />
      </TestWrapper>
    );

    expect(screen.getByTestId('grid')).toBeInTheDocument();
  });

  it('should render mempool table component', () => {
    render(
      <TestWrapper>
        <MempoolPage />
      </TestWrapper>
    );

    expect(screen.getByTestId('mempool-table')).toBeInTheDocument();
  });

  it('should render gradient paper wrapper', () => {
    render(
      <TestWrapper>
        <MempoolPage />
      </TestWrapper>
    );

    expect(screen.getByTestId('gradient-paper')).toBeInTheDocument();
  });

  it('should have proper grid layout structure', () => {
    render(
      <TestWrapper>
        <MempoolPage />
      </TestWrapper>
    );

    const grid = screen.getByTestId('grid');
    expect(grid).toBeInTheDocument();

    // Check grid props for responsive layout
    const props = JSON.parse(grid.getAttribute('data-props') || '{}');
    expect(props.item).toBe(true);
    expect(props.xs).toBe(12);
    expect(props.md).toBe(12);
    expect(props.lg).toBe(12);
  });

  it('should render mempool table within gradient paper', () => {
    render(
      <TestWrapper>
        <MempoolPage />
      </TestWrapper>
    );

    const gradientPaper = screen.getByTestId('gradient-paper');
    const mempoolTable = screen.getByTestId('mempool-table');

    expect(gradientPaper).toBeInTheDocument();
    expect(mempoolTable).toBeInTheDocument();
    expect(gradientPaper).toContainElement(mempoolTable);
  });

  it('should render as a React fragment at root level', () => {
    render(
      <TestWrapper>
        <MempoolPage />
      </TestWrapper>
    );

    // The component returns a fragment, check for Grid presence
    expect(screen.getByTestId('grid')).toBeInTheDocument();
  });

  it('should have full width layout (12 columns across all breakpoints)', () => {
    render(
      <TestWrapper>
        <MempoolPage />
      </TestWrapper>
    );

    const grid = screen.getByTestId('grid');
    const props = JSON.parse(grid.getAttribute('data-props') || '{}');

    // Should span full width on all screen sizes
    expect(props.xs).toBe(12);
    expect(props.md).toBe(12);
    expect(props.lg).toBe(12);
  });

  it('should provide correct component structure', () => {
    render(
      <TestWrapper>
        <MempoolPage />
      </TestWrapper>
    );

    // Verify the component hierarchy: Fragment -> Grid -> GradientPaper -> MempoolTable
    const grid = screen.getByTestId('grid');
    const gradientPaper = screen.getByTestId('gradient-paper');
    const mempoolTable = screen.getByTestId('mempool-table');

    expect(grid).toContainElement(gradientPaper);
    expect(gradientPaper).toContainElement(mempoolTable);
  });

  it('should display mempool data table', () => {
    render(
      <TestWrapper>
        <MempoolPage />
      </TestWrapper>
    );

    const mempoolTable = screen.getByTestId('mempool-table');
    expect(mempoolTable).toHaveTextContent('Mempool Table');
  });
});
