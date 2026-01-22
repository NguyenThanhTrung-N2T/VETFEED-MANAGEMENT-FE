"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Edit, Trash2, Search, Filter } from "lucide-react";
import { KhoHangResponse, CreateKhoHangRequest, UpdateKhoHangRequest } from "@/client/types.gen";
import AddKhoModal from "@/components/kho/AddKhoModal";
import EditKhoModal from "@/components/kho/EditKhoModal";
import DeleteKhoModal from "@/components/kho/DeleteKhoModal";
// 1. Import Filter Modal
import FilterKhoModal, { KhoFilterValues } from "@/components/kho/FilterKhoModal";
import { khoHangService } from "@/services/kho-hang.service";
import AddButton from "@/components/ui/AddButton";
import { toast } from 'sonner';
import { motion } from "framer-motion";
import { tableContainerVariants, tableRowVariants } from "@/lib/animation-variants";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from "@/providers/auth-provider";
// Helper for classes
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function KhoPage() {
    const [query, setQuery] = useState("");
    const [khoData, setKhoData] = useState<KhoHangResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 2. Add Filter State
    const [filterValues, setFilterValues] = useState<KhoFilterValues>({
        tenKho: "",
        diaChi: "",
        trangThai: "ALL"
    });

    const [modalType, setModalType] = useState<'filter' | 'delete' | 'add' | 'edit' | null>(null);
    const [selectedItem, setSelectedItem] = useState<KhoHangResponse | null>(null);

    // 3. Helper to check if filtering is active (for UI styling)
    const isFiltering = useMemo(() => {
        return (
            !!filterValues.tenKho ||
            !!filterValues.diaChi ||
            filterValues.trangThai !== "ALL"
        );
    }, [filterValues]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await khoHangService.getAll();
            setKhoData(data);
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi tải dữ liệu!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 4. Update Filter Logic (Search Bar + Advanced Filters)
    const filteredData = useMemo(() => {
        return khoData.filter((k) => {
            // A. Search Bar Logic
            const matchesSearch = `${k.tenKho} ${k.diaChi} ${k.ghiChu ?? ""}`
                .toLowerCase()
                .includes(query.toLowerCase());

            // B. Modal Filter Logic
            const matchesName = !filterValues.tenKho ||
                k.tenKho?.toLowerCase().includes(filterValues.tenKho.toLowerCase());

            const matchesAddress = !filterValues.diaChi ||
                k.diaChi?.toLowerCase().includes(filterValues.diaChi.toLowerCase());

            const matchesStatus = filterValues.trangThai === "ALL" ||
                k.trangThai === filterValues.trangThai;

            return matchesSearch && matchesName && matchesAddress && matchesStatus;
        });
    }, [khoData, query, filterValues]);

    // --- Modal Handlers ---
    const openAdd = () => setModalType('add');
    const openEdit = (kho: KhoHangResponse) => {
        setSelectedItem(kho);
        setModalType('edit');
    };
    const openDelete = (kho: KhoHangResponse) => {
        setSelectedItem(kho);
        setModalType('delete');
    };
    const openFilter = () => setModalType('filter');

    const closeModal = () => {
        setModalType(null);
        setSelectedItem(null);
    };

    // 5. Filter Actions
    const handleApplyFilter = (newFilters: KhoFilterValues) => {
        setFilterValues(newFilters);
        // closeModal is called inside the modal component on apply, 
        // but we can ensure it here if needed.
    };

    const handleResetFilter = () => {
        setFilterValues({
            tenKho: "",
            diaChi: "",
            trangThai: "ALL"
        });
    };

    // --- CRUD Handlers ---
    const handleCreate = async (newData: CreateKhoHangRequest) => {
        try {
            await khoHangService.create(newData);
            toast.success("Thêm kho hàng mới thành công!");
            await fetchData();
            closeModal();
        } catch (error: any) {
            toast.error(error.error as string);
            throw error;
        }
    };
    const handleUpdate = async (id: string, updatedData: UpdateKhoHangRequest) => {
        try {
            await khoHangService.update(id, updatedData);
            toast.success("Cập nhật kho hàng thành công!");
            await fetchData();
            closeModal();
        } catch (error: any) {
            toast.error(error.error as string);
            throw error;
        }
    };
    const handleDelete = async (id: string) => {
        try {
            await khoHangService.delete(id);
            toast.success("Xóa kho hàng thành công!");
            await fetchData();
            closeModal();
        } catch (error: any) {
            toast.error(error.error as string);
        }
    };

    const renderStatus = (status: string | null | undefined) => {
        const isActive = status === "HOAT_DONG";
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                }`}>
                {isActive ? "Hoạt động" : "Ngưng hoạt động"}
            </span>
        );
    };

    const { user, loading } = useAuth();
    const userRole = user ? user.role : 'NHAN_VIEN';

    return (
        <>
            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col md:flex-row gap-4 mb-6 text-slate-800 relative z-20"
            >
                <div className="relative flex-1 max-w-lg group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, mã kho..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                    />
                </div>
                {userRole === 'QUAN_LY' && (<AddButton onClick={openAdd} className="ml-auto" />)}
            </motion.div>

            {/* Content Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden min-h-125 border border-slate-100">

                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-linear-to-r from-white to-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        Danh sách kho
                        <span className="text-sm font-normal text-slate-500 ml-2 bg-slate-100 px-2 py-0.5 rounded-full">
                            {filteredData.length}
                        </span>
                    </h2>

                    {/* 7. Added Filter Button (Optional but consistent with prev design) */}
                    <button
                        onClick={() => openFilter()}
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border",
                            isFiltering
                                ? "text-blue-600 bg-blue-50 border-blue-100 shadow-inner"
                                : "text-slate-600 bg-white border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-sm"
                        )}
                    >
                        <Filter size={16} />
                        Bộ lọc
                        {isFiltering && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                    </button>
                </div>

                <div className="overflow-x-auto px-6 pb-6">
                    <table className="w-full text-sm border-separate border-spacing-y-1 table-fixed min-w-200">
                        <thead>
                            <tr className="text-left text-xs font-semibold bg-[#e9eff6] text-slate-800 uppercase tracking-wider">
                                <th className="py-3 pl-3 rounded-l-lg w-[10%]">Mã kho</th>
                                <th className="py-3 w-[20%]">Tên kho</th>
                                <th className="py-3 w-[25%]">Địa chỉ</th>
                                <th className="py-3 text-center w-[13%]">Trạng thái</th>
                                <th className="py-3 w-[20%]">Ghi chú</th>
                                <th className="py-3 px-4 text-right rounded-r-lg whitespace-nowrap w-[12%]">Hành động</th>
                            </tr>
                        </thead>
                        <motion.tbody
                            className="text-sm"
                            variants={tableContainerVariants}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {isLoading ? (
                                [...Array(5)].map((_, index) => (
                                    <tr key={index} className="animate-pulse bg-white border-b border-slate-100">
                                        <td className="py-4 pl-3 border-y border-l border-slate-50 rounded-l-lg"><div className="h-4 bg-slate-200 rounded w-12"></div></td>
                                        <td className="py-4 border-y border-slate-50">
                                            <div className="h-4 bg-slate-200 rounded w-32 mb-1"></div>
                                            <div className="h-3 bg-slate-100 rounded w-20"></div>
                                        </td>
                                        <td className="py-4 border-y border-slate-50"><div className="h-4 bg-slate-200 rounded w-48"></div></td>
                                        <td className="py-4 border-y border-slate-50 text-center flex justify-center"><div className="h-6 bg-slate-200 rounded-full w-24"></div></td>
                                        <td className="py-4 border-y border-slate-50"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                                        <td className="py-4 px-4 text-right border-y border-r border-slate-50 rounded-r-lg">
                                            <div className="flex justify-end gap-2"><div className="h-8 w-8 bg-slate-200 rounded-md"></div><div className="h-8 w-8 bg-slate-200 rounded-md"></div></div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                filteredData.map((k) => (
                                    <motion.tr
                                        variants={tableRowVariants}
                                        key={k.maKho}
                                        className="group hover:bg-slate-50 transition-colors odd:bg-white even:bg-[#f1f5f9] text-left">

                                        <td className="py-3 pl-3 font-medium text-slate-700 border-y border-l border-slate-100 rounded-l-lg group-hover:border-slate-200">
                                            {k.maKhoCode || '-'}
                                        </td>
                                        <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-slate-700 font-medium">{k.tenKho}</td>
                                        <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-slate-500">{k.diaChi}</td>
                                        <td className="py-3 text-center border-y border-slate-100 group-hover:border-slate-200">
                                            {renderStatus(k.trangThai)}
                                        </td>
                                        <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 font-medium text-slate-700">{k.ghiChu ?? "-"}</td>
                                        <td className="py-3 px-4 text-right border-y border-r border-slate-100 rounded-r-lg group-hover:border-slate-200 whitespace-nowrap">
                                            <div className="inline-flex items-center gap-2 justify-end">
                                                {(userRole === "QUAN_LY") && (
                                                    <button onClick={() => openEdit(k)} className="p-2 rounded-md text-slate-600 hover:bg-slate-200 cursor-pointer">
                                                        <Edit size={18} />
                                                    </button>
                                                )}
                                                {userRole === "QUAN_LY" && (
                                                    <button onClick={() => openDelete(k)} className="p-2 rounded-md text-red-600 hover:bg-red-50 cursor-pointer">
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
                    {!isLoading && filteredData.length === 0 && (
                        <div className="text-center py-10 text-slate-400">
                            Không tìm thấy kho hàng nào.
                        </div>
                    )}
                </div>
            </motion.div>

            {/* --- Modals --- */}
            {/* 8. Render the Filter Modal */}
            <FilterKhoModal
                isOpen={modalType === 'filter'}
                onClose={closeModal}
                onApply={handleApplyFilter}
                onReset={handleResetFilter}
                initialFilters={filterValues}
            />

            {modalType === 'add' && (
                <AddKhoModal onClose={closeModal} onAdd={handleCreate} />
            )}
            {modalType === 'edit' && selectedItem && (
                <EditKhoModal kho={selectedItem} onClose={closeModal} onUpdate={handleUpdate} />
            )}
            {modalType === 'delete' && selectedItem && (
                <DeleteKhoModal kho={selectedItem} onClose={closeModal} onDelete={handleDelete} />
            )}
        </>
    );
}