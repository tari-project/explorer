import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import BlockPage from '../BlockPage'

// Mock components
vi.mock('@components/StyledComponents', () => ({
  GradientPaper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="gradient-paper">{children}</div>
  )
}))

vi.mock('@components/FetchStatusCheck', () => ({
  default: ({ isError, isLoading, errorMessage }: any) => (
    <div data-testid="fetch-status-check">
      {isLoading && <div data-testid="loading">Loading...</div>}
      {isError && <div data-testid="error">{errorMessage}</div>}
    </div>
  )
}))

vi.mock('@components/Blocks/BlockInfo', () => ({
  default: ({ blockHeight }: { blockHeight: string }) => (
    <div data-testid="block-info" data-block-height={blockHeight}>
      Block Info
    </div>
  )
}))

vi.mock('@components/Blocks/BlockRewards', () => ({
  default: ({ blockHeight }: { blockHeight: string }) => (
    <div data-testid="block-rewards" data-block-height={blockHeight}>
      Block Rewards
    </div>
  )
}))

vi.mock('@components/Blocks/BlockParts', () => ({
  default: ({ blockHeight, type, itemsPerPage }: any) => (
    <div 
      data-testid="block-parts" 
      data-block-height={blockHeight}
      data-type={type}
      data-items-per-page={itemsPerPage}
    >
      Block Parts - {type}
    </div>
  )
}))

vi.mock('@components/Blocks/BlockPartsSearch', () => ({
  default: ({ blockHeight, type, itemsPerPage }: any) => (
    <div 
      data-testid="block-parts-search" 
      data-block-height={blockHeight}
      data-type={type}
      data-items-per-page={itemsPerPage}
    >
      Block Parts Search - {type}
    </div>
  )
}))

vi.mock('@mui/material/Grid', () => ({
  default: ({ children, ...props }: any) => (
    <div data-testid="grid" data-props={JSON.stringify(props)}>
      {children}
    </div>
  )
}))

// Mock the API hook
vi.mock('@services/api/hooks/useBlocks', () => ({
  useGetBlockByHeightOrHash: vi.fn()
}))

// Mock theme
const mockTheme = {
  spacing: vi.fn((value: number) => `${value * 8}px`),
  breakpoints: {
    down: vi.fn(() => 'media-query')
  }
}

vi.mock('@mui/material/styles', () => ({
  useTheme: () => mockTheme,
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Test wrapper component
const TestWrapper = ({ 
  children, 
  initialEntries = ['/blocks/123'] 
}: { 
  children: React.ReactNode
  initialEntries?: string[]
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={mockTheme as any}>
        <MemoryRouter initialEntries={initialEntries}>
          {children}
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

describe('BlockPage', () => {
  let mockUseGetBlockByHeightOrHash: any
  
  beforeEach(async () => {
    vi.clearAllMocks()
    const { useGetBlockByHeightOrHash } = await import('@services/api/hooks/useBlocks')
    mockUseGetBlockByHeightOrHash = vi.mocked(useGetBlockByHeightOrHash)
  })

  it('should render without crashing', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: {},
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <BlockPage />
      </TestWrapper>
    )

    expect(screen.getAllByTestId('grid')[0]).toBeInTheDocument()
  })

  it('should show loading state when data is loading', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <BlockPage />
      </TestWrapper>
    )

    expect(screen.getByTestId('fetch-status-check')).toBeInTheDocument()
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading...')
  })

  it('should show error state when there is an error', () => {
    const errorMessage = 'Failed to fetch block data'
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { message: errorMessage }
    })

    render(
      <TestWrapper>
        <BlockPage />
      </TestWrapper>
    )

    expect(screen.getByTestId('fetch-status-check')).toBeInTheDocument()
    expect(screen.getByTestId('error')).toHaveTextContent(errorMessage)
  })

  it('should show default error message when error has no message', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: {}
    })

    render(
      <TestWrapper>
        <BlockPage />
      </TestWrapper>
    )

    expect(screen.getByTestId('error')).toHaveTextContent('Error retrieving data')
  })

  it('should extract block height from URL pathname', () => {
    const blockHeight = '54321'
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: {},
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper initialEntries={[`/blocks/${blockHeight}`]}>
        <BlockPage />
      </TestWrapper>
    )

    expect(mockUseGetBlockByHeightOrHash).toHaveBeenCalledWith(blockHeight)
  })

  it('should render all block components when data is loaded', () => {
    const blockHeight = '12345'
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: {},
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper initialEntries={[`/blocks/${blockHeight}`]}>
        <BlockPage />
      </TestWrapper>
    )

    // Check all components are rendered with correct block height
    expect(screen.getByTestId('block-info')).toHaveAttribute('data-block-height', blockHeight)
    expect(screen.getByTestId('block-rewards')).toHaveAttribute('data-block-height', blockHeight)
    expect(screen.getByTestId('block-parts-search')).toHaveAttribute('data-block-height', blockHeight)
    
    const blockParts = screen.getAllByTestId('block-parts')
    expect(blockParts).toHaveLength(2) // outputs and inputs
    blockParts.forEach(part => {
      expect(part).toHaveAttribute('data-block-height', blockHeight)
    })
  })

  it('should render block parts search with correct props', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: {},
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <BlockPage />
      </TestWrapper>
    )

    const blockPartsSearch = screen.getByTestId('block-parts-search')
    expect(blockPartsSearch).toHaveAttribute('data-type', 'kernels')
    expect(blockPartsSearch).toHaveAttribute('data-items-per-page', '5')
  })

  it('should render block parts with correct types and pagination', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: {},
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <BlockPage />
      </TestWrapper>
    )

    const blockParts = screen.getAllByTestId('block-parts')
    expect(blockParts).toHaveLength(2)
    
    expect(blockParts[0]).toHaveAttribute('data-type', 'outputs')
    expect(blockParts[0]).toHaveAttribute('data-items-per-page', '5')
    
    expect(blockParts[1]).toHaveAttribute('data-type', 'inputs')
    expect(blockParts[1]).toHaveAttribute('data-items-per-page', '5')
  })

  it('should use theme spacing correctly', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: {},
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <BlockPage />
      </TestWrapper>
    )

    expect(mockTheme.spacing).toHaveBeenCalledWith(3) // gap between sections
  })

  it('should render gradient papers for all sections', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: {},
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <BlockPage />
      </TestWrapper>
    )

    const gradientPapers = screen.getAllByTestId('gradient-paper')
    expect(gradientPapers).toHaveLength(5) // BlockInfo, BlockRewards, BlockPartsSearch, 2x BlockParts
  })

  it('should have responsive grid layout', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: {},
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <BlockPage />
      </TestWrapper>
    )

    const grids = screen.getAllByTestId('grid')
    expect(grids.length).toBeGreaterThan(3) // Multiple grid containers for layout
  })

  it('should handle hash-based block identifiers', () => {
    const blockHash = 'abc123def456'
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: {},
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper initialEntries={[`/blocks/${blockHash}`]}>
        <BlockPage />
      </TestWrapper>
    )

    expect(mockUseGetBlockByHeightOrHash).toHaveBeenCalledWith(blockHash)
    expect(screen.getByTestId('block-info')).toHaveAttribute('data-block-height', blockHash)
  })
})
