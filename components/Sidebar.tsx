"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider'; // Import hook UseAuth
import {
    LayoutDashboard, DollarSign, ShoppingCart,
    ArrowRightLeft, CornerUpLeft, Package,
    Folder, CalendarDays, BarChart3, LogOut, Loader2
} from 'lucide-react';

const MENU_ITEMS = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/dashboard' },
    { name: "Bán hàng", icon: <DollarSign size={20} />, href: "/ban-hang" },
    { name: "Nhập hàng", icon: <ShoppingCart size={20} />, href: "/nhap-hang" },
    { name: "Chuyển kho", icon: <ArrowRightLeft size={20} />, href: "/chuyen-kho" },
    { name: "Trả hàng", icon: <CornerUpLeft size={20} />, href: "/tra-hang" },
    { name: "Tồn kho", icon: <Package size={20} />, href: "/ton-kho" },
    { name: "Danh mục", icon: <Folder size={20} />, href: "/danh-muc/nha-cung-cap", basePath: "/danh-muc" },
    { name: "Công nợ", icon: <CalendarDays size={20} />, href: "/cong-no" },
    // Chỉ Admin mới thấy Báo cáo
    { name: 'Báo cáo', icon: <BarChart3 size={20} />, href: '/bao-cao', role: 'QUAN_LY' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout, loading } = useAuth(); // Lấy data từ Context

    // Xử lý Loading (tránh flash nội dung sai khi chưa load xong user)
    if (loading) {
        return (
            <aside className="w-64 bg-[#0f172a] h-screen flex flex-col shrink-0 sticky top-0 border-r border-slate-800">
                <div className="p-6 flex justify-center">
                    {/* Logo Skeleton */}
                    <div className="h-8 w-32 bg-slate-800 rounded animate-pulse" />
                </div>

                {/* User Info Skeleton */}
                <div className="px-6 pb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 animate-pulse shrink-0" />
                    <div className="space-y-2 flex-1">
                        <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
                        <div className="h-3 w-16 bg-slate-800 rounded animate-pulse" />
                    </div>
                </div>

                {/* Menu Skeleton */}
                <div className="px-4 space-y-3 mt-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-10 w-full bg-slate-800/50 rounded-lg animate-pulse" />
                    ))}
                </div>
            </aside>
        );
    }

    // Nếu không có user (đã logout hoặc chưa login), không render gì cả
    if (!user) return null;

    // Lọc menu dựa trên Role
    const filteredMenu = MENU_ITEMS.filter(item => {
        if (!item.role) return true; // Menu không yêu cầu role -> Hiện tất cả
        // So sánh Role: Chuyển về UpperCase để chắc chắn khớp với API (ADMIN/NHAN_VIEN)
        return user.role?.toUpperCase() === item.role;
    });

    return (
        <aside className="w-64 bg-[#0f172a] text-white flex flex-col shrink-0 h-screen sticky top-0">
            {/* ... Phần Logo ... */}
            <div className="p-6 flex justify-center">
                <h1 className="text-2xl font-bold tracking-wide uppercase">VET<span className="text-[#d4af37]">FEED</span></h1>
            </div>

            {/* User Info lấy từ AuthContext */}
            <div className="px-6 pb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#d4af37] flex items-center justify-center font-bold text-white shrink-0 shadow-lg shadow-emerald-900/20">
                    {/* Hiển thị Avatar nếu có, không thì lấy chữ cái đầu */}
                    {user.avatar ? (
                        <img src={user.avatar} alt="User" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        user.hoTen?.charAt(0).toUpperCase() || "U"
                    )}
                </div>
                <div className="overflow-hidden">
                    <p className="font-medium text-sm truncate text-slate-100" title={user.hoTen}>
                        {user.hoTen}
                    </p>
                    <p className="text-[11px] text-[#d4af37] font-bold uppercase tracking-wider">
                        {user.role === 'QUAN_LY' ? 'Quản lý' : 'Nhân viên'}
                    </p>
                </div>
            </div>

            {/* Menu Navigation */}
            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar pb-4">
                {filteredMenu.map((item, index) => {
                    const isActive = item.basePath
                        ? pathname.startsWith(item.basePath)
                        : pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={index}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative
                                ${isActive
                                    ? 'bg-[#d4af37]/90 text-white font-medium shadow-md shadow-emerald-900/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-[#d4af37]'
                                }`}
                        >
                            {/* Icon */}
                            <span className={`transition-colors ${isActive ? 'text-[#0f172a]' : 'group-hover:text-[#d4af37]'}`}>
                                {item.icon}
                            </span>
                            <span className={`transition-colors ${isActive ? 'text-[#0f172a] text-sm font-bold' : 'group-hover:text-[#d4af37] text-sm font-bold'}`}>{item.name}</span>

                            {/* Active Indicator bar */}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-slate-800 bg-[#0f172a]">
                <button
                    onClick={logout}
                    className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-red-600 hover:text-white text-slate-400 py-2.5 rounded-lg font-medium transition-all duration-300 group"
                >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
}