"use client";

import React, { useState, useEffect } from 'react';
import {
    Search, Plus, Filter, Edit, Trash2,
    DollarSign, Loader2, Eye, XCircle, FileText, CreditCard, Wallet, CheckCircle, Clock
} from 'lucide-react';
import SalesModals, { SalesFilterParams } from '@/components/SalesModals';
import { salesService, PhieuBan } from '@/services/sales.service';
import { format } from 'date-fns';
import AddButton from "@/components/ui/AddButton";
import { motion, AnimatePresence, Variants } from 'framer-motion'; // Import Variants để fix lỗi TS
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '@/providers/auth-provider';

// --- Utility: Merge Class ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function SalesPage() {
    // --- State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<PhieuBan[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [modalType, setModalType] = useState<'filter' | 'add' | 'edit' | 'detail' | 'delete' | null>(null);
    const [filterParams, setFilterParams] = useState<SalesFilterParams>({});
    const { user } = useAuth();

    // --- Animation Variants (Fix lỗi Type ở đây) ---
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0, opacity: 1,
            transition: { type: "spring", stiffness: 120, damping: 12 }
        }
    };

    // --- Fetch Data ---
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await salesService.getAll();
            // Giả lập delay một chút để thấy animation nếu mạng quá nhanh
            // await new Promise(resolve => setTimeout(resolve, 300)); 
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

    // --- Logic Filter ---
    const filteredData = data.filter(item => {
        const matchesSearch =
            (item.tenKhachHang?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (item.maPBCode?.toLowerCase() || '').includes(searchTerm.toLowerCase());

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

    const handleApplyFilter = (params: SalesFilterParams) => setFilterParams(params);
    const isFiltering = Object.values(filterParams).some(x => x !== undefined && x !== '');
    const handleOpenModal = (type: typeof modalType, id: string | null = null) => {
        setSelectedId(id);
        setModalType(type);
    };
    const formatMoney = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    // Helper: Badge thanh toán
    const PaymentBadge = ({ method }: { method: string }) => {
        const config: Record<
            string,
            {
                label: string;
                className: string;
                icon: React.ReactNode;
            }
        > = {
            TIEN_MAT: {
                label: "Tiền mặt",
                className: "bg-emerald-50 text-emerald-700 border-emerald-100",
                icon: <Wallet size={12} />,
            },
            CHUYEN_KHOAN: {
                label: "Chuyển khoản",
                className: "bg-blue-50 text-blue-700 border-blue-100",
                icon: <CreditCard size={12} />,
            },
            CONG_NO: {
                label: "Công nợ",
                className: "bg-amber-50 text-amber-800 border-amber-100",
                icon: <FileText size={12} />,
            },
        };

        const item = config[method] ?? {
            label: method,
            className: "bg-slate-50 text-slate-700 border-slate-200",
            icon: <Wallet size={12} />,
        };

        return (
            <span
                className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm",
                    item.className
                )}
            >
                {item.icon}
                {item.label}
            </span>
        );
    };

    return (
        <div className="p-6 bg-[#eef2f6] min-h-screen relative">
            {/* Background Decoration
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div> */}

            {/* --- HEADER --- */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10"
            >
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br bg-[#25396f] rounded-xl text-white shadow-lg bg-[#25396f]-200">
                            <DollarSign size={24} />
                        </div>
                        Quản lý Bán hàng
                    </h1>
                    <p className="text-slate-500 text-sm mt-2 ml-1">Theo dõi đơn hàng và doanh thu.</p>
                </div>
            </motion.div>

            {/* --- TOOLBAR (Search & Filter) --- */}
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
                        placeholder="Tìm kiếm khách hàng, mã phiếu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                    />
                </div>

                {isFiltering && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium shadow-sm"
                    >
                        <span>Đang lọc dữ liệu</span>
                        <button onClick={() => setFilterParams({})} className="hover:text-red-500 p-1 hover:bg-white rounded-full transition-colors">
                            <XCircle size={16} />
                        </button>
                    </motion.div>
                )}

                <AddButton onClick={() => handleOpenModal('add')} className="ml-auto" />
            </motion.div>

            {/* --- MAIN TABLE CARD --- */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden min-h-[700px] relative z-10"
            >
                {/* Header Table */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-white to-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <FileText size={18} className="text-slate-400" />
                        Danh sách phiếu bán
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
                                <th className="p-5 pl-6">Mã phiếu</th>
                                <th className="p-5">Thời gian</th>
                                <th className="p-5">Khách hàng</th>
                                <th className="p-5 text-right">Tổng tiền</th>
                                <th className="p-5 text-center">Hình thức</th>
                                <th className="p-5 text-center">Trạng thái</th>
                                <th className="p-5 text-center">Hành đông</th>
                            </tr>
                        </thead>

                        <motion.tbody
                            className="text-sm text-slate-700 divide-y divide-slate-50"
                            variants={containerVariants}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {loading ? (
                                // --- SKELETON LOADER ---
                                [...Array(5)].map((_, index) => (
                                    <tr key={index} className="animate-pulse">
                                        <td className="p-5 pl-6"><div className="h-4 bg-slate-100 rounded w-20"></div></td>
                                        <td className="p-5"><div className="h-4 bg-slate-100 rounded w-32"></div></td>
                                        <td className="p-5"><div className="h-4 bg-slate-100 rounded w-40"></div></td>
                                        <td className="p-5"><div className="h-4 bg-slate-100 rounded w-24 ml-auto"></div></td>
                                        <td className="p-5"><div className="h-6 bg-slate-100 rounded-full w-20 mx-auto"></div></td>
                                        <td className="p-5"><div className="h-8 bg-slate-100 rounded-lg w-20 mx-auto"></div></td>
                                    </tr>
                                ))
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <div className="p-4 bg-slate-50 rounded-full mb-3">
                                                <Search size={32} className="opacity-50" />
                                            </div>
                                            <p className="font-medium">Không tìm thấy dữ liệu phù hợp</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item) => (
                                    <motion.tr
                                        key={item.maPB}
                                        variants={itemVariants}
                                        whileHover={{ backgroundColor: "rgba(241, 245, 249, 0.6)" }} // hover:bg-slate-100/60
                                        className="group transition-colors cursor-pointer"
                                        onClick={() => handleOpenModal('detail', item.maPB)}
                                    >
                                        <td className="p-5 pl-6">
                                            <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors font-mono">
                                                {item.maPBCode || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-5 text-slate-500">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-700">
                                                    {item.ngayBan ? format(new Date(item.ngayBan), 'dd/MM/yyyy') : '-'}
                                                </span>
                                                <span className="text-xs opacity-70">
                                                    {item.ngayBan ? format(new Date(item.ngayBan), 'HH:mm') : ''}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-5 font-medium text-slate-800">
                                            {item.tenKhachHang}
                                        </td>
                                        <td className="p-5 text-right">
                                            <span className="font-bold text-slate-800 bg-slate-100/50 px-2 py-1 rounded">
                                                {formatMoney(item.thanhTien)}
                                            </span>
                                        </td>
                                        <td className="p-5 text-center">
                                            <PaymentBadge method={item.hinhThucThanhToan} />
                                        </td>
                                        <td className="p-5 text-center">
                                            <span
                                                className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold border ${item.trangThaiThanhToan === 'DA_THANH_TOAN'
                                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200' // Style cho Đã thanh toán (Xanh)
                                                    : 'bg-orange-100 text-orange-700 border-orange-200'    // Style cho Chưa thanh toán (Cam)
                                                    }`}
                                            >
                                                {/* Logic hiển thị text */}
                                                {item.trangThaiThanhToan === 'DA_THANH_TOAN' ? (
                                                    <>
                                                        <CheckCircle size={12} className="mr-1" /> {/* Icon (tùy chọn) */}
                                                        Đã thanh toán
                                                    </>
                                                ) : (
                                                    <>
                                                        <Clock size={12} className="mr-1" /> {/* Icon (tùy chọn) */}
                                                        Chưa thanh toán
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className="p-5 text-center">
                                            <div className="flex items-center justify-center gap-2 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => handleOpenModal('detail', item.maPB)}
                                                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {user?.role === "QUAN_LY" && (
                                                    <button
                                                        onClick={() => handleOpenModal('delete', item.maPB)}
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
                        </motion.tbody>
                    </table>
                </div>
            </motion.div>

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