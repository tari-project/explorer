import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import BlockHeader from '../BlockHeader';
import { lightTheme } from '@theme/themes';

interface GradientPaperProps {
  children: React.ReactNode;
  [key: string]: unknown;
}

// Mock react-router-dom
const mockUseLocation = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => mockUseLocation(),
  };
});

// Mock API hooks
const mockUseGetBlockByHeightOrHash = vi.fn();
const mockUseAllBlocks = vi.fn();

vi.mock('@services/api/hooks/useBlocks', () => ({
  useGetBlockByHeightOrHash: () => mockUseGetBlockByHeightOrHash(),
  useAllBlocks: () => mockUseAllBlocks(),
}));

// Mock helpers
vi.mock('@utils/helpers', () => ({
  shortenString: (str: string) => `${str.slice(0, 6)}...${str.slice(-6)}`,
}));

// Mock GradientPaper component
vi.mock('@components/StyledComponents', () => ({
  GradientPaper: ({ children, ...props }: GradientPaperProps) => (
    <div {...props}>{children}</div>
  ),
}));

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
  </BrowserRouter>
);

describe('BlockHeader', () => {
  beforeEach(() => {
    mockUseLocation.mockReturnValue({
      pathname: '/blocks/123',
    });
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: null,
      isFetching: false,
      isError: false,
    });
    mockUseAllBlocks.mockReturnValue({
      data: {
        tipInfo: {
          metadata: {
            best_block_height: 1000,
          },
        },
      },
    });
  });

  it('should render block header with height when data is available', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: {
        height: 123,
        prevLink: '/blocks/122',
        nextLink: '/blocks/124',
      },
      isFetching: false,
      isError: false,
    });

    render(
      <TestWrapper>
        <BlockHeader />
      </TestWrapper>
    );

    expect(screen.getByText('Block at Height')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('should render searching state when fetching', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: null,
      isFetching: true,
      isError: false,
    });

    render(
      <TestWrapper>
        <BlockHeader />
      </TestWrapper>
    );

    expect(screen.getByText('Searching...')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('should render error state when block not found', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: null,
      isFetching: false,
      isError: true,
    });

    render(
      <TestWrapper>
        <BlockHeader />
      </TestWrapper>
    );

    expect(screen.getByText('Block not found')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('should shorten long hash strings', () => {
    const longHash = 'a'.repeat(64);
    mockUseLocation.mockReturnValue({
      pathname: `/blocks/${longHash}`,
    });

    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: null,
      isFetching: false,
      isError: false,
    });

    render(
      <TestWrapper>
        <BlockHeader />
      </TestWrapper>
    );

    expect(screen.getByText('aaaaaa...aaaaaa')).toBeInTheDocument();
  });

  it('should render navigation buttons', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: {
        height: 123,
        prevLink: '/blocks/122',
        nextLink: '/blocks/124',
      },
      isFetching: false,
      isError: false,
    });

    render(
      <TestWrapper>
        <BlockHeader />
      </TestWrapper>
    );

    expect(screen.getByText('All Blocks')).toBeInTheDocument();
    expect(screen.getByText('Previous Block')).toBeInTheDocument();
    expect(screen.getByText('Tip')).toBeInTheDocument();
    expect(screen.getByText('Next Block')).toBeInTheDocument();
  });

  it('should disable previous button when at block height 0', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: {
        height: 0,
        prevLink: '/blocks/0',
        nextLink: '/blocks/1',
      },
      isFetching: false,
      isError: false,
    });

    render(
      <TestWrapper>
        <BlockHeader />
      </TestWrapper>
    );

    const prevButton = screen.getByText('Previous Block').closest('button') as HTMLButtonElement;
    expect(prevButton).toBeDisabled();
  });

  it('should disable next button when at tip height', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: {
        height: 1000,
        prevLink: '/blocks/999',
        nextLink: '/blocks/1001',
      },
      isFetching: false,
      isError: false,
    });

    render(
      <TestWrapper>
        <BlockHeader />
      </TestWrapper>
    );

    const nextButton = screen.getByText('Next Block').closest('button') as HTMLButtonElement;
    expect(nextButton).toBeDisabled();
  });

  it('should render correct links for navigation', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: {
        height: 123,
        prevLink: '/blocks/122',
        nextLink: '/blocks/124',
      },
      isFetching: false,
      isError: false,
    });

    render(
      <TestWrapper>
        <BlockHeader />
      </TestWrapper>
    );

    expect(screen.getByText('All Blocks').closest('a') as HTMLAnchorElement).toHaveAttribute(
      'href',
      '/blocks/'
    );
    expect(screen.getByText('Previous Block').closest('a') as HTMLAnchorElement).toHaveAttribute(
      'href',
      '/blocks/122'
    );
    expect(screen.getByText('Tip').closest('a') as HTMLAnchorElement).toHaveAttribute(
      'href',
      '/blocks/1000'
    );
    expect(screen.getByText('Next Block').closest('a') as HTMLAnchorElement).toHaveAttribute(
      'href',
      '/blocks/124'
    );
  });

  it('should handle missing tip data gracefully', () => {
    mockUseAllBlocks.mockReturnValue({
      data: null,
    });

    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: {
        height: 123,
        prevLink: '/blocks/122',
        nextLink: '/blocks/124',
      },
      isFetching: false,
      isError: false,
    });

    render(
      <TestWrapper>
        <BlockHeader />
      </TestWrapper>
    );

    expect(screen.getByText('Block at Height')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('should handle missing block data gracefully', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: null,
      isFetching: false,
      isError: false,
    });

    render(
      <TestWrapper>
        <BlockHeader />
      </TestWrapper>
    );

    // Should show the height/hash from URL
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('should render mobile navigation buttons on small screens', () => {
    // Mock mobile breakpoint
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: {
        height: 123,
        prevLink: '/blocks/122',
        nextLink: '/blocks/124',
      },
      isFetching: false,
      isError: false,
    });

    render(
      <TestWrapper>
        <BlockHeader />
      </TestWrapper>
    );

    // Should still render navigation elements
    expect(screen.getByText('All Blocks')).toBeInTheDocument();
    expect(screen.getByText('Tip')).toBeInTheDocument();
  });

  it('should handle edge case of empty pathname', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/blocks/',
    });

    render(
      <TestWrapper>
        <BlockHeader />
      </TestWrapper>
    );

    // Should handle gracefully without crashing
    expect(screen.getByText('All Blocks')).toBeInTheDocument();
  });
});
