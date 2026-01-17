"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Edit, Trash2, Search, ChevronDown, ChevronLeft, ChevronRight, Plus, Eye, Filter, ChartNoAxesColumnDecreasingIcon } from "lucide-react";
import AddKhachHangModal from "@/components/khach-hang/AddKhachHangModal";
import ViewKhachHangModal from "@/components/khach-hang/ViewKhachHangModal";
import DeleteKhachHangModal from "@/components/khach-hang/DeleteKhachHangModal";
import AddButton from "@/components/ui/AddButton";
import { KhachHangCreateRequest, KhachHangResponse, KhachHangResponsePagedResult, KhachHangUpdateRequest } from "@/client/types.gen";
import { khachHangService } from "@/services/khach-hang.service";
import { toast } from 'sonner';

const loaiKhachHangMap: Record<string, string> = { 'CA_NHAN': "Cá nhân", 'TRANG_TRAI': "Trang trại", 'DAI_LY': "Đại lý", };
const ITEMS_PER_PAGE = 5;

export default function KhachHangPage() {
    const [query, setQuery] = useState("");
    const [khachHangData, setKhachHangData] = useState<KhachHangResponsePagedResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = ITEMS_PER_PAGE;

    const [modalType, setModalType] = useState<'filter' | 'delete' | 'add' | 'view' | null>(null);
    const [selectedItem, setSelectedItem] = useState<KhachHangResponse | null>(null);

    const fetchData = async (page: number = 1, search: string = "") => {
        try {
            console.log("Fetching page:", page); // <-- check page number
            setIsLoading(true);
            const data = await khachHangService.getAll(
                {
                    Page: page,
                    PageSize: pageSize,
                    Keyword: search,
                }
            );
            console.log("API response:", data); // <-- check the returned data
            setKhachHangData(data);
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi tải dữ liệu!");
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchData(currentPage, query);
    }, [currentPage, query]);

    const paginatedData = khachHangData?.items ?? [];
    const totalItems = khachHangData?.total ?? 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [query]);

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
    // --- CRUD Handlers ---
    const handleCreate = async (newData: KhachHangCreateRequest) => {
        try {
            setIsLoading(true);
            await khachHangService.create(newData);
            setCurrentPage(1);
            toast.success("Thêm khách hàng mới thành công!");
            fetchData();
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
            await fetchData(currentPage);
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
            await fetchData(newPage, query);
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
    const userRole: "manager" | "staff" = "manager";
    return (
        <>
            {/* Search Bar */}
            <div className="flex justify-end w-full mb-6">
                <div className="flex shadow-sm rounded-md overflow-hidden bg-white border-slate-200">
                    {/* Dropdown */}
                    <button className="px-4 py-2 text-sm font-medium flex items-center gap-2 bg-[#25396f] text-white rounded-l-lg hover:bg-[#1e2e5a] transition-colors shadow-md">
                        <span>Tất cả</span>
                        <ChevronDown size={14} />
                    </button>

                    {/* Input */}
                    <div className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Tìm kiếm..."
                            className="w-72 py-2 pl-4 pr-10 text-sm border-0 focus:ring-0 outline-none h-full"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <Search size={16} />
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-125 border border-slate-100 flex flex-col">
                {/* Card Header */}
                <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            Danh sách khách hàng
                            <span className="text-sm font-normal text-slate-500 ml-2 bg-slate-100 px-2 py-0.5 rounded-full">
                                {totalItems}
                            </span>
                            <Filter
                                onClick={() => openFilter()}
                                className="cursor-pointer hover:text-green-600 transition-colors ml-1"
                                size={20}
                                strokeWidth={1.5}
                            />
                        </h2>
                    </div>

                    <AddButton onClick={() => openAdd()} />
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
                        <tbody className="text-sm">
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
                                <tr
                                    key={c.maKH}
                                    className="group hover:bg-slate-50 transition-colors odd:bg-white even:bg-[#f1f5f9]"
                                >
                                    <td className="py-3 pl-3 font-medium text-slate-700 border-y border-l border-slate-100 rounded-l-lg group-hover:border-slate-200">
                                        {c.maKHCode}
                                    </td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-slate-700 font-medium">
                                        {c.tenKH}
                                    </td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 font-medium text-slate-700">{c.loaiKhachHang ? loaiKhachHangMap[c.loaiKhachHang] : "-"}</td>
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
                                            {userRole === "manager" && (
                                                <button
                                                    onClick={() => openDelete(c)}
                                                    className="p-2 rounded-md text-red-600 hover:bg-red-50 cursor-pointer">
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                    {!isLoading && totalItems === 0 && (
                        <div className="text-center py-10 text-slate-400">
                            Không tìm thấy khách hàng nào.
                        </div>
                    )}
                </div>

                {/* --- Pagination Controls --- */}
                {totalItems > 0 && (
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
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
            </div >
            {/* Add Modal */}
            {modalType === 'add' && (
                <AddKhachHangModal
                    onClose={() => closeModal()}
                    onAdd={handleCreate}
                />
            )}
            {modalType === 'view' && selectedItem && (
                <ViewKhachHangModal
                    khachHang={selectedItem}
                    onClose={() => closeModal()}
                    onUpdate={handleUpdate}
                />
            )}
            {modalType === 'delete' && selectedItem && (
                <DeleteKhachHangModal
                    khachHang={selectedItem}
                    onClose={() => closeModal()}
                    onDelete={handleDelete}
                />
            )}
        </>
    );
}