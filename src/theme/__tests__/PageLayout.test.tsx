import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import PageLayout from '../PageLayout'
import { useMainStore } from '@services/stores/useMainStore'

// Mock child components
vi.mock('@components/Header/Header', () => ({
  default: () => <div data-testid="header">Header</div>
}))

vi.mock('@components/Header/HeaderTitle/HeaderTitle', () => ({
  default: ({ title, subTitle }: { title: string; subTitle: string }) => (
    <div data-testid="header-title" data-title={title} data-subtitle={subTitle}>
      {title} - {subTitle}
    </div>
  )
}))

vi.mock('@components/VersionInfo/VersionInfo', () => ({
  default: () => <div data-testid="version-info">Version Info</div>
}))

vi.mock('@components/Banner/Banner', () => ({
  default: () => <div data-testid="banner">Banner</div>
}))

vi.mock('@components/Header/StatsBox/StatsBox', () => ({
  default: ({ variant }: { variant?: string }) => (
    <div data-testid="stats-box" data-variant={variant}>Stats Box</div>
  )
}))

// Mock the main store
vi.mock('@services/stores/useMainStore', () => ({
  useMainStore: vi.fn()
}))

// Mock Outlet
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Page Content</div>
  }
})

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('PageLayout', () => {
  beforeEach(() => {
    (useMainStore as any).mockImplementation((selector) => {
      const state = { isMobile: false }
      return selector(state)
    })
  })

  it('should render all main components', () => {
    render(
      <TestWrapper>
        <PageLayout />
      </TestWrapper>
    )

    expect(screen.getByTestId('banner')).toBeInTheDocument()
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('header-title')).toBeInTheDocument()
    expect(screen.getByTestId('outlet')).toBeInTheDocument()
    expect(screen.getByTestId('version-info')).toBeInTheDocument()
  })

  it('should render HeaderTitle with provided title and subtitle', () => {
    render(
      <TestWrapper>
        <PageLayout title="Test Title" subTitle="Test Subtitle" />
      </TestWrapper>
    )

    const headerTitle = screen.getByTestId('header-title')
    expect(headerTitle).toHaveAttribute('data-title', 'Test Title')
    expect(headerTitle).toHaveAttribute('data-subtitle', 'Test Subtitle')
  })

  it('should render HeaderTitle with empty strings when no title/subtitle provided', () => {
    render(
      <TestWrapper>
        <PageLayout />
      </TestWrapper>
    )

    const headerTitle = screen.getByTestId('header-title')
    expect(headerTitle).toHaveAttribute('data-title', '')
    expect(headerTitle).toHaveAttribute('data-subtitle', '')
  })

  it('should render custom header instead of HeaderTitle when provided', () => {
    const CustomHeader = () => <div data-testid="custom-header">Custom Header</div>
    
    render(
      <TestWrapper>
        <PageLayout customHeader={<CustomHeader />} />
      </TestWrapper>
    )

    expect(screen.getByTestId('custom-header')).toBeInTheDocument()
    expect(screen.queryByTestId('header-title')).not.toBeInTheDocument()
  })

  it('should not render mobile stats box when isMobile is false', () => {
    (useMainStore as any).mockImplementation((selector) => {
      const state = { isMobile: false }
      return selector(state)
    })

    render(
      <TestWrapper>
        <PageLayout />
      </TestWrapper>
    )

    expect(screen.queryByTestId('stats-box')).not.toBeInTheDocument()
  })

  it('should render mobile stats box when isMobile is true', () => {
    (useMainStore as any).mockImplementation((selector) => {
      const state = { isMobile: true }
      return selector(state)
    })

    render(
      <TestWrapper>
        <PageLayout />
      </TestWrapper>
    )

    const statsBox = screen.getByTestId('stats-box')
    expect(statsBox).toBeInTheDocument()
    expect(statsBox).toHaveAttribute('data-variant', 'mobile')
  })

  it('should have proper container structure with minHeight', () => {
    render(
      <TestWrapper>
        <PageLayout />
      </TestWrapper>
    )

    // Check for Material-UI components existence
    const container = document.querySelector('.MuiContainer-root')
    expect(container).toBeInTheDocument()
    
    const grid = document.querySelector('.MuiGrid-root')
    expect(grid).toBeInTheDocument()
  })

  it('should apply main-bg class to grid container', () => {
    render(
      <TestWrapper>
        <PageLayout />
      </TestWrapper>
    )

    const element = document.querySelector('.main-bg')
    expect(element).toBeInTheDocument()
  })

  it('should handle all prop combinations', () => {
    const CustomHeader = () => <div data-testid="custom-header">Custom Header</div>
    
    render(
      <TestWrapper>
        <PageLayout 
          title="Test Title"
          subTitle="Test Subtitle"
          customHeader={<CustomHeader />}
        />
      </TestWrapper>
    )

    // When customHeader is provided, title and subtitle should be ignored
    expect(screen.getByTestId('custom-header')).toBeInTheDocument()
    expect(screen.queryByTestId('header-title')).not.toBeInTheDocument()
  })

  it('should call useMainStore with correct selector', () => {
    render(
      <TestWrapper>
        <PageLayout />
      </TestWrapper>
    )

    expect(useMainStore).toHaveBeenCalledWith(expect.any(Function))
    
    // Test the selector function
    const selectorFn = (useMainStore as any).mock.calls[0][0]
    const mockState = { isMobile: true, otherProp: 'test' }
    expect(selectorFn(mockState)).toBe(true)
  })

  it('should render Box component for spacing', () => {
    render(
      <TestWrapper>
        <PageLayout />
      </TestWrapper>
    )

    // Box component should exist (height={40} for spacing)
    const box = document.querySelector('.MuiBox-root')
    expect(box).toBeInTheDocument()
  })
})
