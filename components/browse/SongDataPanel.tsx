import { Card } from "@/components/ui/card";

type Props = {
    data: unknown;
};

function formatValue(value: unknown): string {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
}

function renderEntries(obj: Record<string, unknown>) {
    const entries = Object.entries(obj);
    return (
        <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm">
            {entries.map(([key, value]) => (
                <div key={key} className="contents">
                    <dt className="font-mono text-xs uppercase text-muted-foreground">{key}</dt>
                    <dd className="break-words">{formatValue(value)}</dd>
                </div>
            ))}
        </dl>
    );
}

export default function SongDataPanel({ data }: Props) {
    const records = Array.isArray(data) ? data : data ? [data] : [];

    return (
        <Card className="p-0">
            <details className="group">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-medium select-none">
                    <span>Extended song data</span>
                    <span className="text-xs text-muted-foreground group-open:hidden">Show</span>
                    <span className="hidden text-xs text-muted-foreground group-open:inline">Hide</span>
                </summary>
                <div className="flex flex-col gap-4 px-6 pb-6">
                    {records.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No extended data available.</p>
                    ) : (
                        records.map((r, i) => (
                            <div key={i}>{renderEntries(r as Record<string, unknown>)}</div>
                        ))
                    )}
                </div>
            </details>
        </Card>
    );
}
