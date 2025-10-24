import { useEffect } from 'react';

/**
 * Hook to register keyboard shortcuts
 * @param {string} key - The key to listen for (e.g., 's', 'n', 'f')
 * @param {Function} callback - Function to call when shortcut is triggered
 * @param {Object} options - Options object
 * @param {boolean} options.ctrl - Require Ctrl key (Cmd on Mac)
 * @param {boolean} options.shift - Require Shift key
 * @param {boolean} options.alt - Require Alt key
 * @param {boolean} options.enabled - Whether the shortcut is enabled (default: true)
 */
export function useKeyboardShortcut(key, callback, options = {}) {
  const { ctrl = false, shift = false, alt = false, enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      // Determine if we're on Mac
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifierKey = isMac ? event.metaKey : event.ctrlKey;

      // Check if the key matches
      const keyMatches = event.key.toLowerCase() === key.toLowerCase();

      // Check if modifiers match
      const ctrlMatches = ctrl ? modifierKey : !event.ctrlKey && !event.metaKey;
      const shiftMatches = shift ? event.shiftKey : !event.shiftKey;
      const altMatches = alt ? event.altKey : !event.altKey;

      if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
        event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, callback, ctrl, shift, alt, enabled]);
}

/**
 * Hook to register multiple keyboard shortcuts
 * @param {Array} shortcuts - Array of shortcut configurations
 * Each shortcut should have: { key, callback, ctrl?, shift?, alt?, enabled? }
 */
export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifierKey = isMac ? event.metaKey : event.ctrlKey;

      for (const shortcut of shortcuts) {
        if (shortcut.enabled === false) continue;

        const { key, callback, ctrl = false, shift = false, alt = false } = shortcut;

        const keyMatches = event.key.toLowerCase() === key.toLowerCase();
        const ctrlMatches = ctrl ? modifierKey : !event.ctrlKey && !event.metaKey;
        const shiftMatches = shift ? event.shiftKey : !event.shiftKey;
        const altMatches = alt ? event.altKey : !event.altKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
          event.preventDefault();
          callback(event);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}
