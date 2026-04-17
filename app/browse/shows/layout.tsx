import { listShows } from "@/lib/queries/shows";
import SearchableList from "@/components/browse/SearchableList";

export default function ShowsLayout({ children }: { children: React.ReactNode }) {
    const shows = listShows();
    const items = shows.map((s) => ({
        id: s.showid,
        label: `${s.showdate} — ${s.venue ?? "Unknown venue"}`,
        sub: [s.city, s.state, s.country].filter(Boolean).join(", "),
    }));

    return (
        <>
            <aside className="w-80 shrink-0 border-r">
                <SearchableList items={items} basePath="/browse/shows" placeholder="Search shows..." />
            </aside>
            <section className="flex-1 overflow-auto p-6">{children}</section>
        </>
    );
}
