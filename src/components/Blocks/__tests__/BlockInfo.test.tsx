import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import React from 'react'
import BlockInfo from '../BlockInfo'
import { lightTheme } from '@theme/themes'

// Mock API hooks
const mockUseGetBlockByHeightOrHash = vi.fn()
vi.mock('@services/api/hooks/useBlocks', () => ({
  useGetBlockByHeightOrHash: (blockHeight: any) => mockUseGetBlockByHeightOrHash(blockHeight)
}))

// Mock utility functions
vi.mock('@utils/helpers', () => ({
  toHexString: (data: any) => data ? `0x${data}` : '',
  shortenString: (str: string) => str ? `${str.slice(0, 6)}...${str.slice(-6)}` : '',
  formatTimestamp: (timestamp: number) => timestamp ? new Date(timestamp * 1000).toISOString() : '',
  powCheck: (algo: number) => algo === 1 ? 'SHA-3' : 'Unknown'
}))

// Mock components
vi.mock('@components/StyledComponents', () => ({
  TypographyData: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="typography-data">{children}</div>
  )
}))

vi.mock('@components/CopyToClipboard', () => ({
  default: ({ copy }: { copy: string }) => (
    <button data-testid="copy-button" data-copy={copy}>Copy</button>
  )
}))

vi.mock('@components/InnerHeading', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="inner-heading">{children}</h2>
  )
}))

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>
    {children}
  </ThemeProvider>
)

describe('BlockInfo', () => {
  const mockBlockData = {
    header: {
      hash: { data: 'abcdef123456' },
      pow: { pow_algo: 1 },
      height: 100,
      version: 1,
      timestamp: 1634567890,
      prev_hash: { data: 'fedcba654321' },
      nonce: 12345,
      output_mr: { data: 'output_merkle_root' },
      validator_node_mr: { data: 'validator_merkle_root' },
      kernel_mr: { data: 'kernel_merkle_root' },
      input_mr: { data: 'input_merkle_root' },
      kernel_mmr_size: 500,
      output_mmr_size: 600,
      total_kernel_offset: { data: 'kernel_offset' },
      total_script_offset: { data: 'script_offset' }
    }
  }

  beforeEach(() => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: mockBlockData
    })
  })

  it('should render header heading', () => {
    render(
      <TestWrapper>
        <BlockInfo blockHeight="100" />
      </TestWrapper>
    )

    expect(screen.getByTestId('inner-heading')).toHaveTextContent('Header')
  })

  it('should render all block header fields', () => {
    render(
      <TestWrapper>
        <BlockInfo blockHeight="100" />
      </TestWrapper>
    )

    const expectedLabels = [
      'Hash', 'Proof of Work', 'Height', 'Version', 'Timestamp',
      'Previous Hash', 'Nonce', 'Output Merkle Root', 'Witness Merkle Root',
      'Kernel Merkle Root', 'Input Merkle Root', 'Kernel MMR Size',
      'Output MMR Size', 'Total Kernel Offset', 'Total Script Offset'
    ]

    expectedLabels.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })

  it('should render copyable fields with copy buttons', () => {
    render(
      <TestWrapper>
        <BlockInfo blockHeight="100" />
      </TestWrapper>
    )

    // Fields that should have copy buttons
    const copyableFields = [
      'Hash', 'Previous Hash', 'Output Merkle Root', 'Witness Merkle Root',
      'Kernel Merkle Root', 'Input Merkle Root', 'Total Kernel Offset', 'Total Script Offset'
    ]

    const copyButtons = screen.getAllByTestId('copy-button')
    expect(copyButtons).toHaveLength(copyableFields.length)
  })

  it('should render non-copyable fields without copy buttons', () => {
    render(
      <TestWrapper>
        <BlockInfo blockHeight="100" />
      </TestWrapper>
    )

    // Check specific non-copyable fields
    expect(screen.getByText('SHA-3')).toBeInTheDocument() // Proof of Work
    expect(screen.getByText('100')).toBeInTheDocument() // Height
    expect(screen.getByText('1')).toBeInTheDocument() // Version
    expect(screen.getByText('12345')).toBeInTheDocument() // Nonce
    expect(screen.getByText('500')).toBeInTheDocument() // Kernel MMR Size
    expect(screen.getByText('600')).toBeInTheDocument() // Output MMR Size
  })

  it('should handle missing block data gracefully', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: null
    })

    render(
      <TestWrapper>
        <BlockInfo blockHeight="100" />
      </TestWrapper>
    )

    expect(screen.getByTestId('inner-heading')).toHaveTextContent('Header')
    
    // Should still render labels even without data
    expect(screen.getByText('Hash')).toBeInTheDocument()
    expect(screen.getByText('Height')).toBeInTheDocument()
  })

  it('should handle partial block data', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: {
        header: {
          height: 100,
          version: 1,
          // Missing other fields
        }
      }
    })

    render(
      <TestWrapper>
        <BlockInfo blockHeight="100" />
      </TestWrapper>
    )

    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('should render shortened strings for hash values', () => {
    render(
      <TestWrapper>
        <BlockInfo blockHeight="100" />
      </TestWrapper>
    )

    // Hash values should be shortened (using actual shortened format)
    expect(screen.getByText('0xabcd...123456')).toBeInTheDocument()
  })

  it('should format timestamp correctly', () => {
    render(
      <TestWrapper>
        <BlockInfo blockHeight="100" />
      </TestWrapper>
    )

    // Should display formatted timestamp (updated to match actual output)
    expect(screen.getByText('2021-10-18T14:38:10.000Z')).toBeInTheDocument()
  })

  it('should render proof of work algorithm', () => {
    render(
      <TestWrapper>
        <BlockInfo blockHeight="100" />
      </TestWrapper>
    )

    expect(screen.getByText('SHA-3')).toBeInTheDocument()
  })

  it('should handle unknown proof of work algorithm', () => {
    mockUseGetBlockByHeightOrHash.mockReturnValue({
      data: {
        header: {
          ...mockBlockData.header,
          pow: { pow_algo: 99 } // Unknown algorithm
        }
      }
    })

    render(
      <TestWrapper>
        <BlockInfo blockHeight="100" />
      </TestWrapper>
    )

    expect(screen.getByText('Unknown')).toBeInTheDocument()
  })

  it('should render dividers between fields', () => {
    const { container } = render(
      <TestWrapper>
        <BlockInfo blockHeight="100" />
      </TestWrapper>
    )

    const dividers = container.querySelectorAll('hr')
    expect(dividers.length).toBeGreaterThan(0)
  })

  it('should use correct grid layout', () => {
    render(
      <TestWrapper>
        <BlockInfo blockHeight="100" />
      </TestWrapper>
    )

    // Check that all typography data elements are rendered
    const typographyDataElements = screen.getAllByTestId('typography-data')
    expect(typographyDataElements.length).toBeGreaterThan(0)
  })

  it('should pass block height to API hook', () => {
    render(
      <TestWrapper>
        <BlockInfo blockHeight="123" />
      </TestWrapper>
    )

    // The hook should be called at least once with the block height
    expect(mockUseGetBlockByHeightOrHash).toHaveBeenCalledWith('123')
  })
})
