import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TariLogo from '../TariLogo'

describe('TariLogo', () => {
  it('should render SVG with default props', () => {
    render(<TariLogo />)
    
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('width', '240')
    expect(svg).toHaveAttribute('height', '42')
    expect(svg).toHaveAttribute('viewBox', '0 0 240 42')
  })

  it('should render with custom fill color', () => {
    render(<TariLogo fill="#ff0000" />)
    
    const paths = document.querySelectorAll('path')
    expect(paths.length).toBeGreaterThan(0)
    
    // Check that at least one path has the custom fill
    const pathsWithFill = Array.from(paths).filter(path => 
      path.getAttribute('fill') === '#ff0000'
    )
    expect(pathsWithFill.length).toBeGreaterThan(0)
  })

  it('should use default white fill when no fill provided', () => {
    render(<TariLogo />)
    
    const paths = document.querySelectorAll('path')
    expect(paths.length).toBeGreaterThan(0)
    
    // Check that paths have default white fill
    const pathsWithDefaultFill = Array.from(paths).filter(path => 
      path.getAttribute('fill') === '#FFFFFF'
    )
    expect(pathsWithDefaultFill.length).toBeGreaterThan(0)
  })

  it('should render as link when link prop provided', () => {
    render(<TariLogo link="https://example.com" />)
    
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should render SVG directly when no link provided', () => {
    render(<TariLogo />)
    
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
    
    // Should not be wrapped in a link
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('should have correct SVG structure', () => {
    render(<TariLogo />)
    
    const svg = document.querySelector('svg')
    expect(svg).toHaveAttribute('fill', 'none')
    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg')
    
    const paths = document.querySelectorAll('path')
    expect(paths.length).toBeGreaterThan(0)
  })
})
