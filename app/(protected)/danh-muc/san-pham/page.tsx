"use client";

import React, { useState, useMemo } from "react";
import { Edit, Trash2, Search, ChevronDown, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import AddSanPhamModal from "@/components/san-pham/AddSanPhamModal";
import EditSanPhamModal from "@/components/san-pham/EditSanPhamModal";
import DeleteSanPhamModal from "@/components/san-pham/DeleteSanPhamModal";
import { SanPhamWithPriceDTO } from "@/types/SanPhamWithPrice";
import AddButton from "@/components/ui/AddButton";

// --- MOCK DATA ---
// (Kept your data here)
const MOCK_SanPhamwithPrice: SanPhamWithPriceDTO[] = [
    {
        MaSP: "1",
        MaSPCode: "SP001",
        TenSP: "Amoxicillin 15%",
        LoaiSanPham: "THUOC_THU_Y",
        DonViCoSo: "Lọ",
        DonViQuyDoi: [
            { DonViNhap: "Hộp", TyLe: 12 },
            { DonViNhap: "Thùng nhỏ", TyLe: 120 },
            { DonViNhap: "Thùng to", TyLe: 500 },
        ],
        DonGia: 150000,
        GhiChu: "Hàng nhập khẩu",
        NgayTao: new Date().toISOString(),
    },
    {
        MaSP: "2",
        MaSPCode: "SP002",
        TenSP: "Vitamin B-Complex",
        LoaiSanPham: "THUOC_THU_Y",
        DonViCoSo: "Chai",
        DonViQuyDoi: [],
        DonGia: 80000,
        GhiChu: null,
        NgayTao: new Date().toISOString(),
    },
    {
        MaSP: "3",
        MaSPCode: "SP003",
        TenSP: "Cám gà đẻ trứng",
        LoaiSanPham: "THUC_AN_CHAN_NUOI",
        DonViCoSo: "Kg",
        DonViQuyDoi: [
            { DonViNhap: "Bao", TyLe: 25 },
            { DonViNhap: "Pallet", TyLe: 1000 },
        ],
        DonGia: 12000,
        GhiChu: "Bao 25kg",
        NgayTao: new Date().toISOString(),
    },
    {
        MaSP: "4",
        MaSPCode: "SP004",
        TenSP: "Thuốc sát trùng Iodine",
        LoaiSanPham: "THUOC_THU_Y",
        DonViCoSo: "Chai",
        DonViQuyDoi: [
            { DonViNhap: "Thùng", TyLe: 24 },
        ],
        DonGia: 95000,
        GhiChu: null,
        NgayTao: new Date().toISOString(),
    },
    {
        MaSP: "5",
        MaSPCode: "SP005",
        TenSP: "Men tiêu hóa gia súc",
        LoaiSanPham: "THUOC_THU_Y",
        DonViCoSo: "Gói",
        DonViQuyDoi: [
            { DonViNhap: "Hộp", TyLe: 50 },
        ],
        DonGia: 18000,
        GhiChu: "Dùng cho heo, bò",
        NgayTao: new Date().toISOString(),
    },
    {
        MaSP: "6",
        MaSPCode: "SP006",
        TenSP: "Cám heo tăng trọng",
        LoaiSanPham: "THUC_AN_CHAN_NUOI",
        DonViCoSo: "Kg",
        DonViQuyDoi: [
            { DonViNhap: "Bao", TyLe: 30 },
        ],
        DonGia: 11000,
        GhiChu: "Bao 30kg",
        NgayTao: new Date().toISOString(),
    },
    {
        MaSP: "7",
        MaSPCode: "SP007",
        TenSP: "Kháng sinh Enrofloxacin",
        LoaiSanPham: "THUOC_THU_Y",
        DonViCoSo: "Lọ",
        DonViQuyDoi: [],
        DonGia: 210000,
        GhiChu: "Chỉ dùng theo chỉ định",
        NgayTao: new Date().toISOString(),
    },
    {
        MaSP: "8",
        MaSPCode: "SP008",
        TenSP: "Thức ăn cá tra",
        LoaiSanPham: "THUC_AN_CHAN_NUOI",
        DonViCoSo: "Kg",
        DonViQuyDoi: [
            { DonViNhap: "Bao", TyLe: 20 },
        ],
        DonGia: 13500,
        GhiChu: null,
        NgayTao: new Date().toISOString(),
    },
    {
        MaSP: "9",
        MaSPCode: "SP009",
        TenSP: "Canxi + D3",
        LoaiSanPham: "THUOC_THU_Y",
        DonViCoSo: "Chai",
        DonViQuyDoi: [
            { DonViNhap: "Thùng", TyLe: 12 },
        ],
        DonGia: 70000,
        GhiChu: "Cho gia cầm",
        NgayTao: new Date().toISOString(),
    },
    {
        MaSP: "10",
        MaSPCode: "SP010",
        TenSP: "Cám vịt thịt",
        LoaiSanPham: "THUC_AN_CHAN_NUOI",
        DonViCoSo: "Kg",
        DonViQuyDoi: [
            { DonViNhap: "Bao", TyLe: 25 },
        ],
        DonGia: 10500,
        GhiChu: null,
        NgayTao: new Date().toISOString(),
    },
    {
        MaSP: "11",
        MaSPCode: "SP011",
        TenSP: "Thuốc tẩy giun Levamisole",
        LoaiSanPham: "THUOC_THU_Y",
        DonViCoSo: "Gói",
        DonViQuyDoi: [],
        DonGia: 32000,
        GhiChu: "Dùng định kỳ",
        NgayTao: new Date().toISOString(),
    },
];

const ITEMS_PER_PAGE = 10; // Show 10 items per page

export default function SanPhamPage() {
    const [query, setQuery] = useState("");
    const [sanPhamData, setSanPhamData] = useState<SanPhamWithPriceDTO[]>(MOCK_SanPhamwithPrice);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);

    const [modalType, setModalType] = useState<'filter' | 'delete' | 'add' | 'edit' | null>(null);
    const [selectedItem, setSelectedItem] = useState<SanPhamWithPriceDTO | null>(null);

    // 1. First, Filter the data
    const filteredData = useMemo(() => {
        return sanPhamData.filter((s) =>
            `${s.TenSP} ${s.MaSPCode} ${s.DonViCoSo}`.toLowerCase().includes(query.toLowerCase())
        );
    }, [sanPhamData, query]);

    // 2. Then, Paginate the filtered results
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredData.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredData, currentPage]);

    // Reset to page 1 when search query changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [query]);

    // --- Helper: Optimized Unit Display ---
    // Only shows the first 2 units, then "+N" to keep row height stable
    const renderUnitBadges = (units: SanPhamWithPriceDTO['DonViQuyDoi']) => {
        if (!units || units.length === 0) return <span className="text-slate-400 italic text-xs">--</span>;

        const displayUnits = units.slice(0, 2);
        const remaining = units.length - 2;

        return (
            <div className="flex flex-wrap gap-1 items-center">
                {displayUnits.map((u, idx) => (
                    <span key={idx} className="inline-flex items-center text-[11px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100 whitespace-nowrap">
                        <span className="font-semibold">{u.DonViNhap}</span>
                        <span className="text-blue-400 mx-0.5">×</span>
                        <span>{u.TyLe}</span>
                    </span>
                ))}
                {remaining > 0 && (
                    <span
                        className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 cursor-help"
                        title={units.slice(2).map(u => `${u.DonViNhap} (x${u.TyLe})`).join(', ')}
                    >
                        +{remaining}
                    </span>
                )}
            </div>
        );
    };

    // --- CRUD Handlers (Same as before) ---
    const closeModal = () => { setModalType(null); setSelectedItem(null); };
    const handleCreate = async (newData: SanPhamWithPriceDTO) => {
        setSanPhamData((prev) => [newData, ...prev]);
        closeModal();
    };
    const handleUpdate = async (updatedData: SanPhamWithPriceDTO) => {
        setSanPhamData((prev) => prev.map((k) => (k.MaSP === updatedData.MaSP ? updatedData : k)));
        closeModal();
    };
    const handleDelete = async (id: string) => {
        setSanPhamData(prev => prev.filter(k => k.MaSP !== id));
        closeModal();
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
                                {filteredData.length}
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
                            {paginatedData.map((s) => (
                                <tr key={s.MaSP} className="group hover:bg-slate-50 transition-colors odd:bg-white even:bg-[#f1f5f9]">
                                    <td className="py-3 pl-3 font-medium text-slate-700 border-y border-l border-slate-100 rounded-l-lg group-hover:border-slate-200">
                                        {s.MaSPCode}
                                    </td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200">
                                        <div className="font-medium text-slate-700 truncate" title={s.TenSP}>
                                            {s.TenSP}
                                        </div>
                                    </td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-slate-500">
                                        {s.LoaiSanPham === "THUOC_THU_Y" ? "Thuốc thú y" : "Thức ăn CN"}
                                    </td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-center font-semibold text-slate-700">
                                        {s.DonViCoSo}
                                    </td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200">
                                        {renderUnitBadges(s.DonViQuyDoi)}
                                    </td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-right font-medium text-slate-700">
                                        {s.DonGia ? s.DonGia.toLocaleString("vi-VN") : "0"}
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

                    {filteredData.length === 0 && (
                        <div className="text-center py-10 text-slate-400">
                            Không tìm thấy sản phẩm nào.
                        </div>
                    )}
                </div>

                {/* --- Pagination Controls --- */}
                {filteredData.length > 0 && (
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                            Hiển thị {((currentPage - 1) * ITEMS_PER_PAGE) + 1} đến {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} của {filteredData.length} sản phẩm
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {/* Page Numbers (Simple version) */}
                            {[...Array(totalPages)].map((_, i) => {
                                const pageNum = i + 1;
                                // Only show 5 pages max logic is better for real large apps, 
                                // but for 'hundreds' (e.g. 20 pages), simple scrolling is fine, 
                                // or just showing current/total.
                                if (totalPages > 7 && Math.abs(currentPage - pageNum) > 2 && pageNum !== 1 && pageNum !== totalPages) {
                                    if (Math.abs(currentPage - pageNum) === 3) return <span key={i} className="text-slate-400 text-xs">...</span>;
                                    return null;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 text-xs font-medium rounded-md transition-colors
                                            ${currentPage === pageNum
                                                ? 'bg-[#25396f] text-white'
                                                : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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