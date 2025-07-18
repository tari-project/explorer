import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import InnerHeading from '../InnerHeading';
import { lightTheme } from '@theme/themes';

// Test wrapper with theme
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
);

describe('InnerHeading', () => {
  it('should render children text inside StyledTypography', () => {
    render(
      <TestWrapper>
        <InnerHeading>Test Heading</InnerHeading>
      </TestWrapper>
    );
    const heading = screen.getByText('Test Heading');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName.toLowerCase()).toBe('p'); // MUI Typography defaults to span
    expect(heading).toHaveStyle({
      fontFamily: "'DrukHeavy', sans-serif",
      textTransform: 'uppercase',
    });
  });

  it('should render with border bottom by default', () => {
    const { container } = render(
      <TestWrapper>
        <InnerHeading>Test Heading</InnerHeading>
      </TestWrapper>
    );
    const divider = container.querySelector('hr');
    expect(divider).toBeInTheDocument();
  });

  it('should not render border bottom when borderBottom is false', () => {
    const { container } = render(
      <TestWrapper>
        <InnerHeading borderBottom={false}>Test Heading</InnerHeading>
      </TestWrapper>
    );
    const divider = container.querySelector('hr');
    expect(divider).not.toBeInTheDocument();
  });

  it('should render icon inside a Stack when provided', () => {
    const testIcon = <span data-testid="test-icon">🎯</span>;
    render(
      <TestWrapper>
        <InnerHeading icon={testIcon}>Test Heading</InnerHeading>
      </TestWrapper>
    );
    const iconStack = screen.getByTestId('test-icon').parentElement;
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('🎯')).toBeInTheDocument();
    // The icon should be inside a Stack (div with role presentation)
    expect(iconStack?.tagName.toLowerCase()).toBe('div');
  });

  it('should not render icon section when icon is not provided', () => {
    render(
      <TestWrapper>
        <InnerHeading>Test Heading</InnerHeading>
      </TestWrapper>
    );
    expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
  });

  it('should render multiple children inside StyledTypography', () => {
    render(
      <TestWrapper>
        <InnerHeading>
          <span>First</span>
          <span>Second</span>
        </InnerHeading>
      </TestWrapper>
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('should render with complex icon element inside Stack', () => {
    const complexIcon = (
      <div data-testid="complex-icon">
        <span>Icon Text</span>
        <button>Icon Button</button>
      </div>
    );
    render(
      <TestWrapper>
        <InnerHeading icon={complexIcon}>Test Heading</InnerHeading>
      </TestWrapper>
    );
    expect(screen.getByTestId('complex-icon')).toBeInTheDocument();
    expect(screen.getByText('Icon Text')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Icon Button' })
    ).toBeInTheDocument();
  });

  it('should handle empty children', () => {
    const { container } = render(
      <TestWrapper>
        <InnerHeading>{''}</InnerHeading>
      </TestWrapper>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with both icon and borderBottom disabled', () => {
    const testIcon = <span data-testid="no-border-icon">📊</span>;
    const { container } = render(
      <TestWrapper>
        <InnerHeading icon={testIcon} borderBottom={false}>
          No Border Heading
        </InnerHeading>
      </TestWrapper>
    );
    expect(screen.getByText('No Border Heading')).toBeInTheDocument();
    expect(screen.getByTestId('no-border-icon')).toBeInTheDocument();
    const divider = container.querySelector('hr');
    expect(divider).not.toBeInTheDocument();
  });
});
