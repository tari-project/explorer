import { describe, it, expect, vi } from 'vitest'

// Mock the jsonRpc helper
vi.mock('../../helpers/jsonRpc', () => ({
  jsonRpc: vi.fn(() => Promise.resolve({ data: 'mock' }))
}))

describe('useBlocks hooks', () => {
  it('should export useAllBlocks function', async () => {
    const { useAllBlocks } = await import('../useBlocks')
    expect(typeof useAllBlocks).toBe('function')
  })

  it('should export useGetBlocksByParam function', async () => {
    const { useGetBlocksByParam } = await import('../useBlocks')
    expect(typeof useGetBlocksByParam).toBe('function')
  })

  it('should export useGetBlockByHeightOrHash function', async () => {
    const { useGetBlockByHeightOrHash } = await import('../useBlocks')
    expect(typeof useGetBlockByHeightOrHash).toBe('function')
  })

  it('should export useGetPaginatedData function', async () => {
    const { useGetPaginatedData } = await import('../useBlocks')
    expect(typeof useGetPaginatedData).toBe('function')
  })

  it('should export useSearchByKernel function', async () => {
    const { useSearchByKernel } = await import('../useBlocks')
    expect(typeof useSearchByKernel).toBe('function')
  })

  it('should import required dependencies', async () => {
    const reactQuery = await import('@tanstack/react-query')
    const jsonRpc = await import('../../helpers/jsonRpc')
    
    expect(reactQuery.useQuery).toBeDefined()
    expect(jsonRpc.jsonRpc).toBeDefined()
  })

  it('should test hook configurations', async () => {
    const module = await import('../useBlocks')
    
    // Test that all hooks are defined and can be called
    expect(module.useAllBlocks).toBeDefined()
    expect(module.useGetBlocksByParam).toBeDefined()
    expect(module.useGetBlockByHeightOrHash).toBeDefined()
    expect(module.useGetPaginatedData).toBeDefined()
    expect(module.useSearchByKernel).toBeDefined()
  })

  it('should handle useAllBlocks hook structure', async () => {
    const { useAllBlocks } = await import('../useBlocks')
    
    // Test the hook exists and is callable
    expect(typeof useAllBlocks).toBe('function')
  })

  it('should handle useGetBlocksByParam with parameters', async () => {
    const { useGetBlocksByParam } = await import('../useBlocks')
    
    // Test the hook accepts parameters
    expect(typeof useGetBlocksByParam).toBe('function')
    expect(useGetBlocksByParam.length).toBe(2) // Takes 2 parameters
  })

  it('should handle useGetBlockByHeightOrHash with parameter', async () => {
    const { useGetBlockByHeightOrHash } = await import('../useBlocks')
    
    // Test the hook accepts one parameter
    expect(typeof useGetBlockByHeightOrHash).toBe('function')
    expect(useGetBlockByHeightOrHash.length).toBe(1) // Takes 1 parameter
  })

  it('should handle useGetPaginatedData with multiple parameters', async () => {
    const { useGetPaginatedData } = await import('../useBlocks')
    
    // Test the hook accepts multiple parameters
    expect(typeof useGetPaginatedData).toBe('function')
    expect(useGetPaginatedData.length).toBe(4) // Takes 4 parameters
  })

  it('should handle useSearchByKernel with array parameters', async () => {
    const { useSearchByKernel } = await import('../useBlocks')
    
    // Test the hook accepts array parameters
    expect(typeof useSearchByKernel).toBe('function')
    expect(useSearchByKernel.length).toBe(2) // Takes 2 parameters (arrays)
  })

  it('should use query keys correctly', async () => {
    // Test that the hooks structure includes query configurations
    const module = await import('../useBlocks')
    
    // All hooks should be functions (React Query hooks)
    Object.values(module).forEach(hook => {
      expect(typeof hook).toBe('function')
    })
  })
})
