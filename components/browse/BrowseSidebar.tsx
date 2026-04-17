"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Disc3, Music2, Users, MapPin } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
    { href: "/browse/artists", label: "Artists", icon: Users },
    { href: "/browse/shows", label: "Shows", icon: Disc3 },
    { href: "/browse/songs", label: "Songs", icon: Music2 },
    { href: "/browse/venues", label: "Venues", icon: MapPin },
];

export default function BrowseSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="px-2 py-1.5">
                    <h2 className="text-lg font-semibold">Phish.net</h2>
                    <p className="text-xs text-muted-foreground">Data Browser</p>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Browse</SidebarGroupLabel>
                    <SidebarMenu>
                        {items.map((item) => {
                            const Icon = item.icon;
                            const active = pathname === item.href || pathname.startsWith(item.href + "/");
                            return (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton asChild isActive={active}>
                                        <Link href={item.href}>
                                            <Icon />
                                            <span>{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
