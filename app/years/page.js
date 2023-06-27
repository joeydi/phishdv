import YearsBrowser from "../../components/YearsBrowser.js";

async function getData() {
    const res = await fetch(
        "https://api.phish.net/v5/shows/artist/phish.json?order_by=showdate&apikey=EAF2237D09D475C42DC4",
        // "https://api.phish.net/v5/shows/artistid/2.json?order_by=showdate&apikey=EAF2237D09D475C42DC4",
        { next: { revalidate: 60 } }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

export default async function Home() {
    const data = await getData();
    const shows = data.data ?? [];

    return (
        <main>
            <YearsBrowser shows={shows} />
        </main>
    );
}
