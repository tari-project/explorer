import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OSButton from '../OSButton';

// Mock MUI components
vi.mock('@mui/material', () => ({
  Icon: ({ sx, children }: any) => (
    <div data-testid="icon" data-sx={JSON.stringify(sx)}>
      {children}
    </div>
  ),
}));

// Mock assets
vi.mock('@assets/images/ico-windows.svg', () => ({
  default: 'ico-windows.svg',
}));

vi.mock('@assets/images/ico-mac.svg', () => ({
  default: 'ico-mac.svg',
}));

vi.mock('@assets/images/ico-linux.svg', () => ({
  default: 'ico-linux.svg',
}));

// Mock styled components
vi.mock('../OSButton.styles', () => ({
  GradientButton: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) => (
    <button data-testid="gradient-button" onClick={onClick}>
      {children}
    </button>
  ),
}));

// Mock download links
vi.mock('@utils/downloadLinks', () => ({
  DOWNLOAD_LINKS: {
    windows: 'https://example.com/windows-download',
    mac: 'https://example.com/mac-download',
    linux: 'https://example.com/linux-download',
  },
}));

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
});

describe('OSButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Windows button correctly', () => {
    render(<OSButton os="Windows" />);

    expect(screen.getByTestId('gradient-button')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Windows')).toBeInTheDocument();
  });

  it('should render Mac button correctly', () => {
    render(<OSButton os="Mac" />);

    expect(screen.getByTestId('gradient-button')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Mac')).toBeInTheDocument();
  });

  it('should render Linux button correctly', () => {
    render(<OSButton os="Linux" />);

    expect(screen.getByTestId('gradient-button')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Linux')).toBeInTheDocument();
  });

  it('should open Windows download link when clicked', () => {
    render(<OSButton os="Windows" />);

    const button = screen.getByTestId('gradient-button');
    fireEvent.click(button);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://example.com/windows-download',
      '_blank'
    );
  });

  it('should open Mac download link when clicked', () => {
    render(<OSButton os="Mac" />);

    const button = screen.getByTestId('gradient-button');
    fireEvent.click(button);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://example.com/mac-download',
      '_blank'
    );
  });

  it('should open Linux download link when clicked', () => {
    render(<OSButton os="Linux" />);

    const button = screen.getByTestId('gradient-button');
    fireEvent.click(button);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://example.com/linux-download',
      '_blank'
    );
  });

  it('should render Windows icon with correct styling', () => {
    render(<OSButton os="Windows" />);

    const icon = screen.getByTestId('icon');
    const sx = JSON.parse(icon.getAttribute('data-sx') || '{}');

    expect(sx.width).toBe('24px');
    expect(sx.height).toBe('24px');
    expect(sx.backgroundImage).toBe('url(ico-windows.svg)');
    expect(sx.backgroundSize).toBe('contain');
    expect(sx.backgroundRepeat).toBe('no-repeat');
  });

  it('should render Mac icon with correct styling', () => {
    render(<OSButton os="Mac" />);

    const icon = screen.getByTestId('icon');
    const sx = JSON.parse(icon.getAttribute('data-sx') || '{}');

    expect(sx.backgroundImage).toBe('url(ico-mac.svg)');
  });

  it('should render Linux icon with correct styling', () => {
    render(<OSButton os="Linux" />);

    const icon = screen.getByTestId('icon');
    const sx = JSON.parse(icon.getAttribute('data-sx') || '{}');

    expect(sx.backgroundImage).toBe('url(ico-linux.svg)');
  });

  it('should handle invalid OS gracefully', () => {
    const { container } = render(<OSButton os={'Invalid' as any} />);

    expect(container.firstChild).toBeNull();
  });

  it('should not open link if OS config is invalid', () => {
    render(<OSButton os={'Invalid' as any} />);

    // Since the component returns null for invalid OS, there's no button to click
    expect(mockWindowOpen).not.toHaveBeenCalled();
  });

  it('should render button structure correctly', () => {
    render(<OSButton os="Windows" />);

    const button = screen.getByTestId('gradient-button');
    const icon = screen.getByTestId('icon');
    const label = screen.getByText('Windows');

    expect(button).toContainElement(icon);
    expect(button).toContainElement(label);
  });
});
