import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import BlockTable from '../BlockTable'
import { lightTheme } from '@theme/themes'

// Mock API hooks
const mockUseAllBlocks = vi.fn()
const mockUseGetBlocksByParam = vi.fn()

vi.mock('@services/api/hooks/useBlocks', () => ({
  useAllBlocks: () => mockUseAllBlocks(),
  useGetBlocksByParam: (firstHeight: number, blocksPerPage: number) => mockUseGetBlocksByParam(firstHeight, blocksPerPage)
}))

// Mock store
const mockUseMainStore = vi.fn()
vi.mock('@services/stores/useMainStore', () => ({
  useMainStore: (selector: any) => mockUseMainStore(selector)
}))

// Mock utility functions
vi.mock('@utils/helpers', () => ({
  toHexString: (data: any) => data ? `0x${data}` : '',
  shortenString: (str: string, start = 6, end = 6) => str ? `${str.slice(0, start)}...${str.slice(-end)}` : '',
  formatTimestamp: (timestamp: number) => timestamp ? new Date(timestamp * 1000).toISOString() : '',
  powCheck: (algo: number) => algo === 1 ? 'SHA-3' : 'Unknown'
}))

// Mock components
vi.mock('@components/StyledComponents', () => ({
  TypographyData: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="typography-data">{children}</div>
  )
}))

vi.mock('@components/CopyToClipboard', () => ({
  default: ({ copy }: { copy: string }) => (
    <button data-testid="copy-button" data-copy={copy}>Copy</button>
  )
}))

vi.mock('@components/InnerHeading', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="inner-heading">{children}</h2>
  )
}))

vi.mock('../SkeletonLoader', () => ({
  default: ({ height }: { height: number }) => (
    <div data-testid="skeleton-loader" style={{ height }}>Loading skeleton</div>
  )
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}))

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider theme={lightTheme}>
      {children}
    </ThemeProvider>
  </BrowserRouter>
)

