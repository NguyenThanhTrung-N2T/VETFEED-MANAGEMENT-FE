"use client";
import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Edit, Trash2, ShoppingCart, Loader2, XCircle } from 'lucide-react';
import ImportModals, { ImportFilterParams } from '@/components/ImportModals';
import { importService, PhieuNhap } from '@/services/import.service';
import { format } from 'date-fns';
import AddButton from "@/components/ui/AddButton";

export default function ImportPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<PhieuNhap[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [modalType, setModalType] = useState<'filter' | 'add' | 'edit' | 'detail' | 'delete' | null>(null);

    // [MỚI] State lưu bộ lọc hiện tại
    const [filterParams, setFilterParams] = useState<ImportFilterParams>({});

    // Fetch Data
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await importService.getAll();
            setData(res);
        } catch (error) {
            console.error("Fetch import receipts failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // [CẬP NHẬT] Logic Filter kết hợp
    const filteredData = data.filter(item => {
        // 1. Tìm kiếm cơ bản
        const matchesSearch =
            (item.maPNCode?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (item.tenNCC?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        // 2. Bộ lọc nâng cao
        let matchesFilter = true;

        if (filterParams.fromDate) {
            const itemDate = new Date(item.ngayCapNhat || item.ngayCapNhat); // Sử dụng ngày cập nhật
            const fromDate = new Date(filterParams.fromDate);
            fromDate.setHours(0, 0, 0, 0);
            if (itemDate < fromDate) matchesFilter = false;
        }

        if (matchesFilter && filterParams.toDate) {
            const itemDate = new Date(item.ngayCapNhat || item.ngayCapNhat);
            const toDate = new Date(filterParams.toDate);
            toDate.setHours(23, 59, 59, 999);
            if (itemDate > toDate) matchesFilter = false;
        }

        if (matchesFilter && filterParams.supplierName) {
            if (!item.tenNCC?.toLowerCase().includes(filterParams.supplierName.toLowerCase())) {
                matchesFilter = false;
            }
        }

        if (matchesFilter && filterParams.minTotal !== undefined) {
            if ((item.thanhTien || 0) < filterParams.minTotal) matchesFilter = false;
        }

        return matchesSearch && matchesFilter;
    });

    const handleApplyFilter = (params: ImportFilterParams) => {
        setFilterParams(params);
    };

    const isFiltering = Object.values(filterParams).some(x => x !== undefined && x !== '');

    // Helper render trạng thái
    const renderStatus = (status: string) => {
        switch (status) {
            case 'DA_NHAN': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Đã nhận hàng</span>;
            case 'DA_HUY': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">Đã hủy</span>;
            case 'DA_DAT': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">Đã đặt hàng</span>;
            default: return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold">{status}</span>;
        }
    };

    const handleOpenModal = (type: typeof modalType, id: string | null = null) => {
        setSelectedId(id);
        setModalType(type);
    };

    return (
        <div className="p-6 bg-[#eef2f6] min-h-screen font-sans relative">
            {/* Header & Toolbar */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <ShoppingCart className="p-1 bg-slate-800 rounded text-white" size={28} /> Nhập hàng
                </h1>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6 text-slate-800">
                <div className="relative flex-1 max-w-lg">
                    <input
                        type="text"
                        placeholder="Tìm kiếm mã phiếu, nhà cung cấp..."
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

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[200px] border border-gray-100">
                {/* Header Bảng + Nút Filter */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Danh sách phiếu nhập</h2>

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
                            <tr className="bg-[#e9eff6] text-slate-700 text-sm font-bold uppercase">
                                <th className="p-4">Mã phiếu</th>
                                <th className="p-4">Ngày cập nhật</th>
                                <th className="p-4">Nhà cung cấp</th>
                                <th className="p-4">Kho nhận</th>
                                <th className="p-4 text-right">Thành tiền</th>
                                <th className="p-4 text-center">Trạng thái</th>
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
                                        {isFiltering ? 'Không tìm thấy kết quả phù hợp với bộ lọc' : 'Chưa có dữ liệu'}
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.maPN} className="hover:bg-blue-50 border-b border-gray-100">
                                        <td className="p-4 font-bold text-emerald-700 cursor-pointer" onClick={() => handleOpenModal('detail', item.maPN)}>
                                            {item.maPNCode || 'N/A'}
                                        </td>
                                        <td className="p-4">
                                            {item.ngayCapNhat ? format(new Date(item.ngayCapNhat), 'dd/MM/yyyy') : '-'}
                                        </td>
                                        <td className="p-4 font-semibold">{item.tenNCC}</td>
                                        <td className="p-4">{item.tenKho}</td>
                                        <td className="p-4 text-right font-bold">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.thanhTien || 0)}
                                        </td>
                                        <td className="p-4 text-center">{renderStatus(item.trangThai)}</td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => handleOpenModal('edit', item.maPN)} className="p-1.5 rounded hover:bg-slate-700 hover:text-white">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleOpenModal('delete', item.maPN)} className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-red-500 hover:bg-red-50">
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

            <ImportModals
                isOpen={modalType !== null}
                type={modalType}
                selectedId={selectedId}
                onClose={(refresh) => {
                    setModalType(null);
                    setSelectedId(null);
                    if (refresh) fetchData();
                }}
                // [MỚI] Truyền hàm apply filter
                onApplyFilter={handleApplyFilter}
            />
        </div>
    );
}