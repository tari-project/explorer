import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import FailureIcon from '../FailureIcon';

describe('FailureIcon', () => {
  it('should render SVG with correct dimensions', () => {
    render(<FailureIcon />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '100');
    expect(svg).toHaveAttribute('height', '101');
    expect(svg).toHaveAttribute('viewBox', '0 0 100 101');
  });

  it('should have correct SVG structure', () => {
    render(<FailureIcon />);

    const svg = document.querySelector('svg');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
  });

  it('should contain path and circle elements', () => {
    render(<FailureIcon />);

    const path = document.querySelector('path');
    expect(path).toBeInTheDocument();

    const circles = document.querySelectorAll('circle');
    expect(circles).toHaveLength(2);

    // Check circle properties
    circles.forEach((circle) => {
      expect(circle).toHaveAttribute('cx', '50');
      expect(circle).toHaveAttribute('cy', '50.5');
    });
  });

  it('should render as a functional component', () => {
    const { container } = render(<FailureIcon />);
    expect(container.firstChild).toBeDefined();
  });
});
