import { getSongData, upsertSongData, type SongDataRow } from "@/lib/queries/songdata";

type PhishNetResponse = {
    error: boolean;
    error_message: string;
    data: unknown[];
};

async function fetchSongData(songid: number, apiKey: string): Promise<unknown[]> {
    const url = `https://api.phish.net/v5/songdata/songid/${songid}.json?apikey=${apiKey}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
        throw new Error(`phish.net songdata/${songid} HTTP ${res.status}`);
    }
    const payload = (await res.json()) as PhishNetResponse;
    if (payload.error) {
        throw new Error(`phish.net songdata/${songid} API error: ${payload.error_message}`);
    }
    return payload.data ?? [];
}

export async function ensureSongDataCached(songid: number): Promise<SongDataRow | undefined> {
    const existing = getSongData(songid);
    if (existing) return existing;

    const apiKey = process.env.PHISHNET_API_KEY;
    if (!apiKey) return undefined;

    try {
        const data = await fetchSongData(songid, apiKey);
        const now = Date.now();
        upsertSongData(songid, JSON.stringify(data), now);
        return { songid, raw: JSON.stringify(data), fetched_at: now };
    } catch (err) {
        console.error(`ensureSongDataCached(${songid}) failed:`, err);
        return undefined;
    }
}
