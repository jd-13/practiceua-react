// TODO: Wait for @testing-library/react-native to support react 19
describe("nothing", () => {
  it("is a placeholder", () => {
    expect(true).toBe(true);
  });
});

// import React from "react";
// import { render } from "@testing-library/react-native";
// import { DatabaseProvider, useDatabase } from "./databaseContext";
// import { SQLiteModuleLike, SQLiteDatabaseLike } from "./client";

// // A simple fake SQLite implementation for tests
// const createFakeSQLite = () => {
//   const execAsync = jest.fn().mockResolvedValue(undefined);

//   const fakeDb: SQLiteDatabaseLike = {
//     execAsync,
//   };

//   const fakeSQLite: SQLiteModuleLike = {
//     openDatabaseAsync: jest.fn().mockResolvedValue(fakeDb),
//   };

//   return { fakeSQLite, fakeDb, execAsync };
// };

// // A test component that uses the hook
// const TestComponent = () => {
//   const db = useDatabase();
//   return <>{db ? "database loaded" : "no database"}</>;
// };

// describe("DatabaseContext", () => {
//   it("provides a DatabaseClient constructed with injected SQLite module", async () => {
//     const { fakeSQLite } = createFakeSQLite();

//     const { getByText } = render(
//       <DatabaseProvider sqlite={fakeSQLite}>
//         <TestComponent />
//       </DatabaseProvider>
//     );

//     // The database client exists
//     expect(getByText("database loaded")).toBeTruthy();

//     // And it was constructed using our injected dependency
//     expect(fakeSQLite.openDatabaseAsync).not.toHaveBeenCalled();
//     // init() isn't automatically called — this is expected.
//   });
// });
