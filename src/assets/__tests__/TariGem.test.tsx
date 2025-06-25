import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TariGem from '../TariGem'

describe('TariGem', () => {
  it('should render SVG with default props', () => {
    render(<TariGem />)
    
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('width', '24')
    expect(svg).toHaveAttribute('height', '24')
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
  })

  it('should render with custom fill color', () => {
    render(<TariGem fill="#ff0000" />)
    
    const path = document.querySelector('path')
    expect(path).toHaveAttribute('fill', '#ff0000')
  })

  it('should use default black fill when no fill provided', () => {
    render(<TariGem />)
    
    const path = document.querySelector('path')
    expect(path).toHaveAttribute('fill', '#000')
  })

  it('should have correct SVG structure', () => {
    render(<TariGem />)
    
    const svg = document.querySelector('svg')
    expect(svg).toHaveAttribute('fill', 'none')
    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg')
    
    const path = document.querySelector('path')
    expect(path).toBeDefined()
  })
})
