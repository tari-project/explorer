import { describe, it, expect, vi } from 'vitest'
import { inputItems } from '../Inputs'

// Mock the toHexString helper
vi.mock('@utils/helpers', () => ({
  toHexString: vi.fn((data) => {
    if (Array.isArray(data)) {
      return data.map(byte => ('0' + (byte & 0xff).toString(16)).slice(-2)).join('')
    }
    return 'hex-string'
  })
}))

const createMockInput = () => ({
  features: {
    version: 1,
    output_type: 'STANDARD',
    maturity: 100
  },
  commitment: { data: [255, 0, 128] },
  hash: { data: [128, 255, 0] },
  script: { data: [0, 128, 255] },
  input_data: { data: [255, 255, 0] },
  sender_offset_public_key: { data: [0, 0, 255] },
  script_signature: {
    ephemeral_commitment: { data: [1, 2, 3] },
    ephemeral_pubkey: { data: [4, 5, 6] },
    u_a: { data: [7, 8, 9] },
    u_x: { data: [10, 11, 12] },
    u_y: { data: [13, 14, 15] }
  },
  output_hash: { data: [16, 17, 18] },
  covenant: { data: 'covenant-data' },
  version: 2,
  encrypted_data: { data: [19, 20, 21] },
  minimum_value_promise: 1000,
  metadata_signature: {
    ephemeral_commitment: { data: [22, 23, 24] },
    ephemeral_pubkey: { data: [25, 26, 27] },
    u_a: { data: [28, 29, 30] },
    u_x: { data: [31, 32, 33] },
    u_y: { data: [34, 35, 36] }
  },
  rangeproof_hash: { data: [37, 38, 39] }
})

describe('inputItems', () => {
  it('should transform input data into display items', () => {
    const mockInput = createMockInput()
    const result = inputItems(mockInput)

    expect(result).toHaveLength(12)
    expect(result[0].label).toBe('Features')
    expect(result[0].copy).toBe(false)
    expect(result[0].children).toHaveLength(3)
  })

  it('should correctly format features', () => {
    const mockInput = createMockInput()
    const result = inputItems(mockInput)
    
    const features = result.find(item => item.label === 'Features')
    expect(features?.children).toEqual([
      { label: 'Version', value: 1, copy: false },
      { label: 'Output Type', value: 'STANDARD', copy: false },
      { label: 'Maturity', value: 100, copy: false }
    ])
  })

  it('should include copyable hex fields', () => {
    const mockInput = createMockInput()
    const result = inputItems(mockInput)
    
    const commitment = result.find(item => item.label === 'Commitment')
    expect(commitment?.value).toBe('hex-string')
    expect(commitment?.copy).toBe(true)

    const hash = result.find(item => item.label === 'Hash')
    expect(hash?.value).toBe('hex-string')
    expect(hash?.copy).toBe(true)
  })

  it('should include script signature nested structure', () => {
    const mockInput = createMockInput()
    const result = inputItems(mockInput)
    
    const scriptSig = result.find(item => item.label === 'Script Signature')
    expect(scriptSig?.copy).toBe(false)
    expect(scriptSig?.children).toHaveLength(5)
    expect(scriptSig?.children?.[0]).toEqual({
      label: 'Ephemeral commitment',
      value: 'hex-string',
      copy: true
    })
  })

  it('should include metadata signature nested structure', () => {
    const mockInput = createMockInput()
    const result = inputItems(mockInput)
    
    const metadataSig = result.find(item => item.label === 'Metadata Signature')
    expect(metadataSig?.copy).toBe(false)
    expect(metadataSig?.children).toHaveLength(5)
    expect(metadataSig?.children?.[0]).toEqual({
      label: 'Ephemeral commitment',
      value: 'hex-string',
      copy: true
    })
  })

  it('should include all required non-nested fields', () => {
    const mockInput = createMockInput()
    const result = inputItems(mockInput)
    
    const expectedLabels = [
      'Features',
      'Commitment', 
      'Hash',
      'Script',
      'Input Data',
      'Sender Offset Public Key',
      'Script Signature',
      'Output Hash',
      'Covenant',
      'Version',
      'Encrypted Data',
      'Minimum Value Promise',
      'Metadata Signature',
      'Rangeproof Hash'
    ]

    const actualLabels = result.map(item => item.label)
    expectedLabels.forEach(label => {
      expect(actualLabels).toContain(label)
    })
  })

  it('should handle covenant data correctly', () => {
    const mockInput = createMockInput()
    const result = inputItems(mockInput)
    
    const covenant = result.find(item => item.label === 'Covenant')
    expect(covenant?.value).toBe('covenant-data')
    expect(covenant?.copy).toBe(false)
  })

  it('should handle minimum value promise', () => {
    const mockInput = createMockInput()
    const result = inputItems(mockInput)
    
    const mvp = result.find(item => item.label === 'Minimum Value Promise')
    expect(mvp?.value).toBe(1000)
    expect(mvp?.copy).toBe(false)
  })

  it('should handle version field', () => {
    const mockInput = createMockInput()
    const result = inputItems(mockInput)
    
    const version = result.find(item => item.label === 'Version')
    expect(version?.value).toBe(2)
    expect(version?.copy).toBe(false)
  })

  it('should handle missing data gracefully', () => {
    const incompleteInput = {
      features: { version: 1, output_type: 'TEST', maturity: 0 },
      commitment: { data: [] },
      hash: { data: [] },
      script: { data: [] },
      input_data: { data: [] },
      sender_offset_public_key: { data: [] },
      script_signature: {
        ephemeral_commitment: { data: [] },
        ephemeral_pubkey: { data: [] },
        u_a: { data: [] },
        u_x: { data: [] },
        u_y: { data: [] }
      },
      output_hash: { data: [] },
      covenant: { data: '' },
      version: 0,
      encrypted_data: { data: [] },
      minimum_value_promise: 0,
      metadata_signature: {
        ephemeral_commitment: { data: [] },
        ephemeral_pubkey: { data: [] },
        u_a: { data: [] },
        u_x: { data: [] },
        u_y: { data: [] }
      },
      rangeproof_hash: { data: [] }
    }

    expect(() => inputItems(incompleteInput)).not.toThrow()
    const result = inputItems(incompleteInput)
    expect(result).toHaveLength(12)
  })
})
