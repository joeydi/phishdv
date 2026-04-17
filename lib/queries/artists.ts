import { getDb } from "@/lib/db";
import type { ArtistRow } from "@/lib/types";

export function listArtists(): ArtistRow[] {
    return getDb()
        .prepare("SELECT * FROM artists ORDER BY name COLLATE NOCASE ASC")
        .all() as ArtistRow[];
}

export function getArtist(artistid: number): ArtistRow | undefined {
    return getDb()
        .prepare("SELECT * FROM artists WHERE artistid = ?")
        .get(artistid) as ArtistRow | undefined;
}
