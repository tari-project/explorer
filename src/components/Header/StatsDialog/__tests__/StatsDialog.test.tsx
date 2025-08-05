import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StatsDialog from '../StatsDialog';

// Mock MUI components
vi.mock('@mui/material/Button', () => ({
  default: ({
    children,
    onClick,
    autoFocus,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    autoFocus?: boolean;
  }) => (
    <button data-testid="button" onClick={onClick} data-auto-focus={autoFocus}>
      {children}
    </button>
  ),
}));

vi.mock('@mui/material/DialogContent', () => ({
  default: ({
    children,
    dividers,
  }: {
    children: React.ReactNode;
    dividers?: boolean;
  }) => (
    <div data-testid="dialog-content" data-dividers={dividers}>
      {children}
    </div>
  ),
}));

vi.mock('@mui/material/DialogActions', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-actions">{children}</div>
  ),
}));

vi.mock('@mui/material/IconButton', () => ({
  default: ({
    children,
    onClick,
    'aria-label': ariaLabel,
    sx,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    'aria-label'?: string;
    sx?: unknown;
  }) => (
    <button
      data-testid="icon-button"
      onClick={onClick}
      aria-label={ariaLabel}
      data-sx={JSON.stringify(sx)}
    >
      {children}
    </button>
  ),
}));

vi.mock('@mui/material/Typography', () => ({
  default: ({
    children,
    variant,
    gutterBottom,
  }: {
    children: React.ReactNode;
    variant?: string;
    gutterBottom?: boolean;
  }) => (
    <div
      data-testid={`typography-${variant}`}
      data-gutter-bottom={gutterBottom}
    >
      {children}
    </div>
  ),
}));

vi.mock('@mui/icons-material/Close', () => ({
  default: () => <span data-testid="close-icon">✕</span>,
}));

// Mock react icons
vi.mock('react-icons/io5', () => ({
  IoAnalyticsOutline: () => <span data-testid="analytics-icon">📊</span>,
}));

// Mock styled components
vi.mock('../StatsDialog.styles', () => ({
  BootstrapDialog: ({
    children,
    open,
    'aria-labelledby': ariaLabelledBy,
  }: {
    children: React.ReactNode;
    open?: boolean;
    'aria-labelledby'?: string;
  }) =>
    open ? (
      <div
        data-testid="bootstrap-dialog"
        data-aria-labelledby={ariaLabelledBy}
        data-open={open}
      >
        {children}
      </div>
    ) : null,
  StyledDialogTitle: ({
    children,
    id,
  }: {
    children: React.ReactNode;
    id: string;
  }) => (
    <div data-testid="styled-dialog-title" id={id}>
      {children}
    </div>
  ),
}));

// Mock child components
vi.mock('../../CopyToClipboard', () => ({
  default: ({ copy }: { copy: string }) => (
    <button
      aria-label="copy to clipboard"
      data-testid="icon-button"
      data-copy={copy}
    >
      <svg data-testid="ContentCopyIcon" />
    </button>
  ),
}));

// Mock API hook
vi.mock('@services/api/hooks/useBlocks', () => ({
  useAllBlocks: vi.fn(),
}));

