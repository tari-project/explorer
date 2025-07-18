import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import XIcon from '../XIcon'

describe('XIcon', () => {
  it('should render X icon svg', () => {
    const { container } = render(<XIcon />)
    
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('should contain path element', () => {
    const { container } = render(<XIcon />)
    
    const path = container.querySelector('path')
    expect(path).toBeInTheDocument()
  })
})
