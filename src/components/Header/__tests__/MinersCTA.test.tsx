import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { MockInstance } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import MinersCTA from '../MinersCTA/MinersCTA';
import { lightTheme } from '@theme/themes';

// Mock hooks and utilities
vi.mock('@services/api/hooks/useMinerStats', () => ({
  useMinerStats: vi.fn(() => ({
    data: { totalMiners: 1234 },
    isLoading: false,
    error: null,
  })),
}));

vi.mock('@utils/getOs', () => ({
  getOS: vi.fn(() => 'Windows'),
}));

vi.mock('@utils/downloadLinks', () => ({
  DOWNLOAD_LINKS: {
    default: 'https://default-download.com',
    windows: 'https://windows-download.com',
    mac: 'https://mac-download.com',
  },
}));

vi.mock('@services/stores/useMainStore', () => ({
  useMainStore: vi.fn((selector) => {
    const state = {
      isMobile: false,
      setShowDownloadModal: vi.fn(),
      showDownloadModal: false,
      setIsLinux: vi.fn(),
    };
    return selector(state);
  }),
}));

// Mock NumberFlow component
vi.mock('@number-flow/react', () => ({
  default: ({ value }: { value: number; format?: unknown }) => (
    <span data-testid="number-flow">{value}</span>
  ),
}));

// Mock lazy loading
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    lazy: () => {
      const Component = ({ value }: { value: number; format?: unknown }) => (
        <span data-testid="number-flow">{value}</span>
      );
      Component.displayName = 'NumberFlow';
      return Component;
    },
    Suspense: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

// Mock window.open
const mockOpen = vi.fn();
Object.defineProperty(window, 'open', {
  value: mockOpen,
  writable: true,
});

