import { describe, it, expect, vi, beforeEach } from 'vitest'
import { jsonRpc } from '../jsonRpc'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('jsonRpc', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should make successful request and return JSON', async () => {
    const mockData = { result: 'success', data: [1, 2, 3] }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData)
    })

    const result = await jsonRpc('https://api.example.com/data')
    
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data')
    expect(result).toEqual(mockData)
  })

  it('should handle 404 errors with default message', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    })

    await expect(jsonRpc('https://api.example.com/notfound'))
      .rejects.toThrow('Not found')
  })

  it('should handle 404 errors with custom message', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    })

    const customError = 'Resource not available'
    await expect(jsonRpc('https://api.example.com/notfound', customError))
      .rejects.toThrow(customError)
  })

  it('should handle other HTTP errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    })

    await expect(jsonRpc('https://api.example.com/error'))
      .rejects.toThrow('Request failed with status: 500')
  })

  it('should handle 400 Bad Request', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400
    })

    await expect(jsonRpc('https://api.example.com/bad-request'))
      .rejects.toThrow('Request failed with status: 400')
  })

  it('should handle 401 Unauthorized', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401
    })

    await expect(jsonRpc('https://api.example.com/unauthorized'))
      .rejects.toThrow('Request failed with status: 401')
  })

  it('should handle 403 Forbidden', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403
    })

    await expect(jsonRpc('https://api.example.com/forbidden'))
      .rejects.toThrow('Request failed with status: 403')
  })

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    await expect(jsonRpc('https://api.example.com/network-error'))
      .rejects.toThrow('Network error')
  })

  it('should handle malformed JSON', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.reject(new Error('Invalid JSON'))
    })

    await expect(jsonRpc('https://api.example.com/invalid-json'))
      .rejects.toThrow('Invalid JSON')
  })

  it('should handle empty response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(null)
    })

    const result = await jsonRpc('https://api.example.com/empty')
    expect(result).toBe(null)
  })

  it('should handle complex JSON objects', async () => {
    const complexData = {
      users: [
        { id: 1, name: 'John', meta: { active: true, tags: ['admin'] } },
        { id: 2, name: 'Jane', meta: { active: false, tags: ['user'] } }
      ],
      pagination: { page: 1, total: 2, hasNext: false }
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(complexData)
    })

    const result = await jsonRpc('https://api.example.com/complex')
    expect(result).toEqual(complexData)
  })

  it('should handle array responses', async () => {
    const arrayData = [1, 2, 3, 4, 5]
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(arrayData)
    })

    const result = await jsonRpc('https://api.example.com/array')
    expect(result).toEqual(arrayData)
  })

  it('should handle boolean responses', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(true)
    })

    const result = await jsonRpc('https://api.example.com/boolean')
    expect(result).toBe(true)
  })

  it('should handle string responses', async () => {
    const stringData = 'simple string response'
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(stringData)
    })

    const result = await jsonRpc('https://api.example.com/string')
    expect(result).toBe(stringData)
  })
})
