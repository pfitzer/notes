# Notes

[![publish](https://github.com/pfitzer/notes/actions/workflows/build.yml/badge.svg?branch=release)](https://github.com/pfitzer/notes/actions/workflows/build.yml)

A simple, lightweight desktop notes application built with [Tauri](https://tauri.app/) and [React](https://react.dev/).

## Features

- 📝 Create and manage notes with Markdown support
- 💾 SQLite database for local storage
- 🎨 Clean, modern UI built with DaisyUI
- 📤 Export notes to files
- 📋 Copy note content to clipboard
- ⚠️ Unsaved changes warning when closing editor windows
- 🪟 Multiple editor windows support

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (latest LTS version recommended)
- [Rust](https://www.rust-lang.org/learn/get-started) (latest stable version)

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

## Demo

![demo gif](docs/demo.gif)