import { describe, it, expect } from 'vitest'
import { queryClient } from '../queryClient'

describe('queryClient', () => {
  it('should be a QueryClient instance', () => {
    expect(queryClient).toBeDefined()
    expect(typeof queryClient.getQueryData).toBe('function')
    expect(typeof queryClient.setQueryData).toBe('function')
    expect(typeof queryClient.invalidateQueries).toBe('function')
  })

  it('should have correct default options', () => {
    const defaultOptions = queryClient.getDefaultOptions()
    
    expect(defaultOptions.queries?.refetchOnWindowFocus).toBe(false)
    expect(defaultOptions.queries?.retry).toBe(1)
  })

  it('should support setting and getting query data', () => {
    const testKey = ['test', 'key']
    const testData = { message: 'test data' }
    
    queryClient.setQueryData(testKey, testData)
    const retrievedData = queryClient.getQueryData(testKey)
    
    expect(retrievedData).toEqual(testData)
  })

  it('should support invalidating queries', async () => {
    const testKey = ['test', 'invalidate']
    queryClient.setQueryData(testKey, { data: 'test' })
    
    expect(() => queryClient.invalidateQueries({ queryKey: testKey })).not.toThrow()
  })

  it('should support clearing all queries', () => {
    queryClient.setQueryData(['test1'], { data: 'test1' })
    queryClient.setQueryData(['test2'], { data: 'test2' })
    
    queryClient.clear()
    
    expect(queryClient.getQueryData(['test1'])).toBeUndefined()
    expect(queryClient.getQueryData(['test2'])).toBeUndefined()
  })

  it('should support getting query cache', () => {
    const cache = queryClient.getQueryCache()
    expect(cache).toBeDefined()
    expect(typeof cache.find).toBe('function')
    expect(typeof cache.getAll).toBe('function')
  })

  it('should support mutation functionality', () => {
    expect(typeof queryClient.getMutationCache).toBe('function')
    const mutationCache = queryClient.getMutationCache()
    expect(mutationCache).toBeDefined()
  })
})
