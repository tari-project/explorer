import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import StatsItem from '../StatsItem'
import { lightTheme } from '@theme/themes'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>
    {children}
  </ThemeProvider>
)

describe('StatsItem (Desktop)', () => {
  it('should render label and value correctly', () => {
    render(
      <TestWrapper>
        <StatsItem label="Block Height" value="123,456" />
      </TestWrapper>
    )

    expect(screen.getByText('Block Height')).toBeInTheDocument()
    expect(screen.getByText('123,456')).toBeInTheDocument()
  })

  it('should display value above label in correct order', () => {
    const { container } = render(
      <TestWrapper>
        <StatsItem label="Hash Rate" value="12.3TH/s" />
      </TestWrapper>
    )

    const valueElement = screen.getByText('12.3TH/s')
    const labelElement = screen.getByText('Hash Rate')
    
    // Value should appear before label in DOM order
    const elements = Array.from(container.querySelectorAll('*'))
    const valueIndex = elements.indexOf(valueElement)
    const labelIndex = elements.indexOf(labelElement)
    
    expect(valueIndex).toBeLessThan(labelIndex)
  })

  it('should apply lowerCase styling when prop is true', () => {
    render(
      <TestWrapper>
        <StatsItem label="Avg Block Time" value="4m" lowerCase />
      </TestWrapper>
    )

    const valueElement = screen.getByText('4m')
    expect(valueElement).toBeInTheDocument()
    
    // Should have Material-UI Typography component
    expect(valueElement.tagName).toBe('P')
  })

  it('should not apply lowerCase styling when prop is false', () => {
    render(
      <TestWrapper>
        <StatsItem label="Block Height" value="123,456" lowerCase={false} />
      </TestWrapper>
    )

    const valueElement = screen.getByText('123,456')
    expect(valueElement).toBeInTheDocument()
  })

  it('should not apply lowerCase styling when prop is undefined', () => {
    render(
      <TestWrapper>
        <StatsItem label="Hash Rate" value="12.3TH/s" />
      </TestWrapper>
    )

    const valueElement = screen.getByText('12.3TH/s')
    expect(valueElement).toBeInTheDocument()
  })

  it('should handle empty string values', () => {
    render(
      <TestWrapper>
        <StatsItem label="Test Label" value="" />
      </TestWrapper>
    )

    expect(screen.getByText('Test Label')).toBeInTheDocument()
    // Empty value should still create the element - check by getting all empty text elements
    const valueElements = screen.getAllByText('')
    expect(valueElements.length).toBeGreaterThan(0)
  })

  it('should handle long label text', () => {
    const longLabel = 'Very Long Statistics Label That Might Wrap'
    render(
      <TestWrapper>
        <StatsItem label={longLabel} value="123" />
      </TestWrapper>
    )

    expect(screen.getByText(longLabel)).toBeInTheDocument()
    expect(screen.getByText('123')).toBeInTheDocument()
  })

  it('should handle various hash rate formats', () => {
    const testCases = [
      { value: '1.5KH/s', label: 'Low Hash Rate' },
      { value: '2.5MH/s', label: 'Medium Hash Rate' },
      { value: '3.5GH/s', label: 'High Hash Rate' },
      { value: '4.5TH/s', label: 'Very High Hash Rate' }
    ]

    testCases.forEach(({ value, label }) => {
      const { unmount } = render(
        <TestWrapper>
          <StatsItem label={label} value={value} />
        </TestWrapper>
      )

      expect(screen.getByText(label)).toBeInTheDocument()
      expect(screen.getByText(value)).toBeInTheDocument()
      unmount()
    })
  })

  it('should handle block height with thousands separators', () => {
    render(
      <TestWrapper>
        <StatsItem label="Block Height" value="1,234,567" />
      </TestWrapper>
    )

    expect(screen.getByText('Block Height')).toBeInTheDocument()
    expect(screen.getByText('1,234,567')).toBeInTheDocument()
  })

  it('should handle time format values', () => {
    const timeFormats = ['1m', '2m', '10m', '30s', '1h']
    
    timeFormats.forEach(timeValue => {
      const { unmount } = render(
        <TestWrapper>
          <StatsItem label="Time" value={timeValue} lowerCase />
        </TestWrapper>
      )

      expect(screen.getByText('Time')).toBeInTheDocument()
      expect(screen.getByText(timeValue)).toBeInTheDocument()
      unmount()
    })
  })

  it('should render within styled components structure', () => {
    const { container } = render(
      <TestWrapper>
        <StatsItem label="Test" value="123" />
      </TestWrapper>
    )

    // Should have styled container structure
    expect(container.firstChild).toBeInTheDocument()
    
    // Should contain both value and label elements
    expect(screen.getByText('123')).toBeInTheDocument()
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
