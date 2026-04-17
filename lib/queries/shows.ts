import { getDb } from "@/lib/db";
import type { ShowRow } from "@/lib/types";

export function listShows(): ShowRow[] {
    return getDb()
        .prepare("SELECT * FROM shows ORDER BY showdate DESC")
        .all() as ShowRow[];
}

export function getShow(showid: number): ShowRow | undefined {
    return getDb()
        .prepare("SELECT * FROM shows WHERE showid = ?")
        .get(showid) as ShowRow | undefined;
}

export function listShowsByVenue(venueid: number): ShowRow[] {
    return getDb()
        .prepare("SELECT * FROM shows WHERE venueid = ? ORDER BY showdate DESC")
        .all(venueid) as ShowRow[];
}

export function markShowSetlistFetched(showid: number, timestamp: number): void {
    getDb()
        .prepare("UPDATE shows SET setlist_fetched_at = ? WHERE showid = ?")
        .run(timestamp, showid);
}
