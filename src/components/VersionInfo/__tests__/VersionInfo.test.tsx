import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import VersionInfo from '../VersionInfo'

// Mock the API hook
vi.mock('@services/api/hooks/useBlocks', () => ({
  useAllBlocks: vi.fn()
}))

// Mock MUI components
vi.mock('@mui/material/Typography', () => ({
  default: ({ children, variant, color, ...props }: React.ComponentProps<'span'> & { variant?: string; color?: string }) => (
    <span data-testid="typography" data-variant={variant} data-color={color} {...props}>
      {children}
    </span>
  )
}))

// Mock styled components
vi.mock('../VersionInfo.styles', () => ({
  InnerBox: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="inner-box">{children}</div>
  )
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
      {children}
    </QueryClientProvider>
  )
}

describe('VersionInfo', () => {
  let mockUseAllBlocks: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    vi.clearAllMocks()
    const { useAllBlocks } = await import('@services/api/hooks/useBlocks')
    mockUseAllBlocks = vi.mocked(useAllBlocks)
  })

  it('should render InnerBox container', () => {
    mockUseAllBlocks.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <VersionInfo />
      </TestWrapper>
    )

    expect(screen.getByTestId('inner-box')).toBeInTheDocument()
  })

  it('should render version when data is available', () => {
    const mockData = {
      version: '1.2.3'
    }

    mockUseAllBlocks.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <VersionInfo />
      </TestWrapper>
    )

    expect(screen.getByText('Version:')).toBeInTheDocument()
    expect(screen.getByText('1.2.3')).toBeInTheDocument()
    
    const typography = screen.getByTestId('typography')
    expect(typography).toHaveAttribute('data-variant', 'body2')
    expect(typography).toHaveAttribute('data-color', 'GrayText')
  })

  it('should not render version when data is null', () => {
    mockUseAllBlocks.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <VersionInfo />
      </TestWrapper>
    )

    expect(screen.queryByText('Version:')).not.toBeInTheDocument()
  })

  it('should not render version when version is not available', () => {
    const mockData = {
      // No version property
    }

    mockUseAllBlocks.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <VersionInfo />
      </TestWrapper>
    )

    expect(screen.queryByText('Version:')).not.toBeInTheDocument()
  })

  it('should handle empty version string', () => {
    const mockData = {
      version: ''
    }

    mockUseAllBlocks.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null
    })

    render(
      <TestWrapper>
        <VersionInfo />
      </TestWrapper>
    )

    expect(screen.queryByText('Version:')).not.toBeInTheDocument()
  })
})
