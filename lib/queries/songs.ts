import { getDb } from "@/lib/db";
import type { SongRow } from "@/lib/types";

export function listSongs(): SongRow[] {
    return getDb()
        .prepare("SELECT * FROM songs ORDER BY song COLLATE NOCASE ASC")
        .all() as SongRow[];
}

export function getSong(songid: number): SongRow | undefined {
    return getDb()
        .prepare("SELECT * FROM songs WHERE songid = ?")
        .get(songid) as SongRow | undefined;
}
