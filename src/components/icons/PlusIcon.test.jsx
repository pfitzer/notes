import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PlusIcon } from './PlusIcon';

describe('PlusIcon', () => {
  it('renders svg element', () => {
    const { container } = render(<PlusIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has correct viewBox dimensions', () => {
    const { container } = render(<PlusIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('applies custom className', () => {
    const { container } = render(<PlusIcon className="custom-icon" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('lucide');
    expect(svg).toHaveClass('lucide-plus');
    expect(svg).toHaveClass('custom-icon');
  });

  it('renders with default className when none provided', () => {
    const { container } = render(<PlusIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('lucide');
    expect(svg).toHaveClass('lucide-plus');
  });
});
