"use client";

import React, { useState, useEffect } from 'react';
import {
    Search, ChevronDown, ChevronRight, Filter, Upload, Package, Loader2
} from 'lucide-react';
import { inventoryService } from '@/services/inventory.service';
import { KhoHangTonKho } from '@/types/inventory';

export default function InventoryPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<KhoHangTonKho[]>([]);
    const [loading, setLoading] = useState(true);

    // State quản lý việc mở rộng/thu gọn các Kho
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    // 1. Fetch Data
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await inventoryService.getAll();
            setData(res);
            // Mặc định mở kho đầu tiên nếu có dữ liệu
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

    // 2. Logic Filter (Tìm kiếm cả tên kho HOẶC tên sản phẩm bên trong)
    const filteredData = data.map(kho => {
        // Kiểm tra xem tên kho có khớp từ khóa không
        const isKhoMatch = kho.tenKho?.toLowerCase().includes(searchTerm.toLowerCase());

        // Lọc danh sách con khớp từ khóa
        const filteredItems = kho.danhSachTonKho.filter(item =>
            item.tenSP?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.maPNCode?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Nếu kho khớp tên -> hiển thị toàn bộ item
        // Nếu kho không khớp -> chỉ hiển thị item khớp
        if (isKhoMatch) {
            return kho;
        } else if (filteredItems.length > 0) {
            return { ...kho, danhSachTonKho: filteredItems };
        }
        return null;
    }).filter(item => item !== null) as KhoHangTonKho[]; // Loại bỏ các kho không có item nào khớp

    // Hàm toggle mở/đóng kho
    const toggleExpand = (id: string) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // Helper format tiền tệ
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div className="p-6 bg-[#eef2f6] min-h-screen font-sans relative">

            {/* --- HEADER --- */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <div className="p-1.5 bg-slate-800 rounded text-white">
                        <Package size={20} />
                    </div>
                    Tồn kho
                </h1>
            </div>

            {/* --- TOOLBAR --- */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-lg">
                    <input
                        type="text"
                        placeholder="Tìm kiếm kho, sản phẩm, mã phiếu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 rounded-lg border-none focus:ring-2 focus:ring-slate-300 shadow-sm outline-none bg-white text-slate-700 placeholder:text-slate-400"
                    />
                    <Search className="absolute right-3 top-2.5 text-slate-400" size={20} />
                </div>
            </div>

            {/* --- MAIN TABLE CARD --- */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[300px]">

                {/* Card Header */}
                <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            Danh sách tồn kho
                        </h2>
                    </div>
                </div>

                {/* Table Header Columns */}
                {/* Đã bỏ cột Hành động, chia lại Grid 12 */}
                <div className="px-6 pb-2">
                    <div className="grid grid-cols-12 gap-4 text-sm font-bold text-slate-800 bg-[#e9eff6] p-4 rounded-t-lg">
                        <div className="col-span-5 pl-2">Kho / Mã Phiếu Nhập</div>
                        <div className="col-span-4">Sản phẩm</div>
                        <div className="col-span-2 text-right">Đơn giá nhập</div>
                        <div className="col-span-1 text-center">Tồn</div>
                    </div>
                </div>

                {/* Accordion List */}
                <div className="px-6 pb-6 space-y-1">
                    {loading ? (
                        <div className="p-8 text-center flex justify-center text-slate-500">
                            <Loader2 className="animate-spin mr-2" /> Đang tải dữ liệu...
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            Không tìm thấy dữ liệu phù hợp.
                        </div>
                    ) : (
                        filteredData.map((warehouse) => {
                            const isExpanded = expandedIds.includes(warehouse.maKho);
                            return (
                                <div key={warehouse.maKho} className="border border-transparent rounded-lg overflow-hidden">
                                    {/* WAREHOUSE HEADER ROW (Clickable) */}
                                    <div
                                        onClick={() => toggleExpand(warehouse.maKho)}
                                        className={`flex items-center p-4 cursor-pointer transition-colors
                                            ${isExpanded ? 'bg-blue-50/50' : 'bg-[#f1f5f9] hover:bg-slate-200'}
                                        `}
                                    >
                                        <div className="flex items-center gap-2 font-bold text-slate-700 flex-1">
                                            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                            <span className="text-lg">{warehouse.tenKho}</span>
                                            <span className="text-xs font-normal text-slate-500 bg-white px-2 py-0.5 rounded-full border">
                                                {warehouse.danhSachTonKho.length} mặt hàng
                                            </span>
                                        </div>
                                    </div>

                                    {/* CHILD ITEMS (Shown when expanded) */}
                                    {isExpanded && (
                                        <div className="bg-white border-x border-b border-gray-100 animate-in slide-in-from-top-2 duration-200">
                                            {warehouse.danhSachTonKho.map((item, idx) => (
                                                <div
                                                    key={`${warehouse.maKho}-${idx}`}
                                                    className="grid grid-cols-12 gap-4 p-4 border-b border-gray-50 last:border-0 hover:bg-slate-50 items-center text-sm"
                                                >
                                                    {/* Cột 1: Mã Phiếu Nhập (Thụt vào 1 chút để phân cấp) */}
                                                    <div className="col-span-5 pl-8 flex items-center gap-2">
                                                        <span className="p-1 bg-slate-100 rounded text-xs font-mono text-slate-600">
                                                            {item.maPNCode || 'N/A'}
                                                        </span>
                                                    </div>

                                                    {/* Cột 2: Tên Sản Phẩm */}
                                                    <div className="col-span-4 font-medium text-slate-700">
                                                        {item.tenSP}
                                                    </div>

                                                    {/* Cột 3: Đơn Giá */}
                                                    <div className="col-span-2 text-right text-slate-700 font-medium">
                                                        {formatCurrency(item.donGia)}
                                                    </div>

                                                    {/* Cột 4: Số Lượng */}
                                                    <div className="col-span-1 text-center">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold 
                                                            ${item.soLuong > 10 ? 'bg-green-100 text-green-700' :
                                                                item.soLuong > 0 ? 'bg-yellow-100 text-yellow-700' :
                                                                    'bg-red-100 text-red-700'}`}>
                                                            {item.soLuong}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                            {warehouse.danhSachTonKho.length === 0 && (
                                                <div className="p-4 text-center text-slate-400 italic text-sm">
                                                    Kho này hiện không có hàng tồn.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}