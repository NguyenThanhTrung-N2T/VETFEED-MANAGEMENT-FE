"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Layout, Tag, Users } from "lucide-react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const TABS = [
    { name: "Nhà cung cấp", path: "/danh-muc/nha-cung-cap", icon: Globe },
    { name: "Kho", path: "/danh-muc/kho", icon: Layout },
    { name: "Sản phẩm", path: "/danh-muc/san-pham", icon: Tag },
    { name: "Khách hàng", path: "/danh-muc/khach-hang", icon: Users },
] as const;

export default function DanhMucTabs() {
    const pathname = usePathname();

    return (
        <div className="flex flex-wrap gap-3 mb-8 w-full">
            {TABS.map((tab) => {
                const isActive = pathname === tab.path;
                const Icon = tab.icon;

                return (
                    <Link
                        key={tab.path}
                        href={tab.path}
                        className={cn(
                            "relative flex-1 min-w-37.5 group transition-all duration-200",
                            // 1. If Active: z-20 (Highest, stays on top of everything)
                            // 2. If Hovered (but not active): z-10 (Floats above inactive neighbors)
                            // 3. Default: z-0
                            isActive ? "z-20" : "z-0 hover:z-10"
                        )}
                    >
                        {/* LAYER 1: Inactive Background (White Card) */}
                        {!isActive && (
                            <div className="absolute inset-0 bg-white border border-slate-200 rounded-xl shadow-sm group-hover:border-blue-300 group-hover:shadow-md transition-all z-0" />
                        )}

                        {/* LAYER 2: Active Background (Blue Pill) */}
                        {isActive && (
                            <motion.div
                                layoutId="activeTabBackground"
                                className="absolute inset-0 bg-[#25396f] rounded-xl shadow-lg shadow-blue-900/20 z-10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}

                        {/* LAYER 3: Content (Text & Icon) */}
                        <motion.div
                            className={cn(
                                "relative z-20 flex items-center justify-center gap-2 px-6 py-3 font-medium text-sm transition-colors duration-200 w-full h-full",
                                isActive ? "text-white" : "text-slate-600 group-hover:text-slate-900"
                            )}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Icon size={18} className={cn(isActive ? "text-blue-100" : "text-slate-400")} />
                            <span className="whitespace-nowrap">{tab.name}</span>
                        </motion.div>
                    </Link>
                );
            })}
        </div>
    );
}