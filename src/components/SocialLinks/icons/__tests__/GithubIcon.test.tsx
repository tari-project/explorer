import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import GithubIcon from '../GithubIcon'

describe('GithubIcon', () => {
  it('should render github icon svg', () => {
    const { container } = render(<GithubIcon />)
    
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('width', '21')
    expect(svg).toHaveAttribute('height', '21')
  })

  it('should have correct svg attributes', () => {
    const { container } = render(<GithubIcon />)
    
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('viewBox', '0 0 21 21')
    expect(svg).toHaveAttribute('fill', 'none')
  })

  it('should contain path element', () => {
    const { container } = render(<GithubIcon />)
    
    const path = container.querySelector('path')
    expect(path).toBeInTheDocument()
    expect(path).toHaveAttribute('fill', 'white')
    expect(path).toHaveAttribute('fill-opacity', '0.75')
  })

  it('should contain clipPath definition', () => {
    const { container } = render(<GithubIcon />)
    
    const clipPath = container.querySelector('clipPath')
    expect(clipPath).toBeInTheDocument()
    expect(clipPath).toHaveAttribute('id', 'clip0_1179_19566')
  })
})
