import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import Error from '../Error';
import { lightTheme } from '@theme/themes';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
);

describe('Error', () => {
  it('should render error message', () => {
    const errorMessage = 'Something went wrong';

    render(
      <TestWrapper>
        <Error message={errorMessage} />
      </TestWrapper>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should render alert with error severity', () => {
    render(
      <TestWrapper>
        <Error message="Test error" />
      </TestWrapper>
    );

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('MuiAlert-outlinedError');
  });

  it('should render alert with outlined variant', () => {
    render(
      <TestWrapper>
        <Error message="Test error" />
      </TestWrapper>
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('MuiAlert-outlined');
  });

  it('should handle empty message', () => {
    render(
      <TestWrapper>
        <Error message="" />
      </TestWrapper>
    );

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('');
  });

  it('should handle long error messages', () => {
    const longMessage =
      'This is a very long error message that should still be displayed correctly in the alert component without breaking the layout or accessibility features';

    render(
      <TestWrapper>
        <Error message={longMessage} />
      </TestWrapper>
    );

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('should handle special characters in message', () => {
    const specialMessage =
      'Error: Failed to fetch data (404) - {"error": "Not found"}';

    render(
      <TestWrapper>
        <Error message={specialMessage} />
      </TestWrapper>
    );

    expect(screen.getByText(specialMessage)).toBeInTheDocument();
  });

  it('should be accessible with proper ARIA role', () => {
    render(
      <TestWrapper>
        <Error message="Accessibility test" />
      </TestWrapper>
    );

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute('role', 'alert');
  });

  it('should accept String type for message prop', () => {
    // This test ensures the string type works
    const message: string = 'Test message';
    expect(() => {
      render(
        <TestWrapper>
          <Error message={message} />
        </TestWrapper>
      );
    }).not.toThrow();
  });
});
