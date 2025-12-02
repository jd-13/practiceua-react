import { DatabaseClient, SQLiteDatabaseLike, SQLiteModuleLike } from "./databaseClient";

describe("DatabaseClient", () => {
  it("creates tables using injected SQLite implementation", async () => {
    const execSpy = jest.fn().mockResolvedValue(undefined);

    const fakeDb: SQLiteDatabaseLike = {
      execAsync: execSpy,
    };

    const fakeSQLite: SQLiteModuleLike = {
      openDatabaseAsync: jest.fn().mockResolvedValue(fakeDb),
    };

    const client = new DatabaseClient(fakeSQLite);
    await client.init();

    expect(fakeSQLite.openDatabaseAsync).toHaveBeenCalledWith("database");
    expect(execSpy).toHaveBeenCalledTimes(2);
    expect(execSpy.mock.calls[0][0]).toContain("CREATE TABLE IF NOT EXISTS day_stat");
    expect(execSpy.mock.calls[1][0]).toContain("CREATE TABLE IF NOT EXISTS starred_lessons");
  });
});