import { notFound } from "next/navigation";
import { getShow } from "@/lib/queries/shows";
import { ensureSetlistCached } from "@/lib/setlists";
import DetailCard from "@/components/browse/DetailCard";
import Setlist from "@/components/browse/Setlist";

export default async function ShowDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const showid = Number(id);
    const show = getShow(showid);
    if (!show) notFound();

    await ensureSetlistCached(showid);

    const raw = JSON.parse(show.raw) as Record<string, unknown>;
    const subtitle = [show.venue, show.city, show.state].filter(Boolean).join(" — ");
    return (
        <div className="flex flex-col gap-6">
            <DetailCard
                title={`${show.showdate}${show.artist_name ? ` — ${show.artist_name}` : ""}`}
                subtitle={subtitle || undefined}
                data={raw}
            />
            <Setlist showid={showid} />
        </div>
    );
}
