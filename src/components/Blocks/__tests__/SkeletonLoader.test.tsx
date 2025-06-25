import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import React from 'react'
import SkeletonLoader from '../SkeletonLoader'
import { lightTheme } from '@theme/themes'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }: any, ref: any) => (
      <div ref={ref} {...props}>{children}</div>
    ))
  }
}))

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>
    {children}
  </ThemeProvider>
)

describe('SkeletonLoader', () => {
  it('should render with default height when no height is provided', () => {
    const { container } = render(
      <TestWrapper>
        <SkeletonLoader />
      </TestWrapper>
    )

    const skeletonBox = container.firstChild as HTMLElement
    expect(skeletonBox).toBeInTheDocument()
    expect(skeletonBox).toHaveStyle({ height: '100px' })
  })

  it('should render with custom height when height prop is provided', () => {
    const { container } = render(
      <TestWrapper>
        <SkeletonLoader height={200} />
      </TestWrapper>
    )

    const skeletonBox = container.firstChild as HTMLElement
    expect(skeletonBox).toBeInTheDocument()
    expect(skeletonBox).toHaveStyle({ height: '200px' })
  })

  it('should apply correct base styles', () => {
    const { container } = render(
      <TestWrapper>
        <SkeletonLoader />
      </TestWrapper>
    )

    const skeletonBox = container.firstChild as HTMLElement
    expect(skeletonBox).toHaveStyle({
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      borderRadius: '8px',
      overflow: 'hidden',
      position: 'relative'
    })
  })

  it('should render inner animated element', () => {
    const { container } = render(
      <TestWrapper>
        <SkeletonLoader />
      </TestWrapper>
    )

    const skeletonBox = container.firstChild as HTMLElement
    const innerBox = skeletonBox.firstChild as HTMLElement
    
    expect(innerBox).toBeInTheDocument()
    expect(innerBox).toHaveStyle({
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: '0px',
      left: '0px'
    })
  })

  it('should handle zero height (defaults to 100px since 0 is falsy)', () => {
    const { container } = render(
      <TestWrapper>
        <SkeletonLoader height={0} />
      </TestWrapper>
    )

    const skeletonBox = container.firstChild as HTMLElement
    // Due to the condition `height ? ${height}px : '100px'`, zero height defaults to 100px
    expect(skeletonBox).toHaveStyle('height: 100px')
  })

  it('should handle large height values', () => {
    const { container } = render(
      <TestWrapper>
        <SkeletonLoader height={1000} />
      </TestWrapper>
    )

    const skeletonBox = container.firstChild as HTMLElement
    expect(skeletonBox).toHaveStyle({ height: '1000px' })
  })

  it('should render with motion.div component', () => {
    const { container } = render(
      <TestWrapper>
        <SkeletonLoader />
      </TestWrapper>
    )

    // Should render as div (due to motion.div mock)
    const skeletonBox = container.firstChild as HTMLElement
    expect(skeletonBox.tagName).toBe('DIV')
  })

  it('should apply gradient background to inner element', () => {
    const { container } = render(
      <TestWrapper>
        <SkeletonLoader />
      </TestWrapper>
    )

    const skeletonBox = container.firstChild as HTMLElement
    const innerBox = skeletonBox.firstChild as HTMLElement
    
    expect(innerBox).toHaveStyle({
      background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.01)%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.01) 75%)'
    })
  })

  it('should render component structure correctly', () => {
    const { container } = render(
      <TestWrapper>
        <SkeletonLoader />
      </TestWrapper>
    )

    // Outer container
    const skeletonBox = container.firstChild as HTMLElement
    expect(skeletonBox).toBeInTheDocument()

    // Inner animated element
    const innerBox = skeletonBox.firstChild as HTMLElement
    expect(innerBox).toBeInTheDocument()

    // Should have exactly one child
    expect(skeletonBox.children).toHaveLength(1)
  })

  it('should accept common height values used in the application', () => {
    const commonHeights = [26, 48, 100, 221]
    
    commonHeights.forEach(height => {
      const { container } = render(
        <TestWrapper>
          <SkeletonLoader height={height} />
        </TestWrapper>
      )

      const skeletonBox = container.firstChild as HTMLElement
      expect(skeletonBox).toHaveStyle({ height: `${height}px` })
    })
  })

  it('should maintain aspect ratio with different heights', () => {
    const { container } = render(
      <TestWrapper>
        <SkeletonLoader height={50} />
      </TestWrapper>
    )

    const skeletonBox = container.firstChild as HTMLElement
    const innerBox = skeletonBox.firstChild as HTMLElement
    
    // Inner box should maintain 100% width and height regardless of outer height
    expect(innerBox).toHaveStyle({
      width: '100%',
      height: '100%'
    })
  })
})
