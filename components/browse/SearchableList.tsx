"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type SearchableListItem = {
    id: string | number;
    label: string;
    sub?: string | null;
};

type Props = {
    items: SearchableListItem[];
    basePath: string;
    placeholder?: string;
};

export default function SearchableList({ items, basePath, placeholder = "Search..." }: Props) {
    const [query, setQuery] = useState("");
    const params = useParams<{ id?: string }>();
    const activeId = params?.id;

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items;
        return items.filter((item) => {
            if (item.label.toLowerCase().includes(q)) return true;
            if (item.sub && item.sub.toLowerCase().includes(q)) return true;
            return false;
        });
    }, [items, query]);

    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="shrink-0 border-b p-3">
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="h-9"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                    {filtered.length.toLocaleString()} of {items.length.toLocaleString()}
                </p>
            </div>
            <ScrollArea className="min-h-0 flex-1">
                <ul className="p-1">
                    {filtered.map((item) => {
                        const isActive = String(item.id) === activeId;
                        return (
                            <li key={item.id}>
                                <Link
                                    href={`${basePath}/${item.id}`}
                                    prefetch={false}
                                    className={cn(
                                        "block rounded-md px-3 py-2 text-sm transition-colors",
                                        "hover:bg-accent hover:text-accent-foreground",
                                        isActive && "bg-accent text-accent-foreground"
                                    )}>
                                    <div className="truncate font-medium">{item.label}</div>
                                    {item.sub ? (
                                        <div className="truncate text-xs text-muted-foreground">{item.sub}</div>
                                    ) : null}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </ScrollArea>
        </div>
    );
}
