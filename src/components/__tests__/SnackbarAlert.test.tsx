import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import SnackbarAlert from '../SnackbarAlert'
import { lightTheme } from '@theme/themes'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>
    {children}
  </ThemeProvider>
)

describe('SnackbarAlert', () => {
  const mockSetOpen = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render snackbar when open is true', () => {
    render(
      <TestWrapper>
        <SnackbarAlert 
          open={true} 
          setOpen={mockSetOpen} 
          message="Test error message" 
        />
      </TestWrapper>
    )

    expect(screen.getByText('Test error message')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('should not render snackbar when open is false', () => {
    render(
      <TestWrapper>
        <SnackbarAlert 
          open={false} 
          setOpen={mockSetOpen} 
          message="Test error message" 
        />
      </TestWrapper>
    )

    expect(screen.queryByText('Test error message')).not.toBeInTheDocument()
  })

  it('should call setOpen with false when close button is clicked', () => {
    render(
      <TestWrapper>
        <SnackbarAlert 
          open={true} 
          setOpen={mockSetOpen} 
          message="Test error message" 
        />
      </TestWrapper>
    )

    const closeButtons = screen.getAllByLabelText('Close')
    fireEvent.click(closeButtons[0])

    expect(mockSetOpen).toHaveBeenCalledWith(false)
  })

  it('should have correct anchor position', () => {
    const { container } = render(
      <TestWrapper>
        <SnackbarAlert 
          open={true} 
          setOpen={mockSetOpen} 
          message="Test error message" 
        />
      </TestWrapper>
    )

    const snackbar = container.querySelector('.MuiSnackbar-root')
    expect(snackbar).toHaveClass('MuiSnackbar-anchorOriginBottomCenter')
  })

  it('should display correct message', () => {
    const testMessage = "Custom error message"
    render(
      <TestWrapper>
        <SnackbarAlert 
          open={true} 
          setOpen={mockSetOpen} 
          message={testMessage} 
        />
      </TestWrapper>
    )

    expect(screen.getByText(testMessage)).toBeInTheDocument()
  })

  it('should not close on clickaway', () => {
    render(
      <TestWrapper>
        <SnackbarAlert 
          open={true} 
          setOpen={mockSetOpen} 
          message="Test error message" 
        />
      </TestWrapper>
    )

    // Simulate clickaway event
    const snackbar = screen.getByRole('alert').parentElement?.parentElement
    if (snackbar) {
      fireEvent.click(document.body)
    }

    expect(mockSetOpen).not.toHaveBeenCalled()
  })

  it('should have error severity alert', () => {
    render(
      <TestWrapper>
        <SnackbarAlert 
          open={true} 
          setOpen={mockSetOpen} 
          message="Test error message" 
        />
      </TestWrapper>
    )

    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('MuiAlert-filledError')
  })

  it('should render close icon in action button', () => {
    render(
      <TestWrapper>
        <SnackbarAlert 
          open={true} 
          setOpen={mockSetOpen} 
          message="Test error message" 
        />
      </TestWrapper>
    )

    const closeButton = screen.getAllByLabelText('Close')[0]
    expect(closeButton).toBeInTheDocument()
    expect(closeButton.querySelector('svg')).toBeInTheDocument()
  })
})
