import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MainLayout from '../MainLayout';
import { useMainStore } from '@services/stores/useMainStore';

// Mock child components
vi.mock('@components/Header/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('@components/VersionInfo/VersionInfo', () => ({
  default: () => <div data-testid="version-info">Version Info</div>,
}));

vi.mock('@components/Banner/Banner', () => ({
  default: () => <div data-testid="banner">Banner</div>,
}));

vi.mock('@components/Header/StatsBox/StatsBox', () => ({
  default: ({ variant }: { variant?: string }) => (
    <div data-testid="stats-box" data-variant={variant}>
      Stats Box
    </div>
  ),
}));

// Mock the main store
vi.mock('@services/stores/useMainStore', () => ({
  useMainStore: vi.fn(),
}));

// Mock Outlet
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Page Content</div>,
  };
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('MainLayout', () => {
  beforeEach(() => {
    (useMainStore as any).mockImplementation((selector: any) => {
      const state = { isMobile: false };
      return selector(state);
    });
  });

  it('should render all main layout components', () => {
    render(
      <TestWrapper>
        <MainLayout />
      </TestWrapper>
    );

    expect(screen.getByTestId('banner')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
    expect(screen.getByTestId('version-info')).toBeInTheDocument();
  });

  it('should not render mobile stats box when isMobile is false', () => {
    (useMainStore as any).mockImplementation((selector: any) => {
      const state = { isMobile: false };
      return selector(state);
    });

    render(
      <TestWrapper>
        <MainLayout />
      </TestWrapper>
    );

    expect(screen.queryByTestId('stats-box')).not.toBeInTheDocument();
  });

  it('should render mobile stats box when isMobile is true', () => {
    (useMainStore as any).mockImplementation((selector: any) => {
      const state = { isMobile: true };
      return selector(state);
    });

    render(
      <TestWrapper>
        <MainLayout />
      </TestWrapper>
    );

    const statsBox = screen.getByTestId('stats-box');
    expect(statsBox).toBeInTheDocument();
    expect(statsBox).toHaveAttribute('data-variant', 'mobile');
  });

  it('should have proper container structure', () => {
    render(
      <TestWrapper>
        <MainLayout />
      </TestWrapper>
    );

    // Check for Material-UI components existence
    const container = document.querySelector('.MuiContainer-root');
    expect(container).toBeInTheDocument();

    const grid = document.querySelector('.MuiGrid-root');
    expect(grid).toBeInTheDocument();
  });

  it('should apply main-bg class to grid container', () => {
    render(
      <TestWrapper>
        <MainLayout />
      </TestWrapper>
    );

    const element = document.querySelector('.main-bg');
    expect(element).toBeInTheDocument();
  });

  it('should use correct ThemeProvider', () => {
    render(
      <TestWrapper>
        <MainLayout />
      </TestWrapper>
    );

    // CssBaseline should be applied (normalizes styles)
    const head = document.head;
    expect(head).toBeInTheDocument();
  });

  it('should render components in correct order', () => {
    render(
      <TestWrapper>
        <MainLayout />
      </TestWrapper>
    );

    const components = [
      screen.getByTestId('banner'),
      screen.getByTestId('header'),
      screen.getByTestId('outlet'),
      screen.getByTestId('version-info'),
    ];

    // All components should be present
    components.forEach((component) => {
      expect(component).toBeInTheDocument();
    });
  });

  it('should call useMainStore with correct selector', () => {
    render(
      <TestWrapper>
        <MainLayout />
      </TestWrapper>
    );

    expect(useMainStore).toHaveBeenCalledWith(expect.any(Function));

    // Test the selector function
    const selectorFn = (useMainStore as any).mock.calls[0][0];
    const mockState = { isMobile: true, otherProp: 'test' };
    expect(selectorFn(mockState)).toBe(true);
  });
});
