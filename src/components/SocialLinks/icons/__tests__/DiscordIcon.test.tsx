import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import DiscordIcon from '../DiscordIcon'

describe('DiscordIcon', () => {
  it('should render Discord icon svg', () => {
    const { container } = render(<DiscordIcon />)
    
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('should contain path element', () => {
    const { container } = render(<DiscordIcon />)
    
    const path = container.querySelector('path')
    expect(path).toBeInTheDocument()
  })
})
