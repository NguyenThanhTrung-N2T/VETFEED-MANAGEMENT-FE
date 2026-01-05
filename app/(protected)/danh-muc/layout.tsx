import React from "react";
import DanhMucTabs from "./DanhMucTabs";
import { Folder } from "lucide-react";
export default function DanhMucLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="p-8 space-y-8 bg-[#eef2f6] min-h-full">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Folder size={20} className="text-slate-700" />
                        <h1 className="text-2xl font-bold text-slate-800">Danh mục</h1>
                    </div>
                    <p className="text-slate-500 mt-1">
                        Quản lý Nhà cung cấp, Kho, Sản phẩm và Khách hàng
                    </p>
                </div>
            </div>
            <div className="-mx-8 h-px bg-slate-300" />
            {/* Tabs */}
            <DanhMucTabs />
            {/* Page Content */}
            {children}
        </div>
    );
}
