import { config } from "dotenv";
config({ path: ".env.local" });

import { getDb } from "../lib/db";
import { ensureSetlistCached } from "../lib/setlists";

async function main(): Promise<void> {
    const db = getDb();
    const rows = db
        .prepare("SELECT showid FROM shows WHERE setlist_fetched_at IS NULL ORDER BY showdate DESC")
        .all() as { showid: number }[];

    console.log(`Found ${rows.length} shows without a cached setlist.`);
    if (rows.length === 0) return;

    let done = 0;
    for (const { showid } of rows) {
        await ensureSetlistCached(showid);
        done += 1;
        if (done % 50 === 0 || done === rows.length) {
            console.log(`  ${done}/${rows.length}`);
        }
        await new Promise((r) => setTimeout(r, 100));
    }

    console.log("Done.");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
