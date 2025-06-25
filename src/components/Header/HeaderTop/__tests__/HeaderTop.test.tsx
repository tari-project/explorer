import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import HeaderTop from '../HeaderTop'
import { lightTheme } from '@theme/themes'

// Mock MinersCTA component
vi.mock('../../MinersCTA/MinersCTA', () => ({
  default: ({ theme, buttonText, noBackground }: { 
    theme: string; 
    buttonText: string; 
    noBackground: boolean 
  }) => (
    <div data-testid="miners-cta">
      <span data-theme={theme}>{buttonText}</span>
      <span data-no-background={noBackground.toString()}>MinersCTA</span>
    </div>
  )
}))

// Mock the styles
vi.mock('../HeaderTop.styles', () => ({
  StyledContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="styled-container">{children}</div>
  )
}))

// Mock the logo import
vi.mock('@assets/images/tari-logo.svg', () => ({
  default: '/mock-tari-logo.svg'
}))

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider theme={lightTheme}>
      {children}
    </ThemeProvider>
  </BrowserRouter>
)

describe('HeaderTop', () => {
  it('should render the Tari logo', () => {
    render(
      <TestWrapper>
        <HeaderTop />
      </TestWrapper>
    )

    const logo = screen.getByAltText('Tari Logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/mock-tari-logo.svg')
  })

  it('should render logo as a link to home', () => {
    render(
      <TestWrapper>
        <HeaderTop />
      </TestWrapper>
    )

    const logoLink = screen.getByRole('link')
    expect(logoLink).toHaveAttribute('href', '/')
  })

  it('should render MinersCTA component', () => {
    render(
      <TestWrapper>
        <HeaderTop />
      </TestWrapper>
    )

    const minersCTA = screen.getByTestId('miners-cta')
    expect(minersCTA).toBeInTheDocument()
  })

  it('should pass correct props to MinersCTA', () => {
    render(
      <TestWrapper>
        <HeaderTop />
      </TestWrapper>
    )

    expect(screen.getByText('Download Tari Universe')).toBeInTheDocument()
    expect(screen.getByText('MinersCTA')).toBeInTheDocument()
    
    // Check props are passed correctly
    const themeElement = screen.getByText('Download Tari Universe')
    expect(themeElement).toHaveAttribute('data-theme', 'dark')
    
    const noBackgroundElement = screen.getByText('MinersCTA')
    expect(noBackgroundElement).toHaveAttribute('data-no-background', 'false')
  })

  it('should render StyledContainer', () => {
    render(
      <TestWrapper>
        <HeaderTop />
      </TestWrapper>
    )

    expect(screen.getByTestId('styled-container')).toBeInTheDocument()
  })

  it('should render a divider', () => {
    const { container } = render(
      <TestWrapper>
        <HeaderTop />
      </TestWrapper>
    )

    const divider = container.querySelector('hr')
    expect(divider).toBeInTheDocument()
    expect(divider).toHaveClass('MuiDivider-root')
  })

  it('should have correct structure with container, logo link, and MinersCTA', () => {
    render(
      <TestWrapper>
        <HeaderTop />
      </TestWrapper>
    )

    const container = screen.getByTestId('styled-container')
    const logoLink = screen.getByRole('link')
    const minersCTA = screen.getByTestId('miners-cta')

    // Check that container contains both logo link and MinersCTA
    expect(container).toContainElement(logoLink)
    expect(container).toContainElement(minersCTA)
  })

  it('should render logo with proper attributes', () => {
    render(
      <TestWrapper>
        <HeaderTop />
      </TestWrapper>
    )

    const logo = screen.getByAltText('Tari Logo')
    expect(logo).toBeInstanceOf(HTMLImageElement)
    expect(logo).toHaveAttribute('alt', 'Tari Logo')
    expect(logo).toHaveAttribute('src', '/mock-tari-logo.svg')
  })

  it('should have accessible logo link', () => {
    render(
      <TestWrapper>
        <HeaderTop />
      </TestWrapper>
    )

    const logoLink = screen.getByRole('link')
    expect(logoLink).toBeInTheDocument()
    expect(logoLink).toHaveAttribute('href', '/')
    
    // Should contain the logo image
    const logo = screen.getByAltText('Tari Logo')
    expect(logoLink).toContainElement(logo)
  })

  it('should render complete component structure', () => {
    const { container } = render(
      <TestWrapper>
        <HeaderTop />
      </TestWrapper>
    )

    // Should have the main container
    expect(screen.getByTestId('styled-container')).toBeInTheDocument()
    
    // Should have the divider
    const divider = container.querySelector('hr')
    expect(divider).toBeInTheDocument()
    
    // Should render all components
    expect(screen.getByAltText('Tari Logo')).toBeInTheDocument()
    expect(screen.getByTestId('miners-cta')).toBeInTheDocument()
  })
})
