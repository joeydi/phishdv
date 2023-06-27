// "use client";

import { useState, useEffect } from "react";

const groupByProperty = (array, property) => {
    return array.reduce((result, obj) => {
        const key = obj[property];
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(obj);
        return result;
    }, {});
};

export default function ShowOverlay({ show }) {
    const [setlist, setSetlist] = useState([]);

    const sets = groupByProperty(setlist, "set");

    useEffect(() => {
        const getSetlist = async (showid) => {
            const res = await fetch(
                `https://api.phish.net/v5/setlists/showid/${showid}.json?order_by=showdate&apikey=EAF2237D09D475C42DC4`,
                { next: { revalidate: 60 } }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await res.json();
            console.log(data.data);
            setSetlist(data.data ?? []);
        };

        if (show) {
            getSetlist(show.showid);
        }
    }, [show]);

    return (
        <div className="selected-show-wrap">
            <div className={`selected-show drop-shadow-lg ${show ? "active" : ""}`}>
                {show && (
                    <div>
                        <h1 className="mb-1 font-mono font-bold text-slate-500">{show.showdate}</h1>
                        <p className="font-bold text-xl text-slate-800">{show.venue}</p>
                        <p className="mb-2 text-md text-slate-500">
                            {show.city}, {show.state}
                        </p>
                        <div className="my-8" dangerouslySetInnerHTML={{ __html: show.setlist_notes }} />
                    </div>
                )}
                {setlist && (
                    <div>
                        {Object.keys(sets).map((set) => {
                            const setlist = sets[set];

                            return (
                                <>
                                    <p className="p-2 text-sm uppercase font-bold">
                                        {set === "e" ? "Encore" : `Set ${set}`}
                                    </p>
                                    <div className="bg-slate-100 mb-4 p-2 rounded">
                                        {setlist.map((song) => (
                                            <p key={song.uniqueid} className="me-2">
                                                {song.song}
                                            </p>
                                        ))}
                                    </div>
                                </>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
