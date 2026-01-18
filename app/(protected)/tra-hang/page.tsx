"use client";
import React, { useState, useEffect } from 'react';
import {
    Search, Plus, Filter, Trash2, CornerUpLeft, FileText, Loader2, Eye, XCircle
} from 'lucide-react';
import ReturnModals, { ReturnFilterParams } from '@/components/ReturnModals';
import { returnService, PhieuTra } from '@/services/return.service';
import { format } from 'date-fns';
import AddButton from "@/components/ui/AddButton";

export default function ReturnPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<PhieuTra[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [modalType, setModalType] = useState<'filter' | 'add' | 'detail' | 'delete' | null>(null);

    // [MỚI] State lưu bộ lọc hiện tại
    const [filterParams, setFilterParams] = useState<ReturnFilterParams>({});

    // Fetch Data
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await returnService.getAll();
            setData(res);
        } catch (error) {
            console.error("Fetch returns failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // [CẬP NHẬT] Filter Logic: Kết hợp Tìm kiếm + Bộ lọc nâng cao
    const filteredData = data.filter(item => {
        // 1. Tìm kiếm cơ bản (ô search bar)
        const matchesSearch =
            (item.maPTCode?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (item.tenKhachHang?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (item.maPBCode?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        // 2. Bộ lọc nâng cao (từ Modal Filter)
        let matchesFilter = true;

        if (filterParams.fromDate) {
            const itemDate = new Date(item.ngayTra);
            const fromDate = new Date(filterParams.fromDate);
            fromDate.setHours(0, 0, 0, 0);
            if (itemDate < fromDate) matchesFilter = false;
        }

        if (matchesFilter && filterParams.toDate) {
            const itemDate = new Date(item.ngayTra);
            const toDate = new Date(filterParams.toDate);
            toDate.setHours(23, 59, 59, 999);
            if (itemDate > toDate) matchesFilter = false;
        }

        if (matchesFilter && filterParams.customerName) {
            if (!item.tenKhachHang?.toLowerCase().includes(filterParams.customerName.toLowerCase())) {
                matchesFilter = false;
            }
        }

        if (matchesFilter && filterParams.saleCode) {
            if (!item.maPBCode?.toLowerCase().includes(filterParams.saleCode.toLowerCase())) {
                matchesFilter = false;
            }
        }

        return matchesSearch && matchesFilter;
    });

    const handleApplyFilter = (params: ReturnFilterParams) => {
        setFilterParams(params);
    };

    const isFiltering = Object.values(filterParams).some(x => x !== undefined && x !== '');

    const handleOpenModal = (type: typeof modalType, id: string | null = null) => {
        setSelectedId(id);
        setModalType(type);
    };

    const formatMoney = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    return (
        <div className="p-6 bg-[#eef2f6] min-h-screen font-sans relative">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <div className="p-1 bg-slate-800 rounded text-white">
                        <CornerUpLeft size={20} />
                    </div>
                    Trả hàng
                </h1>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6 text-slate-800">
                <div className="relative flex-1 max-w-lg">
                    <input
                        type="text"
                        placeholder="Tìm theo mã trả, mã bán, khách hàng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 rounded-lg border-none shadow-sm outline-none bg-white"
                    />
                    <Search className="absolute right-3 top-2.5 text-slate-400" size={20} />
                </div>

                {/* [MỚI] Badge hiển thị khi đang lọc */}
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
                    <h2 className="text-xl font-bold text-slate-800">Danh sách phiếu trả</h2>

                    {/* [MỚI] Nút Filter nằm ở đây */}
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
                                <th className="p-4">Mã phiếu trả</th>
                                <th className="p-4">Ngày trả</th>
                                <th className="p-4">Thuộc phiếu bán</th>
                                <th className="p-4">Khách hàng</th>
                                <th className="p-4 text-right">Giá trị hoàn</th>
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
                                    <td colSpan={7} className="p-8 text-center text-slate-500">
                                        {isFiltering ? 'Không tìm thấy kết quả phù hợp với bộ lọc' : 'Chưa có phiếu trả nào'}
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.maPT} className="hover:bg-blue-50 border-b border-gray-100">
                                        <td className="p-4 font-bold text-slate-700 cursor-pointer" onClick={() => handleOpenModal('detail', item.maPT)}>
                                            {item.maPTCode || 'N/A'}
                                        </td>
                                        <td className="p-4">
                                            {item.ngayTra ? format(new Date(item.ngayTra), 'dd/MM/yyyy') : '-'}
                                        </td>
                                        <td className="p-4 font-mono text-emerald-600 font-medium">
                                            {item.maPBCode}
                                        </td>
                                        <td className="p-4 font-semibold">{item.tenKhachHang}</td>
                                        <td className="p-4 text-right font-bold text-slate-800">
                                            {formatMoney(item.thanhTien)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                                                {item.hinhThucHoanTien}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => handleOpenModal('detail', item.maPT)} className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-blue-500 hover:bg-blue-100">
                                                    <Eye size={16} />
                                                </button>
                                                <button onClick={() => handleOpenModal('delete', item.maPT)} className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-red-500 hover:bg-red-50">
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

            <ReturnModals
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