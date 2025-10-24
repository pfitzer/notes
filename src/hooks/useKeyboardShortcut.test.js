import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcut, useKeyboardShortcuts } from './useKeyboardShortcut';

describe('useKeyboardShortcut', () => {
  let originalPlatform;

  beforeEach(() => {
    originalPlatform = navigator.platform;
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'platform', {
      value: originalPlatform,
      writable: true,
    });
  });

  const simulateKeyPress = (key, modifiers = {}) => {
    const event = new KeyboardEvent('keydown', {
      key,
      ctrlKey: modifiers.ctrlKey || false,
      metaKey: modifiers.metaKey || false,
      shiftKey: modifiers.shiftKey || false,
      altKey: modifiers.altKey || false,
      bubbles: true,
    });
    window.dispatchEvent(event);
    return event;
  };

  it('calls callback when key is pressed with ctrl modifier', () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut('s', callback, { ctrl: true }));

    simulateKeyPress('s', { ctrlKey: true });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not call callback when wrong key is pressed', () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut('s', callback, { ctrl: true }));

    simulateKeyPress('a', { ctrlKey: true });

    expect(callback).not.toHaveBeenCalled();
  });

  it('does not call callback when modifier is missing', () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut('s', callback, { ctrl: true }));

    simulateKeyPress('s', { ctrlKey: false });

    expect(callback).not.toHaveBeenCalled();
  });

  it('uses metaKey on Mac platform', () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
      writable: true,
    });

    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut('s', callback, { ctrl: true }));

    simulateKeyPress('s', { metaKey: true });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not call callback when enabled is false', () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut('s', callback, { ctrl: true, enabled: false }));

    simulateKeyPress('s', { ctrlKey: true });

    expect(callback).not.toHaveBeenCalled();
  });

  it('works with shift modifier', () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut('S', callback, { ctrl: true, shift: true }));

    simulateKeyPress('S', { ctrlKey: true, shiftKey: true });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('works with alt modifier', () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut('s', callback, { ctrl: true, alt: true }));

    simulateKeyPress('s', { ctrlKey: true, altKey: true });

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('useKeyboardShortcuts', () => {
  const simulateKeyPress = (key, modifiers = {}) => {
    const event = new KeyboardEvent('keydown', {
      key,
      ctrlKey: modifiers.ctrlKey || false,
      metaKey: modifiers.metaKey || false,
      shiftKey: modifiers.shiftKey || false,
      altKey: modifiers.altKey || false,
      bubbles: true,
    });
    window.dispatchEvent(event);
    return event;
  };

  it('registers multiple shortcuts', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const shortcuts = [
      { key: 's', ctrl: true, callback: callback1 },
      { key: 'n', ctrl: true, callback: callback2 },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    simulateKeyPress('s', { ctrlKey: true });
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();

    simulateKeyPress('n', { ctrlKey: true });
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('skips disabled shortcuts', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const shortcuts = [
      { key: 's', ctrl: true, callback: callback1, enabled: false },
      { key: 'n', ctrl: true, callback: callback2 },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    simulateKeyPress('s', { ctrlKey: true });
    expect(callback1).not.toHaveBeenCalled();

    simulateKeyPress('n', { ctrlKey: true });
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('stops at first matching shortcut', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    // Both shortcuts use the same key combination
    const shortcuts = [
      { key: 's', ctrl: true, callback: callback1 },
      { key: 's', ctrl: true, callback: callback2 },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    simulateKeyPress('s', { ctrlKey: true });

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();
  });
});
