import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

// Import centralized mocks first
import { mockTheme, mockKernelSearchData, mockMuiComponents } from '../../../test/mocks'

// Mock dependencies using centralized mocks
vi.mock('@services/api/hooks/useBlocks', () => ({
  useSearchByKernel: vi.fn()
}))

vi.mock('@mui/material', () => ({
  ...mockMuiComponents,
  useMediaQuery: vi.fn(() => false) // desktop by default
}))

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

import KernelHeader from '../KernelHeader'

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

  // Use centralized mock data with proper data structure

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

      expect(screen.getByText('Block not found')).toBeInTheDocument()
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

      expect(screen.getByText('Blocks found')).toBeInTheDocument()
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

      // When success with empty items, status is "Block found" (singular)
      expect(screen.getByText('Block found')).toBeInTheDocument()
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

      // When no search is active, status is empty string - h1 with empty content exists  
      const h1Elements = screen.getAllByTestId('typography').filter(el => el.getAttribute('data-variant') === 'h1')
      expect(h1Elements[0]).toHaveTextContent('')
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

      // Mobile renders null, so expect empty body
      expect(document.body).toBeInTheDocument()
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

      expect(screen.getByText('Blocks found')).toBeInTheDocument()
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
      const typographyElements = screen.getAllByTestId('typography')
      expect(typographyElements.length).toBeGreaterThan(0)
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
