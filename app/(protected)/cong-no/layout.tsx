import React from "react";
import { CalendarDays } from "lucide-react";
export default function CongNoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="p-6 bg-[#eef2f6] min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <div className="p-1.5 bg-slate-800 rounded text-white">
                        <CalendarDays size={20} />
                    </div>
                    Công nợ
                </h1>
            </div>
            <div className="-mx-8 h-px bg-slate-300 mb-6" />
            {/* Page Content */}
            {children}
        </div>
    );
}