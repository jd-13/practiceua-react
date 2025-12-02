import * as SQLite from 'expo-sqlite';

// Represents the minimal shape of a SQLite database connection
export interface SQLiteDatabaseLike {
    execAsync(sql: string): Promise<void>;
}

// Represents the SQLite module we inject (expo-sqlite or a test stub)
export interface SQLiteModuleLike {
    openDatabaseAsync(name: string): Promise<SQLiteDatabaseLike>;
}

const DB_NAME = "database";
const dayStatTableName = 'day_stat';
const starredLessonsTableName = 'starred_lessons';

export class DatabaseClient {
    private sqlite: SQLiteModuleLike;
    db: SQLiteDatabaseLike | null = null;

    constructor(sqliteImpl: SQLiteModuleLike) {
        this.sqlite = sqliteImpl;
    }

    async init() {
        console.log('[DatabaseClient] Initializing database...');
        this.db = await this.sqlite.openDatabaseAsync(DB_NAME);
        console.log('[DatabaseClient] Database opened successfully');

        // Create the day stat table
        await this.db.execAsync(`CREATE TABLE IF NOT EXISTS ${dayStatTableName}(date TEXT, lesson_name TEXT, num_correct INTEGER, num_answered INTEGER, PRIMARY KEY(date, lesson_name))`);
        console.log(`[DatabaseClient] Ensured table exists: ${dayStatTableName}`);

        // Create the starred lessons table
        await this.db.execAsync(`CREATE TABLE IF NOT EXISTS ${starredLessonsTableName}(lesson_name TEXT, PRIMARY KEY(lesson_name))`);
        console.log(`[DatabaseClient] Ensured table exists: ${starredLessonsTableName}`);
        console.log('[DatabaseClient] Database initialization complete');
    }
};
