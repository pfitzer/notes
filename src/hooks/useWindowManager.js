import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

export function useWindowManager() {
  const [openWindows, setOpenWindows] = useState([]);

  useEffect(() => {
    const unlistenPromise = listen("window-closed", (e) => {
      setOpenWindows((prev) => prev.filter((id) => id !== e.payload));
    });

    return () => {
      unlistenPromise.then(
        (unlisten) => typeof unlisten === "function" && unlisten()
      );
    };
  }, []);

  const openWindow = useCallback(
    async (noteId) => {
      if (openWindows.includes(noteId)) {
        return;
      }

      try {
        setOpenWindows((prev) => [...prev, noteId]);
        await invoke("open_editor", { editorId: String(noteId) });
      } catch (err) {
        console.error("Failed to open editor window:", err);
        setOpenWindows((prev) => prev.filter((id) => id !== noteId));
      }
    },
    [openWindows]
  );

  return { openWindows, openWindow };
}