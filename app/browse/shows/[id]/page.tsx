import { notFound } from "next/navigation";
import { getShow } from "@/lib/queries/shows";
import DetailCard from "@/components/browse/DetailCard";

export default async function ShowDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const show = getShow(Number(id));
    if (!show) notFound();

    const raw = JSON.parse(show.raw) as Record<string, unknown>;
    const subtitle = [show.venue, show.city, show.state].filter(Boolean).join(" — ");
    return (
        <DetailCard
            title={`${show.showdate}${show.artist_name ? ` — ${show.artist_name}` : ""}`}
            subtitle={subtitle || undefined}
            data={raw}
        />
    );
}
