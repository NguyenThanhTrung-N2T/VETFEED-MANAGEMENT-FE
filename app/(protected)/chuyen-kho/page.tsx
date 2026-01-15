"use client";
import React, { useState, useEffect } from 'react';
import {
    Search, Plus, ChevronDown, Edit, Trash2, ArrowRightLeft, Filter, FileText, Loader2
} from 'lucide-react';
import TransferModals from '@/components/TransferModals';
import { transferService, PhieuChuyenKho } from '@/services/transfer.service';
import { format } from 'date-fns';
import AddButton from "@/components/ui/AddButton";

export default function TransferPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<PhieuChuyenKho[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [modalType, setModalType] = useState<'filter' | 'add' | 'edit' | 'detail' | 'delete' | null>(null);

    // Fetch Data
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await transferService.getAll();
            setData(res);
        } catch (error) {
            console.error("Failed to fetch transfers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter Logic
    const filteredData = data.filter(item =>
        (item.maCKCode?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (item.tenKhoXuat?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (item.tenKhoNhan?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (type: typeof modalType, id: string | null = null) => {
        setSelectedId(id);
        setModalType(type);
    };

    const handleCloseModal = (shouldRefresh = false) => {
        setModalType(null);
        setSelectedId(null);
        if (shouldRefresh) fetchData();
    };

    return (
        <div className="p-6 bg-[#eef2f6] min-h-screen font-sans relative">
            {/* Header & Toolbar giữ nguyên UI cũ... */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <div className="p-1 bg-slate-800 rounded text-white">
                        <ArrowRightLeft size={20} />
                    </div>
                    Chuyển kho
                </h1>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6 text-slate-800">
                {/* ... Toolbar Search ... */}
                <div className="relative flex-1 max-w-lg">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo mã, kho..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 rounded-lg focus:ring-2 focus:ring-slate-300 shadow-sm outline-none bg-white"
                    />
                    <Search className="absolute right-3 top-2.5 text-slate-400" size={20} />
                </div>
                <AddButton onClick={() => handleOpenModal('add')} className="ml-auto" />
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-slate-800">Danh sách phiếu chuyển</h2>
                </div>

                <div className="overflow-x-auto px-6 pb-6">
                    <table className="w-full text-left border-collapse rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-[#e9eff6] text-slate-800 text-sm font-bold uppercase">
                                <th className="p-4">Mã phiếu</th>
                                <th className="p-4">Ngày lập</th>
                                <th className="p-4">Kho xuất</th>
                                <th className="p-4">Kho nhận</th>
                                <th className="p-4">Ghi chú</th>
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
                                    <td colSpan={6} className="p-8 text-center text-slate-500">Chưa có dữ liệu</td>
                                </tr>
                            ) : (
                                filteredData.map((item, index) => (
                                    <tr key={index} className="hover:bg-blue-50 border-b border-gray-100">
                                        <td className="p-4 font-bold text-emerald-700 cursor-pointer" onClick={() => handleOpenModal('detail', item.maCK)}>
                                            {item.maCKCode || 'N/A'}
                                        </td>
                                        <td className="p-4">
                                            {item.ngayLap ? format(new Date(item.ngayLap), 'dd/MM/yyyy') : '-'}
                                        </td>
                                        <td className="p-4">{item.tenKhoXuat}</td>
                                        <td className="p-4">{item.tenKhoNhan}</td>
                                        <td className="p-4 text-slate-500 truncate max-w-[200px]">{item.ghiChu}</td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => handleOpenModal('edit', item.maCK)} className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-all">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleOpenModal('delete', item.maCK)} className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-red-500 hover:bg-red-50">
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

            <TransferModals
                isOpen={modalType !== null}
                type={modalType}
                selectedId={selectedId} // Prop mới để truyền ID
                onClose={handleCloseModal}
            />
        </div>
    );
}