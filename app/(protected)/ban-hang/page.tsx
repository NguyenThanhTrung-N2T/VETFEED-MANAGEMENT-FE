"use client";
import React, { useState, useEffect } from 'react';
import {
    Search, Plus, Filter, Edit, Trash2,
    DollarSign, Loader2, Eye, XCircle
} from 'lucide-react';
import SalesModals, { SalesFilterParams } from '@/components/SalesModals';
import { salesService, PhieuBan } from '@/services/sales.service';
import { format } from 'date-fns';
import AddButton from "@/components/ui/AddButton";

export default function SalesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<PhieuBan[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [modalType, setModalType] = useState<'filter' | 'add' | 'edit' | 'detail' | 'delete' | null>(null);

    // State lưu bộ lọc hiện tại
    const [filterParams, setFilterParams] = useState<SalesFilterParams>({});

    // Fetch Data
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await salesService.getAll();
            setData(res);
        } catch (error) {
            console.error("Fetch sales failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Logic Filter
    const filteredData = data.filter(item => {
        // 1. Tìm kiếm cơ bản
        const matchesSearch =
            (item.tenKhachHang?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (item.maPBCode?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        // 2. Bộ lọc nâng cao
        let matchesFilter = true;

        if (filterParams.fromDate) {
            const itemDate = new Date(item.ngayBan);
            const fromDate = new Date(filterParams.fromDate);
            fromDate.setHours(0, 0, 0, 0);
            if (itemDate < fromDate) matchesFilter = false;
        }

        if (matchesFilter && filterParams.toDate) {
            const itemDate = new Date(item.ngayBan);
            const toDate = new Date(filterParams.toDate);
            toDate.setHours(23, 59, 59, 999);
            if (itemDate > toDate) matchesFilter = false;
        }

        if (matchesFilter && filterParams.customerName) {
            if (!item.tenKhachHang?.toLowerCase().includes(filterParams.customerName.toLowerCase())) {
                matchesFilter = false;
            }
        }

        if (matchesFilter && filterParams.minTotal !== undefined) {
            if (item.thanhTien < filterParams.minTotal) matchesFilter = false;
        }

        return matchesSearch && matchesFilter;
    });

    const handleApplyFilter = (params: SalesFilterParams) => {
        setFilterParams(params);
    };

    const isFiltering = Object.values(filterParams).some(x => x !== undefined && x !== '');

    const handleOpenModal = (type: typeof modalType, id: string | null = null) => {
        setSelectedId(id);
        setModalType(type);
    };

    const formatMoney = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    return (
        <div className="p-6 bg-[#eef2f6] min-h-screen font-sans relative">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2 font-sans">
                    <DollarSign className="p-1 bg-slate-800 rounded text-white" size={28} />
                    Bán hàng
                </h1>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6 text-slate-800">
                <div className="relative flex-1 max-w-lg">
                    <input
                        type="text"
                        placeholder="Tìm kiếm khách hàng, mã phiếu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 rounded-lg border-none shadow-sm outline-none bg-white"
                    />
                    <Search className="absolute right-3 top-2.5 text-slate-400" size={20} />
                </div>

                {/* Badge hiển thị khi đang lọc */}
                {isFiltering && (
                    <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium animate-in fade-in">
                        <span>Đang lọc</span>
                        <button onClick={() => setFilterParams({})} className="hover:text-red-500"><XCircle size={16} /></button>
                    </div>
                )}

                <AddButton onClick={() => handleOpenModal('add')} className="ml-auto" />
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[200px] border border-gray-100">
                {/* Header Bảng + Nút Filter */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Lịch sử bán hàng</h2>

                    {/* Nút Filter nằm ở đây */}
                    <button
                        onClick={() => handleOpenModal('filter')}
                        className={`p-2 rounded-lg transition-all ${isFiltering
                            ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                            : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                            }`}
                        title="Bộ lọc"
                    >
                        <Filter size={20} />
                    </button>
                </div>

                <div className="overflow-x-auto px-6 pb-6">
                    <table className="w-full text-left border-collapse rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-[#e9eff6] text-slate-800 text-sm font-bold uppercase">
                                <th className="p-4">Mã phiếu</th>
                                <th className="p-4">Ngày bán</th>
                                <th className="p-4">Khách hàng</th>
                                <th className="p-4 text-right">Tổng tiền</th>
                                <th className="p-4 text-center">Hình thức</th>
                                <th className="p-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-700">
                            {loading ? (
                                // --- SKELETON LOADER ---
                                [...Array(5)].map((_, index) => (
                                    <tr key={index} className="animate-pulse bg-white border-b border-slate-100">
                                        <td className="py-4 pl-3 border-y border-l border-slate-50 rounded-l-lg"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
                                        <td className="py-4 border-y border-slate-50"><div className="h-4 bg-slate-200 rounded w-48"></div></td>
                                        <td className="py-4 border-y border-slate-50"><div className="h-4 bg-slate-200 rounded w-full"></div></td>
                                        <td className="py-4 border-y border-slate-50 text-center"><div className="h-4 bg-slate-200 rounded w-24 mx-auto"></div></td>
                                        <td className="py-4 border-y border-slate-50 text-center"><div className="h-6 bg-slate-200 rounded-full w-8 mx-auto"></div></td>
                                        <td className="py-4 border-y border-slate-50"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
                                        <td className="py-4 px-4 text-right border-y border-r border-slate-50 rounded-r-lg">
                                            <div className="flex justify-end gap-2"><div className="h-8 w-8 bg-slate-200 rounded-md"></div><div className="h-8 w-8 bg-slate-200 rounded-md"></div></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">
                                        {isFiltering ? 'Không tìm thấy kết quả phù hợp với bộ lọc' : 'Chưa có đơn hàng nào'}
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item, index) => (
                                    <tr key={index} className="hover:bg-blue-50 border-b border-gray-100">
                                        <td className="p-4 font-bold text-emerald-700 cursor-pointer" onClick={() => handleOpenModal('detail', item.maPB)}>
                                            {item.maPBCode || 'N/A'}
                                        </td>
                                        <td className="p-4">
                                            {item.ngayBan ? format(new Date(item.ngayBan), 'dd/MM/yyyy HH:mm') : '-'}
                                        </td>
                                        <td className="p-4 font-semibold">{item.tenKhachHang}</td>
                                        <td className="p-4 text-right font-bold text-slate-800">
                                            {formatMoney(item.thanhTien)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                                                {item.hinhThucThanhToan}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => handleOpenModal('detail', item.maPB)} className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-blue-500 hover:bg-blue-100" title="Xem chi tiết">
                                                    <Eye size={16} />
                                                </button>
                                                <button onClick={() => handleOpenModal('delete', item.maPB)} className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-red-500 hover:bg-red-50" title="Xóa">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <SalesModals
                isOpen={modalType !== null}
                type={modalType}
                selectedId={selectedId}
                onClose={(refresh) => {
                    setModalType(null);
                    setSelectedId(null);
                    if (refresh) fetchData();
                }}
                onApplyFilter={handleApplyFilter}
            />
        </div>
    );
}