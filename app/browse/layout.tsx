import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import BrowseSidebar from "@/components/browse/BrowseSidebar";

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider className="h-svh overflow-hidden">
            <BrowseSidebar />
            <SidebarInset className="min-h-0">
                <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
                    <SidebarTrigger />
                </header>
                <div className="flex min-h-0 flex-1">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
