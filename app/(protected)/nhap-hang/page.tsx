"use client";
import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Edit, Trash2, ShoppingCart, Loader2 } from 'lucide-react';
import ImportModals from '@/components/ImportModals';
import { importService, PhieuNhap } from '@/services/import.service';
import { format } from 'date-fns';

export default function ImportPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<PhieuNhap[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [modalType, setModalType] = useState<'filter' | 'add' | 'edit' | 'detail' | 'delete' | null>(null);

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

    // Helper render trạng thái
    const renderStatus = (status: string) => {
        switch (status) {
            case 'DA_NHAN': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Đã nhận hàng</span>;
            case 'DA_HUY': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">Đã hủy</span>;
            case 'DA_DAT': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">Đã đặt hàng</span>;
            default: return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold">{status}</span>;
        }
    };

    // Filter local
    const filteredData = data.filter(item =>
        (item.maPNCode?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (item.tenNCC?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (type: typeof modalType, id: string | null = null) => {
        setSelectedId(id);
        setModalType(type);
    };

    return (
        <div className="p-6 bg-[#eef2f6] min-h-screen font-sans relative">
            {/* Header & Toolbar */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <ShoppingCart className="text-slate-800" size={28} /> Nhập hàng
                </h1>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
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
                <button
                    onClick={() => handleOpenModal('add')}
                    className="ml-auto flex items-center gap-2 px-5 py-2 bg-[#43a047] hover:bg-green-700 text-white rounded-lg font-medium shadow-lg shadow-green-100"
                >
                    <span>Thêm phiếu nhập</span>
                    <Plus size={20} />
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[300px]">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-slate-800">Danh sách phiếu nhập</h2>
                </div>
                <div className="overflow-x-auto px-6 pb-6">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#eef2f6] text-slate-700 text-sm font-bold uppercase">
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
                                <tr><td colSpan={7} className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-emerald-600" /></td></tr>
                            ) : filteredData.length === 0 ? (
                                <tr><td colSpan={7} className="p-8 text-center text-slate-500">Chưa có dữ liệu</td></tr>
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
                                                <button onClick={() => handleOpenModal('edit', item.maPN)} className="p-1.5 border border-slate-300 rounded hover:bg-slate-700 hover:text-white">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleOpenModal('delete', item.maPN)} className="p-1.5 border border-red-300 text-red-500 rounded hover:bg-red-500 hover:text-white">
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
            />
        </div>
    );
}