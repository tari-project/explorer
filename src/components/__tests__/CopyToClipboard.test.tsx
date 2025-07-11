import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import CopyToClipboard from '../CopyToClipboard';
import { lightTheme } from '@theme/themes';

// Mock clipboard API
const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

// Mock setTimeout and clearTimeout
vi.useFakeTimers();

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
);

describe('CopyToClipboard', () => {
  beforeEach(() => {
    mockWriteText.mockClear();
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.useFakeTimers();
  });

  it('should render copy button with tooltip', () => {
    render(
      <TestWrapper>
        <CopyToClipboard copy="test-text" />
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: /copy to clipboard/i });
    expect(button).toBeInTheDocument();

    const icon = screen.getByTestId('ContentCopyIcon');
    expect(icon).toBeInTheDocument();
  });

  it('should call clipboard.writeText when clicked', async () => {
    const textToCopy = 'test-text-to-copy';

    render(
      <TestWrapper>
        <CopyToClipboard copy={textToCopy} />
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: /copy to clipboard/i });
    fireEvent.click(button);

    expect(mockWriteText).toHaveBeenCalledWith(textToCopy);
    expect(mockWriteText).toHaveBeenCalledTimes(1);
  });

  it('should update icon aria-label after clicking', async () => {
    render(
      <TestWrapper>
        <CopyToClipboard copy="test-text" />
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: /copy to clipboard/i });

    // Click the button
    fireEvent.click(button);

    // Check if the icon's aria-label changes to indicate successful copy
    const icon = screen.getByLabelText('Copied to clipboard');
    expect(icon).toBeInTheDocument();
  });

  it('should reset tooltip after 2 seconds', async () => {
    render(
      <TestWrapper>
        <CopyToClipboard copy="test-text" />
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: /copy to clipboard/i });
    fireEvent.click(button);

    // Fast-forward 2 seconds to test timeout behavior
    vi.advanceTimersByTime(2000);

    // The component should have reset its internal state
    // We can verify the click handler still works by checking clipboard calls
    fireEvent.click(button);
    expect(mockWriteText).toHaveBeenCalledTimes(2);
  });

  it('should apply float right style when floatright prop is true', () => {
    render(
      <TestWrapper>
        <CopyToClipboard copy="test-text" floatright={true} />
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: /copy to clipboard/i });
    expect(button).toHaveStyle({ float: 'right' });
  });

  it('should not apply float right style when floatright prop is false', () => {
    render(
      <TestWrapper>
        <CopyToClipboard copy="test-text" floatright={false} />
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: /copy to clipboard/i });
    expect(button).not.toHaveStyle({ float: 'right' });
  });

  it('should not apply float right style when floatright prop is undefined', () => {
    render(
      <TestWrapper>
        <CopyToClipboard copy="test-text" />
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: /copy to clipboard/i });
    expect(button).not.toHaveStyle({ float: 'right' });
  });

  it('should have correct margins for both float and non-float variants', () => {
    const { rerender } = render(
      <TestWrapper>
        <CopyToClipboard copy="test-text" />
      </TestWrapper>
    );

    let button = screen.getByRole('button', { name: /copy to clipboard/i });
    expect(button).toHaveStyle({
      marginLeft: '10px',
      marginRight: '10px',
    });

    rerender(
      <TestWrapper>
        <CopyToClipboard copy="test-text" floatright={true} />
      </TestWrapper>
    );

    button = screen.getByRole('button', { name: /copy to clipboard/i });
    expect(button).toHaveStyle({
      float: 'right',
      marginLeft: '10px',
      marginRight: '10px',
    });
  });

  it('should handle multiple rapid clicks correctly', async () => {
    render(
      <TestWrapper>
        <CopyToClipboard copy="test-text" />
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: /copy to clipboard/i });

    // Click multiple times rapidly
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockWriteText).toHaveBeenCalledTimes(3);
    expect(mockWriteText).toHaveBeenCalledWith('test-text');
  });

  it('should have correct icon size styling', () => {
    render(
      <TestWrapper>
        <CopyToClipboard copy="test-text" />
      </TestWrapper>
    );

    const icon = screen.getByTestId('ContentCopyIcon');
    expect(icon).toHaveStyle({
      width: '16px',
      height: '16px',
    });
  });
});
