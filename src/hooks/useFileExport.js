import { useCallback } from "react";
import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";

export function useFileExport() {
  const exportToFile = useCallback(async (content) => {
    try {
      const filePath = await save({
        filters: [{ name: "Markdown", extensions: ["md"] }],
      });

      if (filePath) {
        await writeTextFile(filePath, content);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to export file:", err);
      return false;
    }
  }, []);

  return { exportToFile };
}