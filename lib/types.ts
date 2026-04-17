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
};
