"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Edit, Trash2, Search, ChevronDown, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import AddSanPhamModal from "@/components/san-pham/AddSanPhamModal";
import EditSanPhamModal from "@/components/san-pham/EditSanPhamModal";
import DeleteSanPhamModal from "@/components/san-pham/DeleteSanPhamModal";
import {
    SanPhamCreateRequest,
    SanPhamUpdateRequest,
    SanPhamResponse,
    SanPhamResponsePagedResult
} from '@/client/types.gen';
import { sanPhamService } from "@/services/san-pham.service";
import AddButton from "@/components/ui/AddButton";

const ITEMS_PER_PAGE = 4; // Show N items per page

export default function SanPhamPage() {
    const [query, setQuery] = useState("");
    const [sanPhamData, setSanPhamData] = useState<SanPhamResponsePagedResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = ITEMS_PER_PAGE;

    const [modalType, setModalType] = useState<'filter' | 'delete' | 'add' | 'edit' | null>(null);
    const [selectedItem, setSelectedItem] = useState<SanPhamResponse | null>(null);

    const fetchData = async (page: number = 1, search: string = "") => {
        try {
            console.log("Fetching page:", page); // <-- check page number
            setIsLoading(true);
            const data = await sanPhamService.getAll(
                {
                    Page: page,
                    PageSize: pageSize,
                    Keyword: search,
                }
            );
            console.log("API response:", data); // <-- check the returned data
            setSanPhamData(data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            // Optional: Add toast error here
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchData(currentPage, query);
    }, [currentPage, query]);

    const paginatedData = sanPhamData?.items ?? [];
    const totalItems = sanPhamData?.total ?? 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [query]);

    // --- CRUD Handlers  ---
    const closeModal = () => { setModalType(null); setSelectedItem(null); };
    const handleCreate = async (newData: SanPhamCreateRequest) => {
        try {
            setIsLoading(true);
            await sanPhamService.create(newData);
            setCurrentPage(1);
            closeModal();
        } catch (error) {
            alert("Tạo sản phẩm mới thất bại!");
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleUpdate = async (id: string, updatedData: SanPhamUpdateRequest) => {
        try {
            setIsLoading(true);
            await sanPhamService.update(id, updatedData);
            await fetchData(currentPage);
            closeModal();
        } catch (error) {
            alert("Cập nhật sản phẩm thất bại!");
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleDelete = async (id: string) => {
        if (!sanPhamData?.items) return; // Early exit if items not loaded
        try {
            setIsLoading(true);
            await sanPhamService.delete(id);
            const newPage = (sanPhamData?.items.length === 1 && currentPage > 1)
                ? currentPage - 1
                : currentPage;

            await fetchData(newPage, query);
            closeModal();
        } catch (error) {
            console.log(error)
            alert("Xóa sản phẩm thất bại");
        }
        finally {
            setIsLoading(false);
        }
    };
    // --- Helper: Optimized Unit Display ---
    // Only shows the first 2 units, then "+N" to keep row height stable
    const renderUnitBadges = (units: SanPhamResponse['donViQuyDoi']) => {
        if (!units || units.length === 0) return <span className="text-slate-400 italic text-xs">--</span>;

        const displayUnits = units.slice(0, 2);
        const remaining = units.length - 2;

        return (
            <div className="flex flex-wrap gap-1 items-center">
                {displayUnits.map((u, idx) => (
                    <span key={idx} className="inline-flex items-center text-[11px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100 whitespace-nowrap">
                        <span className="font-semibold">{u.donViNhap}</span>
                        <span className="text-blue-400 mx-0.5">×</span>
                        <span>{u.tyLe}</span>
                    </span>
                ))}
                {remaining > 0 && (
                    <span
                        className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 cursor-help"
                        title={units.slice(2).map(u => `${u.donViNhap} (x${u.tyLe})`).join(', ')}
                    >
                        +{remaining}
                    </span>
                )}
            </div>
        );
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
    const userRole = "manager";

    return (
        <>
            {/* Search Bar */}
            <div className="flex justify-end w-full mb-6">
                <div className="flex shadow-sm rounded-md overflow-hidden bg-white border-slate-200">
                    <button className="px-4 py-2 text-sm font-medium flex items-center gap-2 bg-[#25396f] text-white rounded-l-lg hover:bg-[#1e2e5a] transition-colors shadow-md">
                        <span>Tất cả</span>
                        <ChevronDown size={14} />
                    </button>
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

            {/* Table Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-125 border border-slate-100 flex flex-col">
                <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            Danh sách sản phẩm
                            <span className="text-sm font-normal text-slate-500 ml-2 bg-slate-100 px-2 py-0.5 rounded-full">
                                {totalItems}
                            </span>
                            <Filter
                                onClick={() => setModalType('filter')}
                                className="cursor-pointer hover:text-green-600 transition-colors ml-1"
                                size={20}
                                strokeWidth={1.5}
                            />
                        </h2>
                    </div>
                    {userRole === "manager" && <AddButton onClick={() => setModalType('add')} />}
                </div>

                <div className="overflow-x-auto px-6 pb-4 flex-1">

                    <table className="w-full text-sm border-separate border-spacing-y-1 table-fixed min-w-250">
                        <thead>
                            <tr className="text-left text-xs font-semibold bg-[#e9eff6] text-slate-800 uppercase tracking-wider">
                                <th className="py-3 pl-3 rounded-l-lg w-[10%]">Mã SP</th>
                                <th className="py-3 w-[22%]">Tên sản phẩm</th>
                                <th className="py-3 w-[11%]">Phân loại</th>
                                <th className="py-3 text-center w-[10%]">ĐVT</th>
                                <th className="py-3 w-[23%]">Quy cách</th>
                                <th className="py-3 text-right w-[12%]">Giá bán</th>
                                <th className="py-3 px-4 text-right rounded-r-lg w-[12%] whitespace-nowrap">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {isLoading ? [...Array(4)].map((_, index) => (
                                <tr key={index} className="animate-pulse bg-white border-b border-slate-100">
                                    {/* Mã SP */}
                                    <td className="py-4 pl-3 border-y border-l border-slate-50 rounded-l-lg">
                                        <div className="h-4 bg-slate-200 rounded w-16"></div>
                                    </td>

                                    {/* Tên sản phẩm */}
                                    <td className="py-4 border-y border-slate-50">
                                        <div className="h-4 bg-slate-200 rounded w-32 mb-1"></div>
                                        <div className="h-3 bg-slate-100 rounded w-20"></div>
                                    </td>

                                    {/* Phân loại */}
                                    <td className="py-4 border-y border-slate-50">
                                        <div className="h-4 bg-slate-200 rounded w-24"></div>
                                    </td>

                                    {/* ĐVT */}
                                    <td className="py-4 border-y border-slate-50 text-center flex justify-center">
                                        <div className="h-6 bg-slate-200 rounded-full w-14"></div>
                                    </td>

                                    {/* Quy cách */}
                                    <td className="py-4 border-y border-slate-50">
                                        <div className="h-4 bg-slate-200 rounded w-28 mb-1"></div>
                                        <div className="h-3 bg-slate-100 rounded w-16"></div>
                                    </td>

                                    {/* Giá bán */}
                                    <td className="py-4 border-y border-slate-50 text-right">
                                        <div className="h-4 bg-slate-200 rounded w-20 mx-auto"></div>
                                    </td>

                                    {/* Hành động */}
                                    <td className="py-4 px-4 text-right border-y border-r border-slate-50 rounded-r-lg">
                                        <div className="flex justify-end gap-2">
                                            <div className="h-8 w-8 bg-slate-200 rounded-md"></div>
                                            <div className="h-8 w-8 bg-slate-200 rounded-md"></div>
                                        </div>
                                    </td>
                                </tr>)
                            ) : paginatedData.map((s) => (
                                <tr key={s.maSP} className="group hover:bg-slate-50 transition-colors odd:bg-white even:bg-[#f1f5f9]">
                                    <td className="py-3 pl-3 font-medium text-slate-700 border-y border-l border-slate-100 rounded-l-lg group-hover:border-slate-200">
                                        {s.maSPCode}
                                    </td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200">
                                        <div className="font-medium text-slate-700 truncate" title={s.tenSP ?? ''}>
                                            {s.tenSP}
                                        </div>
                                    </td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-slate-500">
                                        {s.loaiSanPham === "THUOC_THU_Y" ? "Thuốc thú y" : "Thức ăn CN"}
                                    </td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-center font-semibold text-slate-700">
                                        {s.donViCoSo}
                                    </td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200">
                                        {renderUnitBadges(s.donViQuyDoi)}
                                    </td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-right font-medium text-slate-700">
                                        {s.donGia ? s.donGia.toLocaleString("vi-VN") : "0"}
                                        <span className="text-[10px] text-slate-400 font-normal ml-0.5">₫</span>
                                    </td>
                                    <td className="py-3 px-4 text-right border-y border-r border-slate-100 rounded-r-lg group-hover:border-slate-200 whitespace-nowrap">
                                        <div className="inline-flex items-center gap-1 justify-end">
                                            {userRole === "manager" && (
                                                <button onClick={() => { setSelectedItem(s); setModalType('edit'); }} className="p-2 rounded-md text-slate-600 hover:bg-slate-200 cursor-pointer transition-colors">
                                                    <Edit size={18} />
                                                </button>
                                            )}
                                            {userRole === "manager" && (
                                                <button onClick={() => { setSelectedItem(s); setModalType('delete'); }} className="p-2 rounded-md text-red-600 hover:bg-red-50 cursor-pointer transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {!isLoading && totalItems === 0 && (
                        <div className="text-center py-10 text-slate-400">
                            Không tìm thấy sản phẩm nào.
                        </div>
                    )}
                </div>

                {/* --- Pagination Controls --- */}
                {totalItems > 0 && (
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                            Hiển thị {((currentPage - 1) * ITEMS_PER_PAGE) + 1} đến {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} của {totalItems} sản phẩm
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
            </div>

            {/* Modals remain the same... */}
            {modalType === 'add' && <AddSanPhamModal onClose={closeModal} onAdd={handleCreate} />}
            {modalType === 'edit' && selectedItem && <EditSanPhamModal sanPham={selectedItem} onClose={closeModal} onUpdate={handleUpdate} />}
            {modalType === 'delete' && selectedItem && <DeleteSanPhamModal sanPham={selectedItem} onClose={closeModal} onDelete={handleDelete} />}
        </>
    );
}