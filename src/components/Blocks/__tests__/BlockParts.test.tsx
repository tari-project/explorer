import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import BlockParts from '../BlockParts'
import { lightTheme } from '@theme/themes'

// Mock API hooks
const mockUseGetBlockByHeightOrHash = vi.fn()
const mockUseGetPaginatedData = vi.fn()

vi.mock('@services/api/hooks/useBlocks', () => ({
  useGetBlockByHeightOrHash: () => mockUseGetBlockByHeightOrHash(),
  useGetPaginatedData: (blockHeight: string, type: string, startIndex: number, endIndex: number) => 
    mockUseGetPaginatedData(blockHeight, type, startIndex, endIndex)
}))

// Mock components
vi.mock('../GenerateAccordion', () => ({
  default: ({ adjustedIndex, tabName, items }: any) => (
    <div data-testid={`accordion-${adjustedIndex}`}>
      <span data-testid="tab-name">{tabName}</span>
      <span data-testid="adjusted-index">{adjustedIndex}</span>
      <span data-testid="items-count">{items.length}</span>
    </div>
  )
}))

vi.mock('@components/FetchStatusCheck', () => ({
  default: ({ isLoading, isError, errorMessage }: any) => (
    <div data-testid="fetch-status">
      {isLoading && <span data-testid="loading">Loading...</span>}
      {isError && <span data-testid="error">{errorMessage}</span>}
    </div>
  )
}))

vi.mock('@components/InnerHeading', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="inner-heading">{children}</h2>
  )
}))

// Mock data structures  
vi.mock('../Data/Inputs', () => ({
  inputItems: vi.fn((content) => [
    { label: 'Input Hash', value: content.hash || 'test-hash' },
    { label: 'Input Amount', value: content.amount || '100' }
  ])
}))

vi.mock('../Data/Outputs', () => ({
  outputItems: vi.fn((content) => [
    { label: 'Output Hash', value: content.hash || 'test-hash' },
    { label: 'Output Amount', value: content.amount || '200' }
  ])
}))

