import { getDb } from "@/lib/db";
import type { VenueRow } from "@/lib/types";

export function listVenues(): VenueRow[] {
    return getDb()
        .prepare("SELECT * FROM venues ORDER BY venuename COLLATE NOCASE ASC")
        .all() as VenueRow[];
}

export function getVenue(venueid: number): VenueRow | undefined {
    return getDb()
        .prepare("SELECT * FROM venues WHERE venueid = ?")
        .get(venueid) as VenueRow | undefined;
}
