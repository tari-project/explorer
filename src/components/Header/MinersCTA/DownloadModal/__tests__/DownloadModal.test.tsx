import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DownloadModal from '../DownloadModal';

// Mock MUI components
vi.mock('@mui/material', () => ({
  IconButton: ({
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
  Typography: ({
    children,
    variant,
    sx,
  }: {
    children: React.ReactNode;
    variant?: string;
    sx?: unknown;
  }) => (
    <div data-testid={`typography-${variant}`} data-sx={JSON.stringify(sx)}>
      {children}
    </div>
  ),
  Backdrop: ({
    children,
    open,
    onClick,
    sx,
  }: {
    children: React.ReactNode;
    open?: boolean;
    onClick?: () => void;
    sx?: unknown;
  }) =>
    open ? (
      <div
        data-testid="backdrop"
        onClick={onClick}
        data-sx={JSON.stringify(sx)}
      >
        {children}
      </div>
    ) : null,
  Stack: ({
    children,
    spacing,
    direction,
    mt,
  }: {
    children: React.ReactNode;
    spacing?: unknown;
    direction?: string;
    mt?: unknown;
  }) => (
    <div
      data-testid="stack"
      data-spacing={spacing}
      data-direction={direction}
      data-mt={mt}
    >
      {children}
    </div>
  ),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

vi.mock('@mui/icons-material/Close', () => ({
  default: () => <span data-testid="close-icon">✕</span>,
}));

// Mock store
const mockSetShowDownloadModal = vi.fn();
vi.mock('@services/stores/useMainStore', () => ({
  useMainStore: vi.fn(),
}));

// Mock theme
vi.mock('@theme/themes', () => ({
  lightTheme: {
    palette: {
      mode: 'light',
      grey: { 500: '#9e9e9e' },
    },
  },
}));

// Mock assets
vi.mock('@assets/images/emoji-logo.png', () => ({
  default: 'emoji-logo.png',
}));

// Mock styled components
vi.mock('../DownloadModal.styles', () => ({
  ImageWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="image-wrapper">{children}</div>
  ),
  Modal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal">{children}</div>
  ),
  Wrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="wrapper">{children}</div>
  ),
}));

// Mock child components
vi.mock('../OSButton', () => ({
  default: ({ os }: { os: string }) => (
    <div data-testid={`os-button-${os.toLowerCase()}`}>{os} Button</div>
  ),
}));

describe('DownloadModal', () => {
  let mockUseMainStore: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockUseMainStore = vi.fn();
    const { useMainStore } = await import('@services/stores/useMainStore');
    vi.mocked(useMainStore).mockImplementation(mockUseMainStore);
  });

  it('should not render when showDownloadModal is false', () => {
    mockUseMainStore.mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = {
          showDownloadModal: false,
          setShowDownloadModal: mockSetShowDownloadModal,
        };
        return selector(state);
      }
    );

    render(<DownloadModal />);

    expect(screen.queryByTestId('backdrop')).not.toBeInTheDocument();
  });

  it('should render when showDownloadModal is true', () => {
    mockUseMainStore.mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = {
          showDownloadModal: true,
          setShowDownloadModal: mockSetShowDownloadModal,
        };
        return selector(state);
      }
    );

    render(<DownloadModal />);

    expect(screen.getByTestId('backdrop')).toBeInTheDocument();
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
  });

  it('should render download message', () => {
    mockUseMainStore.mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = {
          showDownloadModal: true,
          setShowDownloadModal: mockSetShowDownloadModal,
        };
        return selector(state);
      }
    );

    render(<DownloadModal />);

    expect(screen.getByText(/Your download/)).toBeInTheDocument();
    expect(screen.getByText(/has started/)).toBeInTheDocument();
    expect(
      screen.getByText('Facing trouble? Here are your download links.')
    ).toBeInTheDocument();
  });

  it('should render Tari logo', () => {
    mockUseMainStore.mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = {
          showDownloadModal: true,
          setShowDownloadModal: mockSetShowDownloadModal,
        };
        return selector(state);
      }
    );

    render(<DownloadModal />);

    expect(screen.getByTestId('image-wrapper')).toBeInTheDocument();
    expect(screen.getByAltText('Tari Logo')).toBeInTheDocument();
  });

  it('should render OS buttons for all platforms', () => {
    mockUseMainStore.mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = {
          showDownloadModal: true,
          setShowDownloadModal: mockSetShowDownloadModal,
        };
        return selector(state);
      }
    );

    render(<DownloadModal />);

    expect(screen.getByTestId('os-button-mac')).toBeInTheDocument();
    expect(screen.getByTestId('os-button-windows')).toBeInTheDocument();
    expect(screen.getByTestId('os-button-linux')).toBeInTheDocument();
  });

  it('should render close button', () => {
    mockUseMainStore.mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = {
          showDownloadModal: true,
          setShowDownloadModal: mockSetShowDownloadModal,
        };
        return selector(state);
      }
    );

    render(<DownloadModal />);

    expect(screen.getByTestId('icon-button')).toBeInTheDocument();
    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
  });

  it('should close modal when close button is clicked', () => {
    mockUseMainStore.mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = {
          showDownloadModal: true,
          setShowDownloadModal: mockSetShowDownloadModal,
        };
        return selector(state);
      }
    );

    render(<DownloadModal />);

    const closeButton = screen.getByTestId('icon-button');
    fireEvent.click(closeButton);

    expect(mockSetShowDownloadModal).toHaveBeenCalledWith(false);
  });

  it('should close modal when backdrop is clicked', () => {
    mockUseMainStore.mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = {
          showDownloadModal: true,
          setShowDownloadModal: mockSetShowDownloadModal,
        };
        return selector(state);
      }
    );

    render(<DownloadModal />);

    const backdrop = screen.getByTestId('backdrop');
    fireEvent.click(backdrop);

    expect(mockSetShowDownloadModal).toHaveBeenCalledWith(false);
  });

  it('should render with proper component structure', () => {
    mockUseMainStore.mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = {
          showDownloadModal: true,
          setShowDownloadModal: mockSetShowDownloadModal,
        };
        return selector(state);
      }
    );

    render(<DownloadModal />);

    expect(screen.getByTestId('wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('stack')).toBeInTheDocument();
  });

  it('should render typography with correct variants', () => {
    mockUseMainStore.mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = {
          showDownloadModal: true,
          setShowDownloadModal: mockSetShowDownloadModal,
        };
        return selector(state);
      }
    );

    render(<DownloadModal />);

    expect(screen.getByTestId('typography-h1')).toBeInTheDocument();
    expect(screen.getByTestId('typography-body1')).toBeInTheDocument();
  });

  it('should render stack with correct props', () => {
    mockUseMainStore.mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = {
          showDownloadModal: true,
          setShowDownloadModal: mockSetShowDownloadModal,
        };
        return selector(state);
      }
    );

    render(<DownloadModal />);

    const stack = screen.getByTestId('stack');
    expect(stack).toHaveAttribute('data-spacing', '2');
    expect(stack).toHaveAttribute('data-direction', 'row');
    expect(stack).toHaveAttribute('data-mt', '2');
  });
});
