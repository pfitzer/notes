import { createContext, useContext, useEffect, useState } from "react";
import { initDatabase } from "../services/database.js";

const DatabaseContext = createContext(null);

export function DatabaseProvider({ children }) {
  const [db, setDb] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function setupDatabase() {
      try {
        const database = await initDatabase();
        setDb(database);
        setIsReady(true);
      } catch (err) {
        console.error("Failed to initialize database:", err);
        setError(err);
      }
    }

    setupDatabase();
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, isReady, error }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
}