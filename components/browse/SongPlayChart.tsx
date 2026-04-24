"use client";

import { useId, useState } from "react";

type Props = {
    playDates: string[];
    artistRangeStart: string;
    artistRangeEnd: string;
};

function toMs(d: string): number {
    return Date.UTC(Number(d.slice(0, 4)), Number(d.slice(5, 7)) - 1, Number(d.slice(8, 10)));
}

export default function SongPlayChart({ playDates, artistRangeStart, artistRangeEnd }: Props) {
    const [sinceDebut, setSinceDebut] = useState(false);
    const checkboxId = useId();

    const debut = playDates[0] ?? artistRangeStart;
    const rangeStart = sinceDebut ? debut : artistRangeStart;
    const rangeEnd = artistRangeEnd;

    const startMs = toMs(rangeStart);
    const endMs = toMs(rangeEnd);
    const span = Math.max(1, endMs - startMs);

    const ticks = playDates
        .map(toMs)
        .filter((t) => t >= startMs && t <= endMs)
        .map((t) => ((t - startMs) / span) * 1000);

    const canToggle = playDates.length > 0;

    return (
        <div className="w-full flex flex-col gap-2">
            <div className="flex justify-end">
                <label
                    htmlFor={checkboxId}
                    className={`flex items-center gap-1.5 text-xs text-muted-foreground ${
                        canToggle ? "cursor-pointer" : "opacity-50"
                    }`}
                >
                    <input
                        id={checkboxId}
                        type="checkbox"
                        checked={sinceDebut}
                        onChange={(e) => setSinceDebut(e.target.checked)}
                        disabled={!canToggle}
                        className="h-3 w-3"
                    />
                    Since debut
                </label>
            </div>
            <svg
                viewBox="0 0 1000 40"
                preserveAspectRatio="none"
                className="w-full h-10"
                aria-label="Song play timeline"
            >
                <line
                    x1={0}
                    x2={1000}
                    y1={32}
                    y2={32}
                    stroke="var(--border)"
                    vectorEffect="non-scaling-stroke"
                />
                {ticks.map((x, i) => (
                    <line
                        key={i}
                        x1={x}
                        x2={x}
                        y1={8}
                        y2={32}
                        stroke="var(--chart-1)"
                        strokeWidth={1}
                        vectorEffect="non-scaling-stroke"
                    />
                ))}
            </svg>
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>{rangeStart.slice(0, 4)}</span>
                <span>{rangeEnd.slice(0, 4)}</span>
            </div>
        </div>
    );
}
