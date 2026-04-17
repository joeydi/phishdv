import { getDb } from "@/lib/db";
import type { SetlistEntryRow } from "@/lib/types";

export function listSetlistEntries(showid: number): SetlistEntryRow[] {
    return getDb()
        .prepare("SELECT * FROM setlist_entries WHERE showid = ? ORDER BY position ASC")
        .all(showid) as SetlistEntryRow[];
}

export type SetlistEntryInput = {
    uniqueid: number;
    showid: number;
    songid: number | null;
    song: string | null;
    slug: string | null;
    set_name: string | null;
    position: number | null;
    transition: number | null;
    trans_mark: string | null;
    footnote: string | null;
    isjam: number | null;
    isreprise: number | null;
    isjamchart: number | null;
    raw: string;
};

export function upsertSetlistEntries(showid: number, entries: SetlistEntryInput[]): void {
    const db = getDb();
    const clear = db.prepare("DELETE FROM setlist_entries WHERE showid = ?");
    const insert = db.prepare(`
        INSERT INTO setlist_entries (
            uniqueid, showid, songid, song, slug, set_name, position, transition,
            trans_mark, footnote, isjam, isreprise, isjamchart, raw, imported_at
        ) VALUES (
            @uniqueid, @showid, @songid, @song, @slug, @set_name, @position, @transition,
            @trans_mark, @footnote, @isjam, @isreprise, @isjamchart, @raw, @imported_at
        )
    `);

    const now = Date.now();
    const tx = db.transaction((rows: SetlistEntryInput[]) => {
        clear.run(showid);
        for (const r of rows) {
            insert.run({ ...r, imported_at: now });
        }
    });
    tx(entries);
}
