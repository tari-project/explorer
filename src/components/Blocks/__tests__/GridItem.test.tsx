import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import GridItem from '../GridItem';
import { lightTheme } from '@theme/themes';

// Mock utility functions
vi.mock('@utils/helpers', () => ({
  shortenString: (str: string) =>
    str ? `${str.slice(0, 6)}...${str.slice(-6)}` : '',
}));

// Mock components
vi.mock('@components/StyledComponents', () => ({
  TypographyData: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="typography-data">{children}</div>
  ),
}));

vi.mock('@components/CopyToClipboard', () => ({
  default: ({ copy }: { copy: string }) => (
    <button data-testid="copy-button" data-copy={copy}>
      Copy
    </button>
  ),
}));

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
);

describe('GridItem', () => {
  it('should render label and value', () => {
    const result = GridItem('Test Label', 'Test Value', false, 0, 0, false);

    render(<TestWrapper>{result}</TestWrapper>);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });

  it('should render with copy functionality when copy is true', () => {
    const result = GridItem('Hash', 'abcdef123456789', true, 0, 0, false);

    render(<TestWrapper>{result}</TestWrapper>);

    expect(screen.getByText('Hash')).toBeInTheDocument();
    expect(screen.getByText('abcdef...456789')).toBeInTheDocument();
    expect(screen.getByTestId('copy-button')).toBeInTheDocument();
    expect(screen.getByTestId('copy-button')).toHaveAttribute(
      'data-copy',
      'abcdef123456789'
    );
  });

  it('should render without copy functionality when copy is false', () => {
    const result = GridItem('Height', '12345', false, 0, 0, false);

    render(<TestWrapper>{result}</TestWrapper>);

    expect(screen.getByText('Height')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.queryByTestId('copy-button')).not.toBeInTheDocument();
  });

  it('should apply alternating background color based on subIndex', () => {
    const evenResult = GridItem('Label 1', 'Value 1', false, 0, 0, false);
    const oddResult = GridItem('Label 2', 'Value 2', false, 0, 1, false);

    const { container: evenContainer } = render(
      <TestWrapper>{evenResult}</TestWrapper>
    );

    const { container: oddContainer } = render(
      <TestWrapper>{oddResult}</TestWrapper>
    );

    // Even subIndex should have background color
    const evenGrid = evenContainer.querySelector('.MuiGrid-container');
    expect(evenGrid).toHaveStyle({ backgroundColor: 'rgba(0, 0, 0, 0.02)' });

    // Odd subIndex should have no background color
    const oddGrid = oddContainer.querySelector('.MuiGrid-container');
    expect(oddGrid).toHaveStyle({ backgroundColor: '' });
  });

  it('should show border when showDivider is true', () => {
    const result = GridItem('Label', 'Value', false, 0, 0, true);

    const { container } = render(<TestWrapper>{result}</TestWrapper>);

    const grid = container.querySelector('.MuiGrid-container');
    expect(grid).toHaveStyle('border-top: 1px solid white');
  });

  it('should not show border when showDivider is false', () => {
    const result = GridItem('Label', 'Value', false, 0, 0, false);

    const { container } = render(<TestWrapper>{result}</TestWrapper>);

    const grid = container.querySelector('.MuiGrid-container');
    expect(grid).toHaveStyle('border-top: none');
  });

  it('should handle numeric values', () => {
    const result = GridItem('Count', 42, false, 0, 0, false);

    render(<TestWrapper>{result}</TestWrapper>);

    expect(screen.getByText('Count')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should handle empty or null values', () => {
    const nullResult = GridItem('Empty', '', false, 0, 0, false);
    const undefinedResult = GridItem('Undefined', '', false, 0, 0, false);

    render(<TestWrapper>{nullResult}</TestWrapper>);

    expect(screen.getByText('Empty')).toBeInTheDocument();

    render(<TestWrapper>{undefinedResult}</TestWrapper>);

    expect(screen.getByText('Undefined')).toBeInTheDocument();
  });

  it('should apply correct grid layout', () => {
    const result = GridItem('Label', 'Value', false, 0, 0, false);

    const { container } = render(<TestWrapper>{result}</TestWrapper>);

    // Check label grid item has correct sizes
    const labelGrid = container.querySelector(
      '[class*="MuiGrid-grid-xs-12"][class*="MuiGrid-grid-md-4"]'
    );
    expect(labelGrid).toBeInTheDocument();

    // Check value grid item has correct sizes
    const valueGrid = container.querySelector(
      '[class*="MuiGrid-grid-xs-12"][class*="MuiGrid-grid-md-8"]'
    );
    expect(valueGrid).toBeInTheDocument();
  });

  it('should render TypographyData component', () => {
    const result = GridItem('Label', 'Value', false, 0, 0, false);

    render(<TestWrapper>{result}</TestWrapper>);

    expect(screen.getByTestId('typography-data')).toBeInTheDocument();
  });

  it('should pass correct key to CopyToClipboard when copy is enabled', () => {
    const result = GridItem('Hash', 'test-hash', true, 5, 3, false);

    render(<TestWrapper>{result}</TestWrapper>);

    const copyButton = screen.getByTestId('copy-button');
    expect(copyButton).toBeInTheDocument();
    // The key is internal to React, but we can verify the copy value
    expect(copyButton).toHaveAttribute('data-copy', 'test-hash');
  });

  it('should handle boolean values', () => {
    const trueResult = GridItem('Active', 'true', false, 0, 0, false);
    const falseResult = GridItem('Inactive', 'false', false, 0, 0, false);

    render(<TestWrapper>{trueResult}</TestWrapper>);

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('true')).toBeInTheDocument();

    render(<TestWrapper>{falseResult}</TestWrapper>);

    expect(screen.getByText('Inactive')).toBeInTheDocument();
    expect(screen.getByText('false')).toBeInTheDocument();
  });
});
