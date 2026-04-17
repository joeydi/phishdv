"use client";

import { useEffect, useState } from "react";

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

function YearList({ year, shows }) {
    return (
        <div>
            <h1>{year}</h1>
            {shows.map((show, i) => {
                return (
                    <div key={show.showid} className="">
                        <h1 className="mb-1 font-mono font-bold text-slate-500">{show.showdate}</h1>
                        <p className="font-bold text-xl text-slate-800">{show.venue}</p>
                        <p className="mb-2 text-md text-slate-500">
                            {show.city}, {show.state}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

export default function YearsBrowser({ shows }) {
    const years = groupByProperty(shows, "showyear");

    return (
        <div className="years">
            {Object.keys(years).map((year) => {
                const shows = years[year];

                return YearList({ year, shows });
            })}
        </div>
    );
}
