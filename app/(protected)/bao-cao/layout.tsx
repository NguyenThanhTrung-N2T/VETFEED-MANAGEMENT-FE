import React from "react";
import { BarChart3 } from "lucide-react";
export default function BaoCaoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="p-8 space-y-8 bg-linear-to-br from-gray-50 via-blue-50 to-gray-100 min-h-full">
            {/* Header */}
            <div className="flex flex-col">
                <div>
                    <div className="flex items-center gap-2">
                        <BarChart3 size={20} className="text-slate-700" />
                        <h1 className="text-2xl font-bold text-slate-800">
                            Báo cáo
                        </h1>
                    </div>

                    <p className="text-slate-500 mt-1">
                        Quản lý báo cáo kinh doanh và tài chính
                    </p>
                </div>
            </div>
            <div className="-mx-8 h-px bg-slate-300" />
            {/* Page Content */}
            {children}
        </div>
    );
}