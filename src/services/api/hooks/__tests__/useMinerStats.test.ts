import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMinerStats, MINER_STATS_QUERY_KEY } from '../useMinerStats'
import React from 'react'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

// Create a wrapper component for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  )
}

describe('useMinerStats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should have correct query key', () => {
    expect(MINER_STATS_QUERY_KEY).toEqual(['minerStats'])
  })

  it('should fetch miner stats successfully', async () => {
    const mockData = { totalMiners: 42 }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData)
    })

    const { result } = renderHook(() => useMinerStats(), {
      wrapper: createWrapper()
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBe(null)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockFetch).toHaveBeenCalledWith('https://rwa.y.at/miner/stats')
    expect(result.current.data).toEqual(mockData)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should handle fetch errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    })

    const { result } = renderHook(() => useMinerStats(), {
      wrapper: createWrapper()
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeTruthy()
    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBe(false)
  })

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useMinerStats(), {
      wrapper: createWrapper()
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeTruthy()
    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBe(false)
  })

  it('should handle different response structures', async () => {
    const mockData = { totalMiners: 1337 }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData)
    })

    const { result } = renderHook(() => useMinerStats(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.totalMiners).toBe(1337)
  })

  it('should handle zero miners', async () => {
    const mockData = { totalMiners: 0 }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData)
    })

    const { result } = renderHook(() => useMinerStats(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.totalMiners).toBe(0)
  })

  it('should handle large numbers of miners', async () => {
    const mockData = { totalMiners: 999999 }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData)
    })

    const { result } = renderHook(() => useMinerStats(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.totalMiners).toBe(999999)
  })

  it('should have correct query configuration', async () => {
    const mockData = { totalMiners: 100 }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData)
    })

    const { result } = renderHook(() => useMinerStats(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // Check that the hook has the expected properties
    expect(result.current).toHaveProperty('data')
    expect(result.current).toHaveProperty('error')
    expect(result.current).toHaveProperty('isLoading')
    expect(result.current).toHaveProperty('isSuccess')
    expect(result.current).toHaveProperty('isError')
    expect(result.current).toHaveProperty('refetch')
  })

  it('should handle 404 response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    })

    const { result } = renderHook(() => useMinerStats(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.message).toBe('Failed to fetch miner stats')
  })

  it('should refetch data when called', async () => {
    const mockData1 = { totalMiners: 50 }
    const mockData2 = { totalMiners: 75 }
    
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData1)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData2)
      })

    const { result } = renderHook(() => useMinerStats(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockData1)

    // Trigger refetch
    result.current.refetch()

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData2)
    })

    expect(mockFetch).toHaveBeenCalledTimes(2)
  })
})
