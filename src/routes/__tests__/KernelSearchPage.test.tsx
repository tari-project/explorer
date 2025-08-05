import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider, type Theme } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import KernelSearchPage from '../KernelSearchPage'

// Mock components
vi.mock('@components/StyledComponents', () => ({
  GradientPaper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="gradient-paper">{children}</div>
  )
}))

vi.mock('@components/FetchStatusCheck', () => ({
  default: ({ isError, isLoading, errorMessage }: { isError?: boolean; isLoading?: boolean; errorMessage?: string }) => (
    <div data-testid="fetch-status-check">
      {isLoading && <div data-testid="loading">Loading...</div>}
      {isError && <div data-testid="error">{errorMessage}</div>}
    </div>
  )
}))

vi.mock('@components/KernelSearch/BlockTable', () => ({
  default: ({ data }: { data: unknown[] }) => (
    <div data-testid="kernel-block-table" data-count={data.length}>
      Kernel Block Table
    </div>
  )
}))

vi.mock('@mui/material', () => ({
  Grid: ({ children, ...props }: React.ComponentProps<'div'>) => (
    <div data-testid="grid" data-props={JSON.stringify(props)}>
      {children}
    </div>
  )
}))

// Mock the API hook
vi.mock('@services/api/hooks/useBlocks', () => ({
  useSearchByKernel: vi.fn()
}))

// Mock theme
const mockTheme = {
  spacing: vi.fn((value: number) => `${value * 8}px`),
  breakpoints: {
    down: vi.fn(() => 'media-query')
  }
}

// Mock window.location.replace
const mockLocationReplace = vi.fn()
Object.defineProperty(window, 'location', {
  value: {
    replace: mockLocationReplace
  },
  writable: true
})

// Test wrapper component
const TestWrapper = ({ 
  children, 
  initialEntries = ['/kernel_search'] 
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
      <ThemeProvider theme={mockTheme as unknown as Theme}>
        <MemoryRouter initialEntries={initialEntries}>
          {children}
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

describe('KernelSearchPage', () => {
  let mockUseSearchByKernel: ReturnType<typeof vi.fn>
  
  beforeEach(async () => {
    vi.clearAllMocks()
    mockLocationReplace.mockClear()
    const { useSearchByKernel } = await import('@services/api/hooks/useBlocks')
    mockUseSearchByKernel = vi.mocked(useSearchByKernel)
  })

  it('should render without crashing', () => {
    mockUseSearchByKernel.mockReturnValue({
      data: { items: [] },
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <KernelSearchPage />
      </TestWrapper>
    )

    expect(screen.getByTestId('grid')).toBeInTheDocument()
  })

  it('should show loading state when data is loading', () => {
    mockUseSearchByKernel.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <KernelSearchPage />
      </TestWrapper>
    )

    expect(screen.getByTestId('fetch-status-check')).toBeInTheDocument()
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading...')
  })

  it('should show error state when there is an error', () => {
    const errorMessage = 'Failed to fetch kernel data'
    mockUseSearchByKernel.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { message: errorMessage }
    })

    render(
      <TestWrapper>
        <KernelSearchPage />
      </TestWrapper>
    )

    expect(screen.getByTestId('fetch-status-check')).toBeInTheDocument()
    expect(screen.getByTestId('error')).toHaveTextContent(errorMessage)
  })

  it('should show default error message when error has no message', () => {
    mockUseSearchByKernel.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: {}
    })

    render(
      <TestWrapper>
        <KernelSearchPage />
      </TestWrapper>
    )

    expect(screen.getByTestId('error')).toHaveTextContent('Error retrieving data')
  })

  it('should render block table when data is available', () => {
    const mockData = {
      items: [
        { block: { header: { height: 100 } } },
        { block: { header: { height: 101 } } }
      ]
    }

    mockUseSearchByKernel.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <KernelSearchPage />
      </TestWrapper>
    )

    expect(screen.getByTestId('kernel-block-table')).toBeInTheDocument()
    expect(screen.getByTestId('kernel-block-table')).toHaveAttribute('data-count', '2')
  })

  it('should parse nonces from URL search params', () => {
    const nonces = ['nonce1', 'nonce2', 'nonce3']
    mockUseSearchByKernel.mockReturnValue({
      data: { items: [] },
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper initialEntries={[`/kernel_search?nonces=${nonces.join(',')}`]}>
        <KernelSearchPage />
      </TestWrapper>
    )

    expect(mockUseSearchByKernel).toHaveBeenCalledWith(nonces, [])
  })

  it('should parse signatures from URL search params', () => {
    const signatures = ['sig1', 'sig2']
    mockUseSearchByKernel.mockReturnValue({
      data: { items: [] },
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper initialEntries={[`/kernel_search?signatures=${signatures.join(',')}`]}>
        <KernelSearchPage />
      </TestWrapper>
    )

    expect(mockUseSearchByKernel).toHaveBeenCalledWith([], signatures)
  })

  it('should parse both nonces and signatures from URL', () => {
    const nonces = ['nonce1', 'nonce2']
    const signatures = ['sig1', 'sig2']
    mockUseSearchByKernel.mockReturnValue({
      data: { items: [] },
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper initialEntries={[`/kernel_search?nonces=${nonces.join(',')}&signatures=${signatures.join(',')}`]}>
        <KernelSearchPage />
      </TestWrapper>
    )

    expect(mockUseSearchByKernel).toHaveBeenCalledWith(nonces, signatures)
  })

  it('should redirect to block page when only one result is found', async () => {
    const mockData = {
      items: [{ block: { header: { height: 12345 } } }]
    }
    const nonces = 'nonce1'
    const signatures = 'sig1'

    mockUseSearchByKernel.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper initialEntries={[`/kernel_search?nonces=${nonces}&signatures=${signatures}`]}>
        <KernelSearchPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(mockLocationReplace).toHaveBeenCalledWith(
        '/blocks/12345?nonce=nonce1&signature=sig1'
      )
    })
  })

  it('should handle empty search parameters', () => {
    mockUseSearchByKernel.mockReturnValue({
      data: { items: [] },
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper initialEntries={['/kernel_search']}>
        <KernelSearchPage />
      </TestWrapper>
    )

    expect(mockUseSearchByKernel).toHaveBeenCalledWith([], [])
  })

  it('should have proper grid layout structure', () => {
    mockUseSearchByKernel.mockReturnValue({
      data: { items: [] },
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <KernelSearchPage />
      </TestWrapper>
    )

    const grid = screen.getByTestId('grid')
    const props = JSON.parse(grid.getAttribute('data-props') || '{}')
    
    expect(props.item).toBe(true)
    expect(props.xs).toBe(12)
    expect(props.md).toBe(12)
    expect(props.lg).toBe(12)
  })

  it('should render with gradient paper wrapper', () => {
    mockUseSearchByKernel.mockReturnValue({
      data: { items: [] },
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <KernelSearchPage />
      </TestWrapper>
    )

    expect(screen.getByTestId('gradient-paper')).toBeInTheDocument()
  })
})
