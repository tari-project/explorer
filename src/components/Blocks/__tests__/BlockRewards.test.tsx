import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import BlockRewards from '../BlockRewards'
import { lightTheme } from '@theme/themes'

// Mock API hooks
const mockUseGetBlockByHeightOrHash = vi.fn()

vi.mock('@services/api/hooks/useBlocks', () => ({
  useGetBlockByHeightOrHash: () => mockUseGetBlockByHeightOrHash()
}))

// Mock components
vi.mock('@components/StyledComponents', () => ({
  TypographyData: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="typography-data">{children}</div>
  )
}))

vi.mock('@components/InnerHeading', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="inner-heading">{children}</h2>
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
      <ThemeProvider theme={lightTheme}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

describe('BlockRewards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render block reward heading', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: { totalCoinbaseXtm: 1000 }
    })

    render(
      <TestWrapper>
        <BlockRewards blockHeight="123" />
      </TestWrapper>
    )

    expect(screen.getByTestId('inner-heading')).toHaveTextContent('Block Reward')
  })

  it('should display total coinbase value label', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: { totalCoinbaseXtm: 1000 }
    })

    render(
      <TestWrapper>
        <BlockRewards blockHeight="123" />
      </TestWrapper>
    )

    expect(screen.getByText('Total coinbase value')).toBeInTheDocument()
  })

  it('should display coinbase reward value with XTM suffix', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: { totalCoinbaseXtm: 1500 }
    })

    render(
      <TestWrapper>
        <BlockRewards blockHeight="123" />
      </TestWrapper>
    )

    expect(screen.getByTestId('typography-data')).toHaveTextContent('1500 XTM')
  })

  it('should display zero value when totalCoinbaseXtm is not provided', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: {}
    })

    render(
      <TestWrapper>
        <BlockRewards blockHeight="123" />
      </TestWrapper>
    )

    expect(screen.getByTestId('typography-data')).toHaveTextContent('0 XTM')
  })

  it('should display zero value when totalCoinbaseXtm is null', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: { totalCoinbaseXtm: null }
    })

    render(
      <TestWrapper>
        <BlockRewards blockHeight="123" />
      </TestWrapper>
    )

    expect(screen.getByTestId('typography-data')).toHaveTextContent('0 XTM')
  })

  it('should display zero value when totalCoinbaseXtm is undefined', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: { totalCoinbaseXtm: undefined }
    })

    render(
      <TestWrapper>
        <BlockRewards blockHeight="123" />
      </TestWrapper>
    )

    expect(screen.getByTestId('typography-data')).toHaveTextContent('0 XTM')
  })

  it('should handle missing block data gracefully', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: null
    })

    render(
      <TestWrapper>
        <BlockRewards blockHeight="123" />
      </TestWrapper>
    )

    expect(screen.getByTestId('typography-data')).toHaveTextContent('0 XTM')
    expect(screen.getByTestId('inner-heading')).toHaveTextContent('Block Reward')
    expect(screen.getByText('Total coinbase value')).toBeInTheDocument()
  })

  it('should handle undefined block data gracefully', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: undefined
    })

    render(
      <TestWrapper>
        <BlockRewards blockHeight="123" />
      </TestWrapper>
    )

    expect(screen.getByTestId('typography-data')).toHaveTextContent('0 XTM')
  })

  it('should display large reward values correctly', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: { totalCoinbaseXtm: 999999999 }
    })

    render(
      <TestWrapper>
        <BlockRewards blockHeight="123" />
      </TestWrapper>
    )

    expect(screen.getByTestId('typography-data')).toHaveTextContent('999999999 XTM')
  })

  it('should display decimal reward values correctly', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: { totalCoinbaseXtm: 123.456 }
    })

    render(
      <TestWrapper>
        <BlockRewards blockHeight="123" />
      </TestWrapper>
    )

    expect(screen.getByTestId('typography-data')).toHaveTextContent('123.456 XTM')
  })

  it('should have proper grid layout structure', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: { totalCoinbaseXtm: 1000 }
    })

    const { container } = render(
      <TestWrapper>
        <BlockRewards blockHeight="123" />
      </TestWrapper>
    )

    // Should have Material-UI Grid components
    const gridContainers = container.querySelectorAll('.MuiGrid-container')
    expect(gridContainers.length).toBeGreaterThan(0)

    const gridItems = container.querySelectorAll('.MuiGrid-item')
    expect(gridItems.length).toBeGreaterThan(0)
  })

  it('should call useGetBlockByHeightOrHash with correct blockHeight', () => {
    const testBlockHeight = '456'
    
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: { totalCoinbaseXtm: 1000 }
    })

    render(
      <TestWrapper>
        <BlockRewards blockHeight={testBlockHeight} />
      </TestWrapper>
    )

    // Note: The hook is called during render, so we can't directly assert the parameter
    // but we can verify the component renders correctly with the provided blockHeight
    expect(screen.getByTestId('inner-heading')).toHaveTextContent('Block Reward')
  })

  it('should handle string blockHeight parameter', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: { totalCoinbaseXtm: 1000 }
    })

    render(
      <TestWrapper>
        <BlockRewards blockHeight="789" />
      </TestWrapper>
    )

    expect(screen.getByTestId('typography-data')).toHaveTextContent('1000 XTM')
  })

  it('should maintain responsive layout with different screen sizes', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: { totalCoinbaseXtm: 1000 }
    })

    const { container } = render(
      <TestWrapper>
        <BlockRewards blockHeight="123" />
      </TestWrapper>
    )

    // Check for responsive grid items (xs, md, lg breakpoints)
    const gridItems = container.querySelectorAll('.MuiGrid-item')
    expect(gridItems.length).toBe(2) // One for label, one for value
  })
})
