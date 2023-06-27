"use client";

import { useEffect, useState } from "react";
import ShowOverlay from "./ShowOverlay.js";

function getPointCoordinates(radius, degrees) {
    // Convert degrees to radians
    var radians = (degrees * Math.PI) / 180;

    // Calculate the x and y coordinates
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Round the coordinates to three decimal places
    x = Number(x.toFixed(3));
    y = Number(y.toFixed(3));

    return { x: x, y: y };
}

function convertRange(value, r1, r2) {
    return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];
}

export default function ShowBrowser({ shows }) {
    const [activeIndex, setActiveIndex] = useState(0);
    // const activeShow = shows[activeIndex];

    const [selectedIndex, setSelectedIndex] = useState(null);
    const selectedShow = shows[selectedIndex] ?? null;

    const handleMouseEnter = (e, index) => {
        setActiveIndex(index);
    };

    const handleClick = (e, index) => {
        setSelectedIndex(index);
    };

    const escKeyHandler = (e) => {
        if (e.key === "Escape") {
            setSelectedIndex(null);
        }

        if (e.key === "ArrowLeft") {
            setSelectedIndex(selectedIndex - 1);
        }

        if (e.key === "ArrowRight") {
            setSelectedIndex(selectedIndex + 1);
        }
    };

    useEffect(() => {
        window.addEventListener("keyup", escKeyHandler);

        return () => {
            window.removeEventListener("keyup", escKeyHandler);
        };
    });

    return (
        <div>
            <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                <circle cx="500" cy="500" r="400" fill="none" stroke="white" strokeWidth="200" />
                {shows.map((show, i) => {
                    let scale = i === activeIndex ? 1.1 : 1;
                    let strokeWidth = i === activeIndex ? 2 : 0.75;

                    let { x: x1, y: y1 } = getPointCoordinates(300, (360 / shows.length) * i - 90);
                    let { x: x2, y: y2 } = getPointCoordinates(500, (360 / shows.length) * i - 90);

                    return (
                        <line
                            key={`line_${i}`}
                            x1={x1 + 500}
                            y1={y1 + 500}
                            x2={x2 + 500}
                            y2={y2 + 500}
                            transform={`scale(${scale})`}
                            transformOrigin={`${x1 + 500} ${y1 + 500}`}
                            stroke="red"
                            strokeWidth={strokeWidth}
                            onMouseEnter={(e) => handleMouseEnter(e, i)}
                            onClick={(e) => handleClick(e, i)}
                        />
                    );
                })}
            </svg>
            {shows.map((show, i) => {
                return (
                    <div
                        key={show.showid}
                        className={`show ${i < activeIndex ? "previous" : ""} ${i > activeIndex ? "next" : ""}`}>
                        <h1 className="mb-1 font-mono font-bold text-slate-500">{show.showdate}</h1>
                        <p className="font-bold text-xl text-slate-800">{show.venue}</p>
                        <p className="mb-2 text-md text-slate-500">
                            {show.city}, {show.state}
                        </p>
                    </div>
                );
            })}

            <ShowOverlay show={selectedShow} />
        </div>
    );
}
