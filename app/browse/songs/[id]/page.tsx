import { notFound } from "next/navigation";
import { getSong } from "@/lib/queries/songs";
import DetailCard from "@/components/browse/DetailCard";

export default async function SongDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const song = getSong(Number(id));
    if (!song) notFound();

    const raw = JSON.parse(song.raw) as Record<string, unknown>;
    return <DetailCard title={song.song} subtitle={song.artist ?? undefined} data={raw} />;
}
