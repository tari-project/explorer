import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

// Mock environment variable
vi.mock('../../helpers/jsonRpc', () => ({
  jsonRpc: vi.fn()
}))

// Mock environment
Object.defineProperty(globalThis, 'import', {
  value: { meta: { env: { VITE_ADDRESS: 'http://localhost:3000' } } },
  writable: true
})

const mockJsonRpc = vi.mocked(await import('../../helpers/jsonRpc')).jsonRpc

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useBlocks hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('useAllBlocks', () => {
    it('should fetch all blocks data successfully', async () => {
      const mockData = {
        blocks: [{ height: 1, hash: 'abc123' }],
        tipInfo: { metadata: { best_block_height: 1 } }
      }
      mockJsonRpc.mockResolvedValue(mockData)

      const { useAllBlocks } = await import('../useBlocks')
      const { result } = renderHook(() => useAllBlocks(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockJsonRpc).toHaveBeenCalledWith('http://localhost:3000/?json')
      expect(result.current.data).toEqual(mockData)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe(null)
    })

    it('should handle fetch errors gracefully', async () => {
      const mockError = new Error('Network error')
      mockJsonRpc.mockRejectedValue(mockError)

      const { useAllBlocks } = await import('../useBlocks')
      const { result } = renderHook(() => useAllBlocks(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toBeTruthy()
      expect(result.current.data).toBeUndefined()
    })

    it('should use correct query key for caching', async () => {
      mockJsonRpc.mockResolvedValue({ data: 'test' })

      const { useAllBlocks } = await import('../useBlocks')
      const { result } = renderHook(() => useAllBlocks(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      // Query key should be ['blocks']
      expect(mockJsonRpc).toHaveBeenCalledTimes(1)
    })

    it('should refetch data at correct interval', async () => {
      vi.useFakeTimers()
      mockJsonRpc.mockResolvedValue({ data: 'test' })

      const { useAllBlocks } = await import('../useBlocks')
      renderHook(() => useAllBlocks(), {
        wrapper: createWrapper(),
      })

      // Fast forward 2 minutes (120000ms)
      vi.advanceTimersByTime(120000)

      await waitFor(() => {
        expect(mockJsonRpc).toHaveBeenCalledTimes(2)
      })

      vi.useRealTimers()
    })
  })

  describe('useGetBlocksByParam', () => {
    it('should fetch blocks with from and limit parameters', async () => {
      const mockData = { blocks: [{ height: 10 }] }
      mockJsonRpc.mockResolvedValue(mockData)

      const { useGetBlocksByParam } = await import('../useBlocks')
      const { result } = renderHook(() => useGetBlocksByParam(10, 50), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockJsonRpc).toHaveBeenCalledWith('http://localhost:3000/?from=10&limit=50&json')
      expect(result.current.data).toEqual(mockData)
    })

    it('should handle different parameter values', async () => {
      mockJsonRpc.mockResolvedValue({ blocks: [] })

      const { useGetBlocksByParam } = await import('../useBlocks')
      const { result } = renderHook(() => useGetBlocksByParam(0, 100), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockJsonRpc).toHaveBeenCalledWith('http://localhost:3000/?from=0&limit=100&json')
    })

    it('should handle errors in parameterized requests', async () => {
      mockJsonRpc.mockRejectedValue(new Error('Invalid parameters'))

      const { useGetBlocksByParam } = await import('../useBlocks')
      const { result } = renderHook(() => useGetBlocksByParam(-1, 0), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toBeTruthy()
    })

    it('should use unique cache keys for different parameters', async () => {
      mockJsonRpc.mockResolvedValue({ blocks: [] })

      const { useGetBlocksByParam } = await import('../useBlocks')
      
      // Render hook with different parameters
      const { result: result1 } = renderHook(() => useGetBlocksByParam(10, 50), {
        wrapper: createWrapper(),
      })
      
      const { result: result2 } = renderHook(() => useGetBlocksByParam(20, 50), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true)
        expect(result2.current.isSuccess).toBe(true)
      })

      // Should make separate API calls for different parameters
      expect(mockJsonRpc).toHaveBeenCalledTimes(2)
      expect(mockJsonRpc).toHaveBeenCalledWith('http://localhost:3000/?from=10&limit=50&json')
      expect(mockJsonRpc).toHaveBeenCalledWith('http://localhost:3000/?from=20&limit=50&json')
    })
  })

  describe('useGetBlockByHeightOrHash', () => {
    it('should fetch block by height', async () => {
      const mockBlockData = { 
        header: { height: 123 }, 
        body: { outputs: [], inputs: [], kernels: [] } 
      }
      mockJsonRpc.mockResolvedValue(mockBlockData)

      const { useGetBlockByHeightOrHash } = await import('../useBlocks')
      const { result } = renderHook(() => useGetBlockByHeightOrHash('123'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockJsonRpc).toHaveBeenCalledWith('http://localhost:3000/blocks/123?json', 'Block not found')
      expect(result.current.data).toEqual(mockBlockData)
    })

    it('should fetch block by hash', async () => {
      const blockHash = 'abc123def456'
      const mockBlockData = { header: { hash: blockHash } }
      mockJsonRpc.mockResolvedValue(mockBlockData)

      const { useGetBlockByHeightOrHash } = await import('../useBlocks')
      const { result } = renderHook(() => useGetBlockByHeightOrHash(blockHash), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockJsonRpc).toHaveBeenCalledWith(`http://localhost:3000/blocks/${blockHash}?json`, 'Block not found')
      expect(result.current.data).toEqual(mockBlockData)
    })

    it('should handle block not found error', async () => {
      mockJsonRpc.mockRejectedValue(new Error('Block not found'))

      const { useGetBlockByHeightOrHash } = await import('../useBlocks')
      const { result } = renderHook(() => useGetBlockByHeightOrHash('999999'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toBeTruthy()
    })

    it('should handle empty block height', async () => {
      mockJsonRpc.mockResolvedValue(null)

      const { useGetBlockByHeightOrHash } = await import('../useBlocks')
      const { result } = renderHook(() => useGetBlockByHeightOrHash(''), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockJsonRpc).toHaveBeenCalledWith('http://localhost:3000/blocks/?json', 'Block not found')
    })
  })

  describe('useGetPaginatedData', () => {
    it('should fetch paginated outputs data', async () => {
      const mockData = { outputs: [{ commitment: 'abc123' }] }
      mockJsonRpc.mockResolvedValue(mockData)

      const { useGetPaginatedData } = await import('../useBlocks')
      const { result } = renderHook(() => useGetPaginatedData('123', 'outputs', 0, 10), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockJsonRpc).toHaveBeenCalledWith(
        'http://localhost:3000/block_data/123?what=outputs&from=0&to=10&json',
        'Block not found'
      )
      expect(result.current.data).toEqual(mockData)
    })

    it('should fetch paginated inputs data', async () => {
      const mockData = { inputs: [{ output_hash: 'def456' }] }
      mockJsonRpc.mockResolvedValue(mockData)

      const { useGetPaginatedData } = await import('../useBlocks')
      const { result } = renderHook(() => useGetPaginatedData('456', 'inputs', 5, 15), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockJsonRpc).toHaveBeenCalledWith(
        'http://localhost:3000/block_data/456?what=inputs&from=5&to=15&json',
        'Block not found'
      )
      expect(result.current.data).toEqual(mockData)
    })

    it('should fetch paginated kernels data', async () => {
      const mockData = { kernels: [{ excess: 'ghi789' }] }
      mockJsonRpc.mockResolvedValue(mockData)

      const { useGetPaginatedData } = await import('../useBlocks')
      const { result } = renderHook(() => useGetPaginatedData('789', 'kernels', 20, 30), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockJsonRpc).toHaveBeenCalledWith(
        'http://localhost:3000/block_data/789?what=kernels&from=20&to=30&json',
        'Block not found'
      )
      expect(result.current.data).toEqual(mockData)
    })

    it('should handle pagination errors', async () => {
      mockJsonRpc.mockRejectedValue(new Error('Invalid range'))

      const { useGetPaginatedData } = await import('../useBlocks')
      const { result } = renderHook(() => useGetPaginatedData('123', 'outputs', -1, 0), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toBeTruthy()
    })

    it('should use correct cache keys for different pagination params', async () => {
      mockJsonRpc.mockResolvedValue({ data: 'test' })

      const { useGetPaginatedData } = await import('../useBlocks')
      
      // Different block heights should use different cache keys
      const { result: result1 } = renderHook(() => useGetPaginatedData('100', 'outputs', 0, 10), {
        wrapper: createWrapper(),
      })
      
      const { result: result2 } = renderHook(() => useGetPaginatedData('200', 'outputs', 0, 10), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true)
        expect(result2.current.isSuccess).toBe(true)
      })

      expect(mockJsonRpc).toHaveBeenCalledTimes(2)
    })
  })

  describe('useSearchByKernel', () => {
    it('should search by kernel nonces and signatures', async () => {
      const mockData = { results: [{ height: 123, hash: 'abc' }] }
      mockJsonRpc.mockResolvedValue(mockData)

      const nonces = ['nonce1', 'nonce2']
      const signatures = ['sig1', 'sig2']

      const { useSearchByKernel } = await import('../useBlocks')
      const { result } = renderHook(() => useSearchByKernel(nonces, signatures), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockJsonRpc).toHaveBeenCalledWith(
        'http://localhost:3000/search_kernels?nonces=nonce1%2Cnonce2&signatures=sig1%2Csig2&json'
      )
      expect(result.current.data).toEqual(mockData)
    })

    it('should handle empty arrays', async () => {
      const mockData = { results: [] }
      mockJsonRpc.mockResolvedValue(mockData)

      const { useSearchByKernel } = await import('../useBlocks')
      const { result } = renderHook(() => useSearchByKernel([], []), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockJsonRpc).toHaveBeenCalledWith(
        'http://localhost:3000/search_kernels?nonces=&signatures=&json'
      )
    })

    it('should properly encode special characters in parameters', async () => {
      mockJsonRpc.mockResolvedValue({ results: [] })

      const nonces = ['nonce+with/special=chars']
      const signatures = ['sig&with?special#chars']

      const { useSearchByKernel } = await import('../useBlocks')
      const { result } = renderHook(() => useSearchByKernel(nonces, signatures), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      // Should properly encode special characters
      expect(mockJsonRpc).toHaveBeenCalledWith(
        'http://localhost:3000/search_kernels?nonces=nonce%2Bwith%2Fspecial%3Dchars&signatures=sig%26with%3Fspecial%23chars&json'
      )
    })

    it('should handle search errors', async () => {
      mockJsonRpc.mockRejectedValue(new Error('Search failed'))

      const { useSearchByKernel } = await import('../useBlocks')
      const { result } = renderHook(() => useSearchByKernel(['nonce'], ['sig']), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toBeTruthy()
    })

    it('should handle single element arrays', async () => {
      mockJsonRpc.mockResolvedValue({ results: [] })

      const { useSearchByKernel } = await import('../useBlocks')
      const { result } = renderHook(() => useSearchByKernel(['single-nonce'], ['single-sig']), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockJsonRpc).toHaveBeenCalledWith(
        'http://localhost:3000/search_kernels?nonces=single-nonce&signatures=single-sig&json'
      )
    })
  })

  describe('Hook integrations', () => {
    it('should export all expected hooks', async () => {
      const module = await import('../useBlocks')
      
      expect(module.useAllBlocks).toBeDefined()
      expect(module.useGetBlocksByParam).toBeDefined()
      expect(module.useGetBlockByHeightOrHash).toBeDefined()
      expect(module.useGetPaginatedData).toBeDefined()
      expect(module.useSearchByKernel).toBeDefined()
    })

    it('should handle concurrent hook calls without interference', async () => {
      mockJsonRpc.mockImplementation((url) => {
        if (url.includes('blocks/123')) return Promise.resolve({ block: 123 })
        if (url.includes('blocks/456')) return Promise.resolve({ block: 456 })
        return Promise.resolve({ default: 'data' })
      })

      const { useGetBlockByHeightOrHash } = await import('../useBlocks')
      
      const { result: result1 } = renderHook(() => useGetBlockByHeightOrHash('123'), {
        wrapper: createWrapper(),
      })
      
      const { result: result2 } = renderHook(() => useGetBlockByHeightOrHash('456'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true)
        expect(result2.current.isSuccess).toBe(true)
      })

      expect(result1.current.data).toEqual({ block: 123 })
      expect(result2.current.data).toEqual({ block: 456 })
    })
  })
})
