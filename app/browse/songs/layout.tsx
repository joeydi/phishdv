import { listSongs } from "@/lib/queries/songs";
import SearchableList from "@/components/browse/SearchableList";

export default function SongsLayout({ children }: { children: React.ReactNode }) {
    const songs = listSongs();
    const items = songs.map((s) => ({ id: s.songid, label: s.song, sub: s.artist }));

    return (
        <>
            <aside className="w-80 shrink-0 border-r">
                <SearchableList items={items} basePath="/browse/songs" placeholder="Search songs..." />
            </aside>
            <section className="flex-1 overflow-auto p-6">{children}</section>
        </>
    );
}
