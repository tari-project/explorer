import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from '../Header';

// Mock child components
vi.mock('../HeaderTop/HeaderTop', () => ({
  default: () => <div data-testid="header-top">Header Top</div>,
}));

vi.mock('../HeaderBottom/HeaderBottom', () => ({
  default: () => <div data-testid="header-bottom">Header Bottom</div>,
}));

vi.mock('../MobileHeader/MobileHeader', () => ({
  default: () => <div data-testid="mobile-header">Mobile Header</div>,
}));

// Mock store
const mockSetIsMobile = vi.fn();
vi.mock('@services/stores/useMainStore', () => ({
  useMainStore: vi.fn(),
}));

// Mock theme
vi.mock('@theme/themes', () => ({
  darkTheme: {
    palette: {
      mode: 'dark',
      primary: { main: '#ffffff' },
      background: { default: '#000000' },
    },
  },
}));

// Mock styled components
vi.mock('../Header.styles', () => ({
  HeaderDark: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="header-dark">{children}</div>
  ),
}));

// Mock emotion ThemeProvider
vi.mock('@emotion/react', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
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
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </BrowserRouter>
  );
};

describe('Header', () => {
  let mockUseMainStore: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    const { useMainStore } = await import('@services/stores/useMainStore');
    mockUseMainStore = vi.mocked(useMainStore);
  });

  it('should render desktop header when not mobile', () => {
    mockUseMainStore.mockImplementation((selector: any) => {
      const state = {
        isMobile: false,
        setIsMobile: mockSetIsMobile,
      };
      return selector(state);
    });

    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    expect(screen.getByTestId('header-dark')).toBeInTheDocument();
    expect(screen.getByTestId('header-top')).toBeInTheDocument();
    expect(screen.getByTestId('header-bottom')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-header')).not.toBeInTheDocument();
  });

  it('should render mobile header when mobile', () => {
    mockUseMainStore.mockImplementation((selector: any) => {
      const state = {
        isMobile: true,
        setIsMobile: mockSetIsMobile,
      };
      return selector(state);
    });

    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-header')).toBeInTheDocument();
    expect(screen.queryByTestId('header-dark')).not.toBeInTheDocument();
    expect(screen.queryByTestId('header-top')).not.toBeInTheDocument();
    expect(screen.queryByTestId('header-bottom')).not.toBeInTheDocument();
  });

  it('should always wrap content in ThemeProvider', () => {
    mockUseMainStore.mockImplementation((selector: any) => {
      const state = {
        isMobile: false,
        setIsMobile: mockSetIsMobile,
      };
      return selector(state);
    });

    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
  });

  it('should respond to isMobile state changes', () => {
    // Initially desktop
    mockUseMainStore.mockImplementation((selector: any) => {
      const state = {
        isMobile: false,
        setIsMobile: mockSetIsMobile,
      };
      return selector(state);
    });

    const { rerender } = render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    expect(screen.getByTestId('header-dark')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-header')).not.toBeInTheDocument();

    // Switch to mobile
    mockUseMainStore.mockImplementation((selector: any) => {
      const state = {
        isMobile: true,
        setIsMobile: mockSetIsMobile,
      };
      return selector(state);
    });

    rerender(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    expect(screen.getByTestId('mobile-header')).toBeInTheDocument();
    expect(screen.queryByTestId('header-dark')).not.toBeInTheDocument();
  });

  it('should render correct desktop header structure', () => {
    mockUseMainStore.mockImplementation((selector: any) => {
      const state = {
        isMobile: false,
        setIsMobile: mockSetIsMobile,
      };
      return selector(state);
    });

    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    const headerDark = screen.getByTestId('header-dark');
    expect(headerDark).toBeInTheDocument();

    // Check that HeaderTop and HeaderBottom are rendered inside HeaderDark
    expect(screen.getByTestId('header-top')).toBeInTheDocument();
    expect(screen.getByTestId('header-bottom')).toBeInTheDocument();
  });
});
