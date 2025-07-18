import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import VNChart from '../VNChart'

// Mock MUI components
vi.mock('@mui/material', () => ({
  Box: ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <div data-testid="box" style={style}>{children}</div>
  ),
  Typography: ({ variant, gutterBottom, children }: any) => (
    <div data-testid={`typography-${variant}`} data-gutter-bottom={gutterBottom}>
      {children}
    </div>
  )
}))

// Mock theme
const mockTheme = {
  spacing: vi.fn((value: number) => `${value * 8}px`),
  palette: {
    mode: 'light',
    text: {
      primary: '#000000'
    }
  }
}

vi.mock('@mui/material/styles', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={mockTheme as any}>
    {children}
  </ThemeProvider>
)

describe('VNChart', () => {
  it('should render validators chart title', () => {
    render(
      <TestWrapper>
        <VNChart />
      </TestWrapper>
    )

    expect(screen.getByTestId('typography-h6')).toBeInTheDocument()
    expect(screen.getByText('VALIDATORS BY TIME')).toBeInTheDocument()
  })

  it('should render coming soon message', () => {
    render(
      <TestWrapper>
        <VNChart />
      </TestWrapper>
    )

    expect(screen.getByTestId('typography-body2')).toBeInTheDocument()
    expect(screen.getByText('Coming soon...')).toBeInTheDocument()
  })

  it('should render container with proper structure', () => {
    render(
      <TestWrapper>
        <VNChart />
      </TestWrapper>
    )

    const boxes = screen.getAllByTestId('box')
    expect(boxes).toHaveLength(2) // Outer box and inner box
  })

  it('should have proper styling for chart container', () => {
    render(
      <TestWrapper>
        <VNChart />
      </TestWrapper>
    )

    const boxes = screen.getAllByTestId('box')
    const chartContainer = boxes[1] // Inner box with styling

    expect(chartContainer).toHaveStyle({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '265px'
    })
  })

  it('should render typography components with correct props', () => {
    render(
      <TestWrapper>
        <VNChart />
      </TestWrapper>
    )

    const titleTypography = screen.getByTestId('typography-h6')
    expect(titleTypography).toHaveAttribute('data-gutter-bottom', 'true')

    const bodyTypography = screen.getByTestId('typography-body2')
    expect(bodyTypography).toHaveAttribute('data-gutter-bottom', 'true')
  })

  it('should be accessible', () => {
    render(
      <TestWrapper>
        <VNChart />
      </TestWrapper>
    )

    // Title should be present for screen readers
    expect(screen.getByText('VALIDATORS BY TIME')).toBeInTheDocument()
    
    // Coming soon message should be informative
    expect(screen.getByText('Coming soon...')).toBeInTheDocument()
  })
})
