import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import Loading from '../Loading'
import { lightTheme } from '@theme/themes'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>
    {children}
  </ThemeProvider>
)

describe('Loading', () => {
  it('should render circular progress indicator', () => {
    render(
      <TestWrapper>
        <Loading />
      </TestWrapper>
    )

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
  })

  it('should have centered layout styles', () => {
    render(
      <TestWrapper>
        <Loading />
      </TestWrapper>
    )

    const container = screen.getByRole('progressbar').parentElement
    expect(container).toHaveStyle({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      padding: '2rem',
      flexDirection: 'column'
    })
  })

  it('should render without any props', () => {
    expect(() => {
      render(
        <TestWrapper>
          <Loading />
        </TestWrapper>
      )
    }).not.toThrow()
  })

  it('should be accessible with proper ARIA role', () => {
    render(
      <TestWrapper>
        <Loading />
      </TestWrapper>
    )

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveAttribute('role', 'progressbar')
  })

  it('should contain CircularProgress component', () => {
    render(
      <TestWrapper>
        <Loading />
      </TestWrapper>
    )

    // Check that the CircularProgress is rendered by looking for its specific structure
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass('MuiCircularProgress-root')
  })
})
