"use client";

import React, { useState, useEffect } from 'react';
import {
    Search, Filter, Trash2, CornerUpLeft, FileText,
    Loader2, Eye, XCircle, Calendar, DollarSign, User, ArrowLeft
} from 'lucide-react';
import ReturnModals, { ReturnFilterParams } from '@/components/ReturnModals';
import { returnService, PhieuTra } from '@/services/return.service';
import { format } from 'date-fns';
import AddButton from "@/components/ui/AddButton";
import { motion, Variants } from 'framer-motion'; // Import Variants fix lỗi TS
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '@/providers/auth-provider';

// --- Utility: Merge Class ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function ReturnPage() {
    // --- State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<PhieuTra[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [modalType, setModalType] = useState<'filter' | 'add' | 'detail' | 'delete' | null>(null);
    const [filterParams, setFilterParams] = useState<ReturnFilterParams>({});
    const { user } = useAuth();

    // --- Animation Variants (FIX LỖI TS: Thêm ": Variants") ---
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.1 }
        }
    };

    // --- Fetch Data ---
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

    // --- Filter Logic ---
    const filteredData = data.filter(item => {
        const matchesSearch =
            (item.maPTCode?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (item.tenKhachHang?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (item.maPBCode?.toLowerCase() || '').includes(searchTerm.toLowerCase());

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

    const handleApplyFilter = (params: ReturnFilterParams) => setFilterParams(params);
    const isFiltering = Object.values(filterParams).some(x => x !== undefined && x !== '');
    const handleOpenModal = (type: typeof modalType, id: string | null = null) => {
        setSelectedId(id);
        setModalType(type);
    };
    const formatMoney = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    // --- Helper Component: Refund Badge ---
    const RefundBadge = ({ method }: { method: string }) => {
        const isCash = method.toLowerCase().includes('tiền mặt');
        const isTransfer = method.toLowerCase().includes('chuyển khoản') || method.toLowerCase().includes('bank');

        let style = "bg-slate-100 text-slate-600 border-slate-200";
        if (isCash) style = "bg-emerald-50 text-emerald-700 border-emerald-100";
        if (isTransfer) style = "bg-blue-50 text-blue-700 border-blue-100";

        return (
            <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm", style)}>
                {method}
            </span>
        );
    }

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
                            <CornerUpLeft size={24} />
                        </div>
                        Quản lý Trả hàng
                    </h1>
                    <p className="text-slate-500 text-sm mt-2 ml-1">Xử lý yêu cầu hoàn trả và khiếu nại.</p>
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
                        <Search className="text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm theo mã trả, mã bán, khách hàng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                    />
                </div>

                {isFiltering && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-700 px-4 py-2 rounded-xl text-sm font-medium shadow-sm"
                    >
                        <span>Đang lọc dữ liệu</span>
                        <button onClick={() => setFilterParams({})} className="hover:text-red-600 p-1 hover:bg-white rounded-full transition-colors">
                            <XCircle size={16} />
                        </button>
                    </motion.div>
                )}
                <AddButton onClick={() => handleOpenModal('add')} className="ml-auto" />
            </motion.div>

            {/* --- TABLE CARD --- */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden min-h-[700px] relative z-10"
            >
                {/* Header Bảng */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-white to-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <FileText size={18} className="text-slate-400" />
                        Danh sách phiếu trả
                        <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ml-2">
                            {filteredData.length} phiếu
                        </span>
                    </h2>

                    <button
                        onClick={() => handleOpenModal('filter')}
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border",
                            isFiltering
                                ? "text-blue-600 bg-blue-50 border-blue-100 shadow-inner"
                                : "text-slate-600 bg-white border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-sm"
                        )}
                    >
                        <Filter size={16} />
                        Bộ lọc
                    </button>
                </div>

                <div className="overflow-x-auto px-6 pb-6">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                                <th className="p-5 pl-6">Mã phiếu trả</th>
                                <th className="p-5">Ngày trả</th>
                                <th className="p-5">Thuộc phiếu bán</th>
                                <th className="p-5">Khách hàng</th>
                                <th className="p-5 text-right">Giá trị hoàn</th>
                                <th className="p-5 text-center">Hình thức</th>
                                <th className="p-5 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-700 divide-y divide-slate-50">
                            {loading ? (
                                // --- SKELETON LOADER ---
                                [...Array(5)].map((_, index) => (
                                    <tr key={index} className="animate-pulse">
                                        <td className="p-5 pl-6"><div className="h-4 bg-slate-100 rounded w-20"></div></td>
                                        <td className="p-5"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
                                        <td className="p-5"><div className="h-4 bg-slate-100 rounded w-20"></div></td>
                                        <td className="p-5"><div className="h-4 bg-slate-100 rounded w-32"></div></td>
                                        <td className="p-5"><div className="h-4 bg-slate-100 rounded w-24 ml-auto"></div></td>
                                        <td className="p-5"><div className="h-6 bg-slate-100 rounded-full w-20 mx-auto"></div></td>
                                        <td className="p-5"><div className="h-8 bg-slate-100 rounded-lg w-20 mx-auto"></div></td>
                                    </tr>
                                ))
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <div className="p-4 bg-slate-50 rounded-full mb-3">
                                                <CornerUpLeft size={32} className="opacity-50" />
                                            </div>
                                            <p className="font-medium">{isFiltering ? 'Không tìm thấy kết quả' : 'Chưa có phiếu trả nào'}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item, index) => (
                                    <motion.tr
                                        key={item.maPT}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
                                        whileHover={{ backgroundColor: "rgba(241, 245, 249, 0.6)" }}
                                        className="group transition-colors cursor-pointer border-b border-slate-50 last:border-none"
                                        onClick={() => handleOpenModal('detail', item.maPT)}
                                    >
                                        <td className="p-5 pl-6">
                                            <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors font-mono">
                                                {item.maPTCode || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-5 text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={12} className="opacity-70" />
                                                <span className="font-medium text-slate-700">
                                                    {item.ngayTra ? format(new Date(item.ngayTra), 'dd/MM/yyyy') : '-'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors">
                                                <span className="font-mono text-sm">{item.maPBCode}</span>
                                            </div>
                                        </td>
                                        <td className="p-5 font-medium text-slate-800">
                                            <div className="flex items-center gap-2">
                                                <User size={14} className="text-slate-400" />
                                                {item.tenKhachHang}
                                            </div>
                                        </td>
                                        <td className="p-5 text-right">
                                            <span className="font-bold text-slate-800 bg-rose-50 px-2 py-1 rounded border border-rose-100/50">
                                                {formatMoney(item.thanhTien)}
                                            </span>
                                        </td>
                                        <td className="p-5 text-center">
                                            <RefundBadge method={item.hinhThucHoanTien} />
                                        </td>
                                        <td className="p-5 text-center">
                                            <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => handleOpenModal('detail', item.maPT)}
                                                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {!loading && user?.role === "QUAN_LY" && (
                                                    <button
                                                        onClick={() => handleOpenModal('delete', item.maPT)}
                                                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

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