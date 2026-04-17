import { getDb } from "../lib/db";
import { fetchPhishNet } from "./_client";

type PhishNetSong = {
    songid: number;
    song: string;
    slug: string | null;
    artist: string | null;
    times_played: number | null;
    debut: string | null;
    last_played: string | null;
};

async function main(): Promise<void> {
    console.log("Fetching songs from phish.net...");
    const songs = await fetchPhishNet<PhishNetSong>("songs");
    console.log(`Received ${songs.length} songs. Writing to SQLite...`);

    const db = getDb();
    const upsert = db.prepare(`
        INSERT INTO songs (songid, song, slug, artist, times_played, debut, last_played, raw, imported_at)
        VALUES (@songid, @song, @slug, @artist, @times_played, @debut, @last_played, @raw, @imported_at)
        ON CONFLICT(songid) DO UPDATE SET
            song=excluded.song,
            slug=excluded.slug,
            artist=excluded.artist,
            times_played=excluded.times_played,
            debut=excluded.debut,
            last_played=excluded.last_played,
            raw=excluded.raw,
            imported_at=excluded.imported_at
    `);

    const now = Date.now();
    const tx = db.transaction((rows: PhishNetSong[]) => {
        for (const r of rows) {
            upsert.run({
                songid: Number(r.songid),
                song: r.song ?? "",
                slug: r.slug ?? null,
                artist: r.artist ?? null,
                times_played: r.times_played ?? null,
                debut: r.debut ?? null,
                last_played: r.last_played ?? null,
                raw: JSON.stringify(r),
                imported_at: now,
            });
        }
    });
    tx(songs);

    console.log(`Imported ${songs.length} songs.`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
