import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import HeaderBottom from '../HeaderBottom';
import { lightTheme } from '@theme/themes';
import { MemoryRouter } from 'react-router-dom';

// Mock the useMainStore hook
const mockUseMainStore = vi.fn();
vi.mock('@services/stores/useMainStore', () => ({
  useMainStore: (selector: any) => mockUseMainStore(selector),
}));

// Mock StatsBox component
vi.mock('../../StatsBox/StatsBox', () => ({
  default: ({ variant }: { variant: string }) => (
    <div data-testid="stats-box" data-variant={variant}>
      StatsBox {variant}
    </div>
  ),
}));

// Mock SearchField component
vi.mock('../SearchField/SearchField', () => ({
  default: ({
    isExpanded,
    fullWidth,
  }: {
    isExpanded: boolean;
    setIsExpanded: Function;
    fullWidth: boolean;
  }) => (
    <div
      data-testid="search-field"
      data-expanded={isExpanded}
      data-fullwidth={fullWidth}
    >
      SearchField
    </div>
  ),
}));

// Mock useMediaQuery and useTheme

const { mockUseMediaQuery } = vi.hoisted(() => {
  return { mockUseMediaQuery: vi.fn() };
});

const { mockUseTheme } = vi.hoisted(() => ({
  mockUseTheme: vi.fn(() => ({ breakpoints: { down: () => 'lg' } })),
}));

vi.mock('@mui/material', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(typeof actual === 'object' && actual !== null ? actual : {}),
    useMediaQuery: (query: any) => mockUseMediaQuery(query),
  };
});
vi.mock('@mui/material/styles', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(typeof actual === 'object' && actual !== null ? actual : {}),
    useTheme: mockUseTheme,
  };
});

// Mock the styles
vi.mock('../HeaderBottom.styles', () => ({
  StyledContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="styled-container">{children}</div>
  ),
}));
// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
  </MemoryRouter>
);

describe('HeaderBottom', () => {
  beforeEach(() => {
    mockUseMainStore.mockClear();
    mockUseMediaQuery.mockReset();
  });

  it('should not render StatsBox or SearchField when mobile', () => {
    mockUseMainStore.mockImplementation((selector) =>
      selector({ isMobile: true })
    );
    mockUseMediaQuery.mockReturnValue(false);

    render(
      <TestWrapper>
        <HeaderBottom />
      </TestWrapper>
    );

    expect(screen.queryByTestId('stats-box')).not.toBeInTheDocument();
    expect(screen.queryByTestId('search-field')).not.toBeInTheDocument();
  });

  it('should render StyledContainer in all modes', () => {
    mockUseMainStore.mockImplementation((selector) =>
      selector({ isMobile: false })
    );
    mockUseMediaQuery.mockReturnValue(false);
    const { unmount } = render(
      <TestWrapper>
        <HeaderBottom />
      </TestWrapper>
    );
    expect(screen.getByTestId('styled-container')).toBeInTheDocument();
    unmount();
    mockUseMainStore.mockImplementation((selector) =>
      selector({ isMobile: true })
    );
    render(
      <TestWrapper>
        <HeaderBottom />
      </TestWrapper>
    );
    expect(screen.getByTestId('styled-container')).toBeInTheDocument();
  });

  it('should render empty container in mobile mode', () => {
    mockUseMainStore.mockImplementation((selector) =>
      selector({ isMobile: true })
    );
    mockUseMediaQuery.mockReturnValue(false);
    render(
      <TestWrapper>
        <HeaderBottom />
      </TestWrapper>
    );
    const container = screen.getByTestId('styled-container');
    expect(container).toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });
});
