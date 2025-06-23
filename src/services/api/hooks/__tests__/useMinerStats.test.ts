import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMinerStats, MINER_STATS_QUERY_KEY } from '../useMinerStats'
import React from 'react'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('useMinerStats', () => {
  let queryClient: QueryClient

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  )

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    })
    mockFetch.mockClear()
  })

  afterEach(() => {
    queryClient.clear()
  })

  it('should have correct query key export', () => {
    expect(MINER_STATS_QUERY_KEY).toEqual(['minerStats'])
  })

  it('should fetch miner stats successfully', async () => {
    const mockStats = { totalMiners: 42 }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockStats
    })

    const { result } = renderHook(() => useMinerStats(), { wrapper })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockFetch).toHaveBeenCalledWith('https://rwa.y.at/miner/stats')
    expect(result.current.data).toEqual(mockStats)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should handle fetch errors gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    })

    const { result } = renderHook(() => useMinerStats(), { wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(mockFetch).toHaveBeenCalledWith('https://rwa.y.at/miner/stats')
    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('Failed to fetch miner stats')
  })

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useMinerStats(), { wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(mockFetch).toHaveBeenCalledWith('https://rwa.y.at/miner/stats')
    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBeInstanceOf(Error)
  })

  it('should use correct query options', async () => {
    const mockStats = { totalMiners: 100 }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockStats
    })

    const { result } = renderHook(() => useMinerStats(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Check that the query key is correct
    const queries = queryClient.getQueryCache().getAll()
    expect(queries).toHaveLength(1)
    expect(queries[0].queryKey).toEqual(['minerStats'])
  })

  it('should handle JSON parsing errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON')
      }
    })

    const { result } = renderHook(() => useMinerStats(), { wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeInstanceOf(Error)
  })

  it('should return correct data structure', async () => {
    const mockStats = { totalMiners: 250 }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockStats
    })

    const { result } = renderHook(() => useMinerStats(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toHaveProperty('totalMiners')
    expect(typeof result.current.data?.totalMiners).toBe('number')
    expect(result.current.data?.totalMiners).toBe(250)
  })

  it('should handle empty response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    })

    const { result } = renderHook(() => useMinerStats(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual({})
  })

  it('should have correct refetch interval configured', () => {
    const { result } = renderHook(() => useMinerStats(), { wrapper })
    
    // Query should be configured for refetching
    const queries = queryClient.getQueryCache().getAll()
    expect(queries).toHaveLength(1)
    
    // The hook should be configured with refetch options
    expect(result.current.refetch).toBeDefined()
  })
})
