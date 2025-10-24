import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotesPage } from './NotesPage';
import { mockNotes } from '../test/utils';

// Mock the hooks
vi.mock('../hooks/useNotes', () => ({
  useNotes: vi.fn(),
}));

vi.mock('../hooks/useWindowManager', () => ({
  useWindowManager: vi.fn(),
}));

vi.mock('../hooks/useTags', () => ({
  useTags: vi.fn(),
}));

import { useNotes } from '../hooks/useNotes';
import { useWindowManager } from '../hooks/useWindowManager';
import { useTags } from '../hooks/useTags';

describe('NotesPage', () => {
  const mockCreateNote = vi.fn();
  const mockRemoveNote = vi.fn();
  const mockHandleSearch = vi.fn();
  const mockOpenWindow = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementations
    useNotes.mockReturnValue({
      notes: mockNotes,
      handleSearch: mockHandleSearch,
      createNote: mockCreateNote,
      removeNote: mockRemoveNote,
    });

    useWindowManager.mockReturnValue({
      openWindow: mockOpenWindow,
    });

    useTags.mockReturnValue({
      allTags: [],
      noteTags: [],
      loading: false,
      error: null,
      addTag: vi.fn(),
      removeTag: vi.fn(),
      refreshTags: vi.fn(),
      refreshAllTags: vi.fn(),
    });
  });

  it('renders page title', () => {
    render(<NotesPage />);
    expect(screen.getByText('All notes')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<NotesPage />);
    expect(screen.getByPlaceholderText('search')).toBeInTheDocument();
  });

  it('renders add note button', () => {
    render(<NotesPage />);
    const buttons = screen.getAllByRole('button');
    // Should have one add button plus delete buttons for each note
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('renders NotesList with notes', () => {
    render(<NotesPage />);
    expect(screen.getByText('First Note')).toBeInTheDocument();
    expect(screen.getByText('Second Note')).toBeInTheDocument();
    expect(screen.getByText('Third Note')).toBeInTheDocument();
  });

  it('calls createNote when add button is clicked', async () => {
    const user = userEvent.setup();
    render(<NotesPage />);

    // Find the add button (it contains the PlusIcon)
    const buttons = screen.getAllByRole('button');
    const addButton = buttons[0]; // First button should be the add button

    await user.click(addButton);

    expect(mockCreateNote).toHaveBeenCalledTimes(1);
  });

  it('calls handleSearch when typing in search input', async () => {
    const user = userEvent.setup();
    render(<NotesPage />);

    const searchInput = screen.getByPlaceholderText('search');
    await user.type(searchInput, 'test');

    expect(mockHandleSearch).toHaveBeenCalled();
    // Should be called for each character typed
    expect(mockHandleSearch.mock.calls.length).toBeGreaterThan(0);
  });

  it('calls openWindow when note is clicked', async () => {
    const user = userEvent.setup();
    render(<NotesPage />);

    await user.click(screen.getByText('First Note'));

    expect(mockOpenWindow).toHaveBeenCalledTimes(1);
    expect(mockOpenWindow).toHaveBeenCalledWith('1');
  });

  it('calls removeNote when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<NotesPage />);

    const deleteButtons = screen.getAllByRole('button');
    // Skip the first button (add button) and click a delete button
    await user.click(deleteButtons[1]);

    expect(mockRemoveNote).toHaveBeenCalledTimes(1);
    expect(mockRemoveNote).toHaveBeenCalledWith('1');
  });

  it('displays empty state when no notes', () => {
    useNotes.mockReturnValue({
      notes: [],
      handleSearch: mockHandleSearch,
      createNote: mockCreateNote,
      removeNote: mockRemoveNote,
    });

    render(<NotesPage />);
    expect(screen.getByText(/No notes found/i)).toBeInTheDocument();
  });

  it('has correct layout classes', () => {
    const { container } = render(<NotesPage />);
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('bg-gray-700');
    expect(mainDiv).toHaveClass('h-screen');
    expect(mainDiv).toHaveClass('p-2');
  });
});
