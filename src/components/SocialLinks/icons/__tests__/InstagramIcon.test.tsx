import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import InstagramIcon from '../InstagramIcon'

describe('InstagramIcon', () => {
  it('should render the Instagram icon', () => {
    const { container } = render(<InstagramIcon />)
    
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('viewBox', '0 0 21 21')
  })

  it('should have correct SVG structure', () => {
    const { container } = render(<InstagramIcon />)
    
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('width', '21')
    expect(svg).toHaveAttribute('height', '21')
  })

  it('should contain path elements', () => {
    const { container } = render(<InstagramIcon />)
    
    const paths = container.querySelectorAll('path')
    expect(paths).toHaveLength(3)
  })
})
