import { getShow, markShowSetlistFetched } from "@/lib/queries/shows";
import { upsertSetlistEntries, type SetlistEntryInput } from "@/lib/queries/setlists";

type PhishNetSetlistEntry = {
    uniqueid: number;
    showid: number;
    songid: number | null;
    song: string | null;
    slug: string | null;
    set: string | null;
    position: number | null;
    transition: number | null;
    trans_mark: string | null;
    footnote: string | null;
    isjam: number | null;
    isreprise: number | null;
    isjamchart: number | null;
};

type PhishNetResponse = {
    error: boolean;
    error_message: string;
    data: PhishNetSetlistEntry[];
};

async function fetchSetlist(showid: number, apiKey: string): Promise<PhishNetSetlistEntry[]> {
    const url = `https://api.phish.net/v5/setlists/showid/${showid}.json?apikey=${apiKey}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
        throw new Error(`phish.net setlists/${showid} HTTP ${res.status}`);
    }
    const payload = (await res.json()) as PhishNetResponse;
    if (payload.error) {
        throw new Error(`phish.net setlists/${showid} API error: ${payload.error_message}`);
    }
    return payload.data ?? [];
}

export async function ensureSetlistCached(showid: number): Promise<void> {
    const show = getShow(showid);
    if (!show) return;
    if (show.setlist_fetched_at != null) return;

    const apiKey = process.env.PHISHNET_API_KEY;
    if (!apiKey) {
        throw new Error("Missing PHISHNET_API_KEY");
    }

    try {
        const entries = await fetchSetlist(showid, apiKey);
        const inputs: SetlistEntryInput[] = entries.map((e) => ({
            uniqueid: Number(e.uniqueid),
            showid: Number(e.showid),
            songid: e.songid != null ? Number(e.songid) : null,
            song: e.song ?? null,
            slug: e.slug ?? null,
            set_name: e.set ?? null,
            position: e.position != null ? Number(e.position) : null,
            transition: e.transition != null ? Number(e.transition) : null,
            trans_mark: e.trans_mark ?? null,
            footnote: e.footnote ?? null,
            isjam: e.isjam != null ? Number(e.isjam) : null,
            isreprise: e.isreprise != null ? Number(e.isreprise) : null,
            isjamchart: e.isjamchart != null ? Number(e.isjamchart) : null,
            raw: JSON.stringify(e),
        }));
        upsertSetlistEntries(showid, inputs);
        markShowSetlistFetched(showid, Date.now());
    } catch (err) {
        console.error(`ensureSetlistCached(${showid}) failed:`, err);
        markShowSetlistFetched(showid, Date.now());
    }
}
