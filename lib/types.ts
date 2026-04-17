export type ArtistRow = {
    artistid: number;
    name: string;
    slug: string | null;
    raw: string;
    imported_at: number;
};

export type VenueRow = {
    venueid: number;
    venuename: string;
    city: string | null;
    state: string | null;
    country: string | null;
    raw: string;
    imported_at: number;
};

export type SongRow = {
    songid: number;
    song: string;
    slug: string | null;
    artist: string | null;
    times_played: number | null;
    debut: string | null;
    last_played: string | null;
    raw: string;
    imported_at: number;
};

export type ShowRow = {
    showid: number;
    showdate: string;
    showyear: number | null;
    artistid: number | null;
    artist_name: string | null;
    venueid: number | null;
    venue: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    tour_name: string | null;
    raw: string;
    imported_at: number;
    setlist_fetched_at: number | null;
};

export type SetlistEntryRow = {
    uniqueid: number;
    showid: number;
    songid: number | null;
    song: string | null;
    slug: string | null;
    set_name: string | null;
    position: number | null;
    transition: number | null;
    trans_mark: string | null;
    footnote: string | null;
    isjam: number | null;
    isreprise: number | null;
    isjamchart: number | null;
    raw: string;
    imported_at: number;
};
