import { notFound } from "next/navigation";
import { getVenue } from "@/lib/queries/venues";
import DetailCard from "@/components/browse/DetailCard";

export default async function VenueDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const venue = getVenue(Number(id));
    if (!venue) notFound();

    const raw = JSON.parse(venue.raw) as Record<string, unknown>;
    const subtitle = [venue.city, venue.state, venue.country].filter(Boolean).join(", ");
    return <DetailCard title={venue.venuename} subtitle={subtitle || undefined} data={raw} />;
}
