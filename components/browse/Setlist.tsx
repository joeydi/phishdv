import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listSetlistEntries } from "@/lib/queries/setlists";
import type { SetlistEntryRow } from "@/lib/types";

const SET_ORDER: Record<string, number> = {
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    e: 90,
    encore: 90,
    s: 99,
    soundcheck: 99,
};

function setRank(name: string | null): number {
    if (!name) return 0;
    const key = name.toLowerCase();
    return SET_ORDER[key] ?? (Number(name) || 50);
}

function setLabel(name: string | null): string {
    if (!name) return "Set";
    const key = name.toLowerCase();
    if (key === "e" || key === "encore") return "Encore";
    if (key === "s" || key === "soundcheck") return "Soundcheck";
    return `Set ${name}`;
}

function groupBySet(entries: SetlistEntryRow[]): Map<string, SetlistEntryRow[]> {
    const groups = new Map<string, SetlistEntryRow[]>();
    for (const e of entries) {
        const key = e.set_name ?? "";
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(e);
    }
    for (const list of groups.values()) {
        list.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    }
    return new Map([...groups.entries()].sort((a, b) => setRank(a[0]) - setRank(b[0])));
}

export default function Setlist({ showid }: { showid: number }) {
    const entries = listSetlistEntries(showid);

    if (entries.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Setlist</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">No setlist available for this show.</p>
                </CardContent>
            </Card>
        );
    }

    const grouped = groupBySet(entries);
    const footnotes: { marker: number; text: string }[] = [];
    const footnoteByText = new Map<string, number>();
    function footnoteIndex(text: string): number {
        const existing = footnoteByText.get(text);
        if (existing != null) return existing;
        const marker = footnotes.length + 1;
        footnoteByText.set(text, marker);
        footnotes.push({ marker, text });
        return marker;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Setlist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {[...grouped.entries()].map(([setKey, songs]) => (
                    <div key={setKey}>
                        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {setLabel(setKey)}
                        </h3>
                        <p className="leading-relaxed">
                            {songs.map((entry, i) => {
                                const isLast = i === songs.length - 1;
                                const marker = entry.footnote ? footnoteIndex(entry.footnote) : null;
                                return (
                                    <span key={entry.uniqueid}>
                                        {entry.songid ? (
                                            <Link
                                                href={`/browse/songs/${entry.songid}`}
                                                className="underline-offset-2 hover:underline">
                                                {entry.song ?? "?"}
                                            </Link>
                                        ) : (
                                            <span>{entry.song ?? "?"}</span>
                                        )}
                                        {marker != null ? <sup className="text-muted-foreground"> [{marker}]</sup> : null}
                                        {!isLast ? entry.trans_mark ?? ", " : ""}
                                    </span>
                                );
                            })}
                        </p>
                    </div>
                ))}
                {footnotes.length > 0 ? (
                    <ol className="mt-4 space-y-1 border-t pt-3 text-xs text-muted-foreground">
                        {footnotes.map((f) => (
                            <li key={f.marker}>
                                <span className="mr-2 font-mono">[{f.marker}]</span>
                                {f.text}
                            </li>
                        ))}
                    </ol>
                ) : null}
            </CardContent>
        </Card>
    );
}
