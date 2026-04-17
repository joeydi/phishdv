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
