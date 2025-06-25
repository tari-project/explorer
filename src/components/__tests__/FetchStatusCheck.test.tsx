import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import FetchStatusCheck from '../FetchStatusCheck'
import { lightTheme } from '@theme/themes'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>
    {children}
  </ThemeProvider>
)

describe('FetchStatusCheck', () => {
  it('should render Loading component when isLoading is true', () => {
    render(
      <TestWrapper>
        <FetchStatusCheck 
          isLoading={true} 
          isError={false} 
          errorMessage="" 
        />
      </TestWrapper>
    )

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
  })

  it('should render Error component when isError is true', () => {
    const errorMessage = 'Failed to load data'
    
    render(
      <TestWrapper>
        <FetchStatusCheck 
          isLoading={false} 
          isError={true} 
          errorMessage={errorMessage} 
        />
      </TestWrapper>
    )

    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('should render null when neither loading nor error', () => {
    const { container } = render(
      <TestWrapper>
        <FetchStatusCheck 
          isLoading={false} 
          isError={false} 
          errorMessage="" 
        />
      </TestWrapper>
    )

    expect(container.firstChild).toBeNull()
  })

  it('should prioritize loading state over error state', () => {
    render(
      <TestWrapper>
        <FetchStatusCheck 
          isLoading={true} 
          isError={true} 
          errorMessage="Error message" 
        />
      </TestWrapper>
    )

    // Should show loading, not error
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
    
    // Should not show error
    const alert = screen.queryByRole('alert')
    expect(alert).not.toBeInTheDocument()
  })

  it('should handle empty error message', () => {
    render(
      <TestWrapper>
        <FetchStatusCheck 
          isLoading={false} 
          isError={true} 
          errorMessage="" 
        />
      </TestWrapper>
    )

    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveTextContent('')
  })

  it('should handle long error messages', () => {
    const longErrorMessage = 'This is a very long error message that should be handled properly by the component without breaking the layout or functionality of the error display'
    
    render(
      <TestWrapper>
        <FetchStatusCheck 
          isLoading={false} 
          isError={true} 
          errorMessage={longErrorMessage} 
        />
      </TestWrapper>
    )

    expect(screen.getByText(longErrorMessage)).toBeInTheDocument()
  })

  it('should not render anything when all states are false', () => {
    const { container } = render(
      <TestWrapper>
        <FetchStatusCheck 
          isLoading={false} 
          isError={false} 
          errorMessage="Some error" 
        />
      </TestWrapper>
    )

    expect(container.firstChild).toBeNull()
  })

  it('should handle special characters in error message', () => {
    const specialCharMessage = 'Error: Failed to fetch (404) - {"status": "error", "code": 404}'
    
    render(
      <TestWrapper>
        <FetchStatusCheck 
          isLoading={false} 
          isError={true} 
          errorMessage={specialCharMessage} 
        />
      </TestWrapper>
    )

    expect(screen.getByText(specialCharMessage)).toBeInTheDocument()
  })

  it('should be accessible with proper ARIA roles', () => {
    const { rerender } = render(
      <TestWrapper>
        <FetchStatusCheck 
          isLoading={true} 
          isError={false} 
          errorMessage="" 
        />
      </TestWrapper>
    )

    // Loading state should have progressbar role
    expect(screen.getByRole('progressbar')).toBeInTheDocument()

    rerender(
      <TestWrapper>
        <FetchStatusCheck 
          isLoading={false} 
          isError={true} 
          errorMessage="Test error" 
        />
      </TestWrapper>
    )

    // Error state should have alert role
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
