import React from "react";
import DanhMucTabs from "./DanhMucTabs";
import { Folder } from "lucide-react";
export default function DanhMucLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="p-6 bg-[#eef2f6] min-h-screen relative">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <div className="p-1.5 bg-slate-800 rounded text-white">
                        <Folder size={20} />
                    </div>
                    Danh mục
                </h1>
            </div>
            <div className="-mx-6 h-px bg-slate-300 mb-6" />
            {/* Tabs */}
            <DanhMucTabs />
            {/* Page Content */}
            {children}
        </div>
    );
}
