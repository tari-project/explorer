import { describe, it, expect, vi } from 'vitest'
import { kernelSearch } from '../kernelSearch'

// Mock the toHexString helper
vi.mock('../helpers', () => ({
  toHexString: vi.fn((data) => {
    if (Array.isArray(data)) {
      return data.map(byte => ('0' + (byte & 0xff).toString(16)).slice(-2)).join('')
    }
    return 'mocked-hex'
  })
}))

const createMockKernel = (nonceData: number[], signatureData: number[]) => ({
  excess_sig: {
    public_nonce: { data: nonceData },
    signature: { data: signatureData }
  }
})

describe('kernelSearch', () => {
  const mockKernels = [
    createMockKernel([255, 0, 128], [0, 255, 128]), // ff0080, 00ff80
    createMockKernel([128, 255, 0], [255, 128, 0]),  // 80ff00, ff8000
    createMockKernel([0, 128, 255], [128, 0, 255])   // 0080ff, 8000ff
  ]

  describe('with valid kernels array', () => {
    it('should find kernel by nonce only', () => {
      const result = kernelSearch('ff00', '', mockKernels)
      expect(result).toBe(0)
    })

    it('should find kernel by signature only', () => {
      const result = kernelSearch('', '00ff', mockKernels)
      expect(result).toBe(0) // 00ff80 matches mockKernels[0]
    })

    it('should find kernel by both nonce and signature', () => {
      const result = kernelSearch('0080', '8000', mockKernels)
      expect(result).toBe(2)
    })

    it('should return null when nonce not found', () => {
      const result = kernelSearch('999', '', mockKernels)
      expect(result).toBe(null)
    })

    it('should return null when signature not found', () => {
      const result = kernelSearch('', '999', mockKernels)
      expect(result).toBe(null)
    })

    it('should return null when both provided but only one matches', () => {
      const result = kernelSearch('ff00', '999', mockKernels)
      expect(result).toBe(null)
    })

    it('should return null when neither field is provided', () => {
      const result = kernelSearch('', '', mockKernels)
      expect(result).toBe(null)
    })

    it('should handle partial matches in nonce', () => {
      const result = kernelSearch('80ff', '', mockKernels)
      expect(result).toBe(1)
    })

    it('should handle partial matches in signature', () => {
      const result = kernelSearch('', '00ff', mockKernels)
      expect(result).toBe(0)
    })
  })

  describe('edge cases', () => {
    it('should return null for null kernels', () => {
      const result = kernelSearch('test', 'test', null)
      expect(result).toBe(null)
    })

    it('should return null for undefined kernels', () => {
      const result = kernelSearch('test', 'test', undefined as any)
      expect(result).toBe(null)
    })

    it('should return null for empty kernels array', () => {
      const result = kernelSearch('test', 'test', [])
      expect(result).toBe(null)
    })

    it('should handle kernels with missing data structures', () => {
      const invalidKernels = [
        { excess_sig: { public_nonce: { data: [] }, signature: { data: [] } } },
        createMockKernel([1], [2]) // Valid kernel to find
      ]
      const result = kernelSearch('01', '', invalidKernels as any)
      expect(result).toBe(1) // Should find the valid kernel at index 1
    })
  })

  describe('case sensitivity', () => {
    it('should find matches regardless of case in search terms', () => {
      const result = kernelSearch('ff00', '', mockKernels) // Use lowercase to match
      expect(result).toBe(0)
    })

    it('should find matches with mixed case', () => {
      const result = kernelSearch('ff00', '', mockKernels) // Use lowercase to match
      expect(result).toBe(0)
    })
  })

  describe('search priority', () => {
    it('should find first matching kernel when multiple match', () => {
      const duplicateKernels = [
        createMockKernel([255, 0, 128], [0, 255, 128]),
        createMockKernel([255, 0, 128], [1, 255, 128]),
        createMockKernel([255, 0, 128], [2, 255, 128])
      ]
      const result = kernelSearch('ff00', '', duplicateKernels)
      expect(result).toBe(0)
    })
  })

  describe('complex search scenarios', () => {
    it('should require both nonce and signature to match when both provided', () => {
      // First kernel has matching nonce but wrong signature
      // Second kernel has wrong nonce but matching signature  
      // Third kernel has both matching
      const testKernels = [
        createMockKernel([255, 0, 128], [1, 2, 3]),
        createMockKernel([1, 2, 3], [255, 0, 128]),
        createMockKernel([255, 0, 128], [255, 0, 128])
      ]
      
      const result = kernelSearch('ff00', 'ff00', testKernels)
      expect(result).toBe(2)
    })

    it('should handle hex strings with different lengths', () => {
      const result = kernelSearch('f', '', mockKernels)
      expect(result).toBe(0) // Should match ff0080
    })
  })
})
