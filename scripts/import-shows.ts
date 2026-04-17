import { getDb } from "../lib/db";
import { fetchPhishNet } from "./_client";

type PhishNetShow = {
    showid: number;
    showdate: string;
    showyear: string | number | null;
    artistid: number | null;
    artist_name: string | null;
    venueid: number | null;
    venue: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    tour_name: string | null;
};

function toInt(value: string | number | null | undefined): number | null {
    if (value === null || value === undefined || value === "") return null;
    const n = typeof value === "number" ? value : parseInt(value, 10);
    return Number.isFinite(n) ? n : null;
}

async function main(): Promise<void> {
    console.log("Fetching shows from phish.net...");
    const shows = await fetchPhishNet<PhishNetShow>("shows");
    console.log(`Received ${shows.length} shows. Writing to SQLite...`);

    const db = getDb();
    const upsert = db.prepare(`
        INSERT INTO shows (
            showid, showdate, showyear, artistid, artist_name,
            venueid, venue, city, state, country, tour_name, raw, imported_at
        )
        VALUES (
            @showid, @showdate, @showyear, @artistid, @artist_name,
            @venueid, @venue, @city, @state, @country, @tour_name, @raw, @imported_at
        )
        ON CONFLICT(showid) DO UPDATE SET
            showdate=excluded.showdate,
            showyear=excluded.showyear,
            artistid=excluded.artistid,
            artist_name=excluded.artist_name,
            venueid=excluded.venueid,
            venue=excluded.venue,
            city=excluded.city,
            state=excluded.state,
            country=excluded.country,
            tour_name=excluded.tour_name,
            raw=excluded.raw,
            imported_at=excluded.imported_at
    `);

    const now = Date.now();
    const tx = db.transaction((rows: PhishNetShow[]) => {
        for (const r of rows) {
            upsert.run({
                showid: Number(r.showid),
                showdate: r.showdate ?? "",
                showyear: toInt(r.showyear),
                artistid: toInt(r.artistid ?? null),
                artist_name: r.artist_name ?? null,
                venueid: toInt(r.venueid ?? null),
                venue: r.venue ?? null,
                city: r.city ?? null,
                state: r.state ?? null,
                country: r.country ?? null,
                tour_name: r.tour_name ?? null,
                raw: JSON.stringify(r),
                imported_at: now,
            });
        }
    });
    tx(shows);

    console.log(`Imported ${shows.length} shows.`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
