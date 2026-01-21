"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Edit, Trash2, Search, ChevronDown, Filter, Tag } from "lucide-react";
import { NhaCungCapCreateRequest, NhaCungCapDetailedResponse, NhaCungCapResponse, NhaCungCapSanPhamItemDto, NhaCungCapSanPhamResponse, NhaCungCapUpdateRequest } from "@/client/types.gen";
import { nhaCungCapService } from "@/services/nha-cung-cap.service";
import AddNCCModal from "@/components/nha-cung-cap/AddNCCModal";
import EditNCCModal from "@/components/nha-cung-cap/EditNCCModal";
import DeleteNCCModal from "@/components/nha-cung-cap/DeleteNCCModal";
import AddButton from "@/components/ui/AddButton";
import { toast } from 'sonner';
import { motion } from "framer-motion";
import { pageVariants, tableContainerVariants, tableRowVariants } from "@/lib/animation-variants";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import FilterNCCModal, { NhaCungCapFilterValues } from "@/components/nha-cung-cap/FitlerNCCModal";
import { useAuth } from "@/providers/auth-provider";
// --- Utility: Merge Class ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
export default function NhaCungCapPage() {
    const [query, setQuery] = useState("");
    const [nhaCungCapData, setNhaCungCapData] = useState<NhaCungCapResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [modalType, setModalType] = useState<'filter' | 'delete' | 'add' | 'edit' | null>(null);
    const [selectedItem, setSelectedItem] = useState<NhaCungCapResponse | null>(null);
    const [filterValues, setFilterValues] = useState<NhaCungCapFilterValues>({
        tenNCC: "",
        soDienThoai: "",
        diaChi: "",
        trangThai: "ALL"
    });
    const isFiltering = useMemo(() => {
        return (
            !!filterValues.tenNCC ||
            !!filterValues.soDienThoai ||
            !!filterValues.diaChi ||
            filterValues.trangThai !== "ALL"
        );
    }, [filterValues]);

    const filteredData = useMemo(() => {
        return nhaCungCapData.filter((n) => {
            // A. Global Search Bar Logic
            const matchesSearch = `${n.tenNCC} ${n.diaChi ?? ""} ${n.soDienThoai}`
                .toLowerCase()
                .includes(query.toLowerCase());

            // B. Advanced Modal Filter Logic
            const matchesName = !filterValues.tenNCC ||
                n.tenNCC?.toLowerCase().includes(filterValues.tenNCC.toLowerCase());

            const matchesPhone = !filterValues.soDienThoai ||
                n.soDienThoai?.includes(filterValues.soDienThoai);

            const matchesAddress = !filterValues.diaChi ||
                n.diaChi?.toLowerCase().includes(filterValues.diaChi.toLowerCase());

            const matchesStatus = filterValues.trangThai === "ALL" ||
                n.trangThai === filterValues.trangThai;

            return matchesSearch && matchesName && matchesPhone && matchesAddress && matchesStatus;
        });
    }, [nhaCungCapData, query, filterValues]);
    const handleApplyFilter = (newFilters: NhaCungCapFilterValues) => {
        setFilterValues(newFilters);
        // Modal closes automatically via its own logic, or we can close it here if needed
        closeModal();
    };
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await nhaCungCapService.getAll();
            setNhaCungCapData(data);
        } catch (error) {
            toast.error("Xảy ra lỗi khi tải dữ liệu!");
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    // --- Modal Handlers ---
    const openAdd = () => setModalType('add');
    const openEdit = (item: NhaCungCapResponse) => {
        setSelectedItem(item);
        setModalType('edit');
    };
    const openDelete = (item: NhaCungCapResponse) => {
        setSelectedItem(item);
        setModalType('delete');
    };
    const openFilter = () => setModalType('filter');
    const closeModal = () => {
        setModalType(null);
        setSelectedItem(null);
    };

    // --- CRUD Handlers ---
    const handleCreate = async (newData: NhaCungCapCreateRequest) => {
        try {
            console.log(newData);
            await nhaCungCapService.create(newData);
            toast.success("Thêm nhà cung cấp mới thành công!");
            await fetchData();
            closeModal();
        } catch (error: any) {
            toast.error(error?.message ?? "Tạo nhà cung cấp thất bại!");
            throw error;
        }
    };

    const handleUpdate = async (id: string, updatedData: NhaCungCapUpdateRequest) => {
        try {
            await nhaCungCapService.update(id, updatedData);
            toast.success("Cập nhật nhà cung cấp thành công!");
            await fetchData();
            closeModal();
        } catch (error: any) {
            toast.error(error?.message ?? "Cập nhật nhà cung cấp thất bại!");
            throw error;
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await nhaCungCapService.delete(id);
            toast.success("Xóa nhà cung cấp thành công!");
            await fetchData();
            closeModal();
        } catch (error: any) {
            toast.error(error?.message ?? "Xóa nhà cung cấp thất bại!");
        }
    };
    const handleResetFilter = () => {
        setFilterValues({
            tenNCC: "",
            soDienThoai: "",
            diaChi: "",
            trangThai: "ALL"
        });
        // query is optional to reset, usually keep it separate
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
                {/* Search Input */}
                <div className="relative flex-1 max-w-lg group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, mã nhà cung cấp..."
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
                        Danh sách nhà cung cấp
                        <span className="text-sm font-normal text-slate-500 ml-2 bg-slate-100 px-2 py-0.5 rounded-full">
                            {filteredData.length ?? 0}
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
                        <Filter size={16} />
                        Bộ lọc
                        {isFiltering && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                    </button>
                </div>

                <div className="overflow-x-auto px-6 pb-6">
                    {/* Applied Fixed Layout + Min Width */}
                    <table className="w-full text-sm border-separate border-spacing-y-1 table-fixed min-w-250">
                        <thead>
                            <tr className="text-left text-xs font-semibold bg-[#e9eff6] text-slate-800 uppercase tracking-wider">
                                <th className="py-3 pl-3 rounded-l-lg w-[10%]">Mã NCC</th>
                                <th className="py-3 w-[22%]">Nhà cung cấp</th>
                                <th className="py-3 w-[25%]">Địa chỉ</th>
                                <th className="py-3 text-center w-[12%]">Số điện thoại</th>
                                <th className="py-3 w-[10%] text-center">Sản phẩm</th>
                                <th className="py-3 w-[10%]">Ghi chú</th>
                                <th className="py-3 px-4 text-right rounded-r-lg w-[11%] whitespace-nowrap">Hành động</th>
                            </tr>
                        </thead>
                        <motion.tbody
                            className="text-sm text-slate-700 divide-y divide-slate-50"
                            variants={tableContainerVariants} // Apply stagger effect
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {isLoading ? (
                                // --- SKELETON LOADER ---
                                [...Array(4)].map((_, index) => (
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
                            ) : (
                                filteredData.map((n) => (
                                    <motion.tr
                                        key={n.maNCC}
                                        variants={tableRowVariants} // Apply fade up item
                                        className="group hover:bg-slate-50 transition-colors odd:bg-white even:bg-[#f1f5f9] text-left"
                                    >

                                        <td className="py-3 pl-3 font-medium text-slate-700 border-y border-l border-slate-100 rounded-l-lg group-hover:border-slate-200">
                                            {n.maNCCCode}
                                        </td>

                                        <td className="py-3 border-y border-slate-100 group-hover:border-slate-200">
                                            <div className="font-medium text-slate-700 truncate" title={n.tenNCC ?? ''}>{n.tenNCC}</div>
                                        </td>

                                        <td className="py-3 border-y border-slate-100 group-hover:border-slate-200">
                                            <div className="text-slate-500 truncate" title={n.diaChi ?? ''}>{n.diaChi ?? "-"}</div>
                                        </td>

                                        <td className="py-3 border-y text-center border-slate-100 group-hover:border-slate-200 text-slate-700">
                                            {n.soDienThoai}
                                        </td>

                                        {/* Products Count Badge */}
                                        <td className="py-3 border-y text-center border-slate-100 group-hover:border-slate-200">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                ${typeof (n.sanPhamCount) === "number" && n.sanPhamCount > 0 ?
                                                    'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-100 text-slate-500'}
                                            `}>
                                                <Tag size={12} />
                                                {n.sanPhamCount ?? 0}
                                            </span>
                                        </td>

                                        <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-slate-500 truncate">
                                            {n.ghiChu ?? "-"}
                                        </td>

                                        <td className="py-3 px-4 text-right border-y border-r border-slate-100 rounded-r-lg group-hover:border-slate-200 whitespace-nowrap">
                                            <div className="inline-flex items-center gap-2 justify-end">
                                                {userRole === "QUAN_LY" && (
                                                    <button
                                                        onClick={() => openEdit(n)}
                                                        className="p-2 rounded-md text-slate-600 hover:bg-slate-200 cursor-pointer transition-colors"
                                                        title="Chỉnh sửa & Xem sản phẩm"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                )}
                                                {userRole === "QUAN_LY" && (
                                                    <button
                                                        onClick={() => openDelete(n)}
                                                        className="p-2 rounded-md text-red-600 hover:bg-red-50 cursor-pointer transition-colors">
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
                            Không tìm thấy nhà cung cấp nào.
                        </div>
                    )}
                </div>
            </motion.div>
            {/* 6. Render the Filter Modal */}
            <FilterNCCModal
                isOpen={modalType === 'filter'}
                onClose={closeModal}
                onApply={handleApplyFilter}
                onReset={handleResetFilter}
                initialFilters={filterValues}
            />
            {modalType === 'add' && (
                <AddNCCModal onClose={closeModal} onAdd={handleCreate} />
            )}
            {modalType === 'edit' && selectedItem && (
                <EditNCCModal data={selectedItem} onClose={closeModal} onUpdate={handleUpdate} />
            )}
            {modalType === 'delete' && selectedItem &&
                <DeleteNCCModal
                    nhaCungCap={selectedItem}
                    onClose={closeModal}
                    onDelete={handleDelete} />}
        </>
    )
}