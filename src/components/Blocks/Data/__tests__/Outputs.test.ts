import { describe, it, expect, vi } from 'vitest';
import { outputItems } from '../Outputs';

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

const createMockOutput = () => ({
  payment_reference: { data: [22, 23, 24] },
  features: {
    version: 1,
    output_type: 'COINBASE',
    maturity: 200,
    coinbase_extra: { data: [1, 2, 3] },
  },
  commitment: { data: [255, 0, 128] },
  hash: { data: [128, 255, 0] },
  script: { data: [0, 128, 255] },
  sender_offset_public_key: { data: [255, 255, 0] },
  metadata_signature: {
    ephemeral_commitment: { data: [4, 5, 6] },
    ephemeral_pubkey: { data: [7, 8, 9] },
    u_a: { data: [10, 11, 12] },
    u_x: { data: [13, 14, 15] },
    u_y: { data: [16, 17, 18] },
  },
  covenant: { data: 'covenant-version-data' },
  encrypted_data: { data: [19, 20, 21] },
});

describe('outputItems', () => {
  it('should transform output data into display items', () => {
    const mockOutput = createMockOutput();
    const result = outputItems(mockOutput);

    expect(result).toHaveLength(9);
    expect(result[0].label).toBe('Payment Reference');
    expect(result[1].label).toBe('Features');
  });

  it('should correctly format features', () => {
    const mockOutput = createMockOutput();
    const result = outputItems(mockOutput);

    const features = result.find((item) => item.label === 'Features');
    expect(features?.copy).toBe(false);
    expect(features?.children).toHaveLength(4);
    expect(features?.children).toEqual([
      { label: 'Version', value: 1, copy: false },
      { label: 'Output Type', value: 'COINBASE', copy: false },
      { label: 'Maturity', value: 200, copy: false },
      { label: 'Coinbase Extra Data', value: '010203', copy: true },
    ]);
  });

  it('should include copyable hex fields', () => {
    const mockOutput = createMockOutput();
    const result = outputItems(mockOutput);

    const commitment = result.find((item) => item.label === 'Commitment');
    expect(commitment?.value).toBe('ff0080');
    expect(commitment?.copy).toBe(true);

    const hash = result.find((item) => item.label === 'Hash');
    expect(hash?.value).toBe('80ff00');
    expect(hash?.copy).toBe(true);

    const script = result.find((item) => item.label === 'Script');
    expect(script?.value).toBe('0080ff');
    expect(script?.copy).toBe(true);
  });

  it('should include sender offset public key', () => {
    const mockOutput = createMockOutput();
    const result = outputItems(mockOutput);

    const senderOffset = result.find(
      (item) => item.label === 'Sender Offset Public Key'
    );
    expect(senderOffset?.value).toBe('ffff00');
    expect(senderOffset?.copy).toBe(true);
  });

  it('should include metadata signature nested structure', () => {
    const mockOutput = createMockOutput();
    const result = outputItems(mockOutput);

    const metadataSig = result.find(
      (item) => item.label === 'Metadata Signature'
    );
    expect(metadataSig?.copy).toBe(false);
    expect(metadataSig?.children).toHaveLength(5);
    expect(metadataSig?.children?.[0]).toEqual({
      label: 'Ephemeral commitment',
      value: '040506',
      copy: true,
    });
    expect(metadataSig?.children?.[1]).toEqual({
      label: 'Ephemeral pubkey',
      value: '070809',
      copy: true,
    });
    expect(metadataSig?.children?.[2]).toEqual({
      label: 'u_a',
      value: '0a0b0c',
      copy: true,
    });
    expect(metadataSig?.children?.[3]).toEqual({
      label: 'u_x',
      value: '0d0e0f',
      copy: true,
    });
    expect(metadataSig?.children?.[4]).toEqual({
      label: 'u_y',
      value: '101112',
      copy: true,
    });
  });

  it('should include covenant version', () => {
    const mockOutput = createMockOutput();
    const result = outputItems(mockOutput);

    const covenant = result.find((item) => item.label === 'Covenant Version');
    expect(covenant?.value).toBe('covenant-version-data');
    expect(covenant?.copy).toBe(false);
  });

  it('should include encrypted data', () => {
    const mockOutput = createMockOutput();
    const result = outputItems(mockOutput);

    const encryptedData = result.find(
      (item) => item.label === 'Encrypted Data'
    );
    expect(encryptedData?.value).toBe('131415');
    expect(encryptedData?.copy).toBe(true);
  });

  it('should handle all expected labels', () => {
    const mockOutput = createMockOutput();
    const result = outputItems(mockOutput);

    const expectedLabels = [
      'Features',
      'Commitment',
      'Hash',
      'Script',
      'Sender Offset Public Key',
      'Metadata Signature',
      'Covenant Version',
      'Encrypted Data',
    ];

    const actualLabels = result.map((item) => item.label);
    expectedLabels.forEach((label) => {
      expect(actualLabels).toContain(label);
    });
  });

  it('should handle different output types', () => {
    const standardOutput = {
      ...createMockOutput(),
      features: {
        version: 2,
        output_type: 'STANDARD',
        maturity: 0,
        coinbase_extra: { data: [] },
      },
    };

    const result = outputItems(standardOutput);
    const features = result.find((item) => item.label === 'Features');
    expect(features?.children?.[1].value).toBe('STANDARD');
  });

  it('should handle missing data gracefully', () => {
    const incompleteOutput = {
      payment_reference: { data: [] },
      features: {
        version: 0,
        output_type: '',
        maturity: 0,
        coinbase_extra: { data: [] },
      },
      commitment: { data: [] },
      hash: { data: [] },
      script: { data: [] },
      sender_offset_public_key: { data: [] },
      metadata_signature: {
        ephemeral_commitment: { data: [] },
        ephemeral_pubkey: { data: [] },
        u_a: { data: [] },
        u_x: { data: [] },
        u_y: { data: [] },
      },
      covenant: { data: '' },
      encrypted_data: { data: [] },
    };

    expect(() => outputItems(incompleteOutput)).not.toThrow();
    const result = outputItems(incompleteOutput);
    expect(result).toHaveLength(9);
  });

  it('should handle empty coinbase extra data', () => {
    const mockOutput = {
      ...createMockOutput(),
      features: {
        ...createMockOutput().features,
        coinbase_extra: { data: [] },
      },
    };

    const result = outputItems(mockOutput);
    const features = result.find((item) => item.label === 'Features');
    expect(features?.children?.[3].value).toBe('');
  });

  it('should handle null or undefined values gracefully', () => {
    const mockOutput = {
      ...createMockOutput(),
      covenant: { data: [] },
    };

    expect(() => outputItems(mockOutput)).not.toThrow();
    const result = outputItems(mockOutput);
    const covenant = result.find((item) => item.label === 'Covenant Version');
    expect(covenant?.value).toBe('');
  });
});
