import { render } from '@testing-library/react';
import { vi } from 'vitest';

// Mock note data for tests
export const mockNote = {
  note_id: '1',
  title: 'Test Note',
  content: 'Test content',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
};

export const mockNotes = [
  { note_id: '1', title: 'First Note', content: 'Content 1' },
  { note_id: '2', title: 'Second Note', content: 'Content 2' },
  { note_id: '3', title: 'Third Note', content: 'Content 3' },
];

// Custom render function that includes common providers if needed
export function renderWithProviders(ui, options = {}) {
  return render(ui, { ...options });
}

// Mock hooks
export const mockUseNotes = {
  notes: mockNotes,
  handleSearch: vi.fn(),
  createNote: vi.fn(),
  removeNote: vi.fn(),
};

export const mockUseWindowManager = {
  openWindow: vi.fn(),
};

export const mockUseEditor = {
  content: '',
  title: '',
  handleContentChange: vi.fn(),
  handleTitleChange: vi.fn(),
  saveNote: vi.fn(),
};

// Helper to wait for async operations
export const waitForAsync = () => new Promise((resolve) => setTimeout(resolve, 0));
