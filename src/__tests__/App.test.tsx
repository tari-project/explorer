import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';
import '@testing-library/jest-dom';

interface PageLayoutProps {
  title?: string;
  customHeader?: React.ReactNode;
  children?: React.ReactNode;
}

interface TypographyProps {
  children: React.ReactNode;
}

interface MockTheme {
  breakpoints: {
    down: (breakpoint: string) => string;
  };
}

// Mock all the page components
vi.mock('@routes/BlockExplorerPage', () => ({
  default: () => (
    <div data-testid="block-explorer-page">Block Explorer Page</div>
  ),
}));

vi.mock('@routes/BlocksPage', () => ({
  default: () => <div data-testid="blocks-page">Blocks Page</div>,
}));

vi.mock('@routes/MempoolPage', () => ({
  default: () => <div data-testid="mempool-page">Mempool Page</div>,
}));

vi.mock('@routes/KernelSearchPage', () => ({
  default: () => <div data-testid="kernel-search-page">Kernel Search Page</div>,
}));

vi.mock('@routes/VNPage', () => ({
  default: () => <div data-testid="vn-page">VN Page</div>,
}));

vi.mock('@routes/BlockPage', () => ({
  default: () => <div data-testid="block-page">Block Page</div>,
}));

// Mock layout components with proper outlet handling
vi.mock('@theme/MainLayout', () => ({
  default: () => (
    <div data-testid="main-layout">
      <Outlet />
    </div>
  ),
}));

vi.mock('@theme/PageLayout', () => ({
  default: ({ title, customHeader, children }: PageLayoutProps) => (
    <div data-testid="page-layout">
      {title && <div data-testid="page-title">{title}</div>}
      {customHeader && <div data-testid="custom-header">{customHeader}</div>}
      <div data-testid="page-content">
        <Outlet />
        {children}
      </div>
    </div>
  ),
}));

// Mock header components
vi.mock('@components/Blocks/BlockHeader', () => ({
  default: () => <div data-testid="block-header">Block Header</div>,
}));

vi.mock('@components/KernelSearch/KernelHeader', () => ({
  default: () => <div data-testid="kernel-header">Kernel Header</div>,
}));

// Mock the main store
const mockSetIsMobile = vi.fn();
vi.mock('@services/stores/useMainStore', () => ({
  useMainStore: vi.fn((selector) => {
    if (selector) {
      return selector({ setIsMobile: mockSetIsMobile });
    }
    return { setIsMobile: mockSetIsMobile };
  }),
}));

// Mock MUI theme and useMediaQuery
const mockTheme = {
  breakpoints: {
    down: vi.fn(() => 'media-query'),
  },
};

vi.mock('@mui/material', () => ({
  useTheme: () => mockTheme,
  useMediaQuery: vi.fn(() => false),
  Typography: ({ children }: TypographyProps) => (
    <div data-testid="typography">{children}</div>
  ),
}));

// Test wrapper component
const TestWrapper = ({
  children,
  initialEntries = ['/'],
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
      <ThemeProvider theme={mockTheme as MockTheme}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render main layout for root path', () => {
    render(
      <TestWrapper initialEntries={['/']}>
        <App />
      </TestWrapper>
    );

    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    expect(screen.getByTestId('block-explorer-page')).toBeInTheDocument();
  });

  it('should render VN page for /vns route', () => {
    render(
      <TestWrapper initialEntries={['/vns']}>
        <App />
      </TestWrapper>
    );

    expect(screen.getByTestId('page-layout')).toBeInTheDocument();
    expect(screen.getByTestId('page-title')).toHaveTextContent(
      'Validator Nodes'
    );
    expect(screen.getByTestId('vn-page')).toBeInTheDocument();
  });

  it('should render blocks page for /blocks route', () => {
    render(
      <TestWrapper initialEntries={['/blocks']}>
        <App />
      </TestWrapper>
    );

    expect(screen.getByTestId('page-layout')).toBeInTheDocument();
    expect(screen.getByTestId('page-title')).toHaveTextContent('Blocks');
    expect(screen.getByTestId('blocks-page')).toBeInTheDocument();
  });

  it('should render block page with custom header for /blocks/:blockHeight route', () => {
    render(
      <TestWrapper initialEntries={['/blocks/123']}>
        <App />
      </TestWrapper>
    );

    expect(screen.getByTestId('page-layout')).toBeInTheDocument();
    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    expect(screen.getByTestId('block-header')).toBeInTheDocument();
    expect(screen.getByTestId('block-page')).toBeInTheDocument();
  });

  it('should render kernel search page for /kernel_search route', () => {
    render(
      <TestWrapper initialEntries={['/kernel_search']}>
        <App />
      </TestWrapper>
    );

    expect(screen.getByTestId('page-layout')).toBeInTheDocument();
    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    expect(screen.getByTestId('kernel-header')).toBeInTheDocument();
    expect(screen.getByTestId('kernel-search-page')).toBeInTheDocument();
  });

  it('should render mempool page for /mempool route', () => {
    render(
      <TestWrapper initialEntries={['/mempool']}>
        <App />
      </TestWrapper>
    );

    expect(screen.getByTestId('page-layout')).toBeInTheDocument();
    expect(screen.getByTestId('page-title')).toHaveTextContent('Mempool');
    expect(screen.getByTestId('mempool-page')).toBeInTheDocument();
  });

  it('should call setIsMobile when component mounts', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    expect(mockSetIsMobile).toHaveBeenCalled();
  });

  it('should detect mobile state using media query', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    expect(mockTheme.breakpoints.down).toHaveBeenCalledWith('md');
  });

  it('should use theme breakpoints for mobile detection', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    expect(mockTheme.breakpoints.down).toHaveBeenCalledWith('md');
  });

  it('should handle route parameters correctly', () => {
    const blockHeight = '456789';
    render(
      <TestWrapper initialEntries={[`/blocks/${blockHeight}`]}>
        <App />
      </TestWrapper>
    );

    expect(screen.getByTestId('block-page')).toBeInTheDocument();
    expect(screen.getByTestId('block-header')).toBeInTheDocument();
  });
});
