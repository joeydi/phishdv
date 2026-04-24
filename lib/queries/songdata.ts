import { getDb } from "@/lib/db";

export type SongDataRow = {
    songid: number;
    raw: string;
    fetched_at: number;
};

export function getSongData(songid: number): SongDataRow | undefined {
    return getDb()
        .prepare("SELECT * FROM song_data WHERE songid = ?")
        .get(songid) as SongDataRow | undefined;
}

export function upsertSongData(songid: number, raw: string, fetchedAt: number): void {
    getDb()
        .prepare(
            `INSERT INTO song_data (songid, raw, fetched_at)
             VALUES (?, ?, ?)
             ON CONFLICT(songid) DO UPDATE SET raw=excluded.raw, fetched_at=excluded.fetched_at`
        )
        .run(songid, raw, fetchedAt);
}
