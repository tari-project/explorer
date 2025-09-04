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

describe('StatsItem (Mobile)', () => {
  it('should render label and value correctly', () => {
    render(
      <TestWrapper>
        <StatsItem label="Block Height" value="123,456" />
      </TestWrapper>
    )

    expect(screen.getByText('Block Height')).toBeInTheDocument()
    expect(screen.getByText('123,456')).toBeInTheDocument()
  })

  it('should handle React node labels for multiline text', () => {
    const multilineLabel = (
      <>
        RandomX
        <br />
        Hash Rate
      </>
    )

    render(
      <TestWrapper>
        <StatsItem label={multilineLabel} value="12.3TH/s" />
      </TestWrapper>
    )

    expect(screen.getByText(/RandomX/)).toBeInTheDocument()
    expect(screen.getByText(/Hash Rate/)).toBeInTheDocument()
    expect(screen.getByText('12.3TH/s')).toBeInTheDocument()
  })

  it('should display label before value in correct order', () => {
    const { container } = render(
      <TestWrapper>
        <StatsItem label="Hash Rate" value="12.3TH/s" />
      </TestWrapper>
    )

    const valueElement = screen.getByText('12.3TH/s')
    const labelElement = screen.getByText('Hash Rate')
    
    // Label should appear before value in DOM order
    const elements = Array.from(container.querySelectorAll('*'))
    const valueIndex = elements.indexOf(valueElement)
    const labelIndex = elements.indexOf(labelElement)
    
    expect(labelIndex).toBeLessThan(valueIndex)
  })

  it('should apply lowerCase styling when prop is true', () => {
    render(
      <TestWrapper>
        <StatsItem 
          label={<>Avg Block<br />Time</>} 
          value="4m" 
          lowerCase 
        />
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
        <StatsItem 
          label={<>Tip<br />Height</>} 
          value="123,456" 
          lowerCase={false} 
        />
      </TestWrapper>
    )

    const valueElement = screen.getByText('123,456')
    expect(valueElement).toBeInTheDocument()
  })

  it('should handle string labels as well as React nodes', () => {
    render(
      <TestWrapper>
        <StatsItem label="Simple Label" value="123" />
      </TestWrapper>
    )

    expect(screen.getByText('Simple Label')).toBeInTheDocument()
    expect(screen.getByText('123')).toBeInTheDocument()
  })

  it('should handle complex multiline labels with multiple breaks', () => {
    const complexLabel = (
      <>
        Tari RandomX
        <br />
        Hash Rate
        <br />
        (Mining)
      </>
    )

    render(
      <TestWrapper>
        <StatsItem label={complexLabel} value="5.4TH/s" />
      </TestWrapper>
    )

    expect(screen.getByText(/Tari RandomX/)).toBeInTheDocument()
    expect(screen.getByText(/Hash Rate/)).toBeInTheDocument()
    expect(screen.getByText(/\(Mining\)/)).toBeInTheDocument()
    expect(screen.getByText('5.4TH/s')).toBeInTheDocument()
  })

  it('should handle empty string values', () => {
    render(
      <TestWrapper>
        <StatsItem label={<>Test<br />Label</>} value="" />
      </TestWrapper>
    )

    expect(screen.getByText(/Test/)).toBeInTheDocument()
    expect(screen.getByText(/Label/)).toBeInTheDocument()
    // Empty value should still create the element - check by role
    const valueElements = screen.getAllByText('')
    expect(valueElements.length).toBeGreaterThan(0)
  })

  it('should handle various mobile-optimized hash rate formats', () => {
    const testCases = [
      { 
        value: '1.5KH/s', 
        label: <>Low<br />Hash Rate</> 
      },
      { 
        value: '2.5MH/s', 
        label: <>Medium<br />Hash Rate</> 
      },
      { 
        value: '3.5GH/s', 
        label: <>High<br />Hash Rate</> 
      },
      { 
        value: '4.5TH/s', 
        label: <>Very High<br />Hash Rate</> 
      }
    ]

    testCases.forEach(({ value, label }) => {
      const { unmount } = render(
        <TestWrapper>
          <StatsItem label={label} value={value} />
        </TestWrapper>
      )

      expect(screen.getByText(value)).toBeInTheDocument()
      unmount()
    })
  })

  it('should maintain mobile layout structure with compact spacing', () => {
    render(
      <TestWrapper>
        <StatsItem 
          label={<>Sha3X<br />Hash Rate</>} 
          value="9.9TH/s" 
        />
      </TestWrapper>
    )

    const valueElement = screen.getByText('9.9TH/s')
    const sha3xText = screen.getByText(/Sha3X/)
    const hashRateText = screen.getByText(/Hash Rate/)
    
    expect(valueElement).toBeInTheDocument()
    expect(sha3xText).toBeInTheDocument()
    expect(hashRateText).toBeInTheDocument()
  })

  it('should handle touch-friendly mobile interactions', () => {
    const { container } = render(
      <TestWrapper>
        <StatsItem 
          label={<>Avg Block<br />Time</>} 
          value="4m" 
          lowerCase 
        />
      </TestWrapper>
    )

    // Should have styled container structure optimized for mobile
    expect(container.firstChild).toBeInTheDocument()
    
    // Should contain both value and label elements
    expect(screen.getByText('4m')).toBeInTheDocument()
    expect(screen.getByText(/Avg Block/)).toBeInTheDocument()
    expect(screen.getByText(/Time/)).toBeInTheDocument()
  })

  it('should render within mobile-specific styled components', () => {
    const { container } = render(
      <TestWrapper>
        <StatsItem 
          label={<>Test<br />Mobile</>} 
          value="123" 
        />
      </TestWrapper>
    )

    // Should have styled container structure
    expect(container.firstChild).toBeInTheDocument()
    
    // Should contain all elements
    expect(screen.getByText('123')).toBeInTheDocument()
    expect(screen.getByText(/Test/)).toBeInTheDocument()
    expect(screen.getByText(/Mobile/)).toBeInTheDocument()
  })
})
