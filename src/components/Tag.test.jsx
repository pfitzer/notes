import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tag } from './Tag';

const mockTag = {
  tag_id: '1',
  name: 'Important',
  color: '#ef4444',
};

describe('Tag', () => {
  it('renders tag name', () => {
    render(<Tag tag={mockTag} />);
    expect(screen.getByText('Important')).toBeInTheDocument();
  });

  it('applies custom color', () => {
    const { container } = render(<Tag tag={mockTag} />);
    const tagElement = container.querySelector('span');
    expect(tagElement).toHaveStyle({ backgroundColor: '#ef4444' });
  });

  it('uses default color when not specified', () => {
    const tagWithoutColor = { ...mockTag, color: undefined };
    const { container } = render(<Tag tag={tagWithoutColor} />);
    const tagElement = container.querySelector('span');
    expect(tagElement).toHaveStyle({ backgroundColor: '#3b82f6' });
  });

  it('calls onRemove when remove button is clicked', async () => {
    const handleRemove = vi.fn();
    const user = userEvent.setup();

    render(<Tag tag={mockTag} onRemove={handleRemove} />);

    const removeButton = screen.getByRole('button', { name: /remove important/i });
    await user.click(removeButton);

    expect(handleRemove).toHaveBeenCalledWith(mockTag);
  });

  it('calls onClick when tag is clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Tag tag={mockTag} onClick={handleClick} />);

    const tagElement = screen.getByText('Important');
    await user.click(tagElement);

    expect(handleClick).toHaveBeenCalledWith(mockTag);
  });

  it('does not show remove button when onRemove is not provided', () => {
    render(<Tag tag={mockTag} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('adds cursor-pointer class when onClick is provided', () => {
    const { container } = render(<Tag tag={mockTag} onClick={vi.fn()} />);
    const tagElement = container.querySelector('span');
    expect(tagElement).toHaveClass('cursor-pointer');
  });

  it('applies custom className', () => {
    const { container } = render(<Tag tag={mockTag} className="custom-class" />);
    const tagElement = container.querySelector('span');
    expect(tagElement).toHaveClass('custom-class');
  });

  it('stops propagation when remove button is clicked', async () => {
    const handleRemove = vi.fn();
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Tag tag={mockTag} onRemove={handleRemove} onClick={handleClick} />);

    const removeButton = screen.getByRole('button', { name: /remove important/i });
    await user.click(removeButton);

    expect(handleRemove).toHaveBeenCalledWith(mockTag);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
