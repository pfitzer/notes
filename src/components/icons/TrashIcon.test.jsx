import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TrashIcon } from './TrashIcon';

describe('TrashIcon', () => {
  it('renders svg element', () => {
    const { container } = render(<TrashIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has correct viewBox dimensions', () => {
    const { container } = render(<TrashIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('applies custom className', () => {
    const { container } = render(<TrashIcon className="custom-icon" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('lucide');
    expect(svg).toHaveClass('lucide-trash-2');
    expect(svg).toHaveClass('custom-icon');
  });

  it('renders with default className when none provided', () => {
    const { container } = render(<TrashIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('lucide');
    expect(svg).toHaveClass('lucide-trash-2');
  });
});
