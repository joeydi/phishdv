import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import BrowseSidebar from "@/components/browse/BrowseSidebar";

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <BrowseSidebar />
            <SidebarInset>
                <header className="flex h-12 items-center gap-2 border-b px-3">
                    <SidebarTrigger />
                </header>
                <div className="flex h-[calc(100vh-3rem)] min-h-0">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
