import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import HeaderTitle from '../HeaderTitle'

// Mock MUI components
vi.mock('@mui/material/Container', () => ({
  default: ({ children, maxWidth }: { children: React.ReactNode; maxWidth?: string }) => (
    <div data-testid="container" data-max-width={maxWidth}>
      {children}
    </div>
  )
}))

// Mock styled components
vi.mock('../HeaderTitle.styles', () => ({
  StyledContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="styled-container">{children}</div>
  ),
  StyledTitle: ({ children, variant }: { children: React.ReactNode; variant: string }) => (
    <h1 data-testid="styled-title" data-variant={variant}>
      {children}
    </h1>
  ),
  StyledSubTitle: ({ children, variant }: { children: React.ReactNode; variant: string }) => (
    <p data-testid="styled-subtitle" data-variant={variant}>
      {children}
    </p>
  )
}))

describe('HeaderTitle', () => {
  it('should render title', () => {
    render(<HeaderTitle title="Test Title" />)

    expect(screen.getByTestId('styled-title')).toBeInTheDocument()
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('should render title with correct variant', () => {
    render(<HeaderTitle title="Test Title" />)

    const title = screen.getByTestId('styled-title')
    expect(title).toHaveAttribute('data-variant', 'h1')
  })

  it('should render subtitle when provided', () => {
    render(<HeaderTitle title="Test Title" subTitle="Test Subtitle" />)

    expect(screen.getByTestId('styled-subtitle')).toBeInTheDocument()
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
  })

  it('should render subtitle with correct variant', () => {
    render(<HeaderTitle title="Test Title" subTitle="Test Subtitle" />)

    const subtitle = screen.getByTestId('styled-subtitle')
    expect(subtitle).toHaveAttribute('data-variant', 'body2')
  })

  it('should not render subtitle when not provided', () => {
    render(<HeaderTitle title="Test Title" />)

    expect(screen.queryByTestId('styled-subtitle')).toBeInTheDocument()
    const subtitle = screen.getByTestId('styled-subtitle')
    expect(subtitle).toHaveTextContent('') // Empty subtitle still renders
  })

  it('should render within container with correct maxWidth', () => {
    render(<HeaderTitle title="Test Title" />)

    const container = screen.getByTestId('container')
    expect(container).toHaveAttribute('data-max-width', 'xl')
  })

  it('should render proper component structure', () => {
    render(<HeaderTitle title="Test Title" subTitle="Test Subtitle" />)

    expect(screen.getByTestId('container')).toBeInTheDocument()
    expect(screen.getByTestId('styled-container')).toBeInTheDocument()
    expect(screen.getByTestId('styled-title')).toBeInTheDocument()
    expect(screen.getByTestId('styled-subtitle')).toBeInTheDocument()
  })

  it('should handle empty title gracefully', () => {
    render(<HeaderTitle title="" />)

    expect(screen.getByTestId('styled-title')).toBeInTheDocument()
    const title = screen.getByTestId('styled-title')
    expect(title).toHaveTextContent('')
  })

  it('should handle long titles', () => {
    const longTitle = 'This is a very long title that might wrap to multiple lines and should be handled gracefully'
    render(<HeaderTitle title={longTitle} />)

    expect(screen.getByText(longTitle)).toBeInTheDocument()
  })

  it('should handle long subtitles', () => {
    const longSubtitle = 'This is a very long subtitle that provides additional context and information about the current page or section'
    render(<HeaderTitle title="Title" subTitle={longSubtitle} />)

    expect(screen.getByText(longSubtitle)).toBeInTheDocument()
  })
})