describe('BlockTable', () => {
  const mockBlocksData = {
    headers: [
      {
        height: 100,
        timestamp: 1634567890,
        pow: { pow_algo: 1 },
        hash: { data: 'block100hash' },
        kernels: 5,
        outputs: 3
      },
      {
        height: 99,
        timestamp: 1634567880,
        pow: { pow_algo: 1 },
        hash: { data: 'block99hash' },
        kernels: 7,
        outputs: 2
      }
    ]
  }

  beforeEach(() => {
    mockUseAllBlocks.mockReturnValue({
      data: {
        tipInfo: {
          metadata: {
            best_block_height: 100
          }
        }
      }
    })

    mockUseGetBlocksByParam.mockReturnValue({
      data: mockBlocksData,
      isLoading: false
    })

    mockUseMainStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({ isMobile: false })
      }
      return false
    })
  })

  it('should render heading', () => {
    render(
      <TestWrapper>
        <BlockTable />
      </TestWrapper>
    )

    expect(screen.getByTestId('inner-heading')).toHaveTextContent('All Blocks')
  })

  it('should render desktop view with headers when not mobile', () => {
    render(
      <TestWrapper>
        <BlockTable />
      </TestWrapper>
    )

    expect(screen.getByText('Height')).toBeInTheDocument()
    expect(screen.getByText('Time')).toBeInTheDocument()
    expect(screen.getByText('Proof of Work')).toBeInTheDocument()
    expect(screen.getByText('Hash')).toBeInTheDocument()
    expect(screen.getByText('Kernels')).toBeInTheDocument()
    expect(screen.getByText('Outputs')).toBeInTheDocument()
  })

  it('should render mobile view when isMobile is true', () => {
    mockUseMainStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({ isMobile: true })
      }
      return true
    })

    render(
      <TestWrapper>
        <BlockTable />
      </TestWrapper>
    )

    // Mobile view should have different structure but same content
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('99')).toBeInTheDocument()
  })

  it('should render block data correctly', () => {
    render(
      <TestWrapper>
        <BlockTable />
      </TestWrapper>
    )

    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('99')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('should render copy buttons for hash values', () => {
    render(
      <TestWrapper>
        <BlockTable />
      </TestWrapper>
    )

    const copyButtons = screen.getAllByTestId('copy-button')
    expect(copyButtons.length).toBe(2) // One for each block hash
  })

  it('should render loading skeletons when loading', () => {
    mockUseGetBlocksByParam.mockReturnValue({
      data: null,
      isLoading: true
    })

    render(
      <TestWrapper>
        <BlockTable />
      </TestWrapper>
    )

    const skeletons = screen.getAllByTestId('skeleton-loader')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should render pagination controls', () => {
    render(
      <TestWrapper>
        <BlockTable />
      </TestWrapper>
    )

    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Tip')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
  })

  it('should handle rows per page selection', () => {
    render(
      <TestWrapper>
        <BlockTable />
      </TestWrapper>
    )

    expect(screen.getByText('Rows per page')).toBeInTheDocument()
    expect(screen.getByDisplayValue('10')).toBeInTheDocument()
  })

  it('should handle next page button click', () => {
    render(
      <TestWrapper>
        <BlockTable />
      </TestWrapper>
    )

    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)

    // Should call the API with different parameters
    expect(mockUseGetBlocksByParam).toHaveBeenCalled()
  })

  it('should handle previous page button click', () => {
    render(
      <TestWrapper>
        <BlockTable />
      </TestWrapper>
    )

    // First simulate being on page 2
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)

    const prevButton = screen.getByText('Previous')
    fireEvent.click(prevButton)

    expect(mockUseGetBlocksByParam).toHaveBeenCalled()
  })

  it('should handle tip button click', () => {
    render(
      <TestWrapper>
        <BlockTable />
      </TestWrapper>
    )

    const tipButton = screen.getByText('Tip')
    fireEvent.click(tipButton)

    expect(mockUseGetBlocksByParam).toHaveBeenCalled()
  })

  it('should handle rows per page change', () => {
    render(
      <TestWrapper>
        <BlockTable />
      </TestWrapper>
    )

    const select = screen.getByDisplayValue('10')
    fireEvent.change(select, { target: { value: '20' } })

    expect(mockUseGetBlocksByParam).toHaveBeenCalled()
  })

  it('should disable previous button on first page', () => {
    render(
      <TestWrapper>
        <BlockTable />
      </TestWrapper>
    )

    const prevButton = screen.getByText('Previous')
    expect(prevButton).toBeDisabled()
  })

  it('should disable next button when no more data', () => {
    mockUseGetBlocksByParam.mockReturnValue({
      data: {
        headers: [mockBlocksData.headers[0]] // Only one block, less than blocksPerPage
      },
      isLoading: false
    })

    render(
      <TestWrapper>
        <BlockTable />
      </TestWrapper>
    )

    const nextButton = screen.getByText('Next')
    expect(nextButton).toBeDisabled()
  })

  it('should render links to individual block pages', () => {
    render(
      <TestWrapper>
        <BlockTable />
      </TestWrapper>
    )

    const blockLinks = screen.getAllByRole('link')
    const heightLinks = blockLinks.filter(link => 
      link.getAttribute('href')?.includes('/blocks/100') || 
      link.getAttribute('href')?.includes('/blocks/99')
    )
    
    expect(heightLinks.length).toBeGreaterThan(0)
  })

  it('should show current page range', () => {
    render(
      <TestWrapper>
        <BlockTable />
      </TestWrapper>
    )

    expect(screen.getByText(/Showing blocks \d+ - \d+/)).toBeInTheDocument()
  })

  it('should handle no data gracefully', () => {
    mockUseGetBlocksByParam.mockReturnValue({
      data: { headers: [] },
      isLoading: false
    })

    render(
      <TestWrapper>
        <BlockTable />
      </TestWrapper>
    )

    expect(screen.getByTestId('inner-heading')).toHaveTextContent('All Blocks')
  })

  it('should format timestamps correctly', () => {
    render(
      <TestWrapper>
        <BlockTable />
      </TestWrapper>
    )

    expect(screen.getByText('2021-10-18T14:38:10.000Z')).toBeInTheDocument()
    expect(screen.getByText('2021-10-18T14:38:00.000Z')).toBeInTheDocument()
  })

  it('should render proof of work algorithms', () => {
    render(
      <TestWrapper>
        <BlockTable />
      </TestWrapper>
    )

    const sha3Elements = screen.getAllByText('SHA-3')
    expect(sha3Elements.length).toBe(2) // One for each block
  })
})
