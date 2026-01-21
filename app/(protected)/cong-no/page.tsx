"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Search, Plus, Edit, Trash2, ChevronDown, Eye, Filter,
    Wallet, Briefcase, ArrowUpDown, XCircle
} from "lucide-react";
import { CongNoTongHopResponse, CreateCongNoRequest } from "@/client/types.gen";
import { congNoService } from "@/services/cong-no.service";
import ViewCongNoModal from "@/components/cong-no/ViewCongNoModal";
import AddCongNoModal from "@/components/cong-no/AddCongNoModal";
import AddButton from "@/components/ui/AddButton";
import { toast } from 'sonner';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import FilterCongNoModal, { CongNoFilterValues } from "@/components/cong-no/FilterCongNoModal";
// --- Utility: Merge Class ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function CongNoPage() {
    // --- State ---
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [congNoData, setCongNoData] = useState<CongNoTongHopResponse[]>([]);
    const [modalType, setModalType] = useState<'filter' | 'add' | 'view' | null>(null);
    const [selectedItem, setSelectedItem] = useState<CongNoTongHopResponse | null>(null);
    const [filterValues, setFilterValues] = useState<CongNoFilterValues>({
        tenDoiTuong: "",
        loaiDoiTuong: "ALL",
        trangThaiNo: "ALL"
    });
    const isFiltering = useMemo(() => {
        return (
            !!filterValues.tenDoiTuong ||
            filterValues.loaiDoiTuong !== "ALL" ||
            filterValues.trangThaiNo !== "ALL"
        );
    }, [filterValues]);
    // --- Animation Variants ---
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
            setIsLoading(true);
            const data = await congNoService.getAll();
            console.log(data);
            setCongNoData(data);
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi tải dữ liệu!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Logic Filter ---
    const filteredData = useMemo(() => {
        return congNoData.filter((d) => {
            // A. Global Search Bar
            const matchesQuery = query
                ? (d.tenDoiTuong?.toLowerCase().includes(query.toLowerCase()) ||
                    d.maDoiTuongCode?.toLowerCase().includes(query.toLowerCase()))
                : true;

            // B. Filter Modal: Name
            const matchesName = filterValues.tenDoiTuong
                ? d.tenDoiTuong?.toLowerCase().includes(filterValues.tenDoiTuong.toLowerCase())
                : true;

            // C. Filter Modal: Type
            const matchesType = filterValues.loaiDoiTuong !== "ALL"
                ? d.loaiDoiTuong === filterValues.loaiDoiTuong
                : true;

            // D. Filter Modal: Debt Status
            let matchesDebt = true;
            if (filterValues.trangThaiNo === "CON_NO") {
                matchesDebt = (d.duNo ?? 0) > 0;
            } else if (filterValues.trangThaiNo === "HET_NO") {
                matchesDebt = (d.duNo ?? 0) <= 0;
            }

            return matchesQuery && matchesName && matchesType && matchesDebt;
        });
    }, [congNoData, query, filterValues]);
    // --- Formatters ---
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

    const formatDate = (date?: string | null) => (date ? new Date(date).toLocaleDateString("vi-VN") : "-");

    // --- Modal Handlers ---
    const openAdd = () => setModalType('add');
    const openView = (congNoSummary: CongNoTongHopResponse) => {
        setSelectedItem(congNoSummary);
        setModalType('view');
    };
    const closeModal = () => {
        setModalType(null);
        setSelectedItem(null);
    };
    const openFilter = () => setModalType('filter');
    const handleApplyFilter = (newFilters: CongNoFilterValues) => {
        setFilterValues(newFilters);
    };

    const handleResetFilter = () => {
        setFilterValues({
            tenDoiTuong: "",
            loaiDoiTuong: "ALL",
            trangThaiNo: "ALL"
        });
    };
    const handleCreate = async (newData: CreateCongNoRequest) => {
        try {
            await congNoService.create(newData);
            toast.success("Tạo công nợ mới thành công!");
            await fetchData();
            closeModal();
        } catch (error: any) {
            toast.error(error as string);
        }
    };

    // --- Render Helpers ---
    const renderTypeBadge = (type: string | null | undefined) => {
        if (!type) return null;
        const isNCC = type === "NHA_CUNG_CAP";
        return (
            <span className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm w-fit",
                isNCC
                    ? "bg-blue-50 text-blue-700 border-blue-100"
                    : "bg-purple-50 text-purple-700 border-purple-100"
            )}>
                {isNCC ? <Briefcase size={12} /> : <Wallet size={12} />}
                {isNCC ? "Nhà Cung Cấp" : "Khách Hàng"}
            </span>
        );
    };

    return (
        <div className="bg-[#eef2f6] min-h-screen font-sans relative">
            {/* --- SEARCH BAR --- */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col md:flex-row gap-4 mb-6 text-slate-800 relative z-20"
            >
                {/* Search Input */}
                <div className="relative flex-1 max-w-lg group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, mã đối tượng..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                    />
                </div>

                <AddButton onClick={openAdd} className="ml-auto" />
            </motion.div>

            {/* --- MAIN TABLE CARD --- */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden min-h-150 relative z-10"
            >
                {/* Header Table Info */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-linear-to-r from-white to-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        {/* <ArrowUpDown size={18} className="text-slate-400" /> */}
                        Danh sách công nợ
                        <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ml-2">
                            {filteredData.length}
                        </span>
                    </h2>
                    <button
                        onClick={() => openFilter()}
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border",
                            isFiltering
                                ? "text-blue-600 bg-blue-50 border-blue-100 shadow-inner"
                                : "text-slate-600 bg-white border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-sm"
                        )}
                    >
                        <Filter size={16} className={isFiltering ? "fill-current" : ""} />
                        Bộ lọc
                        {isFiltering && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                    </button>
                </div>

                <div className="overflow-x-auto px-6 pb-6">
                    <table className="w-full text-sm border-separate border-spacing-y-1 table-fixed min-w-250">
                        <thead>
                            <tr className="text-left text-xs font-semibold bg-[#e9eff6] text-slate-800 uppercase tracking-wider">
                                <th className="py-3 pl-3 rounded-l-lg w-[10%]">Mã</th>
                                <th className="py-3 w-[22%]">Tên đối tượng</th>
                                <th className="py-3 text-center w-[9%]">Loại</th>
                                <th className="py-3 text-right w-[12%]">Tổng phát sinh</th>
                                <th className="py-3 text-right w-[12%]">Đã thanh toán</th>
                                <th className="py-3 text-right w-[12%]">Dư nợ</th>
                                <th className="py-3 text-center w-[12%]">Hạn thanh toán</th>
                                <th className="py-3 px-4 text-right rounded-r-lg w-[11%] whitespace-nowrap">Hành động</th>
                            </tr>
                        </thead>

                        <motion.tbody
                            className="text-sm text-slate-700 divide-y divide-slate-50"
                            variants={containerVariants}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {isLoading ? (
                                // --- SKELETON LOADER ---
                                [...Array(5)].map((_, index) => (
                                    <tr key={index} className="animate-pulse">
                                        <td className="p-5 pl-6"><div className="h-4 bg-slate-100 rounded w-16"></div></td>
                                        <td className="p-5"><div className="h-4 bg-slate-100 rounded w-32"></div></td>
                                        <td className="p-5"><div className="h-6 bg-slate-100 rounded-full w-20"></div></td>
                                        <td className="p-5"><div className="h-4 bg-slate-100 rounded w-20 ml-auto"></div></td>
                                        <td className="p-5"><div className="h-4 bg-slate-100 rounded w-20 ml-auto"></div></td>
                                        <td className="p-5"><div className="h-4 bg-slate-100 rounded w-20 ml-auto"></div></td>
                                        <td className="p-5"><div className="h-4 bg-slate-100 rounded w-24 mx-auto"></div></td>
                                        <td className="p-5"><div className="h-8 bg-slate-100 rounded-lg w-8 ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-20 text-center">
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
                                        key={item.maDoiTuong}
                                        variants={itemVariants}
                                        whileHover={{ backgroundColor: "rgba(241, 245, 249, 0.6)" }}
                                        className="group transition-colors hover:bg-slate-50 odd:bg-white even:bg-[#f1f5f9]"
                                        onClick={() => openView(item)}
                                    >
                                        <td className="py-3 pl-3 font-medium text-slate-700 border-y border-l border-slate-100 rounded-l-lg group-hover:border-slate-200">
                                            {item.maDoiTuongCode}
                                        </td>
                                        <td className="py-3 border-y border-slate-100 group-hover:border-slate-200">
                                            {item.tenDoiTuong}
                                        </td>
                                        <td className="py-3 text-center border-y border-slate-100 group-hover:border-slate-200">
                                            {renderTypeBadge(item.loaiDoiTuong)}
                                        </td>
                                        <td className="py-3 text-right border-y border-slate-100 group-hover:border-slate-200">
                                            {formatCurrency(item.tongPhatSinh ?? 0)}
                                        </td>
                                        <td className="py-3 text-right text-green-600 border-y border-slate-100 group-hover:border-slate-200">
                                            {formatCurrency(item.daThanhToan ?? 0)}
                                        </td>
                                        <td className="py-3 text-right border-y border-slate-100 group-hover:border-slate-200">
                                            <span className={cn(
                                                "font-bold px-2 py-1 rounded",
                                                (item.duNo ?? 0) > 0
                                                    ? "bg-red-50 text-red-600"
                                                    : "bg-green-50 text-green-600"
                                            )}>
                                                {formatCurrency(item.duNo ?? 0)}
                                            </span>
                                        </td>
                                        <td className="py-3 border-y text-center border-slate-100 group-hover:border-slate-200">
                                            {formatDate(item.hanThanhToanGanNhat)}
                                        </td>
                                        <td className="py-3 px-4 text-right border-y border-r border-slate-100 rounded-r-lg group-hover:border-slate-200 whitespace-nowrap">
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openView(item);
                                                    }}
                                                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </motion.tbody>
                    </table>
                </div>
            </motion.div >

            {/* --- MODALS --- */}
            <FilterCongNoModal
                isOpen={modalType === 'filter'}
                onClose={closeModal}
                onApply={handleApplyFilter}
                onReset={handleResetFilter}
                initialFilters={filterValues}
            />
            {
                modalType === 'view' && selectedItem && (
                    <ViewCongNoModal
                        onClose={closeModal}
                        onAdd={handleCreate}
                        congNoSummary={selectedItem}
                    />
                )
            }

            {
                modalType === 'add' && (
                    <AddCongNoModal
                        onClose={closeModal}
                        onAdd={handleCreate}
                    />
                )
            }
        </div >
    );
}