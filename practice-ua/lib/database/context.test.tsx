import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { DatabaseProvider, useDatabase } from "./context";
import { SQLiteDatabaseLike, SQLiteModuleLike } from "./client";

class FakeDatabase implements SQLiteDatabaseLike {
  execAsync = jest.fn().mockResolvedValue(undefined);
}

class FakeSQLiteModule implements SQLiteModuleLike {
  openDatabaseAsync = jest.fn().mockImplementation(async (name: string) => {
    return new FakeDatabase();
  });
}

describe("DatabaseProvider with injected SQLite", () => {
  it("provides a DatabaseClient via context and initializes DB", async () => {
    const fakeSQLite = new FakeSQLiteModule();
    let clientFromContext: any = null;

    const TestComponent = () => {
      clientFromContext = useDatabase();
      return null;
    };

    render(
      <DatabaseProvider sqlite={fakeSQLite}>
        <TestComponent />
      </DatabaseProvider>
    );

    // Wait for initialization to finish
    await waitFor(() => {
      expect(clientFromContext).not.toBeNull();
      expect(clientFromContext.db).not.toBeNull();
    });

    expect(fakeSQLite.openDatabaseAsync).toHaveBeenCalledWith("database");

    const db = clientFromContext.db;
    expect(db.execAsync).toHaveBeenCalledTimes(2);

    expect(db.execAsync).toHaveBeenCalledWith(
      expect.stringContaining("CREATE TABLE IF NOT EXISTS day_stat")
    );

    expect(db.execAsync).toHaveBeenCalledWith(
      expect.stringContaining("CREATE TABLE IF NOT EXISTS starred_lessons")
    );
  });

  it("useDatabase returns null if used outside provider", () => {
    let contextValue: any = undefined;

    const TestComponent = () => {
      contextValue = useDatabase();
      return null;
    };

    render(<TestComponent />);
    expect(contextValue).toBeNull();
  });
});
