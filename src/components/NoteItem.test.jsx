import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NoteItem } from './NoteItem';
import { mockNote } from '../test/utils';

describe('NoteItem', () => {
  const defaultProps = {
    note: mockNote,
    onOpen: vi.fn(),
    onDelete: vi.fn(),
  };

  it('renders note title', () => {
    render(<NoteItem {...defaultProps} />);
    expect(screen.getByText('Test Note')).toBeInTheDocument();
  });

  it('calls onOpen with note_id when title is clicked', async () => {
    const handleOpen = vi.fn();
    const user = userEvent.setup();

    render(<NoteItem {...defaultProps} onOpen={handleOpen} />);

    await user.click(screen.getByText('Test Note'));

    expect(handleOpen).toHaveBeenCalledTimes(1);
    expect(handleOpen).toHaveBeenCalledWith('1');
  });

  it('calls onDelete with note_id when delete button is clicked', async () => {
    const handleDelete = vi.fn();
    const user = userEvent.setup();

    render(<NoteItem {...defaultProps} onDelete={handleDelete} />);

    // Find the delete button (it contains the TrashIcon)
    const deleteButton = screen.getByRole('button');
    await user.click(deleteButton);

    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledWith('1');
  });

  it('renders TrashIcon in delete button', () => {
    const { container } = render(<NoteItem {...defaultProps} />);
    const svg = container.querySelector('svg.lucide-trash-2');
    expect(svg).toBeInTheDocument();
  });

  it('renders with correct styling classes', () => {
    render(<NoteItem {...defaultProps} />);
    const noteDiv = screen.getByText('Test Note').closest('div');
    expect(noteDiv).toHaveClass('cursor-pointer');
  });

  it('displays different note title', () => {
    const differentNote = { ...mockNote, title: 'Different Title' };
    render(<NoteItem {...defaultProps} note={differentNote} />);
    expect(screen.getByText('Different Title')).toBeInTheDocument();
  });
});