// Mock setTimeout
vi.useFakeTimers();

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('MinersCTA', () => {
  beforeEach(() => {
    mockOpen.mockClear();
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.useFakeTimers();
  });

  it('should render full component with miners count and download button', () => {
    render(
      <TestWrapper>
        <MinersCTA theme="light" />
      </TestWrapper>
    );

    expect(screen.getByText('active miners')).toBeInTheDocument();
    expect(screen.getByText('Download Tari Universe')).toBeInTheDocument();
    expect(screen.getByTestId('number-flow')).toBeInTheDocument();
  });

  it('should render minersOnly variant with correct styling', () => {
    render(
      <TestWrapper>
        <MinersCTA theme="light" minersOnly={true} />
      </TestWrapper>
    );

    expect(screen.getByText('active miners')).toBeInTheDocument();
    expect(
      screen.queryByText('Download Tari Universe')
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('number-flow')).toBeInTheDocument();
  });

  it('should render buttonOnly variant with download button only', () => {
    render(
      <TestWrapper>
        <MinersCTA theme="light" buttonOnly={true} />
      </TestWrapper>
    );

    expect(screen.queryByText('active miners')).not.toBeInTheDocument();
    expect(screen.getByText('Download Tari Universe')).toBeInTheDocument();
  });

  it('should open download link when button is clicked', () => {
    render(
      <TestWrapper>
        <MinersCTA theme="light" />
      </TestWrapper>
    );

    const downloadButton = screen.getByText('Download Tari Universe');
    fireEvent.click(downloadButton);

    expect(mockOpen).toHaveBeenCalledWith(
      'https://windows-download.com',
      '_blank'
    );
  });

  it('should use custom button text when provided', () => {
    render(
      <TestWrapper>
        <MinersCTA theme="light" buttonText="Custom Download Text" />
      </TestWrapper>
    );

    expect(screen.getByText('Custom Download Text')).toBeInTheDocument();
    expect(
      screen.queryByText('Download Tari Universe')
    ).not.toBeInTheDocument();
  });

  it('should handle different OS download links', async () => {
    const { getOS } = await import('@utils/getOs');

    // Test MacOS
    (getOS as unknown as MockInstance).mockReturnValue('MacOS');
    const { unmount: unmountMac } = render(
      <TestWrapper>
        <MinersCTA theme="light" />
      </TestWrapper>
    );

    let downloadButton = screen.getByText('Download Tari Universe');
    fireEvent.click(downloadButton);
    expect(mockOpen).toHaveBeenCalledWith('https://mac-download.com', '_blank');

    unmountMac();
    mockOpen.mockClear();

    // Test Unknown OS - should not call window.open (only shows modal)
    (getOS as unknown as MockInstance).mockReturnValue('Unknown');
    render(
      <TestWrapper>
        <MinersCTA theme="light" />
      </TestWrapper>
    );

    downloadButton = screen.getByText('Download Tari Universe');
    fireEvent.click(downloadButton);
    // Unknown OS should not call window.open, only show download modal
    expect(mockOpen).not.toHaveBeenCalled();
  });

  it('should show download modal on supported OS click', async () => {
    const mockSetShowDownloadModal = vi.fn();
    const { useMainStore } = await import('@services/stores/useMainStore');
    const { getOS } = await import('@utils/getOs');

    // Ensure OS is Windows for this test
    (getOS as unknown as MockInstance).mockReturnValue('Windows');
    (useMainStore as unknown as MockInstance).mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = {
          isMobile: false,
          setShowDownloadModal: mockSetShowDownloadModal,
          setIsLinux: vi.fn(),
        };
        return selector(state);
      }
    );

    render(
      <TestWrapper>
        <MinersCTA theme="light" />
      </TestWrapper>
    );

    const downloadButton = screen.getByText('Download Tari Universe');
    fireEvent.click(downloadButton);

    expect(mockSetShowDownloadModal).toHaveBeenCalledWith(true);

    // Fast forward 20 seconds to test modal auto-close
    vi.advanceTimersByTime(20000);

    expect(mockSetShowDownloadModal).toHaveBeenCalledWith(false);
  });

  it('should display miner count with correct formatting', async () => {
    const { useMinerStats } = await import('@services/api/hooks/useMinerStats');

    // Test large number formatting
    (useMinerStats as unknown as MockInstance).mockReturnValue({
      data: { totalMiners: 150000 },
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <MinersCTA theme="light" />
      </TestWrapper>
    );

    expect(screen.getByTestId('number-flow')).toBeInTheDocument();
  });

  it('should handle missing miner stats data gracefully', async () => {
    const { useMinerStats } = await import('@services/api/hooks/useMinerStats');

    (useMinerStats as unknown as MockInstance).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <MinersCTA theme="light" />
      </TestWrapper>
    );

    expect(screen.getByText('active miners')).toBeInTheDocument();
    expect(screen.getByTestId('number-flow')).toBeInTheDocument();
  });

  it('should apply dark theme styling', () => {
    render(
      <TestWrapper>
        <MinersCTA theme="dark" />
      </TestWrapper>
    );

    expect(screen.getByText('active miners')).toBeInTheDocument();
    expect(screen.getByText('Download Tari Universe')).toBeInTheDocument();
  });

  it('should apply noBackground styling', () => {
    render(
      <TestWrapper>
        <MinersCTA theme="light" noBackground={true} />
      </TestWrapper>
    );

    expect(screen.getByText('active miners')).toBeInTheDocument();
    expect(screen.getByText('Download Tari Universe')).toBeInTheDocument();
  });

  it('should handle mobile interface correctly', async () => {
    const { useMainStore } = await import('@services/stores/useMainStore');

    (useMainStore as unknown as MockInstance).mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = {
          isMobile: true,
          setShowDownloadModal: vi.fn(),
          setIsLinux: vi.fn(),
        };
        return selector(state);
      }
    );

    render(
      <TestWrapper>
        <MinersCTA theme="light" />
      </TestWrapper>
    );

    expect(screen.getByText('active miners')).toBeInTheDocument();
    expect(screen.getByText('Download Tari Universe')).toBeInTheDocument();
  });
});
