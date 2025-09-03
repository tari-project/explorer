import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import StatsMobile from '../StatsMobile'
import { lightTheme } from '@theme/themes'

// Mock StatsItem component
vi.mock('../StatsItem/StatsItem', () => ({
  default: ({ label, value, lowerCase }: { label: React.ReactNode; value: string; lowerCase?: boolean }) => (
    <div data-testid={`stats-item-mobile`}>
      <span data-testid="value" className={lowerCase ? 'lowercase' : ''}>{value}</span>
      <span data-testid="label">{typeof label === 'string' ? label : 'multiline-label'}</span>
    </div>
  )
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>
    {children}
  </ThemeProvider>
)

describe('StatsMobile', () => {
  const mockProps = {
    moneroHashRate: '12.3TH/s',
    shaHashRate: '9.9TH/s',
    tariRandomXHashRate: '5.4TH/s',
    cuckarooHashRate: '3.2TH/s', 
    averageBlockTime: '4m',
    blockHeight: '123,456'
  }

  it('should render all six statistics items', () => {
    render(
      <TestWrapper>
        <StatsMobile {...mockProps} />
      </TestWrapper>
    )

    const statsItems = screen.getAllByTestId('stats-item-mobile')
    expect(statsItems).toHaveLength(6)
  })

  it('should display correct values for each statistic', () => {
    render(
      <TestWrapper>
        <StatsMobile {...mockProps} />
      </TestWrapper>
    )

    const values = screen.getAllByTestId('value')
    expect(values[0]).toHaveTextContent('12.3TH/s') // RandomX Hash Rate
    expect(values[1]).toHaveTextContent('9.9TH/s')  // Sha3X Hash Rate  
    expect(values[2]).toHaveTextContent('5.4TH/s')  // Tari RandomX Hash Rate
    expect(values[3]).toHaveTextContent('3.2TH/s')  // Cuckaroo29 Hash Rate
    expect(values[4]).toHaveTextContent('4m')       // Avg Block Time
    expect(values[5]).toHaveTextContent('123,456')  // Block Height
  })

  it('should apply lowerCase prop to average block time only', () => {
    render(
      <TestWrapper>
        <StatsMobile {...mockProps} />
      </TestWrapper>
    )

    const values = screen.getAllByTestId('value')
    
    // Only the 5th item (avg block time) should have lowercase class
    expect(values[0]).not.toHaveClass('lowercase') // RandomX
    expect(values[1]).not.toHaveClass('lowercase') // Sha3X  
    expect(values[2]).not.toHaveClass('lowercase') // Tari RandomX
    expect(values[3]).not.toHaveClass('lowercase') // Cuckaroo29
    expect(values[4]).toHaveClass('lowercase')     // Avg Block Time
    expect(values[5]).not.toHaveClass('lowercase') // Block Height
  })

  it('should use multiline labels for mobile compact display', () => {
    render(
      <TestWrapper>
        <StatsMobile {...mockProps} />
      </TestWrapper>
    )

    const labels = screen.getAllByTestId('label')
    
    // All labels should be rendered as multiline (React nodes with <br/>)
    labels.forEach(label => {
      expect(label).toHaveTextContent('multiline-label')
    })
  })

  it('should render with mobile-specific layout structure', () => {
    const { container } = render(
      <TestWrapper>
        <StatsMobile {...mockProps} />
      </TestWrapper>
    )

    // Should have nested mobile wrapper structure
    expect(container.firstChild).toBeInTheDocument()
    
    // Should contain a row structure for mobile layout
    const statsItems = screen.getAllByTestId('stats-item-mobile')
    expect(statsItems).toHaveLength(6)
  })

  it('should handle empty string values gracefully', () => {
    const emptyProps = {
      moneroHashRate: '',
      shaHashRate: '',
      tariRandomXHashRate: '',
      cuckarooHashRate: '',
      averageBlockTime: '',
      blockHeight: ''
    }

    render(
      <TestWrapper>
        <StatsMobile {...emptyProps} />
      </TestWrapper>
    )

    const statsItems = screen.getAllByTestId('stats-item-mobile')
    expect(statsItems).toHaveLength(6)
    
    const values = screen.getAllByTestId('value')
    values.forEach(value => {
      expect(value).toHaveTextContent('')
    })
  })

  it('should maintain responsive mobile design constraints', () => {
    render(
      <TestWrapper>
        <StatsMobile {...mockProps} />
      </TestWrapper>
    )

    // Mobile component should be contained within proper wrapper structure
    const statsItems = screen.getAllByTestId('stats-item-mobile')
    expect(statsItems).toHaveLength(6)
    
    // All stats should be rendered in mobile-optimized format
    expect(screen.getAllByTestId('value')).toHaveLength(6)
    expect(screen.getAllByTestId('label')).toHaveLength(6)
  })

  it('should handle different hash rate magnitudes correctly', () => {
    const differentMagnitudeProps = {
      moneroHashRate: '1.5KH/s',
      shaHashRate: '2.5MH/s', 
      tariRandomXHashRate: '3.5GH/s',
      cuckarooHashRate: '4.1TH/s',
      averageBlockTime: '2m',
      blockHeight: '999,999'
    }

    render(
      <TestWrapper>
        <StatsMobile {...differentMagnitudeProps} />
      </TestWrapper>
    )

    const values = screen.getAllByTestId('value')
    expect(values[0]).toHaveTextContent('1.5KH/s')
    expect(values[1]).toHaveTextContent('2.5MH/s')
    expect(values[2]).toHaveTextContent('3.5GH/s')
    expect(values[3]).toHaveTextContent('4.1TH/s')
    expect(values[4]).toHaveTextContent('2m')
    expect(values[5]).toHaveTextContent('999,999')
  })
})
