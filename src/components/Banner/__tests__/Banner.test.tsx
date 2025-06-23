import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Banner from '../Banner'

// Mock the styled components
vi.mock('../styles', () => ({
  Wrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="banner-wrapper">{children}</div>
  ),
  Holder: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="banner-holder">{children}</div>
  ),
  Text: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="banner-text">{children}</span>
  ),
  GradientText: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="gradient-text">{children}</span>
  )
}))

describe('Banner', () => {
  it('should render banner with correct text content', () => {
    render(<Banner />)
    
    expect(screen.getByTestId('banner-wrapper')).toBeInTheDocument()
    expect(screen.getByTestId('banner-holder')).toBeInTheDocument()
    expect(screen.getByTestId('banner-text')).toBeInTheDocument()
    expect(screen.getByTestId('gradient-text')).toBeInTheDocument()
  })

  it('should display mainnet live message', () => {
    render(<Banner />)
    
    expect(screen.getByText('Tari Mainnet')).toBeInTheDocument()
    expect(screen.getByText('is live')).toBeInTheDocument()
  })

  it('should have correct component structure', () => {
    render(<Banner />)
    
    const wrapper = screen.getByTestId('banner-wrapper')
    const holder = screen.getByTestId('banner-holder')
    const text = screen.getByTestId('banner-text')
    const gradientText = screen.getByTestId('gradient-text')
    
    expect(wrapper).toContainElement(holder)
    expect(holder).toContainElement(text)
    expect(text).toContainElement(gradientText)
  })

  it('should render as a functional component', () => {
    const { container } = render(<Banner />)
    expect(container.firstChild).toBeDefined()
  })
})
