import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import TelegramIcon from '../TelegramIcon'

describe('TelegramIcon', () => {
  it('should render the Telegram icon', () => {
    const { container } = render(<TelegramIcon />)
    
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('viewBox', '0 0 21 21')
  })

  it('should have correct SVG structure', () => {
    const { container } = render(<TelegramIcon />)
    
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('width', '21')
    expect(svg).toHaveAttribute('height', '21')
  })

  it('should contain path element', () => {
    const { container } = render(<TelegramIcon />)
    
    const path = container.querySelector('path')
    expect(path).toBeInTheDocument()
  })
})
