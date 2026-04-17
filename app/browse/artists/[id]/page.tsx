import { notFound } from "next/navigation";
import { getArtist } from "@/lib/queries/artists";
import DetailCard from "@/components/browse/DetailCard";

export default async function ArtistDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const artist = getArtist(Number(id));
    if (!artist) notFound();

    const raw = JSON.parse(artist.raw) as Record<string, unknown>;
    return <DetailCard title={artist.name} subtitle={artist.slug ?? undefined} data={raw} />;
}
