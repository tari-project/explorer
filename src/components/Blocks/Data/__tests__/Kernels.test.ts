import { describe, it, expect, vi } from 'vitest';
import { kernelItems } from '../Kernels';

// Mock the toHexString helper
vi.mock('@utils/helpers', () => ({
  toHexString: vi.fn((data) => {
    if (Array.isArray(data)) {
      return data
        .map((byte) => ('0' + (byte & 0xff).toString(16)).slice(-2))
        .join('');
    }
    return 'hex-string';
  }),
}));

const createMockKernel = () => ({
  features: 0, // KERNEL_STANDARD = 0
  fee: 1000000, // 1 XTM in microTari
  lock_height: 12345,
  excess: { data: [255, 0, 128] },
  excess_sig: {
    public_nonce: { data: [128, 255, 0] },
    signature: { data: [0, 128, 255] },
  },
  hash: { data: [255, 255, 0] },
  version: 1,
});

describe('kernelItems', () => {
  it('should transform kernel data into display items', () => {
    const mockKernel = createMockKernel();
    const result = kernelItems(mockKernel);

    expect(result).toHaveLength(7);
    expect(result[0].label).toBe('Features');
    expect(result[1].label).toBe('Fee');
    expect(result[2].label).toBe('Lock Height');
  });

  it('should correctly format features', () => {
    const mockKernel = createMockKernel();
    const result = kernelItems(mockKernel);

    const features = result.find((item) => item.label === 'Features');
    expect(features?.value).toBe(0);
    expect(features?.copy).toBe(false);
  });

  it('should correctly format fee in XTM', () => {
    const mockKernel = createMockKernel();
    const result = kernelItems(mockKernel);

    const fee = result.find((item) => item.label === 'Fee');
    expect(fee?.value).toBe('1 XTM');
    expect(fee?.copy).toBe(false);
  });

  it('should handle different fee amounts', () => {
    const mockKernel = { ...createMockKernel(), fee: 2500000 };
    const result = kernelItems(mockKernel);

    const fee = result.find((item) => item.label === 'Fee');
    expect(fee?.value).toBe('2.5 XTM');
  });

  it('should handle zero fee', () => {
    const mockKernel = { ...createMockKernel(), fee: 0 };
    const result = kernelItems(mockKernel);

    const fee = result.find((item) => item.label === 'Fee');
    expect(fee?.value).toBe('0 XTM');
  });

  it('should include lock height', () => {
    const mockKernel = createMockKernel();
    const result = kernelItems(mockKernel);

    const lockHeight = result.find((item) => item.label === 'Lock Height');
    expect(lockHeight?.value).toBe(12345);
    expect(lockHeight?.copy).toBe(false);
  });

  it('should include copyable excess field', () => {
    const mockKernel = createMockKernel();
    const result = kernelItems(mockKernel);

    const excess = result.find((item) => item.label === 'Excess');
    expect(excess?.value).toBe('ff0080');
    expect(excess?.copy).toBe(true);
  });

  it('should include excess signature nested structure', () => {
    const mockKernel = createMockKernel();
    const result = kernelItems(mockKernel);

    const excessSig = result.find((item) => item.label === 'Excess Sig');
    expect(excessSig?.copy).toBe(false);
    expect(excessSig?.children).toHaveLength(2);
    expect(excessSig?.children?.[0]).toEqual({
      label: 'Public Nonce',
      value: '80ff00',
      copy: true,
    });
    expect(excessSig?.children?.[1]).toEqual({
      label: 'Signature',
      value: '0080ff',
      copy: true,
    });
  });

  it('should include hash field', () => {
    const mockKernel = createMockKernel();
    const result = kernelItems(mockKernel);

    const hash = result.find((item) => item.label === 'Hash');
    expect(hash?.value).toBe('ffff00');
    expect(hash?.copy).toBe(true);
    expect(hash?.header).toBe(false);
  });

  it('should include version field', () => {
    const mockKernel = createMockKernel();
    const result = kernelItems(mockKernel);

    const version = result.find((item) => item.label === 'Version');
    expect(version?.value).toBe(1);
    expect(version?.copy).toBe(false);
  });

  it('should handle all expected labels', () => {
    const mockKernel = createMockKernel();
    const result = kernelItems(mockKernel);

    const expectedLabels = [
      'Features',
      'Fee',
      'Lock Height',
      'Excess',
      'Excess Sig',
      'Hash',
      'Version',
    ];

    const actualLabels = result.map((item) => item.label);
    expectedLabels.forEach((label) => {
      expect(actualLabels).toContain(label);
    });
  });

  it('should handle missing data gracefully', () => {
    const incompleteKernel = {
      features: 0,
      fee: 0,
      lock_height: 0,
      excess: { data: [] },
      excess_sig: {
        public_nonce: { data: [] },
        signature: { data: [] },
      },
      hash: { data: [] },
      version: 0,
    };

    expect(() => kernelItems(incompleteKernel)).not.toThrow();
    const result = kernelItems(incompleteKernel);
    expect(result).toHaveLength(7);
  });

  it('should handle large fee amounts correctly', () => {
    const mockKernel = { ...createMockKernel(), fee: 123456789000 };
    const result = kernelItems(mockKernel);

    const fee = result.find((item) => item.label === 'Fee');
    expect(fee?.value).toBe('123456.789 XTM');
  });

  it('should handle fractional microTari fees', () => {
    const mockKernel = { ...createMockKernel(), fee: 1234567 };
    const result = kernelItems(mockKernel);

    const fee = result.find((item) => item.label === 'Fee');
    expect(fee?.value).toBe('1.234567 XTM');
  });
});
