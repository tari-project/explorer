import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import SearchKernel from '../SearchKernel';
import { lightTheme } from '@theme/themes';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the store hook
const mockSetSearchOpen = vi.fn();
vi.mock('@services/stores/useMainStore', () => ({
  useMainStore: vi.fn(() => mockSetSearchOpen),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
  </BrowserRouter>
);

describe('SearchKernel', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockSetSearchOpen.mockClear();
  });

  it('should render nonce and signature input fields', () => {
    render(
      <TestWrapper>
        <SearchKernel />
      </TestWrapper>
    );

    expect(screen.getByRole('textbox', { name: /nonce/i })).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: /signature/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('should focus on nonce field initially', () => {
    render(
      <TestWrapper>
        <SearchKernel />
      </TestWrapper>
    );

    const nonceInput = screen.getByRole('textbox', { name: /nonce/i });
    expect(nonceInput).toHaveFocus();
  });

  it('should update input values when typing', () => {
    render(
      <TestWrapper>
        <SearchKernel />
      </TestWrapper>
    );

    const nonceInput = screen.getByRole('textbox', { name: /nonce/i });
    const signatureInput = screen.getByRole('textbox', { name: /signature/i });

    fireEvent.change(nonceInput, { target: { value: 'test-nonce' } });
    fireEvent.change(signatureInput, { target: { value: 'test-signature' } });

    expect(nonceInput).toHaveValue('test-nonce');
    expect(signatureInput).toHaveValue('test-signature');
  });

  it('should show validation errors for empty fields when search is clicked', () => {
    render(
      <TestWrapper>
        <SearchKernel />
      </TestWrapper>
    );

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    expect(screen.getByText('Both fields are required.')).toBeInTheDocument();
    expect(screen.getByText('Nonce is required')).toBeInTheDocument();
    expect(screen.getByText('Signature is required')).toBeInTheDocument();
  });

  it('should show validation error for invalid nonce length', () => {
    render(
      <TestWrapper>
        <SearchKernel />
      </TestWrapper>
    );

    const nonceInput = screen.getByRole('textbox', { name: /nonce/i });
    const signatureInput = screen.getByRole('textbox', { name: /signature/i });
    const searchButton = screen.getByRole('button', { name: /search/i });

    // Valid 64-char signature, invalid nonce
    fireEvent.change(nonceInput, { target: { value: 'short-nonce' } });
    fireEvent.change(signatureInput, {
      target: {
        value:
          '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      },
    });
    fireEvent.click(searchButton);

    expect(
      screen.getByText('Nonce must be a 64-character hash.')
    ).toBeInTheDocument();
  });

  it('should show validation error for invalid signature length', () => {
    render(
      <TestWrapper>
        <SearchKernel />
      </TestWrapper>
    );

    const nonceInput = screen.getByRole('textbox', { name: /nonce/i });
    const signatureInput = screen.getByRole('textbox', { name: /signature/i });
    const searchButton = screen.getByRole('button', { name: /search/i });

    // Valid 64-char nonce, invalid signature
    fireEvent.change(nonceInput, {
      target: {
        value:
          '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      },
    });
    fireEvent.change(signatureInput, { target: { value: 'short-sig' } });
    fireEvent.click(searchButton);

    expect(
      screen.getByText('Signature must be a 64-character hash.')
    ).toBeInTheDocument();
  });

  it('should navigate to kernel search page with valid inputs', () => {
    render(
      <TestWrapper>
        <SearchKernel />
      </TestWrapper>
    );

    const nonceInput = screen.getByRole('textbox', { name: /nonce/i });
    const signatureInput = screen.getByRole('textbox', { name: /signature/i });
    const searchButton = screen.getByRole('button', { name: /search/i });

    const validNonce =
      '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const validSignature =
      'fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321';

    fireEvent.change(nonceInput, { target: { value: validNonce } });
    fireEvent.change(signatureInput, { target: { value: validSignature } });
    fireEvent.click(searchButton);

    expect(mockNavigate).toHaveBeenCalledWith(
      `/kernel_search?nonces=${validNonce}&signatures=${validSignature}`
    );
    expect(mockSetSearchOpen).toHaveBeenCalledWith(false);
  });

  it('should trigger search on Enter key press in nonce field', () => {
    render(
      <TestWrapper>
        <SearchKernel />
      </TestWrapper>
    );

    const nonceInput = screen.getByRole('textbox', { name: /nonce/i });
    const signatureInput = screen.getByRole('textbox', { name: /signature/i });

    const validNonce =
      '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const validSignature =
      'fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321';

    fireEvent.change(nonceInput, { target: { value: validNonce } });
    fireEvent.change(signatureInput, { target: { value: validSignature } });
    fireEvent.keyDown(nonceInput, { key: 'Enter', code: 'Enter' });

    expect(mockNavigate).toHaveBeenCalledWith(
      `/kernel_search?nonces=${validNonce}&signatures=${validSignature}`
    );
  });

  it('should trigger search on Enter key press in signature field', () => {
    render(
      <TestWrapper>
        <SearchKernel />
      </TestWrapper>
    );

    const nonceInput = screen.getByRole('textbox', { name: /nonce/i });
    const signatureInput = screen.getByRole('textbox', { name: /signature/i });

    const validNonce =
      '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const validSignature =
      'fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321';

    fireEvent.change(nonceInput, { target: { value: validNonce } });
    fireEvent.change(signatureInput, { target: { value: validSignature } });
    fireEvent.keyDown(signatureInput, { key: 'Enter', code: 'Enter' });

    expect(mockNavigate).toHaveBeenCalledWith(
      `/kernel_search?nonces=${validNonce}&signatures=${validSignature}`
    );
  });

  it('should clear inputs and close search when cancel is clicked', () => {
    render(
      <TestWrapper>
        <SearchKernel />
      </TestWrapper>
    );

    const nonceInput = screen.getByRole('textbox', { name: /nonce/i });
    const signatureInput = screen.getByRole('textbox', { name: /signature/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    // Add some input
    fireEvent.change(nonceInput, { target: { value: 'test-nonce' } });
    fireEvent.change(signatureInput, { target: { value: 'test-signature' } });

    fireEvent.click(cancelButton);

    expect(nonceInput).toHaveValue('');
    expect(signatureInput).toHaveValue('');
    expect(mockSetSearchOpen).toHaveBeenCalledWith(false);
  });

  it('should show field-specific error messages when touched', () => {
    render(
      <TestWrapper>
        <SearchKernel />
      </TestWrapper>
    );

    const nonceInput = screen.getByRole('textbox', { name: /nonce/i });
    const signatureInput = screen.getByRole('textbox', { name: /signature/i });

    // Touch nonce field and leave empty
    fireEvent.change(nonceInput, { target: { value: 'temp' } });
    fireEvent.change(nonceInput, { target: { value: '' } });

    expect(screen.getByText('Nonce is required')).toBeInTheDocument();

    // Touch signature field and leave empty
    fireEvent.change(signatureInput, { target: { value: 'temp' } });
    fireEvent.change(signatureInput, { target: { value: '' } });

    expect(screen.getByText('Signature is required')).toBeInTheDocument();
  });

  it('should mark fields as touched when typing', () => {
    render(
      <TestWrapper>
        <SearchKernel />
      </TestWrapper>
    );

    const nonceInput = screen.getByRole('textbox', { name: /nonce/i });

    // Initially no error should be shown
    expect(screen.queryByText('Nonce is required')).not.toBeInTheDocument();

    // Type something and then delete it
    fireEvent.change(nonceInput, { target: { value: 'test' } });
    fireEvent.change(nonceInput, { target: { value: '' } });

    // Now error should be shown because field was touched
    expect(screen.getByText('Nonce is required')).toBeInTheDocument();
  });

  it('should clear error messages when valid input is provided', () => {
    render(
      <TestWrapper>
        <SearchKernel />
      </TestWrapper>
    );

    const nonceInput = screen.getByRole('textbox', { name: /nonce/i });
    const signatureInput = screen.getByRole('textbox', { name: /signature/i });
    const searchButton = screen.getByRole('button', { name: /search/i });

    // First trigger error
    fireEvent.click(searchButton);
    expect(screen.getByText('Both fields are required.')).toBeInTheDocument();

    // Then provide valid input
    const validNonce =
      '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const validSignature =
      'fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321';

    fireEvent.change(nonceInput, { target: { value: validNonce } });
    fireEvent.change(signatureInput, { target: { value: validSignature } });
    fireEvent.click(searchButton);

    // Error should be cleared and navigation should happen
    expect(
      screen.queryByText('Both fields are required.')
    ).not.toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('should have correct input field properties', () => {
    render(
      <TestWrapper>
        <SearchKernel />
      </TestWrapper>
    );

    const nonceInput = screen.getByRole('textbox', { name: /nonce/i });
    const signatureInput = screen.getByRole('textbox', { name: /signature/i });

    // Nonce field properties
    expect(nonceInput).toHaveAttribute('name', 'nonce');
    expect(nonceInput).toBeRequired();

    // Signature field properties
    expect(signatureInput).toHaveAttribute('name', 'signature');
    expect(signatureInput).toBeRequired();
  });

  it('should not trigger search on non-Enter key presses', () => {
    render(
      <TestWrapper>
        <SearchKernel />
      </TestWrapper>
    );

    const nonceInput = screen.getByRole('textbox', { name: /nonce/i });

    fireEvent.keyDown(nonceInput, { key: 'Escape', code: 'Escape' });
    fireEvent.keyDown(nonceInput, { key: 'Tab', code: 'Tab' });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should validate exact 64-character length for hashes', () => {
    render(
      <TestWrapper>
        <SearchKernel />
      </TestWrapper>
    );

    const nonceInput = screen.getByRole('textbox', { name: /nonce/i });
    const signatureInput = screen.getByRole('textbox', { name: /signature/i });
    const searchButton = screen.getByRole('button', { name: /search/i });

    // Test 63 characters (too short)
    fireEvent.change(nonceInput, {
      target: {
        value: '123456789abcdef123456789abcdef123456789abcdef123456789abcdef12',
      },
    });
    fireEvent.change(signatureInput, {
      target: {
        value:
          '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      },
    });
    fireEvent.click(searchButton);

    expect(
      screen.getByText('Nonce must be a 64-character hash.')
    ).toBeInTheDocument();

    // Test 65 characters (too long)
    fireEvent.change(nonceInput, {
      target: {
        value:
          '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1',
      },
    });
    fireEvent.click(searchButton);

    expect(
      screen.getByText('Nonce must be a 64-character hash.')
    ).toBeInTheDocument();
  });
});
