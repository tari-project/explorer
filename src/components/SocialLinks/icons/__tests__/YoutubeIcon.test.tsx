import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import YoutubeIcon from '../YoutubeIcon'

describe('YoutubeIcon', () => {
  it('should render the Youtube icon', () => {
    const { container } = render(<YoutubeIcon />)
    
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('viewBox', '0 0 21 21')
  })

  it('should have correct SVG structure', () => {
    const { container } = render(<YoutubeIcon />)
    
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('width', '21')
    expect(svg).toHaveAttribute('height', '21')
  })

  it('should contain path element', () => {
    const { container } = render(<YoutubeIcon />)
    
    const path = container.querySelector('path')
    expect(path).toBeInTheDocument()
  })
})
