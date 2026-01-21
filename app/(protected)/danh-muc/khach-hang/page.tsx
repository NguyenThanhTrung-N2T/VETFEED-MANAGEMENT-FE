"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Edit, Trash2, Search, ChevronDown, ChevronLeft, ChevronRight, Plus, Eye, Filter, ChartNoAxesColumnDecreasingIcon } from "lucide-react";
import AddKhachHangModal from "@/components/khach-hang/AddKhachHangModal";
import ViewKhachHangModal from "@/components/khach-hang/ViewKhachHangModal";
import DeleteKhachHangModal from "@/components/khach-hang/DeleteKhachHangModal";
import AddButton from "@/components/ui/AddButton";
import { KhachHangCreateRequest, KhachHangResponse, KhachHangResponsePagedResult, KhachHangUpdateRequest } from "@/client/types.gen";
import { khachHangService, CustomerSearchParams } from "@/services/khach-hang.service";
import { toast } from 'sonner';
import { motion } from "framer-motion";
import { pageVariants, tableContainerVariants, tableRowVariants } from "@/lib/animation-variants";
import FilterKhachHangModal, { KhachHangFilterValues } from "@/components/khach-hang/FilterKhachHangModal";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from "@/providers/auth-provider";
// Helper for classes
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
const loaiKhachHangMap: Record<string, string> = { 'CA_NHAN': "Cá nhân", 'TRANG_TRAI': "Trang trại", 'DAI_LY': "Đại lý", };
const ITEMS_PER_PAGE = 8;

