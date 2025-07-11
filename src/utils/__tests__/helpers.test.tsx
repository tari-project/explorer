import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import {
  toHexString,
  fromHexString,
  shortenString,
  removeTagged,
  emptyRows,
  handleChangePage,
  handleChangeRowsPerPage,
  formatTimestamp,
  formatHash,
  powCheck,
  renderJson,
} from '../helpers';

describe('helpers', () => {
  describe('toHexString', () => {
    it('should convert byte array to hex string', () => {
      const byteArray = [255, 0, 128, 15];
      expect(toHexString(byteArray)).toBe('ff00800f');
    });

    it('should handle empty array', () => {
      expect(toHexString([])).toBe('');
    });

    it('should handle undefined', () => {
      expect(toHexString(undefined)).toBe('undefined');
    });

    it('should handle tagged objects', () => {
      const taggedObj = {
        '@@TAGGED@@': ['type', [255, 0]],
      };
      expect(toHexString(taggedObj)).toBe('ff00');
    });

    it('should handle unsupported types', () => {
      expect(toHexString('string')).toBe('Unsupported type');
      expect(toHexString(123)).toBe('Unsupported type');
    });
  });

  describe('fromHexString', () => {
    it('should convert hex string to byte array', () => {
      expect(fromHexString('ff00800f')).toEqual([255, 0, 128, 15]);
    });

    it('should handle empty string', () => {
      expect(fromHexString('')).toEqual([]);
    });

    it('should handle single byte', () => {
      expect(fromHexString('ff')).toEqual([255]);
    });

    it('should handle lowercase hex', () => {
      expect(fromHexString('ab')).toEqual([171]);
    });
  });

  describe('shortenString', () => {
    it('should shorten string with default parameters', () => {
      const longString = 'abcdefghijklmnopqrstuvwxyz';
      expect(shortenString(longString)).toBe('abcdefgh...stuvwxyz');
    });

    it('should shorten string with custom parameters', () => {
      const longString = 'abcdefghijklmnopqrstuvwxyz';
      expect(shortenString(longString, 4, 4)).toBe('abcd...wxyz');
    });

    it('should handle short strings', () => {
      expect(shortenString('abc', 4, 4)).toBe('abc...abc');
    });

    it('should handle empty string', () => {
      expect(shortenString('')).toBe('...');
    });
  });

  describe('removeTagged', () => {
    it('should return tagged value', () => {
      const taggedObj = {
        '@@TAGGED@@': ['type', 'value'],
      };
      expect(removeTagged(taggedObj)).toBe('value');
    });

    it('should return original object if not tagged', () => {
      const obj = { key: 'value' };
      expect(removeTagged(obj)).toEqual(obj);
    });

    it('should handle undefined', () => {
      expect(removeTagged(undefined)).toBe('undefined');
    });

    it('should handle primitive values', () => {
      expect(removeTagged('string')).toBe('string');
      expect(removeTagged(123)).toBe(123);
    });
  });

  describe('emptyRows', () => {
    it('should calculate empty rows correctly', () => {
      expect(emptyRows(1, 10, new Array(15))).toBe(5);
    });

    it('should return 0 for first page', () => {
      expect(emptyRows(0, 10, new Array(5))).toBe(0);
    });

    it('should return 0 when no empty rows', () => {
      expect(emptyRows(1, 10, new Array(20))).toBe(0);
    });

    it('should handle negative results', () => {
      expect(emptyRows(2, 10, new Array(25))).toBe(5);
    });
  });

  describe('handleChangePage', () => {
    it('should call setPage with new page', () => {
      const setPage = vi.fn();
      handleChangePage(2, setPage);
      expect(setPage).toHaveBeenCalledWith(2);
    });
  });

  describe('handleChangeRowsPerPage', () => {
    it('should update rows per page and reset page', () => {
      const setRowsPerPage = vi.fn();
      const setPage = vi.fn();
      const event = {
        target: { value: '25' },
      } as any;

      handleChangeRowsPerPage(event, setRowsPerPage, setPage);

      expect(setRowsPerPage).toHaveBeenCalledWith(25);
      expect(setPage).toHaveBeenCalledWith(0);
    });
  });

  describe('formatTimestamp', () => {
    it('should format timestamp correctly', () => {
      const timestamp = 1640995200; // 2022-01-01 00:00:00 UTC
      const result = formatTimestamp(timestamp);
      expect(result).toMatch(/2022-01-01 \d{2}:\d{2}:\d{2}/);
    });

    it('should handle zero timestamp', () => {
      const result = formatTimestamp(0);
      expect(result).toMatch(/1970-01-01 \d{2}:\d{2}:\d{2}/);
    });

    it('should pad single digits', () => {
      const timestamp = 1640995261; // 2022-01-01 00:01:01 UTC
      const result = formatTimestamp(timestamp);
      expect(result).toMatch(/2022-01-01 \d{2}:01:01/);
    });
  });

  describe('formatHash', () => {
    it('should format hash with default decimals', () => {
      expect(formatHash(1500)).toBe('1.5KH');
    });

    it('should format hash with custom decimals', () => {
      expect(formatHash(1500, 2)).toBe('1.50KH');
    });

    it('should handle different suffixes', () => {
      expect(formatHash(500)).toBe('500.0H');
      expect(formatHash(1500000)).toBe('1.5MH');
      expect(formatHash(1500000000)).toBe('1.5GH');
      expect(formatHash(1500000000000)).toBe('1.5TH');
      expect(formatHash(1500000000000000)).toBe('1.5PH');
    });

    it('should handle very large numbers', () => {
      expect(formatHash(1500000000000000000)).toBe('1500.0PH');
    });

    it('should handle zero', () => {
      expect(formatHash(0)).toBe('0.0H');
    });
  });

  describe('powCheck', () => {
    it('should return correct PoW text for RandomX (Merge Mined)', () => {
      expect(powCheck('0')).toBe('RandomX (Merge Mined)');
    });

    it('should return correct PoW text for SHA3x', () => {
      expect(powCheck('1')).toBe('SHA3x');
    });

    it('should return correct PoW text for RandomX', () => {
      expect(powCheck('2')).toBe('RandomX');
    });

    it('should return Unknown for invalid numbers', () => {
      expect(powCheck('3')).toBe('Unknown');
      expect(powCheck('999')).toBe('Unknown');
      expect(powCheck('')).toBe('Unknown');
    });
  });

  describe('renderJson', () => {
    it('should render byte arrays as hex strings', () => {
      const byteArray = new Array(32).fill(255);
      const { container } = render(<div>{renderJson(byteArray)}</div>);
      expect(container).toHaveTextContent('ff'.repeat(32));
    });

    it('should render regular arrays', () => {
      const array = [1, 2, 3];
      const { container } = render(<div>{renderJson(array)}</div>);
      expect(container).toHaveTextContent('[');
      expect(container).toHaveTextContent('1');
      expect(container).toHaveTextContent('2');
      expect(container).toHaveTextContent('3');
    });

    it('should render objects', () => {
      const obj = { key1: 'value1', key2: 42 };
      const { container } = render(<div>{renderJson(obj)}</div>);
      expect(container).toHaveTextContent('{');
      expect(container).toHaveTextContent('key1');
      expect(container).toHaveTextContent('value1');
      expect(container).toHaveTextContent('key2');
      expect(container).toHaveTextContent('42');
    });

    it('should render strings with quotes', () => {
      const { container } = render(<div>{renderJson('test')}</div>);
      expect(container).toHaveTextContent('"test"');
    });

    it('should render numbers and other primitives', () => {
      const { container } = render(<div>{renderJson(42)}</div>);
      expect(container).toHaveTextContent('42');
    });

    it('should render boolean and other values', () => {
      const { container } = render(<div>{renderJson(42)}</div>);
      expect(container.querySelector('span.other')).toBeInTheDocument();
      expect(container).toHaveTextContent('42');
    });

    it('should handle nested objects', () => {
      const nested = { outer: { inner: 'value' } };
      const { container } = render(<div>{renderJson(nested)}</div>);
      expect(container).toHaveTextContent('outer');
      expect(container).toHaveTextContent('inner');
      expect(container).toHaveTextContent('value');
    });
  });
});
