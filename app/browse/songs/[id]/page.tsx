import { notFound } from "next/navigation";
import { getSong } from "@/lib/queries/songs";
import { getPlayDatesForSong, listShowsForSong } from "@/lib/queries/setlists";
import { getShowDateRangeForArtist } from "@/lib/queries/shows";
import { ensureSongDataCached } from "@/lib/songdata";
import DetailCard from "@/components/browse/DetailCard";
import SongPlayChart from "@/components/browse/SongPlayChart";
import SongDataPanel from "@/components/browse/SongDataPanel";
import SongShowList from "@/components/browse/SongShowList";

export default async function SongDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const song = getSong(Number(id));
    if (!song) notFound();

    const playDates = getPlayDatesForSong(song.songid);
    const shows = listShowsForSong(song.songid);
    const artistRange = song.artist ? getShowDateRangeForArtist(song.artist) : undefined;

    const artistRangeStart = artistRange?.min ?? playDates[0] ?? song.debut ?? "";
    const artistRangeEnd = artistRange?.max ?? playDates.at(-1) ?? song.last_played ?? "";

    const raw = JSON.parse(song.raw) as Record<string, unknown>;

    const songData = await ensureSongDataCached(song.songid);
    const songDataParsed = songData ? JSON.parse(songData.raw) : null;

    return (
        <div className="flex flex-col gap-6">
            {artistRangeStart && artistRangeEnd ? (
                <SongPlayChart
                    playDates={playDates}
                    artistRangeStart={artistRangeStart}
                    artistRangeEnd={artistRangeEnd}
                />
            ) : null}
            <DetailCard title={song.song} subtitle={song.artist ?? undefined} data={raw} />
            <SongDataPanel data={songDataParsed} />
            <SongShowList shows={shows} />
        </div>
    );
}
