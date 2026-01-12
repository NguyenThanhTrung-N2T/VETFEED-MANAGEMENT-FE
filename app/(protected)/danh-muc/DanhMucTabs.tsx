"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Layout, Tag, Users } from "lucide-react";

const TABS = [
    { name: "Nhà cung cấp", path: "/danh-muc/nha-cung-cap", icon: Globe },
    { name: "Kho", path: "/danh-muc/kho", icon: Layout },
    { name: "Sản phẩm", path: "/danh-muc/san-pham", icon: Tag },
    { name: "Khách hàng", path: "/danh-muc/khach-hang", icon: Users },
] as const;

export default function DanhMucTabs() {
    const pathname = usePathname();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {TABS.map((tab) => {
                const isActive = pathname === tab.path;
                const Icon = tab.icon;

                return (
                    <Link
                        key={tab.path}
                        href={tab.path}
                        className={`
                            flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg
                            font-medium shadow-sm transition-all
                            ${isActive
                                ? "bg-[#FFC20E] text-slate-900"
                                : "bg-[#25396f] text-white rounded-lg hover:bg-[#1e2e5a] cursor-pointer"
                            }
            `}
                    >
                        <Icon size={18} />
                        <span>{tab.name}</span>
                    </Link>
                );
            })}
        </div>
    );
}
