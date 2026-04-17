import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DB_PATH = path.join(process.cwd(), "data", "phish.db");

const globalForDb = globalThis as unknown as { __phishDb?: Database.Database };

export function getDb(): Database.Database {
    if (globalForDb.__phishDb) return globalForDb.__phishDb;

    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    const db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    runMigrations(db);

    globalForDb.__phishDb = db;
    return db;
}

function runMigrations(db: Database.Database): void {
    db.exec(`
        CREATE TABLE IF NOT EXISTS artists (
            artistid    INTEGER PRIMARY KEY,
            name        TEXT NOT NULL,
            slug        TEXT,
            raw         TEXT NOT NULL,
            imported_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_artists_name ON artists(name);

        CREATE TABLE IF NOT EXISTS venues (
            venueid     INTEGER PRIMARY KEY,
            venuename   TEXT NOT NULL,
            city        TEXT,
            state       TEXT,
            country     TEXT,
            raw         TEXT NOT NULL,
            imported_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_venues_name ON venues(venuename);

        CREATE TABLE IF NOT EXISTS songs (
            songid       INTEGER PRIMARY KEY,
            song         TEXT NOT NULL,
            slug         TEXT,
            artist       TEXT,
            times_played INTEGER,
            debut        TEXT,
            last_played  TEXT,
            raw          TEXT NOT NULL,
            imported_at  INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_songs_song ON songs(song);

        CREATE TABLE IF NOT EXISTS shows (
            showid      INTEGER PRIMARY KEY,
            showdate    TEXT NOT NULL,
            showyear    INTEGER,
            artistid    INTEGER,
            artist_name TEXT,
            venueid     INTEGER,
            venue       TEXT,
            city        TEXT,
            state       TEXT,
            country     TEXT,
            tour_name   TEXT,
            raw         TEXT NOT NULL,
            imported_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_shows_showdate ON shows(showdate);
        CREATE INDEX IF NOT EXISTS idx_shows_artistid ON shows(artistid);
    `);
}
