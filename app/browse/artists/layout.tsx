import { listArtists } from "@/lib/queries/artists";
import SearchableList from "@/components/browse/SearchableList";

export default function ArtistsLayout({ children }: { children: React.ReactNode }) {
    const artists = listArtists();
    const items = artists.map((a) => ({ id: a.artistid, label: a.name, sub: a.slug }));

    return (
        <>
            <aside className="w-80 shrink-0 border-r">
                <SearchableList items={items} basePath="/browse/artists" placeholder="Search artists..." />
            </aside>
            <section className="flex-1 overflow-auto p-6">{children}</section>
        </>
    );
}
