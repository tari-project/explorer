import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import SearchField from '../SearchField/SearchField';
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

// Mock SnackbarAlert component
vi.mock('../../SnackbarAlert', () => ({
  default: ({
    open,
    message,
  }: {
    open: boolean;
    message: string;
    setOpen: (open: boolean) => void;
  }) => {
    React.useEffect(() => {
      if (open) {
        console.log('SnackbarAlert opened with message:', message);
      }
    }, [open, message]);

    return open ? (
      <div data-testid="snackbar-alert" role="alert">
        {message}
      </div>
    ) : null;
  },
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
  </BrowserRouter>
);

describe('SearchField', () => {
  const mockSetIsExpanded = vi.fn();

  beforeEach(() => {
    mockNavigate.mockClear();
    mockSetIsExpanded.mockClear();
  });

  it('should show search icon button when not expanded', () => {
    render(
      <TestWrapper>
        <SearchField isExpanded={false} setIsExpanded={mockSetIsExpanded} />
      </TestWrapper>
    );

    // The expand button should be present
    const expandButton = screen.getByRole('button');
    expect(expandButton).toBeInTheDocument();
  });

  it('should expand search field when expand button is clicked', () => {
    render(
      <TestWrapper>
        <SearchField isExpanded={false} setIsExpanded={mockSetIsExpanded} />
      </TestWrapper>
    );

    const expandButton = screen.getByRole('button');
    fireEvent.click(expandButton);

    expect(mockSetIsExpanded).toHaveBeenCalledWith(true);
  });

  it('should show search input when expanded', () => {
    render(
      <TestWrapper>
        <SearchField isExpanded={true} setIsExpanded={mockSetIsExpanded} />
      </TestWrapper>
    );

    // Updated label
    const searchInput = screen.getByLabelText(
      'Search by PayRef / Block Height / Block Hash'
    );
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute(
      'placeholder',
      'Enter 64 character hash or block height'
    );
  });

  it('should update query and lowercase when user types in input', () => {
    render(
      <TestWrapper>
        <SearchField isExpanded={true} setIsExpanded={mockSetIsExpanded} />
      </TestWrapper>
    );

    const searchInput = screen.getByLabelText(
      'Search by PayRef / Block Height / Block Hash'
    );
    fireEvent.change(searchInput, { target: { value: 'ABC123' } });
    expect(searchInput).toHaveValue('abc123');
  });

  it('should navigate to block page when valid height is entered', () => {
    render(
      <TestWrapper>
        <SearchField isExpanded={true} setIsExpanded={mockSetIsExpanded} />
      </TestWrapper>
    );

    const searchInput = screen.getByLabelText(
      'Search by PayRef / Block Height / Block Hash'
    );
    fireEvent.change(searchInput, { target: { value: '12345' } });
    fireEvent.keyPress(searchInput, {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });

    expect(mockNavigate).toHaveBeenCalledWith('/blocks/12345');
    expect(mockSetIsExpanded).toHaveBeenCalledWith(false);
  });

  it('should navigate to search page when valid hash is entered', () => {
    const validHash =
      '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    render(
      <TestWrapper>
        <SearchField isExpanded={true} setIsExpanded={mockSetIsExpanded} />
      </TestWrapper>
    );

    const searchInput = screen.getByLabelText(
      'Search by PayRef / Block Height / Block Hash'
    );
    fireEvent.change(searchInput, {
      target: { value: validHash.toUpperCase() },
    });
    fireEvent.keyPress(searchInput, {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });

    expect(mockNavigate).toHaveBeenCalledWith(`/search?hash=${validHash}`);
    expect(mockSetIsExpanded).toHaveBeenCalledWith(false);
  });

  it('should show error snackbar for invalid query', async () => {
    render(
      <TestWrapper>
        <SearchField isExpanded={true} setIsExpanded={mockSetIsExpanded} />
      </TestWrapper>
    );

    const searchInput = screen.getByLabelText(
      'Search by PayRef / Block Height / Block Hash'
    );
    fireEvent.change(searchInput, { target: { value: 'invalid-query' } });
    fireEvent.keyPress(searchInput, {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });

    await waitFor(() => {
      expect(screen.getByTestId('snackbar-alert')).toBeInTheDocument();
      expect(screen.getByText('Invalid query')).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockSetIsExpanded).toHaveBeenCalledWith(false);
  });

  it('should show error for negative height', async () => {
    render(
      <TestWrapper>
        <SearchField isExpanded={true} setIsExpanded={mockSetIsExpanded} />
      </TestWrapper>
    );

    const searchInput = screen.getByLabelText(
      'Search by PayRef / Block Height / Block Hash'
    );
    fireEvent.change(searchInput, { target: { value: '-1' } });
    fireEvent.keyPress(searchInput, {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });

    await waitFor(() => {
      expect(screen.getByTestId('snackbar-alert')).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should show error for hash with incorrect length', async () => {
    render(
      <TestWrapper>
        <SearchField isExpanded={true} setIsExpanded={mockSetIsExpanded} />
      </TestWrapper>
    );

    const searchInput = screen.getByLabelText(
      'Search by PayRef / Block Height / Block Hash'
    );
    fireEvent.change(searchInput, { target: { value: 'abcdef1234567890' } }); // Invalid - too short for hash
    fireEvent.keyPress(searchInput, {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });

    await waitFor(() => {
      expect(screen.getByTestId('snackbar-alert')).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should close search field when empty query is submitted', () => {
    render(
      <TestWrapper>
        <SearchField isExpanded={true} setIsExpanded={mockSetIsExpanded} />
      </TestWrapper>
    );

    const searchInput = screen.getByLabelText(
      'Search by PayRef / Block Height / Block Hash'
    );
    fireEvent.keyPress(searchInput, {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });

    expect(mockSetIsExpanded).toHaveBeenCalledWith(false);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should show close button when input is empty', () => {
    render(
      <TestWrapper>
        <SearchField isExpanded={true} setIsExpanded={mockSetIsExpanded} />
      </TestWrapper>
    );

    // The close button should be visible when input is empty
    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();
  });

  it('should show search button when input has value', () => {
    render(
      <TestWrapper>
        <SearchField isExpanded={true} setIsExpanded={mockSetIsExpanded} />
      </TestWrapper>
    );

    const searchInput = screen.getByLabelText(
      'Search by PayRef / Block Height / Block Hash'
    );
    fireEvent.change(searchInput, { target: { value: '12345' } });

    // The search button should be visible when input has value
    const searchButton = screen.getByRole('button');
    expect(searchButton).toBeInTheDocument();
  });

  it('should close search field when close button is clicked', () => {
    render(
      <TestWrapper>
        <SearchField isExpanded={true} setIsExpanded={mockSetIsExpanded} />
      </TestWrapper>
    );

    // Click the close button (when input is empty)
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(mockSetIsExpanded).toHaveBeenCalledWith(false);
  });

  it('should perform search when search button is clicked', () => {
    render(
      <TestWrapper>
        <SearchField isExpanded={true} setIsExpanded={mockSetIsExpanded} />
      </TestWrapper>
    );

    const searchInput = screen.getByLabelText(
      'Search by PayRef / Block Height / Block Hash'
    );
    fireEvent.change(searchInput, { target: { value: '12345' } });

    const searchButton = screen.getByRole('button');
    fireEvent.click(searchButton);

    expect(mockNavigate).toHaveBeenCalledWith('/blocks/12345');
    expect(mockSetIsExpanded).toHaveBeenCalledWith(false);
  });

  it('should validate block height as zero', () => {
    render(
      <TestWrapper>
        <SearchField isExpanded={true} setIsExpanded={mockSetIsExpanded} />
      </TestWrapper>
    );

    const searchInput = screen.getByLabelText(
      'Search by PayRef / Block Height / Block Hash'
    );
    fireEvent.change(searchInput, { target: { value: '0' } });
    fireEvent.keyPress(searchInput, {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });

    expect(mockNavigate).toHaveBeenCalledWith('/blocks/0');
  });

  it('should clear input after successful search', () => {
    render(
      <TestWrapper>
        <SearchField isExpanded={true} setIsExpanded={mockSetIsExpanded} />
      </TestWrapper>
    );

    const searchInput = screen.getByLabelText(
      'Search by PayRef / Block Height / Block Hash'
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: '12345' } });
    fireEvent.keyPress(searchInput, {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });

    // After navigation, input should be cleared
    expect(searchInput.value).toBe('');
  });

  it('should clear input after invalid search', async () => {
    render(
      <TestWrapper>
        <SearchField isExpanded={true} setIsExpanded={mockSetIsExpanded} />
      </TestWrapper>
    );

    const searchInput = screen.getByLabelText(
      'Search by PayRef / Block Height / Block Hash'
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'invalid' } });
    fireEvent.keyPress(searchInput, {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });

    await waitFor(() => {
      expect(searchInput.value).toBe('');
    });
  });

  it('should handle other key presses without action', () => {
    render(
      <TestWrapper>
        <SearchField isExpanded={true} setIsExpanded={mockSetIsExpanded} />
      </TestWrapper>
    );

    const searchInput = screen.getByLabelText(
      'Search by PayRef / Block Height / Block Hash'
    );
    fireEvent.change(searchInput, { target: { value: '12345' } });
    fireEvent.keyPress(searchInput, { key: 'Escape' });

    // Should not navigate on non-Enter key press
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
