"use client";

import React, { useState } from "react";
import { Edit, Trash2, Search, ChevronDown, Plus, Filter, Package } from "lucide-react";
import AddSanPhamModal from "@/components/san-pham/AddSanPhamModal";
import EditSanPhamModal from "@/components/san-pham/EditSanPhamModal"; // Ensure this exists and uses the new Form
import DeleteSanPhamModal from "@/components/san-pham/DeleteSanPhamModal";
import { SanPhamWithPriceDTO } from "@/types/SanPhamWithPrice";
import AddButton from "@/components/ui/AddButton";
// --- MOCK DATA WITH UNITS ---
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
            { DonViNhap: "Container", TyLe: 1000 },
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
        DonViQuyDoi: [], // No conversion
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
            { DonViNhap: "Pallet", TyLe: 1000 }
        ],
        DonGia: 12000, // Price per Kg
        GhiChu: "Bao 25kg",
        NgayTao: new Date().toISOString(),
    },
];

export default function SanPhamPage() {
    const [query, setQuery] = useState("");
    const [sanPhamData, setSanPhamData] = useState<SanPhamWithPriceDTO[]>(MOCK_SanPhamwithPrice);
    const [modalType, setModalType] = useState<'filter' | 'delete' | 'add' | 'edit' | null>(null);
    const [selectedItem, setSelectedItem] = useState<SanPhamWithPriceDTO | null>(null);

    // Filtering logic
    const filteredData = sanPhamData.filter((s) =>
        `${s.TenSP} ${s.MaSPCode} ${s.DonViCoSo}`.toLowerCase().includes(query.toLowerCase())
    );

    // Helper: Format units for display
    // Input: Base="Kg", Units=[{Name="Bao", Ratio=25}] -> Output: "Bao (25 Kg)"
    const formatPackaging = (base: string, units: SanPhamWithPriceDTO['DonViQuyDoi']) => {
        if (!units || units.length === 0) return <span className="text-slate-400 italic">--</span>;

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-1 gap-y-1 max-w-65">
                {units.map((u, idx) => (
                    <span key={idx} className="inline-flex items-center text-xs bg-blue-50 text-blue-700 px-1 py-0.5 rounded-full w-fit">
                        <span className="font-semibold">{u.DonViNhap}</span>
                        <span className="text-blue-400">×</span>
                        <span>{u.TyLe}</span>
                    </span>
                ))}
            </div>
        );
    };

    // --- Modal Handlers ---
    const openAdd = () => setModalType('add');
    const openEdit = (item: SanPhamWithPriceDTO) => {
        setSelectedItem(item);
        setModalType('edit');
    };
    const openDelete = (item: SanPhamWithPriceDTO) => {
        setSelectedItem(item);
        setModalType('delete');
    };
    const openFilter = () => {
        setModalType('filter');
    }
    const closeModal = () => {
        setModalType(null);
        setSelectedItem(null);
    };

    // --- CRUD Handlers ---
    const handleCreate = async (newData: SanPhamWithPriceDTO) => {
        setSanPhamData((prev) => [newData, ...prev]);
    };

    const handleUpdate = async (updatedData: SanPhamWithPriceDTO) => {
        setSanPhamData((prev) => prev.map((k) => (k.MaSP === updatedData.MaSP ? updatedData : k)));
    };

    const handleDelete = async (id: string) => {
        setSanPhamData(prev => prev.filter(k => k.MaSP !== id));
    };

    const userRole: "manager" | "staff" = "manager";

    return (
        <>
            {/* Search Bar Area */}
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
                            placeholder="Tìm kiếm tên, mã, đơn vị..."
                            className="w-72 py-2 pl-4 pr-10 text-sm border-0 focus:ring-0 outline-none h-full"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <Search size={16} />
                        </span>
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-125 border border-slate-100">
                <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            Danh sách sản phẩm
                            <Filter
                                onClick={() => openFilter()}
                                className="cursor-pointer hover:text-green-600 transition-colors ml-1"
                                size={20}
                                strokeWidth={1.5}
                            />
                        </h2>
                    </div>

                    {(userRole === "manager") &&
                        (<AddButton onClick={() => openAdd()} />)}
                </div>

                <div className="overflow-x-auto px-6 pb-6">
                    <table className="w-full text-sm border-separate border-spacing-y-1">
                        <thead>
                            <tr className="text-left text-xs font-semibold bg-[#e9eff6] text-slate-800 uppercase tracking-wider">
                                <th className="py-3 pl-3 rounded-l-lg">Mã SP</th>
                                <th className="py-3 ">Tên sản phẩm</th>
                                <th className="py-3 ">Phân loại</th>
                                <th className="py-3 text-center">ĐVT (Gốc)</th>
                                <th className="py-3">Quy cách (Quy đổi)</th>
                                <th className="py-3 text-left">Giá bán</th>
                                <th className="py-3 px-4 text-right rounded-r-lg w-px whitespace-nowrap">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredData.map((s) => (
                                <tr key={s.MaSP} className="group hover:bg-slate-50 transition-colors odd:bg-white even:bg-[#f1f5f9]">
                                    <td className="py-3 pl-3 font-medium text-slate-700 border-y border-l border-slate-100 rounded-l-lg group-hover:border-slate-200">
                                        {s.MaSPCode}
                                    </td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-slate-700 font-medium">
                                        {s.TenSP}
                                    </td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-slate-500">
                                        {s.LoaiSanPham === "THUOC_THU_Y" ? "Thuốc thú y" : "Thức ăn CN"}
                                    </td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-center font-semibold text-slate-700">
                                        {s.DonViCoSo}
                                    </td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200">
                                        {formatPackaging(s.DonViCoSo, s.DonViQuyDoi)}
                                    </td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-left font-medium text-slate-700">
                                        {s.DonGia ? s.DonGia.toLocaleString("vi-VN") : "0"} ₫
                                        <span className="text-xs text-slate-400 font-normal ml-1">
                                            /{s.DonViCoSo}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right border-y border-r border-slate-100 rounded-r-lg group-hover:border-slate-200 w-px whitespace-nowrap">
                                        <div className="inline-flex items-center gap-1 justify-end">
                                            {userRole === "manager" && (
                                                <button
                                                    onClick={() => openEdit(s)}
                                                    className="p-2 rounded-md text-slate-600 hover:bg-slate-200 cursor-pointer">
                                                    <Edit size={18} />
                                                </button>
                                            )}
                                            {userRole === "manager" && (<button
                                                onClick={() => openDelete(s)}
                                                className="p-2 rounded-md text-red-600 hover:bg-red-50 cursor-pointer">
                                                <Trash2 size={18} />
                                            </button>)}
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
            </div>

            {/* Modals */}
            {modalType === 'add' && (
                <AddSanPhamModal onClose={closeModal} onAdd={handleCreate} />
            )}
            {modalType === 'edit' && selectedItem && (
                <EditSanPhamModal
                    sanPham={selectedItem}
                    onClose={closeModal}
                    onUpdate={handleUpdate}
                />
            )}
            {modalType === 'delete' && selectedItem && (
                <DeleteSanPhamModal
                    sanPham={selectedItem}
                    onClose={closeModal}
                    onDelete={handleDelete}
                />
            )}
        </>
    );
}