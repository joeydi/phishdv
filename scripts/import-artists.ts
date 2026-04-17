import { getDb } from "../lib/db";
import { fetchPhishNet } from "./_client";

type PhishNetArtist = {
    id: number;
    artist: string;
    slug: string | null;
};

async function main(): Promise<void> {
    console.log("Fetching artists from phish.net...");
    const artists = await fetchPhishNet<PhishNetArtist>("artists");
    console.log(`Received ${artists.length} artists. Writing to SQLite...`);

    const db = getDb();
    const upsert = db.prepare(`
        INSERT INTO artists (artistid, name, slug, raw, imported_at)
        VALUES (@artistid, @name, @slug, @raw, @imported_at)
        ON CONFLICT(artistid) DO UPDATE SET
            name=excluded.name,
            slug=excluded.slug,
            raw=excluded.raw,
            imported_at=excluded.imported_at
    `);

    const now = Date.now();
    const tx = db.transaction((rows: PhishNetArtist[]) => {
        for (const r of rows) {
            upsert.run({
                artistid: Number(r.id),
                name: r.artist ?? "",
                slug: r.slug ?? null,
                raw: JSON.stringify(r),
                imported_at: now,
            });
        }
    });
    tx(artists);

    console.log(`Imported ${artists.length} artists.`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
