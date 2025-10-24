# Notes

[![publish](https://github.com/pfitzer/notes/actions/workflows/build.yml/badge.svg?branch=release)](https://github.com/pfitzer/notes/actions/workflows/build.yml)
[![Tests](https://github.com/pfitzer/notes/actions/workflows/test.yml/badge.svg)](https://github.com/pfitzer/notes/actions/workflows/test.yml)

A simple, lightweight desktop notes application built with [Tauri](https://tauri.app/) and [React](https://react.dev/).

## Features

- 📝 Create and manage notes with Markdown support
- 🏷️ Organize notes with color-coded tags
- 🔍 Search and filter notes by text or tags
- 💾 SQLite database for local storage
- 🎨 Clean, modern UI built with DaisyUI
- 📤 Export notes to files
- 📋 Copy note content to clipboard
- ⚠️ Unsaved changes warning when closing editor windows
- 🪟 Multiple editor windows support
- ⌨️ Keyboard shortcuts for quick actions

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (latest LTS version recommended)
- [Rust](https://www.rust-lang.org/learn/get-started) (latest stable version)
- [Tauri](https://tauri.app/) 2.0+ (installed via npm)
- [React](https://react.dev/) 19.2+ (installed via npm)

### Setup

```bash
git clone https://github.com/pfitzer/notes.git
cd notes

# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Build for production
npm run tauri build
```

## Using Tags

The tag system helps you organize and filter your notes effectively.

### Adding Tags to Notes

In the **Editor Page**:
1. Find the "Tags" field below the title
2. Type a tag name and press **Enter** to add it
3. Tags are automatically created with random colors
4. Click the × button on a tag to remove it

### Filtering Notes by Tags

In the **Notes List Page**:
- All available tags appear below the search bar
- Click a tag to filter notes with that tag
- Selected tags are highlighted with a white ring
- Click "Clear all" to remove all tag filters
- Filter multiple tags to show notes with any of the selected tags

### Tag Features

- **Color-Coded**: Each tag gets a unique color for easy identification
- **Persistent**: Tags are shared across all notes
- **Visual**: Tags appear directly on note cards in the list view
- **Fast Filtering**: Instantly filter your notes by clicking tags

## Keyboard Shortcuts

The application supports the following keyboard shortcuts for improved productivity:

### Notes List Page
- **Ctrl/Cmd + N** - Create a new note
- **Ctrl/Cmd + F** - Focus on search input

### Editor Page
- **Ctrl/Cmd + S** - Save the current note

> **Note:** On macOS, use `Cmd` instead of `Ctrl` for all shortcuts.

## Testing

The project uses [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/react) for testing.

### Run Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Coverage

Current test coverage: **100%** for all tested components

- All UI components (Button, Input, Tag, Icons)
- Feature components (NoteItem, NotesList)
- Pages (NotesPage)
- Keyboard shortcuts hook

Coverage reports are generated in the `coverage/` directory. Open `coverage/index.html` in a browser to view the detailed coverage report.

### CI/CD

Tests run automatically on:
- Every push to the `main` branch
- All pull requests to `main`

## Demo

![demo gif](docs/demo.gif)