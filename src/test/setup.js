import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Tauri APIs
global.window = global.window || {};
window.__TAURI_INTERNALS__ = {};

// Mock Tauri invoke
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

// Mock Tauri window
vi.mock('@tauri-apps/api/window', () => ({
  getCurrent: vi.fn(() => ({
    listen: vi.fn(),
    emit: vi.fn(),
  })),
}));

// Mock Tauri plugins
vi.mock('@tauri-apps/plugin-sql', () => ({
  default: vi.fn(() => ({
    select: vi.fn(),
    execute: vi.fn(),
  })),
}));

vi.mock('@tauri-apps/plugin-dialog', () => ({
  message: vi.fn(),
  ask: vi.fn(),
  confirm: vi.fn(),
}));

vi.mock('@tauri-apps/plugin-shell', () => ({
  open: vi.fn(),
}));

vi.mock('@tauri-apps/plugin-notification', () => ({
  sendNotification: vi.fn(),
}));

vi.mock('@tauri-apps/plugin-clipboard-manager', () => ({
  writeText: vi.fn(),
  readText: vi.fn(),
}));

vi.mock('@tauri-apps/plugin-fs', () => ({
  readTextFile: vi.fn(),
  writeTextFile: vi.fn(),
}));
