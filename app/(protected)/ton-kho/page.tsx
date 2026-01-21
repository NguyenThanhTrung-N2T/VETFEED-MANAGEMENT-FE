"use client";

import React, { useState, useEffect } from 'react';
import {
    Search, ChevronDown, ChevronRight, Package, Loader2,
    Box, AlertTriangle, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { inventoryService } from '@/services/inventory.service';
import { KhoHangTonKho } from '@/types/inventory';
import { motion, AnimatePresence, Variants } from 'framer-motion'; // Import Variants fix lỗi TS
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility: Merge Class ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function InventoryPage() {
    // --- State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<KhoHangTonKho[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    // --- Animation Variants (Fix lỗi TS) ---
    // Hiệu ứng cho danh sách con (Sản phẩm)
    const listVariants: Variants = {
        hidden: { opacity: 0, height: 0, overflow: 'hidden' },
        visible: {
            opacity: 1,
            height: 'auto',
            transition: { duration: 0.3, ease: "easeInOut" }
        },
        exit: {
            opacity: 0,
            height: 0,
            transition: { duration: 0.2, ease: "easeInOut" }
        }
    };

    // --- Fetch Data ---
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await inventoryService.getAll();
            setData(res);
            // Mặc định mở kho đầu tiên
            if (res.length > 0) {
                setExpandedIds([res[0].maKho]);
            }
        } catch (error) {
            console.error("Failed to fetch inventory:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Filter Logic ---
    const filteredData = data.map(kho => {
        const isKhoMatch = kho.tenKho?.toLowerCase().includes(searchTerm.toLowerCase());
        const filteredItems = kho.danhSachTonKho.filter(item =>
            item.tenSP?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.maPNCode?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (isKhoMatch) return kho;
        else if (filteredItems.length > 0) return { ...kho, danhSachTonKho: filteredItems };
        return null;
    }).filter(item => item !== null) as KhoHangTonKho[];

    const toggleExpand = (id: string) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    // --- Helper: Stock Status Badge ---
    const StockBadge = ({ quantity }: { quantity: number }) => {
        let colorClass = "bg-emerald-50 text-emerald-700 border-emerald-100";
        let Icon = CheckCircle2;
        let text = "Sẵn hàng";

        if (quantity === 0) {
            colorClass = "bg-red-50 text-red-700 border-red-100";
            Icon = Box;
            text = "Hết hàng";
        } else if (quantity <= 10) {
            colorClass = "bg-amber-50 text-amber-700 border-amber-100";
            Icon = AlertTriangle;
            text = "Sắp hết";
        }

        return (
            <div className={cn("flex flex-col items-center justify-center gap-1 min-w-[80px]")}>
                <span className={cn("text-sm font-bold px-2 py-0.5 rounded-md border", colorClass)}>
                    {quantity}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                    <Icon size={10} /> {text}
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 bg-[#eef2f6] min-h-screen font-sans relative">
            {/* --- HEADER --- */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10"
            >
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br bg-[#25396f] rounded-xl text-white shadow-lg bg-[#25396f]-200">
                            <Package size={24} />
                        </div>
                        Quản lý Tồn kho
                    </h1>
                    <p className="text-slate-500 text-sm mt-2 ml-1">Kiểm soát số lượng và giá trị hàng hóa.</p>
                </div>
            </motion.div>

            {/* --- TOOLBAR --- */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col md:flex-row gap-4 mb-6 text-slate-800 relative z-10"
            >
                <div className="relative flex-1 max-w-lg group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm kho, sản phẩm, mã phiếu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none transition-all"
                    />
                </div>
            </motion.div>

            {/* --- MAIN CONTENT (ACCORDION LIST) --- */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4 relative z-10"
            >
                {/* Header Columns (Fake Table Header) */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider bg-white/50 rounded-xl border border-slate-100 shadow-sm backdrop-blur-sm">
                    <div className="col-span-6 md:col-span-5 pl-2">Kho / Mã Phiếu Nhập</div>
                    <div className="col-span-4 md:col-span-4">Sản phẩm</div>
                    <div className="col-span-2 md:col-span-2 text-right hidden md:block">Giá trị</div>
                    <div className="col-span-2 md:col-span-1 text-center">Tồn kho</div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <Loader2 className="animate-spin mb-2 text-emerald-500" size={32} />
                        <p>Đang tải dữ liệu kho...</p>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 text-slate-400">
                        <Package size={48} className="opacity-20 mb-4" />
                        <p className="font-medium">Không tìm thấy dữ liệu phù hợp</p>
                    </div>
                ) : (
                    filteredData.map((warehouse, wIndex) => {
                        const isExpanded = expandedIds.includes(warehouse.maKho);
                        return (
                            <motion.div
                                key={warehouse.maKho}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: wIndex * 0.1 }}
                                className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden group hover:border-emerald-200 transition-colors"
                            >
                                {/* WAREHOUSE HEADER (Clickable) */}
                                <div
                                    onClick={() => toggleExpand(warehouse.maKho)}
                                    className={cn(
                                        "flex items-center p-5 cursor-pointer transition-all duration-300 select-none",
                                        isExpanded ? "bg-emerald-50/50" : "bg-white hover:bg-slate-50"
                                    )}
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={cn(
                                            "p-2 rounded-lg transition-colors duration-300",
                                            isExpanded ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm"
                                        )}>
                                            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                        </div>
                                        <div>
                                            <h3 className={cn("font-bold text-lg transition-colors", isExpanded ? "text-emerald-800" : "text-slate-700")}>
                                                {warehouse.tenKho}
                                            </h3>
                                            <p className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-2">
                                                <Package size={12} />
                                                {warehouse.danhSachTonKho.length} mặt hàng
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* ITEMS LIST (Accordion Body) */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            variants={listVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            className="border-t border-slate-100 bg-slate-50/30"
                                        >
                                            {warehouse.danhSachTonKho.length === 0 ? (
                                                <div className="p-8 text-center text-slate-400 italic text-sm">
                                                    Kho này hiện không có hàng.
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-slate-100">
                                                    {warehouse.danhSachTonKho.map((item, idx) => (
                                                        <motion.div
                                                            key={`${warehouse.maKho}-${idx}`}
                                                            // Animation từng dòng (Fix lỗi tàng hình)
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: idx * 0.05 }}
                                                            className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white transition-colors"
                                                        >
                                                            {/* Cột 1: Mã Phiếu */}
                                                            <div className="col-span-6 md:col-span-5 pl-4 md:pl-14 flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                                                <span className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono font-medium text-slate-600 shadow-sm">
                                                                    {item.maPNCode || 'N/A'}
                                                                </span>
                                                            </div>

                                                            {/* Cột 2: Tên Sản Phẩm */}
                                                            <div className="col-span-4 md:col-span-4 font-semibold text-slate-700 text-sm">
                                                                {item.tenSP}
                                                            </div>

                                                            {/* Cột 3: Giá Trị */}
                                                            <div className="col-span-2 md:col-span-2 text-right hidden md:block">
                                                                <span className="text-slate-600 text-sm bg-slate-100/50 px-2 py-1 rounded">
                                                                    {formatCurrency(item.donGia)}
                                                                </span>
                                                            </div>

                                                            {/* Cột 4: Số Lượng (Badge) */}
                                                            <div className="col-span-2 md:col-span-1 flex justify-center">
                                                                <StockBadge quantity={item.soLuong} />
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })
                )}
            </motion.div>
        </div>
    );
}