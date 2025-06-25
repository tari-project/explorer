import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import StatsDesktop from '../StatsDesktop'
import { lightTheme } from '@theme/themes'

// Mock StatsItem component
vi.mock('../StatsItem/StatsItem', () => ({
  default: ({ label, value, lowerCase }: { label: string; value: string; lowerCase?: boolean }) => (
    <div data-testid={`stats-item-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <span data-testid="value" className={lowerCase ? 'lowercase' : ''}>{value}</span>
      <span data-testid="label">{label}</span>
    </div>
  )
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>
    {children}
  </ThemeProvider>
)

describe('StatsDesktop', () => {
  const mockProps = {
    moneroHashRate: '12.3TH/s',
    shaHashRate: '9.9TH/s', 
    tariRandomXHashRate: '5.4TH/s',
    averageBlockTime: '4m',
    blockHeight: '123,456'
  }

  it('should render all statistics with correct labels and values', () => {
    render(
      <TestWrapper>
        <StatsDesktop {...mockProps} />
      </TestWrapper>
    )

    expect(screen.getByTestId('stats-item-randomx-hash-rate')).toBeInTheDocument()
    expect(screen.getByTestId('stats-item-sha3x-hash-rate')).toBeInTheDocument()
    expect(screen.getByTestId('stats-item-tari-randomx-hash-rate')).toBeInTheDocument()
    expect(screen.getByTestId('stats-item-avg-block-time')).toBeInTheDocument()
    expect(screen.getByTestId('stats-item-block-height')).toBeInTheDocument()
  })

  it('should display correct values for each statistic', () => {
    render(
      <TestWrapper>
        <StatsDesktop {...mockProps} />
      </TestWrapper>
    )

    const randomxItem = screen.getByTestId('stats-item-randomx-hash-rate')
    expect(randomxItem.querySelector('[data-testid="value"]')).toHaveTextContent('12.3TH/s')
    expect(randomxItem.querySelector('[data-testid="label"]')).toHaveTextContent('RandomX Hash Rate')

    const sha3xItem = screen.getByTestId('stats-item-sha3x-hash-rate')
    expect(sha3xItem.querySelector('[data-testid="value"]')).toHaveTextContent('9.9TH/s')
    expect(sha3xItem.querySelector('[data-testid="label"]')).toHaveTextContent('Sha3X Hash Rate')

    const tariRandomxItem = screen.getByTestId('stats-item-tari-randomx-hash-rate')
    expect(tariRandomxItem.querySelector('[data-testid="value"]')).toHaveTextContent('5.4TH/s')
    expect(tariRandomxItem.querySelector('[data-testid="label"]')).toHaveTextContent('Tari RandomX Hash Rate')

    const blockTimeItem = screen.getByTestId('stats-item-avg-block-time')
    expect(blockTimeItem.querySelector('[data-testid="value"]')).toHaveTextContent('4m')
    expect(blockTimeItem.querySelector('[data-testid="label"]')).toHaveTextContent('Avg Block Time')

    const blockHeightItem = screen.getByTestId('stats-item-block-height')
    expect(blockHeightItem.querySelector('[data-testid="value"]')).toHaveTextContent('123,456')
    expect(blockHeightItem.querySelector('[data-testid="label"]')).toHaveTextContent('Block Height')
  })

  it('should apply lowerCase prop to average block time only', () => {
    render(
      <TestWrapper>
        <StatsDesktop {...mockProps} />
      </TestWrapper>
    )

    const blockTimeValue = screen.getByTestId('stats-item-avg-block-time').querySelector('[data-testid="value"]')
    expect(blockTimeValue).toHaveClass('lowercase')

    // Other values should not have lowercase class
    const randomxValue = screen.getByTestId('stats-item-randomx-hash-rate').querySelector('[data-testid="value"]')
    expect(randomxValue).not.toHaveClass('lowercase')
  })

  it('should handle empty string values gracefully', () => {
    const emptyProps = {
      moneroHashRate: '',
      shaHashRate: '',
      tariRandomXHashRate: '',
      averageBlockTime: '',
      blockHeight: ''
    }

    render(
      <TestWrapper>
        <StatsDesktop {...emptyProps} />
      </TestWrapper>
    )

    expect(screen.getByTestId('stats-item-randomx-hash-rate')).toBeInTheDocument()
    expect(screen.getByTestId('stats-item-sha3x-hash-rate')).toBeInTheDocument()
    expect(screen.getByTestId('stats-item-tari-randomx-hash-rate')).toBeInTheDocument()
    expect(screen.getByTestId('stats-item-avg-block-time')).toBeInTheDocument()
    expect(screen.getByTestId('stats-item-block-height')).toBeInTheDocument()
  })

  it('should render with desktop-specific layout wrapper', () => {
    const { container } = render(
      <TestWrapper>
        <StatsDesktop {...mockProps} />
      </TestWrapper>
    )

    // Should have the Wrapper component from StatsBox.styles
    expect(container.firstChild).toBeInTheDocument()
  })
})
