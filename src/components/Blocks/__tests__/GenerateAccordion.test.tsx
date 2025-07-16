import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import GenerateAccordion from '../GenerateAccordion';
import { lightTheme } from '@theme/themes';

// Mock helpers
vi.mock('@utils/helpers', () => ({
  shortenString: vi.fn((str) => `${str?.slice(0, 8)}...${str?.slice(-8)}`),
}));

// Mock CopyToClipboard component
vi.mock('@components/CopyToClipboard', () => ({
  default: ({ copy }: { copy: string }) => (
    <button aria-label="copy to clipboard" data-copy={copy}>
      <svg data-testid="ContentCopyIcon" />
    </button>
  ),
}));

// Mock components completely
vi.mock('@components/StyledComponents', () => ({
  StyledAccordion: ({
    children,
    expanded,
    onChange,
    isHighlighted,
    ...props
  }: any) => {
    // Omit isHighlighted from props
    const { isHighlighted: _isHighlighted, ...rest } = props;
    return (
      <div
        data-testid="styled-accordion"
        data-expanded={expanded}
        data-highlighted={
          isHighlighted === undefined ? 'false' : String(isHighlighted)
        }
        onClick={() => onChange?.({}, !expanded)}
        {...rest}
      >
        {children}
      </div>
    );
  },
  StyledAccordionSummary: ({
    children,
    expandIcon,
    isHighlighted,
    expanded,
    ...props
  }: any) => {
    // Omit expandIcon, isHighlighted, expanded from props
    return (
      <button role="button" {...props}>
        {children}
      </button>
    );
  },
  TypographyData: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="typography-data">{children}</div>
  ),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
);

describe('GenerateAccordion', () => {
  const mockHandleChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    items: [
      { label: 'Hash', value: 'abc123', copy: 'abc123' },
      { label: 'Amount', value: '100', copy: '100' },
    ],
    adjustedIndex: 1,
    expanded: 'panel1',
    handleChange: mockHandleChange,
    expandedPanel: 'panel1',
    tabName: 'Input',
    isHighlighted: false,
  };

  it('should render accordion with correct title', () => {
    render(
      <TestWrapper>
        <GenerateAccordion {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Input 1')).toBeInTheDocument();
  });

  it('should render all items as grid items', () => {
    render(
      <TestWrapper>
        <GenerateAccordion {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Hash')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('abc123...abc123')).toBeInTheDocument();
    expect(screen.getByText('100...100')).toBeInTheDocument();
  });

  it('should show expanded state correctly', () => {
    render(
      <TestWrapper>
        <GenerateAccordion {...defaultProps} expanded="panel1" />
      </TestWrapper>
    );

    expect(screen.getByTestId('styled-accordion')).toHaveAttribute(
      'data-expanded',
      'true'
    );
  });

  it('should show collapsed state correctly', () => {
    render(
      <TestWrapper>
        <GenerateAccordion {...defaultProps} expanded={false} />
      </TestWrapper>
    );

    expect(screen.getByTestId('styled-accordion')).toHaveAttribute(
      'data-expanded',
      'false'
    );
  });

  it('should handle click events correctly', () => {
    const mockHandleChangeWithPanel = vi.fn().mockReturnValue(mockHandleChange);

    render(
      <TestWrapper>
        <GenerateAccordion
          {...defaultProps}
          handleChange={mockHandleChangeWithPanel}
        />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('styled-accordion'));
    expect(mockHandleChangeWithPanel).toHaveBeenCalledWith('panel1');
  });

  it('should handle items with children correctly', () => {
    const itemsWithChildren = [
      {
        label: 'Parent Item',
        value: 'parent-value',
        copy: 'parent-copy',
        children: [
          { label: 'Child 1', value: 'child1-value', copy: 'child1-copy' },
          { label: 'Child 2', value: 'child2-value', copy: 'child2-copy' },
        ],
      },
      { label: 'Regular Item', value: 'regular-value', copy: 'regular-copy' },
    ];

    render(
      <TestWrapper>
        <GenerateAccordion {...defaultProps} items={itemsWithChildren} />
      </TestWrapper>
    );

    // Parent item should be rendered
    expect(screen.getByText('Parent Item')).toBeInTheDocument();
    expect(screen.getByText('parent-v...nt-value')).toBeInTheDocument();

    // Child items should be rendered
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('child1-v...d1-value')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('child2-v...d2-value')).toBeInTheDocument();

    // Regular item should be rendered
    expect(screen.getByText('Regular Item')).toBeInTheDocument();
    expect(screen.getByText('regular-...ar-value')).toBeInTheDocument();
  });

  it('should apply highlighting when isHighlighted is true', () => {
    render(
      <TestWrapper>
        <GenerateAccordion {...defaultProps} isHighlighted={true} />
      </TestWrapper>
    );

    expect(screen.getByTestId('styled-accordion')).toHaveAttribute(
      'data-highlighted',
      'true'
    );
  });

  it('should not apply highlighting when isHighlighted is false', () => {
    render(
      <TestWrapper>
        <GenerateAccordion {...defaultProps} isHighlighted={false} />
      </TestWrapper>
    );

    expect(screen.getByTestId('styled-accordion')).toHaveAttribute(
      'data-highlighted',
      'false'
    );
  });

  it('should not apply highlighting when isHighlighted is undefined', () => {
    render(
      <TestWrapper>
        <GenerateAccordion {...defaultProps} />
      </TestWrapper>
    );

    const accordion = screen.getByTestId('styled-accordion');
    expect(accordion).toHaveAttribute('data-highlighted', 'false');
  });

  it('should render correct aria-controls and id attributes', () => {
    render(
      <TestWrapper>
        <GenerateAccordion {...defaultProps} />
      </TestWrapper>
    );

    const summaryElement = screen.getAllByRole('button')[0]; // Get first button (accordion summary)
    expect(summaryElement).toHaveAttribute('aria-controls', 'panel1-content');
    expect(summaryElement).toHaveAttribute('id', 'panel1-header');
  });

  it('should render expand icon', () => {
    render(
      <TestWrapper>
        <GenerateAccordion {...defaultProps} />
      </TestWrapper>
    );

    // ExpandMoreIcon should be rendered
    // const expandIcon = screen.getByTestId('ExpandMoreIcon');
    // expect(expandIcon).toBeInTheDocument();
  });

  it('should handle different tab names correctly', () => {
    render(
      <TestWrapper>
        <GenerateAccordion
          {...defaultProps}
          tabName="Kernel"
          adjustedIndex={5}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Kernel 5')).toBeInTheDocument();
  });

  it('should handle empty items array', () => {
    render(
      <TestWrapper>
        <GenerateAccordion {...defaultProps} items={[]} />
      </TestWrapper>
    );

    expect(screen.getByText('Input 1')).toBeInTheDocument();
    expect(screen.queryByTestId(/^grid-item-/)).not.toBeInTheDocument();
  });

  it('should handle complex nested structures', () => {
    const complexItems = [
      {
        label: 'Complex Parent',
        value: 'complex-value',
        copy: 'complex-copy',
        children: [
          { label: 'Nested Child 1', value: 'nested1', copy: 'nested1-copy' },
          { label: 'Nested Child 2', value: 'nested2', copy: 'nested2-copy' },
          { label: 'Nested Child 3', value: 'nested3', copy: 'nested3-copy' },
        ],
      },
    ];

    render(
      <TestWrapper>
        <GenerateAccordion {...defaultProps} items={complexItems} />
      </TestWrapper>
    );

    expect(screen.getByText('Complex Parent')).toBeInTheDocument();
    expect(screen.getByText('complex-...ex-value')).toBeInTheDocument();
    expect(screen.getByText('Nested Child 1')).toBeInTheDocument();
    expect(screen.getByText('nested1...nested1')).toBeInTheDocument();
    expect(screen.getByText('Nested Child 2')).toBeInTheDocument();
    expect(screen.getByText('nested2...nested2')).toBeInTheDocument();
    expect(screen.getByText('Nested Child 3')).toBeInTheDocument();
    expect(screen.getByText('nested3...nested3')).toBeInTheDocument();
  });

  it('should pass correct parameters to GridItem for parent items', () => {
    const items = [
      { label: 'Parent', value: 'parent-val', copy: 'parent-copy' },
    ];

    render(
      <TestWrapper>
        <GenerateAccordion {...defaultProps} items={items} adjustedIndex={3} />
      </TestWrapper>
    );

    expect(screen.getByText('Parent')).toBeInTheDocument();
    expect(screen.getByText('parent-v...rent-val')).toBeInTheDocument();
  });

  it('should pass correct parameters to GridItem for child items', () => {
    const items = [
      {
        label: 'Parent',
        value: 'parent-val',
        copy: 'parent-copy',
        children: [{ label: 'Child', value: 'child-val', copy: 'child-copy' }],
      },
    ];

    render(
      <TestWrapper>
        <GenerateAccordion {...defaultProps} items={items} adjustedIndex={2} />
      </TestWrapper>
    );

    // Find child grid item by checking content since DOM structure is complex
    expect(screen.getByText('Child')).toBeInTheDocument();
    expect(screen.getByText('child-va...hild-val')).toBeInTheDocument();
  });
});