export default function KhachHangPage() {
    const [query, setQuery] = useState("");
    const [khachHangData, setKhachHangData] = useState<KhachHangResponsePagedResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = ITEMS_PER_PAGE;

    const [modalType, setModalType] = useState<'filter' | 'delete' | 'add' | 'view' | null>(null);
    const [selectedItem, setSelectedItem] = useState<KhachHangResponse | null>(null);
    const [filterValues, setFilterValues] = useState<KhachHangFilterValues>({
        tenKH: "",
        soDienThoai: "",
        loaiKhachHang: "ALL",
        trangThai: "ALL"
    });
    const isFiltering = useMemo(() => {
        return (
            !!filterValues.tenKH ||
            !!filterValues.soDienThoai ||
            filterValues.loaiKhachHang !== "ALL" ||
            filterValues.trangThai !== "ALL"
        );
    }, [filterValues]);
    const fetchData = async (page: number = 1, search: string = "", filters: KhachHangFilterValues) => {
        try {
            setIsLoading(true);

            // 1. Prepare Backend Params
            const params: CustomerSearchParams = {
                Page: page,
                PageSize: pageSize,
            };

            // Map Dropdowns
            if (filters.loaiKhachHang && filters.loaiKhachHang !== 'ALL') {
                params.LoaiKhachHang = filters.loaiKhachHang;
            }
            if (filters.trangThai && filters.trangThai !== 'ALL') {
                params.TrangThai = filters.trangThai;
            }

            // 2. Determine Keyword for Server (Priority: Global > Phone > Name)
            // We prioritize Phone because it's more specific than Name.
            let serverKeyword = "";
            if (search.trim()) {
                serverKeyword = search.trim();
            } else if (filters.soDienThoai?.trim()) {
                serverKeyword = filters.soDienThoai.trim();
            } else if (filters.tenKH?.trim()) {
                serverKeyword = filters.tenKH.trim();
            }

            if (serverKeyword) {
                params.Keyword = serverKeyword;
            }

            // 3. Call API
            const data = await khachHangService.getAll(params);

            // ---------------------------------------------------------
            // 4. CLIENT-SIDE "AND" LOGIC VERIFICATION
            // ---------------------------------------------------------
            // If we are using the Advanced Filter (not Global Search), we strictly enforce matches.
            // This fixes the issue where searching Phone gets a result, but the Name is wrong.
            if (!search.trim() && data && data.items) {
                const nameFilter = filters.tenKH?.toLowerCase().trim();
                const phoneFilter = filters.soDienThoai?.trim();

                data.items = data.items.filter(item => {
                    // Check Name (if filter exists)
                    const matchName = nameFilter
                        ? item.tenKH?.toLowerCase().includes(nameFilter)
                        : true;

                    // Check Phone (if filter exists)
                    const matchPhone = phoneFilter
                        ? item.soDienThoai?.includes(phoneFilter)
                        : true;

                    // Both must be true
                    return matchName && matchPhone;
                });

                // Optional: Update total count if you filtered items out
                // (This is a visual fix; real pagination total comes from DB)
                //data.total = data.items.length;
            }

            setKhachHangData(data);
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi tải dữ liệu!");
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchData(currentPage, query, filterValues);
    }, [currentPage, query, filterValues]);

    const paginatedData = khachHangData?.items ?? [];
    const totalItems = khachHangData?.total ?? 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [query, filterValues]);

    // --- Modal States ---
    const openAdd = () => {
        setModalType('add');
    };
    const openView = (khachHang: KhachHangResponse) => {
        setSelectedItem(khachHang);
        setModalType('view');
    };
    const openDelete = (khachHang: KhachHangResponse) => {
        setSelectedItem(khachHang);
        setModalType('delete');
    };
    const openFilter = () => {
        setModalType('filter');
    };
    const closeModal = () => {
        setModalType(null);
        setSelectedItem(null);
    };
    const handleApplyFilter = (newFilters: KhachHangFilterValues) => {
        setFilterValues(newFilters);
        // Page reset handled by useEffect
    };

    const handleResetFilter = () => {
        setFilterValues({
            tenKH: "",
            soDienThoai: "",
            loaiKhachHang: "ALL",
            trangThai: "ALL"
        });
    };
    // --- CRUD Handlers ---
    const handleCreate = async (newData: KhachHangCreateRequest) => {
        try {
            setIsLoading(true);
            await khachHangService.create(newData);
            setCurrentPage(1);
            toast.success("Thêm khách hàng mới thành công!");
            fetchData(1, query, filterValues);
            closeModal();
        }
        catch (error) {
            toast.error(error as string);
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleUpdate = async (id: string, updatedData: KhachHangUpdateRequest) => {
        try {
            setIsLoading(true);
            await khachHangService.update(id, updatedData);
            toast.success("Sửa thông tin khách hàng thành công!");
            await fetchData(currentPage, query, filterValues);
            closeModal();
        }
        catch (error) {
            toast.error(error as string);
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleDelete = async (id: string) => {
        if (!khachHangData?.items) return; // Early exit if items not loaded
        try {
            setIsLoading(true);
            await khachHangService.delete(id);
            const newPage = (khachHangData?.items.length === 1 && currentPage > 1)
                ? currentPage - 1
                : currentPage;
            toast.success("Xóa khách hàng thành công!");
            await fetchData(newPage, query, filterValues);
            closeModal();
        }
        catch (error) {
            toast.error(error as string);
        }
        finally {
            setIsLoading(false);
        }
    };
    // Helper to generate the array of page numbers (e.g., [1, '...', 4, 5, 6, '...', 10])
    const getPaginationGroup = () => {
        // If total pages are few (<= 7), show all of them
        if (totalPages <= 7) {
            return [...Array(totalPages)].map((_, i) => i + 1);
        }
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        const pages: (number | string)[] = [1]; // Showing the first page
        // Add left dots if needed
        if (start > 2) {
            pages.push('...');
        }
        // Add middle pages
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        // Add right dots if needed
        if (end < totalPages - 1) {
            pages.push('...');
        }
        // Always show last page
        pages.push(totalPages);
        return pages;
    };
    // TODO: Get real role from auth/session
    const loaiKhachHangRenderMap: Record<string, { label: string; className: string }> = {
        'CA_NHAN': {
            label: "Cá nhân",
            className: "bg-blue-50 text-blue-700 border border-blue-200",
        },
        'TRANG_TRAI': {
            label: "Trang trại",
            className: "bg-green-50 text-green-700 border border-green-200",
        },
        'DAI_LY': {
            label: "Đại lý",
            className: "bg-orange-50 text-orange-700 border border-orange-200",
        },
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
                        placeholder="Tìm kiếm theo tên, mã khách hàng..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                    />
                </div>

                <AddButton onClick={openAdd} className="ml-auto" />
            </motion.div>

            {/* Content Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden min-h-125 border border-slate-100 flex flex-col">
                {/* Card Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-linear-to-r from-white to-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        Danh sách khách hàng
                        <span className="text-sm font-normal text-slate-500 ml-2 bg-slate-100 px-2 py-0.5 rounded-full">
                            {totalItems}
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

                <div className="overflow-x-auto px-6 pb-4 flex-1">
                    <table className="w-full text-sm border-separate border-spacing-y-1 table-fixed min-w-250">
                        <thead>
                            <tr className="text-left text-xs font-semibold bg-[#e9eff6] text-slate-800 uppercase tracking-wider">
                                <th className="py-3 pl-3 rounded-l-lg w-[10%]">Mã KH</th>
                                <th className="py-3 w-[22%]">Họ tên</th>
                                <th className="py-3 w-[12%]">Loại KH</th>
                                <th className="py-3 text-center w-[16%]">Số điện thoại</th>
                                <th className="py-3 text-right w-[14%]">Tổng mua (VNĐ)</th>
                                <th className="py-3 text-right w-[14%]">Công nợ (VNĐ)</th>
                                <th className="py-3 px-4 text-right rounded-r-lg whitespace-nowrap w-[12%]">Hành động</th>
                            </tr>
                        </thead>
                        <motion.tbody
                            className="text-sm text-slate-700 divide-y divide-slate-50"
                            variants={tableContainerVariants} // Apply stagger effect
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {isLoading ? [...Array(4)].map((_, index) => (
                                <tr key={index} className="bg-white shadow-sm rounded-lg animate-pulse">
                                    {/* Mã KH */}
                                    <td className="py-3 pl-3 rounded-l-lg">
                                        <div className="h-4 w-16 bg-slate-200 rounded" />
                                    </td>
                                    {/* Họ tên */}
                                    <td className="py-3">
                                        <div className="h-4 w-40 bg-slate-200 rounded" />
                                    </td>
                                    {/* Loại KH */}
                                    <td className="py-3">
                                        <div className="h-4 w-24 bg-slate-200 rounded" />
                                    </td>
                                    {/* Số điện thoại */}
                                    <td className="py-3 text-center">
                                        <div className="h-4 w-28 bg-slate-200 rounded mx-auto" />
                                    </td>
                                    {/* Tổng mua */}
                                    <td className="py-3 text-right">
                                        <div className="h-4 w-24 bg-slate-200 rounded ml-auto" />
                                    </td>
                                    {/* Công nợ */}
                                    <td className="py-3 text-right">
                                        <div className="h-4 w-24 bg-slate-200 rounded ml-auto" />
                                    </td>
                                    {/* Hành động */}
                                    <td className="py-3 px-4 text-right rounded-r-lg">
                                        <div className="h-8 w-20 bg-slate-200 rounded ml-auto" />
                                    </td>
                                </tr>
                            )) : (paginatedData.map((c) => (
                                <motion.tr
                                    key={c.maKH}
                                    variants={tableRowVariants} // Apply fade up item
                                    className="group hover:bg-slate-50 transition-colors odd:bg-white even:bg-[#f1f5f9] text-left"
                                >
                                    <td className="py-3 pl-3 font-medium text-slate-700 border-y border-l border-slate-100 rounded-l-lg group-hover:border-slate-200">
                                        {c.maKHCode}
                                    </td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-slate-700 font-medium">
                                        {c.tenKH}
                                    </td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200">
                                        {c.loaiKhachHang !== null && c.loaiKhachHang !== undefined &&
                                            loaiKhachHangRenderMap[c.loaiKhachHang] ? (
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold 
      ${loaiKhachHangRenderMap[c.loaiKhachHang].className}`}
                                            >
                                                {loaiKhachHangRenderMap[c.loaiKhachHang].label}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">-</span>
                                        )}
                                    </td>
                                    <td className="py-3 border-y text-center border-slate-100 group-hover:border-slate-200 font-medium text-slate-700">{c.soDienThoai ?? "-"}</td>
                                    <td className="py-3 text-right font-medium text-slate-800">
                                        {c.tongMua ? c.tongMua.toLocaleString("vi-VN") : '0'}
                                    </td>
                                    <td className="py-3 text-right font-medium text-red-600">
                                        {c.congNoHienTai ? c.congNoHienTai.toLocaleString("vi-VN") : '0'}
                                    </td>
                                    <td className="py-3 px-4 text-right border-y border-r border-slate-100 rounded-r-lg group-hover:border-slate-200 whitespace-nowrap">
                                        <div className="inline-flex items-center gap-2">
                                            <button
                                                onClick={() => openView(c)}
                                                className="p-2 rounded-md text-blue-600 hover:bg-blue-100 cursor-pointer">
                                                <Eye size={18} />
                                            </button>
                                            {userRole === "QUAN_LY" && (
                                                <button
                                                    onClick={() => openDelete(c)}
                                                    className="p-2 rounded-md text-red-600 hover:bg-red-50 cursor-pointer">
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            )))}
                        </motion.tbody>
                    </table>
                    {!isLoading && totalItems === 0 && (
                        <div className="text-center py-10 text-slate-400">
                            Không tìm thấy khách hàng nào.
                        </div>
                    )}
                </div>

                {/* --- Pagination Controls --- */}
                {totalItems > 0 && (
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between sticky bottom-0">
                        <span className="text-sm text-slate-500">
                            Hiển thị {((currentPage - 1) * ITEMS_PER_PAGE) + 1} đến {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} của {totalItems} khách hàng
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-md border
                                bg-white border-slate-300 text-slate-600
                                transition-all duration-200

                                cursor-pointer
                                hover:bg-slate-50 hover:text-[#25396f] hover:border-[#25396f] hover:shadow-sm

                                disabled:opacity-40
                                disabled:cursor-default
                                disabled:hover:bg-white
                                disabled:hover:text-slate-600
                                disabled:hover:border-slate-300
                                disabled:shadow-none"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {/* Page Numbers (Simple version) */}
                            {getPaginationGroup().map((item, index) => {
                                // If the item is '...', render the span
                                if (item === '...') {
                                    return (
                                        <span key={`dots-${index}`} className="text-slate-400 text-xs px-1 self-end mb-2">
                                            ...
                                        </span>
                                    );
                                }

                                return (
                                    <button
                                        key={item}
                                        onClick={() => setCurrentPage(item as number)}
                                        className={`w-8 h-8 text-xs font-medium rounded-md transition-all duration-100 cursor-pointer
                                            ${currentPage === item
                                                ? // SELECTED: Add a slight shadow to make it pop
                                                'bg-[#25396f] text-white border border-[#25396f] shadow-md scale-105'
                                                : // UNSELECTED: On hover: slight gray bg, text turns blue, border turns blue
                                                'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-[#25396f] hover:border-[#25396f]'
                                            }`}
                                    >
                                        {item}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-md border
                                    bg-white border-slate-300 text-slate-600
                                    transition-all duration-100

                                    cursor-pointer
                                    hover:bg-slate-50 hover:text-[#25396f] hover:border-[#25396f] hover:shadow-sm

                                    disabled:opacity-40
                                    disabled:cursor-default
                                    disabled:hover:bg-white
                                    disabled:hover:text-slate-600
                                    disabled:hover:border-slate-300
                                    disabled:shadow-none"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </motion.div >
            <FilterKhachHangModal
                isOpen={modalType === 'filter'}
                onClose={closeModal}
                onApply={handleApplyFilter}
                onReset={handleResetFilter}
                initialFilters={filterValues}
            />
            {/* Add Modal */}
            {
                modalType === 'add' && (
                    <AddKhachHangModal
                        onClose={() => closeModal()}
                        onAdd={handleCreate}
                    />
                )
            }
            {
                modalType === 'view' && selectedItem && (
                    <ViewKhachHangModal
                        khachHang={selectedItem}
                        onClose={() => closeModal()}
                        onUpdate={handleUpdate}
                    />
                )
            }
            {
                modalType === 'delete' && selectedItem && (
                    <DeleteKhachHangModal
                        khachHang={selectedItem}
                        onClose={() => closeModal()}
                        onDelete={handleDelete}
                    />
                )
            }
        </>
    );
}