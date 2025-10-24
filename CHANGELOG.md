# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-24

### Added
- **Tag System**: Organize notes with color-coded tags
  - Add tags to notes in the editor (press Enter to add)
  - Filter notes by clicking tags in the list view
  - 8 predefined tag colors, randomly assigned
  - Tags are shared across all notes and stored in SQLite database
  - Support for multiple tag filtering
- **Keyboard Shortcuts**: Quick actions for improved productivity
  - `Ctrl/Cmd + N`: Create a new note (Notes List Page)
  - `Ctrl/Cmd + F`: Focus on search input (Notes List Page)
  - `Ctrl/Cmd + S`: Save the current note (Editor Page)
  - Cross-platform support (Ctrl on Windows/Linux, Cmd on macOS)
- **Help Menu**: In-app usage instructions
  - Access via menu bar
  - Comprehensive guide covering all features
  - Keyboard shortcuts reference
  - Tag system usage instructions
- **Testing Suite**: Comprehensive test coverage with Vitest
  - 71 passing tests with 100% coverage
  - React Testing Library for component tests
  - Tests for all UI components, features, and keyboard shortcuts
  - CI/CD integration with GitHub Actions
  - Coverage reports with v8
- **Test Scripts**: New npm commands
  - `npm test`: Run tests in watch mode
  - `npm run test:run`: Run tests once
  - `npm run test:ui`: Interactive test UI
  - `npm run test:coverage`: Generate coverage reports
- **Documentation**: Extensive README updates
  - Tag system usage guide
  - Keyboard shortcuts documentation
  - Testing instructions
  - GitHub Actions test badge

### Changed
- **NoteItem Component**: Now displays tags below note title
- **NotesPage**: Added tag filter UI below search bar
- **EditorPage**: Added tag input field below title field
- **useNotes Hook**: Now loads notes with their associated tags
- **About Dialog**: Now displays app version automatically from Cargo.toml
- **Input Component**: Converted to forwardRef to support focus control

### Database
- Migration v2: Created `tags` table with tag_id, name, and color columns
- Migration v3: Created `note_tags` junction table for many-to-many relationships
- Added CASCADE delete for automatic cleanup of tag associations
- New database functions for tag management and filtering

### Developer Experience
- Added Vitest configuration
- Added test setup with Tauri API mocks
- Added test utilities and mock data
- Added coverage configuration with exclusions

## [1.0.0] - 2024-01-25

### Added
- Initial release
- Create and manage notes with Markdown support
- SQLite database for local storage
- Search functionality for notes
- Export notes to files
- Copy note content to clipboard
- Unsaved changes warning when closing editor windows
- Multiple editor windows support
- Clean, modern UI built with DaisyUI and Tailwind CSS
- Tauri-based desktop application for Windows, macOS, and Linux

[1.1.0]: https://github.com/pfitzer/notes/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/pfitzer/notes/releases/tag/v1.0.0
