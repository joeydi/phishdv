import { getDb } from "../lib/db";
import { fetchPhishNet } from "./_client";

type PhishNetVenue = {
    venueid: number;
    venuename: string;
    city: string | null;
    state: string | null;
    country: string | null;
};

async function main(): Promise<void> {
    console.log("Fetching venues from phish.net...");
    const venues = await fetchPhishNet<PhishNetVenue>("venues");
    console.log(`Received ${venues.length} venues. Writing to SQLite...`);

    const db = getDb();
    const upsert = db.prepare(`
        INSERT INTO venues (venueid, venuename, city, state, country, raw, imported_at)
        VALUES (@venueid, @venuename, @city, @state, @country, @raw, @imported_at)
        ON CONFLICT(venueid) DO UPDATE SET
            venuename=excluded.venuename,
            city=excluded.city,
            state=excluded.state,
            country=excluded.country,
            raw=excluded.raw,
            imported_at=excluded.imported_at
    `);

    const now = Date.now();
    const tx = db.transaction((rows: PhishNetVenue[]) => {
        for (const r of rows) {
            upsert.run({
                venueid: Number(r.venueid),
                venuename: r.venuename ?? "",
                city: r.city ?? null,
                state: r.state ?? null,
                country: r.country ?? null,
                raw: JSON.stringify(r),
                imported_at: now,
            });
        }
    });
    tx(venues);

    console.log(`Imported ${venues.length} venues.`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
