"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, DollarSign, ShoppingCart,
    ArrowRightLeft, CornerUpLeft, Package,
    Folder, CalendarDays, BarChart3, LogOut
} from 'lucide-react';

const MENU_ITEMS = [
    // Sửa href ngắn gọn hơn
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/dashboard' },
    { name: "Bán hàng", icon: <DollarSign size={20} />, href: "/ban-hang" },
    { name: "Nhập hàng", icon: <ShoppingCart size={20} />, href: "/nhap-hang" },
    { name: "Chuyển kho", icon: <ArrowRightLeft size={20} />, href: "/chuyen-kho" },
    { name: "Trả hàng", icon: <CornerUpLeft size={20} />, href: "/tra-hang" },
    { name: "Tồn kho", icon: <Package size={20} />, href: "/ton-kho" },
    { name: "Danh mục", icon: <Folder size={20} />, href: "/danh-muc" },
    { name: "Công nợ", icon: <CalendarDays size={20} />, href: "/cong-no" },
    { name: 'Báo cáo', icon: <BarChart3 size={20} />, href: '/bao-cao', role: 'admin' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [role, setRole] = useState<string | null>(null);
    const [userName, setUserName] = useState("Loading...");

    // Đọc dữ liệu từ LocalStorage khi component được mount (chạy ở Client)
    useEffect(() => {
        const storedRole = localStorage.getItem('userRole') || 'staff'; // Mặc định là staff nếu không tìm thấy
        const storedName = localStorage.getItem('userName') || 'Nhân viên';
        setRole(storedRole);
        setUserName(storedName);
    }, []);

    // Lọc menu
    const filteredMenu = MENU_ITEMS.filter(item => {
        if (!item.role) return true; // Không yêu cầu role -> Hiện cho tất cả
        return item.role === role;   // Yêu cầu role -> Phải khớp với role hiện tại
    });

    const handleLogout = () => {
        // 1. XÓA COOKIE (Bước quan trọng nhất)
        // Đặt max-age=0 để trình duyệt xoá ngay lập tức
        document.cookie = "userRole=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        // 2. Xóa LocalStorage
        localStorage.clear();

        // 3. Chuyển hướng dứt khoát về trang login
        // Dùng window.location.href thay vì router.push để reload lại trang sạch sẽ nhất
        window.location.href = "/login";
    };

    if (!role) return null; // Tránh render sai khi chưa load xong role

    return (
        <aside className="w-64 bg-[#0f172a] text-white flex flex-col shrink-0 h-screen sticky top-0">
            {/* ... Phần Logo ... */}
            <div className="p-6 flex justify-center">
                <h1 className="text-2xl font-bold tracking-wide uppercase">VET<span className="text-emerald-500">FEED</span></h1>
            </div>

            {/* User Info lấy từ LocalStorage */}
            <div className="px-6 pb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white">
                    {userName.charAt(0)}
                </div>
                <div>
                    <p className="font-medium text-sm truncate w-32">{userName}</p>
                    <p className="text-xs text-gray-400 capitalize">{role}</p>
                </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                {filteredMenu.map((item, index) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={index}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                                ${isActive
                                    ? 'bg-yellow-400 text-slate-900 font-semibol'
                                    : 'text-slate-200 hover:bg-white/10'
                                }`}
                        >
                            <span>{item.icon}</span>
                            <span className="text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium transition-colors"
                >
                    <LogOut size={18} />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
}