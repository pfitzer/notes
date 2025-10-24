# Notes

[![publish](https://github.com/pfitzer/notes/actions/workflows/build.yml/badge.svg?branch=release)](https://github.com/pfitzer/notes/actions/workflows/build.yml)
[![Tests](https://github.com/pfitzer/notes/actions/workflows/test.yml/badge.svg)](https://github.com/pfitzer/notes/actions/workflows/test.yml)

A simple, lightweight desktop notes application built with [Tauri](https://tauri.app/) and [React](https://react.dev/).

## Features

- 📝 Create and manage notes with Markdown support
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

- All UI components (Button, Input, Icons)
- Feature components (NoteItem, NotesList)
- Pages (NotesPage)

Coverage reports are generated in the `coverage/` directory. Open `coverage/index.html` in a browser to view the detailed coverage report.

### CI/CD

Tests run automatically on:
- Every push to the `main` branch
- All pull requests to `main`

## Demo

![demo gif](docs/demo.gif)