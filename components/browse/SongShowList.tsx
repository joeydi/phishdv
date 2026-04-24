import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SongShowRow } from "@/lib/queries/setlists";

type Props = {
    shows: SongShowRow[];
};

function venueLabel(show: SongShowRow): string {
    return [show.venue, show.city, show.state ?? show.country].filter(Boolean).join(" — ");
}

export default function SongShowList({ shows }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">
                    Shows <span className="text-sm font-normal text-muted-foreground">({shows.length})</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {shows.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No shows found. Import more setlists to populate this list.
                    </p>
                ) : (
                    <ul className="divide-y text-sm">
                        {shows.map((show) => (
                            <li key={show.showid} className="flex items-baseline gap-4 py-2">
                                <Link
                                    href={`/browse/shows/${show.showid}`}
                                    className="font-mono underline-offset-2 hover:underline"
                                >
                                    {show.showdate}
                                </Link>
                                <span className="text-muted-foreground">{venueLabel(show)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
