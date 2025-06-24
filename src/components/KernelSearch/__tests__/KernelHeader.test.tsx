import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import KernelHeader from '../KernelHeader'

// Mock dependencies using individual vi.mock calls
vi.mock('@services/api/hooks/useBlocks', () => ({
  useSearchByKernel: vi.fn()
}))

vi.mock('@mui/material', () => ({
  Box: ({ children, style, ...props }: any) => (
    <div data-testid="box" style={style} {...props}>{children}</div>
  ),
  Container: ({ children, ...props }: any) => (
    <div data-testid="container" {...props}>{children}</div>
  ),
  Typography: ({ children, variant, color }: any) => (
    <div data-testid="typography" data-variant={variant} data-color={color}>{children}</div>
  ),
  useMediaQuery: vi.fn(() => false) // desktop by default
}))

// Import centralized mock
import { mockTheme, mockKernelSearchData } from '../../../test/mocks'

vi.mock('@mui/material/styles', () => ({
  useTheme: () => mockTheme,
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(() => ({
    search: ''
  })),
  MemoryRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Test wrapper
const TestWrapper = ({ children, initialEntries = ['/'] }: { 
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

describe('KernelHeader', () => {
  let mockUseSearchByKernel: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const { useSearchByKernel } = await import('@services/api/hooks/useBlocks')
    mockUseSearchByKernel = vi.mocked(useSearchByKernel)
  })

  const mockKernelSearchData = {
    results: [
      {
        block_height: 12345,
        block_hash: { data: 'block_hash_1' },
        timestamp: 1640995200,
        pow: { pow_algo: 1 },
        kernels: 5,
        outputs: 10
      },
      {
        block_height: 12346,
        block_hash: { data: 'block_hash_2' },
        timestamp: 1640995260,
        pow: { pow_algo: 2 },
        kernels: 3,
        outputs: 8
      }
    ]
  }

  describe('URL parameter parsing', () => {
    it('should handle empty URL parameters', async () => {
      const { useLocation } = await import('react-router-dom')
      vi.mocked(useLocation).mockReturnValue({
        search: '',
        pathname: '',
        state: null,
        hash: '',
        key: ''
      })

      mockUseSearchByKernel.mockReturnValue({
        data: null,
        isFetching: false,
        isError: false,
        isSuccess: false
      })

      render(
        <TestWrapper>
          <KernelHeader />
        </TestWrapper>
      )

      // Should call useSearchByKernel with empty arrays
      expect(mockUseSearchByKernel).toHaveBeenCalledWith([], [])
    })

    it('should parse nonces and signatures from URL', async () => {
      const { useLocation } = await import('react-router-dom')
      vi.mocked(useLocation).mockReturnValue({
        search: '?nonces=nonce1,nonce2&signatures=sig1,sig2',
        pathname: '',
        state: null,
        hash: '',
        key: ''
      })

      mockUseSearchByKernel.mockReturnValue({
        data: null,
        isFetching: false,
        isError: false,
        isSuccess: false
      })

      render(
        <TestWrapper>
          <KernelHeader />
        </TestWrapper>
      )

      // Should call useSearchByKernel with parsed arrays
      expect(mockUseSearchByKernel).toHaveBeenCalledWith(
        ['nonce1', 'nonce2'],
        ['sig1', 'sig2']
      )
    })

    it('should handle single nonce and signature', async () => {
      const { useLocation } = await import('react-router-dom')
      vi.mocked(useLocation).mockReturnValue({
        search: '?nonces=single-nonce&signatures=single-sig',
        pathname: '',
        state: null,
        hash: '',
        key: ''
      })

      mockUseSearchByKernel.mockReturnValue({
        data: null,
        isFetching: false,
        isError: false,
        isSuccess: false
      })

      render(
        <TestWrapper>
          <KernelHeader />
        </TestWrapper>
      )

      // Should call useSearchByKernel with single item arrays
      expect(mockUseSearchByKernel).toHaveBeenCalledWith(
        ['single-nonce'],
        ['single-sig']
      )
    })
  })

  describe('Search status display', () => {
    beforeEach(async () => {
      const { useLocation } = await import('react-router-dom')
      vi.mocked(useLocation).mockReturnValue({
        search: '?nonces=test&signatures=test',
        pathname: '',
        state: null,
        hash: '',
        key: ''
      })
    })

    it('should display searching status', () => {
      mockUseSearchByKernel.mockReturnValue({
        data: null,
        isFetching: true,
        isError: false,
        isSuccess: false
      })

      render(
        <TestWrapper>
          <KernelHeader />
        </TestWrapper>
      )

      expect(screen.getByText('Searching...')).toBeInTheDocument()
    })

    it('should display error status', () => {
      mockUseSearchByKernel.mockReturnValue({
        data: null,
        isFetching: false,
        isError: true,
        isSuccess: false
      })

      render(
        <TestWrapper>
          <KernelHeader />
        </TestWrapper>
      )

      expect(screen.getByText('Error occurred during search')).toBeInTheDocument()
    })

    it('should display success status with result count', () => {
      mockUseSearchByKernel.mockReturnValue({
        data: mockKernelSearchData,
        isFetching: false,
        isError: false,
        isSuccess: true
      })

      render(
        <TestWrapper>
          <KernelHeader />
        </TestWrapper>
      )

      expect(screen.getByText('Found 2 blocks')).toBeInTheDocument()
    })

    it('should display no results found', () => {
      mockUseSearchByKernel.mockReturnValue({
        data: { items: [] },
        isFetching: false,
        isError: false,
        isSuccess: true
      })

      render(
        <TestWrapper>
          <KernelHeader />
        </TestWrapper>
      )

      expect(screen.getByText('No results found')).toBeInTheDocument()
    })

    it('should display default status when no search is active', () => {
      mockUseSearchByKernel.mockReturnValue({
        data: null,
        isFetching: false,
        isError: false,
        isSuccess: false
      })

      render(
        <TestWrapper>
          <KernelHeader />
        </TestWrapper>
      )

      expect(screen.getByText('Ready to search')).toBeInTheDocument()
    })
  })

  describe('Mobile responsiveness', () => {
    beforeEach(async () => {
      const { useLocation } = await import('react-router-dom')
      vi.mocked(useLocation).mockReturnValue({
        search: '?nonces=test&signatures=test',
        pathname: '',
        state: null,
        hash: '',
        key: ''
      })
    })

    it('should handle mobile layout', async () => {
      const { useMediaQuery } = await import('@mui/material')
      vi.mocked(useMediaQuery).mockReturnValue(true) // mobile

      mockUseSearchByKernel.mockReturnValue({
        data: mockKernelSearchData,
        isFetching: false,
        isError: false,
        isSuccess: true
      })

      render(
        <TestWrapper>
          <KernelHeader />
        </TestWrapper>
      )

      // Should still display status regardless of mobile/desktop
      expect(screen.getByText('Found 2 blocks')).toBeInTheDocument()
    })

    it('should handle desktop layout', async () => {
      const { useMediaQuery } = await import('@mui/material')
      vi.mocked(useMediaQuery).mockReturnValue(false) // desktop

      mockUseSearchByKernel.mockReturnValue({
        data: mockKernelSearchData,
        isFetching: false,
        isError: false,
        isSuccess: true
      })

      render(
        <TestWrapper>
          <KernelHeader />
        </TestWrapper>
      )

      expect(screen.getByText('Found 2 blocks')).toBeInTheDocument()
    })
  })

  describe('Component structure', () => {
    beforeEach(async () => {
      const { useLocation } = await import('react-router-dom')
      vi.mocked(useLocation).mockReturnValue({
        search: '',
        pathname: '',
        state: null,
        hash: '',
        key: ''
      })
    })

    it('should render header structure', () => {
      mockUseSearchByKernel.mockReturnValue({
        data: null,
        isFetching: false,
        isError: false,
        isSuccess: false
      })

      render(
        <TestWrapper>
          <KernelHeader />
        </TestWrapper>
      )

      // Check for basic structure elements
      expect(screen.getByTestId('box')).toBeInTheDocument()
      expect(screen.getByTestId('typography')).toBeInTheDocument()
    })

    it('should use theme correctly', () => {
      mockUseSearchByKernel.mockReturnValue({
        data: null,
        isFetching: false,
        isError: false,
        isSuccess: false
      })

      render(
        <TestWrapper>
          <KernelHeader />
        </TestWrapper>
      )

      // Theme should be accessed via useTheme
      expect(mockTheme.breakpoints.down).toHaveBeenCalledWith('sm')
    })
  })
})
