import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SuccessIcon from '../SuccessIcon';

describe('SuccessIcon', () => {
  it('should render SVG with correct dimensions', () => {
    render(<SuccessIcon />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '100');
    expect(svg).toHaveAttribute('height', '101');
    expect(svg).toHaveAttribute('viewBox', '0 0 100 101');
  });

  it('should have correct SVG structure', () => {
    render(<SuccessIcon />);

    const svg = document.querySelector('svg');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
  });

  it('should contain path and circle elements', () => {
    render(<SuccessIcon />);

    const path = document.querySelector('path');
    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute('fill', '#9330FF');

    const circles = document.querySelectorAll('circle');
    expect(circles).toHaveLength(2);

    // Check circle properties
    circles.forEach((circle) => {
      expect(circle).toHaveAttribute('cx', '50');
      expect(circle).toHaveAttribute('cy', '50.5');
      expect(circle).toHaveAttribute('stroke', '#9330FF');
    });
  });

  it('should have correct circle attributes', () => {
    render(<SuccessIcon />);

    const circles = document.querySelectorAll('circle');

    // First circle
    expect(circles[0]).toHaveAttribute('opacity', '0.4');
    expect(circles[0]).toHaveAttribute('r', '36.5');

    // Second circle
    expect(circles[1]).toHaveAttribute('opacity', '0.1');
    expect(circles[1]).toHaveAttribute('r', '49.5');
  });
});
