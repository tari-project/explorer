import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Logo from '../Logo'

describe('Logo', () => {
  it('should render SVG logo', () => {
    render(<Logo />)
    
    const svgElement = document.querySelector('svg')
    expect(svgElement).toBeInTheDocument()
  })

  it('should use default fill color when none provided', () => {
    render(<Logo />)
    
    const svgElement = document.querySelector('svg')
    const pathElement = svgElement?.querySelector('path')
    expect(pathElement).toHaveAttribute('fill', '#000')
  })

  it('should use custom fill color when provided', () => {
    render(<Logo fill="#ff0000" />)
    
    const svgElement = document.querySelector('svg')
    const pathElement = svgElement?.querySelector('path')
    expect(pathElement).toHaveAttribute('fill', '#ff0000')
  })

  it('should have correct default dimensions', () => {
    render(<Logo />)
    
    const svgElement = document.querySelector('svg')
    expect(svgElement).toHaveAttribute('width', '202')
    expect(svgElement).toHaveAttribute('height', '42')
    expect(svgElement).toHaveAttribute('viewBox', '0 0 202 42')
  })

  it('should render without errors when no props provided', () => {
    expect(() => {
      render(<Logo />)
    }).not.toThrow()
  })

  it('should have proper SVG namespace', () => {
    render(<Logo />)
    
    const svgElement = document.querySelector('svg')
    expect(svgElement).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg')
  })
})
