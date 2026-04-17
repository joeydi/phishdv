import { listVenues } from "@/lib/queries/venues";
import SearchableList from "@/components/browse/SearchableList";

export default function VenuesLayout({ children }: { children: React.ReactNode }) {
    const venues = listVenues();
    const items = venues.map((v) => ({
        id: v.venueid,
        label: v.venuename,
        sub: [v.city, v.state, v.country].filter(Boolean).join(", "),
    }));

    return (
        <>
            <aside className="w-80 shrink-0 border-r">
                <SearchableList items={items} basePath="/browse/venues" placeholder="Search venues..." />
            </aside>
            <section className="flex-1 overflow-auto p-6">{children}</section>
        </>
    );
}
