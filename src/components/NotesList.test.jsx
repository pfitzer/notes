import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotesList } from './NotesList';
import { mockNotes } from '../test/utils';

describe('NotesList', () => {
  const defaultProps = {
    notes: mockNotes,
    onOpenNote: vi.fn(),
    onDeleteNote: vi.fn(),
  };

  it('renders all notes', () => {
    render(<NotesList {...defaultProps} />);
    expect(screen.getByText('First Note')).toBeInTheDocument();
    expect(screen.getByText('Second Note')).toBeInTheDocument();
    expect(screen.getByText('Third Note')).toBeInTheDocument();
  });

  it('displays empty state when no notes', () => {
    render(<NotesList {...defaultProps} notes={[]} />);
    expect(screen.getByText(/No notes found/i)).toBeInTheDocument();
    expect(screen.getByText(/Create one to get started/i)).toBeInTheDocument();
  });

  it('displays empty state when notes is null', () => {
    render(<NotesList {...defaultProps} notes={null} />);
    expect(screen.getByText(/No notes found/i)).toBeInTheDocument();
  });

  it('displays empty state when notes is undefined', () => {
    render(<NotesList {...defaultProps} notes={undefined} />);
    expect(screen.getByText(/No notes found/i)).toBeInTheDocument();
  });

  it('passes onOpenNote to each NoteItem', async () => {
    const handleOpen = vi.fn();
    const user = userEvent.setup();

    render(<NotesList {...defaultProps} onOpenNote={handleOpen} />);

    await user.click(screen.getByText('First Note'));

    expect(handleOpen).toHaveBeenCalledWith('1');
  });

  it('passes onDeleteNote to each NoteItem', async () => {
    const handleDelete = vi.fn();
    const user = userEvent.setup();

    render(<NotesList {...defaultProps} onDeleteNote={handleDelete} />);

    // Get all delete buttons (there should be 3, one for each note)
    const deleteButtons = screen.getAllByRole('button');
    await user.click(deleteButtons[0]);

    expect(handleDelete).toHaveBeenCalledWith('1');
  });

  it('renders correct number of NoteItems', () => {
    render(<NotesList {...defaultProps} />);
    const noteItems = screen.getAllByRole('button');
    // Each note has one delete button
    expect(noteItems).toHaveLength(3);
  });

  it('uses note_id as key for each NoteItem', () => {
    const { container } = render(<NotesList {...defaultProps} />);
    // React should render all items without key warnings
    expect(container.querySelectorAll('.p-2')).toHaveLength(3);
  });

  it('handles single note correctly', () => {
    const singleNote = [mockNotes[0]];
    render(<NotesList {...defaultProps} notes={singleNote} />);
    expect(screen.getByText('First Note')).toBeInTheDocument();
    expect(screen.queryByText('Second Note')).not.toBeInTheDocument();
  });
});
