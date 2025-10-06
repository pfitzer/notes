import { useCallback } from "react";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";

export function useNotifications() {
  const notify = useCallback(async (title, body) => {
    try {
      let permissionGranted = await isPermissionGranted();

      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === "granted";
      }

      if (permissionGranted) {
        sendNotification({ title, body });
      }
    } catch (err) {
      console.error("Failed to send notification:", err);
    }
  }, []);

  return { notify };
}