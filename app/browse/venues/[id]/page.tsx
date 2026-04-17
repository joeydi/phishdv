import Link from "next/link";
import { notFound } from "next/navigation";
import { getVenue } from "@/lib/queries/venues";
import { listShowsByVenue } from "@/lib/queries/shows";
import DetailCard from "@/components/browse/DetailCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function VenueDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const venueid = Number(id);
    const venue = getVenue(venueid);
    if (!venue) notFound();

    const raw = JSON.parse(venue.raw) as Record<string, unknown>;
    const subtitle = [venue.city, venue.state, venue.country].filter(Boolean).join(", ");
    const shows = listShowsByVenue(venueid);

    return (
        <div className="flex flex-col gap-6">
            <DetailCard title={venue.venuename} subtitle={subtitle || undefined} data={raw} />
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Shows at this venue ({shows.length.toLocaleString()})</CardTitle>
                </CardHeader>
                <CardContent>
                    {shows.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No shows recorded at this venue.</p>
                    ) : (
                        <ul className="divide-y">
                            {shows.map((show) => (
                                <li key={show.showid}>
                                    <Link
                                        href={`/browse/shows/${show.showid}`}
                                        className="flex items-baseline justify-between gap-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                                        <span className="font-mono">{show.showdate}</span>
                                        <span className="flex-1 text-muted-foreground">
                                            {show.artist_name ?? "—"}
                                        </span>
                                        {show.tour_name ? (
                                            <span className="text-xs text-muted-foreground">{show.tour_name}</span>
                                        ) : null}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
