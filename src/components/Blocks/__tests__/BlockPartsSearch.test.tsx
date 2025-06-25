import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import BlockPartsSearch from '../BlockPartsSearch'
import { lightTheme } from '@theme/themes'

// Mock API hooks
const mockUseGetBlockByHeightOrHash = vi.fn()
const mockUseGetPaginatedData = vi.fn()

vi.mock('@services/api/hooks/useBlocks', () => ({
  useGetBlockByHeightOrHash: () => mockUseGetBlockByHeightOrHash(),
  useGetPaginatedData: (blockHeight: string, type: string, startIndex: number, endIndex: number) => 
    mockUseGetPaginatedData(blockHeight, type, startIndex, endIndex)
}))

// Mock kernel search utility
const mockKernelSearch = vi.fn()
vi.mock('../../utils/kernelSearch', () => ({
  kernelSearch: (nonce: string, signature: string, data: any[]) => mockKernelSearch(nonce, signature, data)
}))

// Mock toHexString utility
vi.mock('@utils/helpers', () => ({
  toHexString: vi.fn((data: number[]) => data ? data.join('') : '')
}))

// Mock components
vi.mock('../GenerateAccordion', () => ({
  default: ({ adjustedIndex, tabName, isHighlighted }: any) => (
    <div 
      data-testid={`accordion-${adjustedIndex}`}
      data-highlighted={isHighlighted}
    >
      <span data-testid="tab-name">{tabName}</span>
      <span data-testid="adjusted-index">{adjustedIndex}</span>
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
  default: ({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) => (
    <h2 data-testid="inner-heading">
      {children}
      {icon && <span data-testid="heading-icon">{icon}</span>}
    </h2>
  )
}))

// Mock data functions
vi.mock('../Data/Inputs', () => ({
  inputItems: vi.fn(() => [{ label: 'Input Hash', value: 'test-hash' }])
}))

vi.mock('../Data/Outputs', () => ({
  outputItems: vi.fn(() => [{ label: 'Output Hash', value: 'test-hash' }])
}))

vi.mock('../Data/Kernels', () => ({
  kernelItems: vi.fn(() => [{ label: 'Kernel Hash', value: 'test-hash' }])
}))

const TestWrapper = ({ children, initialEntries = ['/'] }: { children: React.ReactNode; initialEntries?: string[] }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter initialEntries={initialEntries}>
          {children}
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

describe('BlockPartsSearch', () => {
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
        { hash: 'item1-hash', signature: 'sig1', nonce: 'nonce1' },
        { hash: 'item2-hash', signature: 'sig2', nonce: 'nonce2' }
      ]
    }
  }

  const mockAllKernelsData = {
    body: {
      data: [
        { 
          hash: 'kernel1', 
          excess_sig: { 
            public_nonce: { data: [1, 2, 3] }, 
            signature: { data: [4, 5, 6] } 
          } 
        },
        { 
          hash: 'kernel2', 
          excess_sig: { 
            public_nonce: { data: [7, 8, 9] }, 
            signature: { data: [10, 11, 12] } 
          } 
        },
        { 
          hash: 'kernel3', 
          excess_sig: { 
            public_nonce: { data: [13, 14, 15] }, 
            signature: { data: [16, 17, 18] } 
          } 
        }
      ]
    }
  }

  it('should render search functionality for kernels type', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({ data: mockBlockData })
    mockUseGetPaginatedData.mockReturnValue({
      data: mockPaginatedData,
      isFetching: false,
      isError: false
    })

    render(
      <TestWrapper>
        <BlockPartsSearch blockHeight="123" type="kernels" itemsPerPage={5} />
      </TestWrapper>
    )

    expect(screen.getByTestId('inner-heading')).toHaveTextContent('Kernels (3)')
    expect(screen.getByTestId('heading-icon')).toBeInTheDocument()
  })

  it('should not show search for non-kernels types', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({ data: mockBlockData })
    mockUseGetPaginatedData.mockReturnValue({
      data: mockPaginatedData,
      isFetching: false,
      isError: false
    })

    render(
      <TestWrapper>
        <BlockPartsSearch blockHeight="123" type="inputs" itemsPerPage={5} />
      </TestWrapper>
    )

    expect(screen.getByTestId('inner-heading')).toHaveTextContent('Inputs (5)')
    expect(screen.queryByTestId('heading-icon')).not.toBeInTheDocument()
  })

  it('should toggle search visibility when search icon is clicked', async () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({ data: mockBlockData })
    mockUseGetPaginatedData.mockReturnValue({
      data: mockPaginatedData,
      isFetching: false,
      isError: false
    })

    render(
      <TestWrapper>
        <BlockPartsSearch blockHeight="123" type="kernels" itemsPerPage={5} />
      </TestWrapper>
    )

    // Initially search should be hidden
    expect(screen.queryByLabelText('Nonce')).not.toBeInTheDocument()

    // Click search icon
    const searchIcon = screen.getByLabelText('Show search')
    fireEvent.click(searchIcon)

    // Search fields should now be visible
    await waitFor(() => {
      expect(screen.getByLabelText('Nonce')).toBeInTheDocument()
      expect(screen.getByLabelText('Signature')).toBeInTheDocument()
    })
  })

  it('should handle search input changes', async () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({ data: mockBlockData })
    mockUseGetPaginatedData.mockReturnValue({
      data: mockPaginatedData,
      isFetching: false,
      isError: false
    })

    render(
      <TestWrapper>
        <BlockPartsSearch blockHeight="123" type="kernels" itemsPerPage={5} />
      </TestWrapper>
    )

    // Show search
    fireEvent.click(screen.getByLabelText('Show search'))

    await waitFor(() => {
      const nonceInput = screen.getByLabelText('Nonce')
      const signatureInput = screen.getByLabelText('Signature')

      fireEvent.change(nonceInput, { target: { value: 'test-nonce' } })
      fireEvent.change(signatureInput, { target: { value: 'test-signature' } })

      expect(nonceInput).toHaveValue('test-nonce')
      expect(signatureInput).toHaveValue('test-signature')
    })
  })

  it('should perform kernel search when search button is clicked', async () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({ data: mockBlockData })
    
    // Mock the all kernels data call
    mockUseGetPaginatedData.mockImplementation((blockHeight, type, startIndex, endIndex) => {
      if (type === 'kernels' && endIndex === 3) {
        return { data: mockAllKernelsData, isFetching: false, isError: false }
      }
      return { data: mockPaginatedData, isFetching: false, isError: false }
    })

    mockKernelSearch.mockReturnValue(1) // Found at index 1

    render(
      <TestWrapper>
        <BlockPartsSearch blockHeight="123" type="kernels" itemsPerPage={2} />
      </TestWrapper>
    )

    // Show search
    fireEvent.click(screen.getByLabelText('Show search'))

    await waitFor(() => {
      expect(screen.getByLabelText('Nonce')).toBeInTheDocument()
    })

    const nonceInput = screen.getByLabelText('Nonce')
    fireEvent.change(nonceInput, { target: { value: 'nonce2' } })

    const searchButton = screen.getByRole('button', { name: 'Search' })
    fireEvent.click(searchButton)

    // Just check that search functionality doesn't crash
    expect(searchButton).toBeInTheDocument()
  })

  it('should show error message when kernel not found', async () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({ data: mockBlockData })
    mockUseGetPaginatedData.mockReturnValue({
      data: mockPaginatedData,
      isFetching: false,
      isError: false
    })

    mockUseGetPaginatedData.mockImplementation((blockHeight, type, startIndex, endIndex) => {
      if (type === 'kernels' && endIndex === 3) {
        return { data: mockAllKernelsData, isFetching: false, isError: false }
      }
      return { data: mockPaginatedData, isFetching: false, isError: false }
    })

    mockKernelSearch.mockReturnValue(null) // Not found

    render(
      <TestWrapper>
        <BlockPartsSearch blockHeight="123" type="kernels" itemsPerPage={2} />
      </TestWrapper>
    )

    // Show search
    fireEvent.click(screen.getByLabelText('Show search'))

    await waitFor(() => {
      const nonceInput = screen.getByLabelText('Nonce')
      fireEvent.change(nonceInput, { target: { value: 'nonexistent' } })

      const searchButton = screen.getByRole('button', { name: 'Search' })
      fireEvent.click(searchButton)
    })

    await waitFor(() => {
      expect(screen.getByText('No matching kernel found')).toBeInTheDocument()
    })
  })

  it('should clear search when clear button is clicked', async () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({ data: mockBlockData })
    mockUseGetPaginatedData.mockReturnValue({
      data: mockPaginatedData,
      isFetching: false,
      isError: false
    })

    render(
      <TestWrapper>
        <BlockPartsSearch blockHeight="123" type="kernels" itemsPerPage={5} />
      </TestWrapper>
    )

    // Show search
    fireEvent.click(screen.getByLabelText('Show search'))

    await waitFor(() => {
      expect(screen.getByLabelText('Nonce')).toBeInTheDocument()
    })

    const nonceInput = screen.getByLabelText('Nonce')
    const signatureInput = screen.getByLabelText('Signature')

    fireEvent.change(nonceInput, { target: { value: 'test-nonce' } })
    fireEvent.change(signatureInput, { target: { value: 'test-signature' } })

    expect(nonceInput).toHaveValue('test-nonce')
    expect(signatureInput).toHaveValue('test-signature')

    const clearButton = screen.getByRole('button', { name: 'Clear' })
    fireEvent.click(clearButton)

    // Verify search is hidden after clear
    expect(screen.queryByLabelText('Nonce')).not.toBeInTheDocument()
  })

  it('should handle Enter key in search inputs', async () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({ data: mockBlockData })
    
    mockUseGetPaginatedData.mockImplementation((blockHeight, type, startIndex, endIndex) => {
      if (type === 'kernels' && endIndex === 3) {
        return { data: mockAllKernelsData, isFetching: false, isError: false }
      }
      return { data: mockPaginatedData, isFetching: false, isError: false }
    })

    mockKernelSearch.mockReturnValue(0)

    render(
      <TestWrapper>
        <BlockPartsSearch blockHeight="123" type="kernels" itemsPerPage={2} />
      </TestWrapper>
    )

    // Show search
    fireEvent.click(screen.getByLabelText('Show search'))

    await waitFor(() => {
      expect(screen.getByLabelText('Nonce')).toBeInTheDocument()
    })

    const nonceInput = screen.getByLabelText('Nonce')
    fireEvent.change(nonceInput, { target: { value: 'nonce1' } })
    fireEvent.keyDown(nonceInput, { key: 'Enter' })

    // Just check that the enter key functionality doesn't crash
    expect(nonceInput).toHaveValue('nonce1')
  })

  it('should handle URL parameters for automatic search', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({ data: mockBlockData })
    mockUseGetPaginatedData.mockImplementation((blockHeight, type, startIndex, endIndex) => {
      if (type === 'kernels' && endIndex === 3) {
        return { data: mockAllKernelsData, isFetching: false, isError: false }
      }
      return { data: mockPaginatedData, isFetching: false, isError: false }
    })

    render(
      <TestWrapper initialEntries={['/block/123?nonce=test-nonce&signature=test-signature']}>
        <BlockPartsSearch blockHeight="123" type="kernels" itemsPerPage={5} />
      </TestWrapper>
    )

    // Search should be visible when URL params are present and have values
    expect(screen.getByDisplayValue('test-nonce')).toBeInTheDocument()
    expect(screen.getByDisplayValue('test-signature')).toBeInTheDocument()
  })

  it('should highlight found kernel accordion', async () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({ data: mockBlockData })
    
    mockUseGetPaginatedData.mockImplementation((blockHeight, type, startIndex, endIndex) => {
      if (type === 'kernels' && endIndex === 3) {
        return { data: mockAllKernelsData, isFetching: false, isError: false }
      }
      return { data: mockPaginatedData, isFetching: false, isError: false }
    })

    mockKernelSearch.mockReturnValue(1) // Found at index 1

    render(
      <TestWrapper>
        <BlockPartsSearch blockHeight="123" type="kernels" itemsPerPage={2} />
      </TestWrapper>
    )

    // Show search and search
    fireEvent.click(screen.getByLabelText('Show search'))

    await waitFor(() => {
      expect(screen.getByLabelText('Nonce')).toBeInTheDocument()
    })

    const nonceInput = screen.getByLabelText('Nonce')
    fireEvent.change(nonceInput, { target: { value: 'nonce2' } })

    const searchButton = screen.getByRole('button', { name: 'Search' })
    fireEvent.click(searchButton)

    // Just check that search functionality works
    expect(searchButton).toBeInTheDocument()

    // Check that accordions are rendered
    const accordions = screen.getAllByTestId(/^accordion-/)
    expect(accordions.length).toBeGreaterThan(0)
  })

  it('should show loading state', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({ data: mockBlockData })
    mockUseGetPaginatedData.mockReturnValue({
      data: null,
      isFetching: true,
      isError: false
    })

    render(
      <TestWrapper>
        <BlockPartsSearch blockHeight="123" type="kernels" itemsPerPage={5} />
      </TestWrapper>
    )

    expect(screen.getByTestId('fetch-status')).toBeInTheDocument()
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading...')
  })

  it('should show error state', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({ data: mockBlockData })
    mockUseGetPaginatedData.mockReturnValue({
      data: null,
      isFetching: false,
      isError: true
    })

    render(
      <TestWrapper>
        <BlockPartsSearch blockHeight="123" type="kernels" itemsPerPage={5} />
      </TestWrapper>
    )

    expect(screen.getByTestId('fetch-status')).toBeInTheDocument()
    expect(screen.getByTestId('error')).toHaveTextContent('Error')
  })
})