// Mock utilities
vi.mock('@utils/helpers', () => ({
  toHexString: vi.fn((data) => `hex_${data}`),
  shortenString: vi.fn((str) => `${str?.slice(0, 6)}...${str?.slice(-4)}`),
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
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('StatsDialog', () => {
  let mockUseAllBlocks: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const { useAllBlocks } = await import('@services/api/hooks/useBlocks');
    mockUseAllBlocks = vi.mocked(useAllBlocks);
  });

  const mockStatsData = {
    tipInfo: {
      metadata: {
        best_block_height: 123456,
        best_block_hash: {
          data: [1, 2, 3, 4, 5, 6, 7, 8],
        },
        pruned_height: 123000,
      },
    },
    version: '1.0.0',
  };

  it('should render analytics icon button', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockStatsData,
    });

    render(
      <TestWrapper>
        <StatsDialog />
      </TestWrapper>
    );

    expect(screen.getByTestId('analytics-icon')).toBeInTheDocument();
  });

  it('should not show dialog initially', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockStatsData,
    });

    render(
      <TestWrapper>
        <StatsDialog />
      </TestWrapper>
    );

    expect(screen.queryByTestId('bootstrap-dialog')).not.toBeInTheDocument();
  });

  it('should open dialog when analytics button is clicked', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockStatsData,
    });

    render(
      <TestWrapper>
        <StatsDialog />
      </TestWrapper>
    );

    const analyticsButton = screen.getAllByTestId('icon-button')[0];
    fireEvent.click(analyticsButton);

    expect(screen.getByTestId('bootstrap-dialog')).toBeInTheDocument();
    expect(screen.getByTestId('styled-dialog-title')).toBeInTheDocument();
    expect(screen.getByText('Latest Stats')).toBeInTheDocument();
  });

  it('should display blockchain statistics', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockStatsData,
    });

    render(
      <TestWrapper>
        <StatsDialog />
      </TestWrapper>
    );

    // Open dialog
    const analyticsButton = screen.getAllByTestId('icon-button')[0];
    fireEvent.click(analyticsButton);

    expect(screen.getByText('123456')).toBeInTheDocument();
    expect(screen.getByText('123000')).toBeInTheDocument();
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
  });

  it('should render copy to clipboard for best block hash', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockStatsData,
    });

    render(
      <TestWrapper>
        <StatsDialog />
      </TestWrapper>
    );

    // Open dialog
    const analyticsButton = screen.getAllByTestId('icon-button')[0];
    fireEvent.click(analyticsButton);

    expect(screen.getByTestId('ContentCopyIcon')).toBeInTheDocument();
  });

  it('should close dialog when close button is clicked', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockStatsData,
    });

    render(
      <TestWrapper>
        <StatsDialog />
      </TestWrapper>
    );

    // Open dialog
    const analyticsButton = screen.getAllByTestId('icon-button')[0];
    fireEvent.click(analyticsButton);
    expect(screen.getByTestId('bootstrap-dialog')).toBeInTheDocument();

    // Close dialog
    const closeButton = screen.getByTestId('button');
    fireEvent.click(closeButton);
    expect(screen.queryByTestId('bootstrap-dialog')).not.toBeInTheDocument();
  });

  it('should close dialog when close icon is clicked', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockStatsData,
    });

    render(
      <TestWrapper>
        <StatsDialog />
      </TestWrapper>
    );

    // Open dialog
    const analyticsButton = screen.getAllByTestId('icon-button')[0];
    fireEvent.click(analyticsButton);
    expect(screen.getByTestId('bootstrap-dialog')).toBeInTheDocument();

    // Find close icon button (should be the second icon button)
    const iconButtons = screen.getAllByTestId('icon-button');
    const closeIconButton = iconButtons[1];
    fireEvent.click(closeIconButton);
    expect(screen.queryByTestId('bootstrap-dialog')).not.toBeInTheDocument();
  });

  it('should handle missing data gracefully', () => {
    mockUseAllBlocks.mockReturnValue({
      data: null,
    });

    render(
      <TestWrapper>
        <StatsDialog />
      </TestWrapper>
    );

    // Open dialog
    const analyticsButton = screen.getAllByTestId('icon-button')[0];
    fireEvent.click(analyticsButton);

    expect(screen.getByTestId('bootstrap-dialog')).toBeInTheDocument();
    expect(screen.getByTestId('styled-dialog-title')).toBeInTheDocument();
  });

  it('should not render version when not available', () => {
    const dataWithoutVersion = {
      tipInfo: {
        metadata: {
          best_block_height: 123456,
          best_block_hash: {
            data: [1, 2, 3, 4, 5, 6, 7, 8],
          },
          pruned_height: 123000,
        },
      },
    };

    mockUseAllBlocks.mockReturnValue({
      data: dataWithoutVersion,
    });

    render(
      <TestWrapper>
        <StatsDialog />
      </TestWrapper>
    );

    // Open dialog
    const analyticsButton = screen.getAllByTestId('icon-button')[0];
    fireEvent.click(analyticsButton);

    expect(screen.queryByText('Version:')).not.toBeInTheDocument();
  });

  it('should render dialog with proper accessibility attributes', () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockStatsData,
    });

    render(
      <TestWrapper>
        <StatsDialog />
      </TestWrapper>
    );

    // Open dialog
    const analyticsButton = screen.getAllByTestId('icon-button')[0];
    fireEvent.click(analyticsButton);

    const dialog = screen.getByTestId('bootstrap-dialog');
    expect(dialog).toHaveAttribute(
      'data-aria-labelledby',
      'customized-dialog-title'
    );

    const title = screen.getByTestId('styled-dialog-title');
    expect(title).toHaveAttribute('id', 'customized-dialog-title');
  });
});