vi.mock('../Data/Kernels', () => ({
  kernelItems: vi.fn((content) => [
    { label: 'Kernel Hash', value: content.hash || 'test-hash' },
    { label: 'Kernel Signature', value: content.signature || 'test-sig' }
  ])
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

describe('BlockParts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockBlockData = {
    body: {
      inputs_length: 5,
      outputs_length: 10,
      kernels_length: 3
    }
  }

  const mockPaginatedData = {
    body: {
      data: [
        { hash: 'item1-hash', amount: '100' },
        { hash: 'item2-hash', amount: '200' }
      ]
    }
  }

  it('should render inputs with pagination when type is inputs', async () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: mockBlockData
    })
    mockUseGetPaginatedData.mockReturnValue({
      data: mockPaginatedData,
      isFetching: false,
      isError: false
    })

    render(
      <TestWrapper>
        <BlockParts blockHeight="123" type="inputs" itemsPerPage={2} />
      </TestWrapper>
    )

    expect(screen.getByTestId('inner-heading')).toHaveTextContent('Inputs (5)')
    expect(screen.getByTestId('accordion-1')).toBeInTheDocument()
    expect(screen.getByTestId('accordion-2')).toBeInTheDocument()
    
    // Should show pagination for 5 items with 2 per page
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('should render outputs with correct title and count', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: mockBlockData
    })
    mockUseGetPaginatedData.mockReturnValue({
      data: mockPaginatedData,
      isFetching: false,
      isError: false
    })

    render(
      <TestWrapper>
        <BlockParts blockHeight="123" type="outputs" itemsPerPage={5} />
      </TestWrapper>
    )

    expect(screen.getByTestId('inner-heading')).toHaveTextContent('Outputs (10)')
    expect(screen.getAllByTestId(/^accordion-/)).toHaveLength(2)
  })

  it('should render kernels with correct title and count', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: mockBlockData
    })
    mockUseGetPaginatedData.mockReturnValue({
      data: mockPaginatedData,
      isFetching: false,
      isError: false
    })

    render(
      <TestWrapper>
        <BlockParts blockHeight="123" type="kernels" itemsPerPage={5} />
      </TestWrapper>
    )

    expect(screen.getByTestId('inner-heading')).toHaveTextContent('Kernels (3)')
    expect(screen.getAllByTestId(/^accordion-/)).toHaveLength(2)
  })

  it('should show loading state when fetching data', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: mockBlockData
    })
    mockUseGetPaginatedData.mockReturnValue({
      data: null,
      isFetching: true,
      isError: false
    })

    render(
      <TestWrapper>
        <BlockParts blockHeight="123" type="inputs" itemsPerPage={5} />
      </TestWrapper>
    )

    expect(screen.getByTestId('fetch-status')).toBeInTheDocument()
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading...')
  })

  it('should show error state when data fetch fails', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: mockBlockData
    })
    mockUseGetPaginatedData.mockReturnValue({
      data: null,
      isFetching: false,
      isError: true
    })

    render(
      <TestWrapper>
        <BlockParts blockHeight="123" type="inputs" itemsPerPage={5} />
      </TestWrapper>
    )

    expect(screen.getByTestId('fetch-status')).toBeInTheDocument()
    expect(screen.getByTestId('error')).toHaveTextContent('Error')
  })

  it('should handle pagination correctly', async () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: mockBlockData
    })
    mockUseGetPaginatedData.mockReturnValue({
      data: mockPaginatedData,
      isFetching: false,
      isError: false
    })

    render(
      <TestWrapper>
        <BlockParts blockHeight="123" type="inputs" itemsPerPage={2} />
      </TestWrapper>
    )

    // Should have pagination for 5 items with 2 per page = 3 pages
    const pagination = screen.getByRole('navigation')
    expect(pagination).toBeInTheDocument()
    
    // Page 2 button should be present
    const page2Button = screen.getByLabelText('Go to page 2')
    expect(page2Button).toBeInTheDocument()
  })

  it('should not show pagination when all items fit on one page', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: { body: { inputs_length: 2 } }
    })
    mockUseGetPaginatedData.mockReturnValue({
      data: mockPaginatedData,
      isFetching: false,
      isError: false
    })

    render(
      <TestWrapper>
        <BlockParts blockHeight="123" type="inputs" itemsPerPage={5} />
      </TestWrapper>
    )

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('should pass correct data to GenerateAccordion components', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: mockBlockData
    })
    mockUseGetPaginatedData.mockReturnValue({
      data: mockPaginatedData,
      isFetching: false,
      isError: false
    })

    render(
      <TestWrapper>
        <BlockParts blockHeight="123" type="inputs" itemsPerPage={5} />
      </TestWrapper>
    )

    // Check that tab names are correct
    const tabNames = screen.getAllByTestId('tab-name')
    expect(tabNames[0]).toHaveTextContent('Input')
    expect(tabNames[1]).toHaveTextContent('Input')

    // Check that items are passed correctly
    const itemsCounts = screen.getAllByTestId('items-count')
    expect(itemsCounts[0]).toHaveTextContent('2') // 2 items from inputItems mock
    expect(itemsCounts[1]).toHaveTextContent('2')
  })

  it('should handle page changes correctly', async () => {
    let currentStartIndex = 0
    let currentEndIndex = 2

    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: mockBlockData
    })
    mockUseGetPaginatedData.mockImplementation((blockHeight, type, startIndex, endIndex) => {
      currentStartIndex = startIndex
      currentEndIndex = endIndex
      return {
        data: mockPaginatedData,
        isFetching: false,
        isError: false
      }
    })

    render(
      <TestWrapper>
        <BlockParts blockHeight="123" type="inputs" itemsPerPage={2} />
      </TestWrapper>
    )

    // Initially should be page 1 (startIndex 0, endIndex 2)
    expect(currentStartIndex).toBe(0)
    expect(currentEndIndex).toBe(2)

    // Click page 2
    const page2Button = screen.getByLabelText('Go to page 2')
    fireEvent.click(page2Button)

    await waitFor(() => {
      expect(currentStartIndex).toBe(2)
      expect(currentEndIndex).toBe(4)
    })
  })

  it('should handle zero items gracefully', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: { body: { inputs_length: 0 } }
    })
    mockUseGetPaginatedData.mockReturnValue({
      data: { body: { data: [] } },
      isFetching: false,
      isError: false
    })

    render(
      <TestWrapper>
        <BlockParts blockHeight="123" type="inputs" itemsPerPage={5} />
      </TestWrapper>
    )

    expect(screen.getByTestId('inner-heading')).toHaveTextContent('Inputs (0)')
    expect(screen.queryByTestId(/^accordion-/)).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('should handle missing block data gracefully', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: null
    })
    mockUseGetPaginatedData.mockReturnValue({
      data: mockPaginatedData,
      isFetching: false,
      isError: false
    })

    render(
      <TestWrapper>
        <BlockParts blockHeight="123" type="inputs" itemsPerPage={5} />
      </TestWrapper>
    )

    expect(screen.getByTestId('inner-heading')).toHaveTextContent('Inputs (0)')
  })
})
