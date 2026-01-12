import React from "react";
import { CalendarDays } from "lucide-react";
export default function CongNoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="p-8 space-y-8 bg-[#eef2f6] min-h-full">
            {/* Header */}
            <div className="flex flex-col">
                <div>
                    <div className="flex items-center gap-2">
                        <CalendarDays size={20} className="text-slate-700" />
                        <h1 className="text-2xl font-bold text-slate-800">
                            Công nợ
                        </h1>
                    </div>

                    <p className="text-slate-500 mt-1">
                        Quản lý công nợ Khách hàng và Nhà cung cấp
                    </p>
                </div>
            </div>
            <div className="-mx-8 h-px bg-slate-300" />
            {/* Page Content */}
            {children}
        </div>
    );
}