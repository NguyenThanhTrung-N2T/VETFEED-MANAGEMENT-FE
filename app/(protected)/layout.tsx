import Sidebar from "@/components/Sidebar";
import { Toaster } from "sonner";
export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full bg-[#eef2f6]">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                {children}
                <Toaster
                    position="top-right"
                    richColors
                    closeButton
                />
            </main>
        </div>
    );
}