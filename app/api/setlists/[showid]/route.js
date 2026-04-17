export async function GET(request, { params }) {
    const { showid } = await params;

    const res = await fetch(
        `https://api.phish.net/v5/setlists/showid/${showid}.json?order_by=showdate&apikey=EAF2237D09D475C42DC4`
    );

    if (!res.ok) {
        return Response.json({ error: "Failed to fetch setlist" }, { status: res.status });
    }

    const data = await res.json();
    return Response.json(data);
}
