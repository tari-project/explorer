import { describe, it, expect, vi } from 'vitest';
import { kernelSearch } from '../searchFunctions';

// Mock the helpers module
vi.mock('@utils/helpers', () => ({
  toHexString: vi.fn((data) => {
    // Simple mock that returns a hex-like string for testing
    if (Array.isArray(data)) {
      return data.map((n) => n.toString(16).padStart(2, '0')).join('');
    }
    return data?.toString() || '';
  }),
}));

describe('kernelSearch', () => {
  const createMockKernel = (nonceData: number[], signatureData: number[]) => ({
    excess_sig: {
      public_nonce: { data: nonceData },
      signature: { data: signatureData },
    },
  });

  const mockKernels = [
    createMockKernel([1, 2, 3, 4], [5, 6, 7, 8]),
    createMockKernel([9, 10, 11, 12], [13, 14, 15, 16]),
    createMockKernel([17, 18, 19, 20], [21, 22, 23, 24]),
  ];

  it('should return null if kernels array is null or undefined', () => {
    expect(kernelSearch('test', 'test', null as any)).toBeNull();
    expect(kernelSearch('test', 'test', undefined as any)).toBeNull();
  });

  it('should find kernel by nonce only', () => {
    const result = kernelSearch('01020304', '', mockKernels);
    expect(result).toBe(0);
  });

  it('should find kernel by signature only', () => {
    const result = kernelSearch('', '0d0e0f10', mockKernels);
    expect(result).toBe(1);
  });

  it('should find kernel by both nonce and signature', () => {
    const result = kernelSearch('11121314', '15161718', mockKernels);
    expect(result).toBe(2);
  });

  it('should return null if no kernel matches nonce', () => {
    const result = kernelSearch('99999999', '', mockKernels);
    expect(result).toBeNull();
  });

  it('should return null if no kernel matches signature', () => {
    const result = kernelSearch('', '99999999', mockKernels);
    expect(result).toBeNull();
  });

  it('should return null if both provided but only one matches', () => {
    // Provide correct nonce but wrong signature
    const result = kernelSearch('01020304', '99999999', mockKernels);
    expect(result).toBeNull();
  });

  it('should handle partial matches with includes logic', () => {
    // Test that includes() is used, so partial matches work
    const result = kernelSearch('0102', '', mockKernels);
    expect(result).toBe(0);
  });

  it('should return null when neither nonce nor signature provided', () => {
    const result = kernelSearch('', '', mockKernels);
    expect(result).toBeNull();
  });

  it('should handle empty kernels array', () => {
    const result = kernelSearch('test', 'test', []);
    expect(result).toBeNull();
  });

  it('should find first matching kernel when multiple match', () => {
    const duplicateKernels = [
      createMockKernel([1, 2, 3, 4], [5, 6, 7, 8]),
      createMockKernel([1, 2, 3, 4], [9, 10, 11, 12]), // Same nonce, different signature
    ];

    const result = kernelSearch('01020304', '', duplicateKernels);
    expect(result).toBe(0); // Should return first match
  });

  it('should handle case where kernel data conversion fails gracefully', () => {
    const malformedKernels = [
      {
        excess_sig: {
          public_nonce: { data: null },
          signature: { data: [1, 2, 3] },
        },
      },
    ];

    // Should not throw and should handle gracefully
    const result = kernelSearch('test', '', malformedKernels);
    expect(result).toBeNull();
  });
});
