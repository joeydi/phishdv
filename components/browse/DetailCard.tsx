import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
    title: string;
    subtitle?: string | null;
    data: Record<string, unknown>;
};

function formatValue(value: unknown): string {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
}

export default function DetailCard({ title, subtitle, data }: Props) {
    const entries = Object.entries(data);
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">{title}</CardTitle>
                {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
            </CardHeader>
            <CardContent>
                <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm">
                    {entries.map(([key, value]) => (
                        <div key={key} className="contents">
                            <dt className="font-mono text-xs uppercase text-muted-foreground">{key}</dt>
                            <dd className="break-words">{formatValue(value)}</dd>
                        </div>
                    ))}
                </dl>
            </CardContent>
        </Card>
    );
}
