import React, {
  createContext,
  useContext,
  useMemo,
  ReactNode,
  useEffect,
} from "react";
import { DatabaseClient, SQLiteModuleLike } from "./client";
import * as SQLite from "expo-sqlite";

const DatabaseContext = createContext<DatabaseClient | null>(null);

type DatabaseProviderProps = {
  sqlite?: SQLiteModuleLike;
  children: ReactNode;
};

export const DatabaseProvider = ({
  sqlite = SQLite,
  children,
}: DatabaseProviderProps) => {
  const dbClient = useMemo(() => new DatabaseClient(sqlite), [sqlite]);

  useEffect(() => {
    dbClient.init();
  }, [dbClient]);

  return <DatabaseContext value={dbClient}>{children}</DatabaseContext>;
};

export const useDatabase = () => useContext(DatabaseContext);
