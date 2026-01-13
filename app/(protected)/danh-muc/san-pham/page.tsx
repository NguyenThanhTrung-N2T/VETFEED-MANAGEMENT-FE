"use client";

import React, { useMemo, useState } from "react";
import { Edit, Trash2, Search, ChevronDown, Plus, Filter } from "lucide-react";
import AddSanPhamModal from "@/components/san-pham/AddSanPhamModal";
import EditSanPhamModal from "@/components/san-pham/EditSanPhamModal";
import DeleteSanPhamModal from "@/components/san-pham/DeleteSanPhamModal";
import { SanPhamWithPriceDTO } from "@/types/SanPhamWithPrice";
// TODO: Replace with real API call - fetch from /api/san-pham
const MOCK_SanPhamwithPrice: SanPhamWithPriceDTO[] = [
    {
        MaSP: "sp-0001-0000-0000-000000000001",
        MaSPCode: "SP001",
        TenSP: "Amoxicillin 15%",
        LoaiSanPham: "THUOC_THU_Y",
        DonViTinh: "Chai",
        DonGia: 150000,
        GhiChu: "Note Supercalifrasdflkdsjlkfdslakjfksdjalkfjsdlkfslkadjfdjfdlkjflkjflkj",
        NgayTao: new Date().toISOString(),
    },
    {
        MaSP: "sp-0002-0000-0000-000000000002",
        MaSPCode: "SP002",
        TenSP: "Vitamin B-Complex",
        LoaiSanPham: "THUOC_THU_Y",
        DonViTinh: "Chai",
        DonGia: 80000,
        GhiChu: null,
        NgayTao: new Date().toISOString(),
    },
    {
        MaSP: "sp-0003-0000-0000-000000000003",
        MaSPCode: "SP003",
        TenSP: "Cám gà đẻ trứng",
        LoaiSanPham: "THUC_AN_CHAN_NUOI",
        DonViTinh: "Bao",
        DonGia: 120000,
        GhiChu: "20kg",
        NgayTao: new Date().toISOString(),
    },
];
export default function SanPhamPage() {
    const [query, setQuery] = useState("");
    const [sanPhamWithPriceData, setSanPhamWithPriceData] = useState<SanPhamWithPriceDTO[]>(MOCK_SanPhamwithPrice);

    const [modalType, setModalType] = useState<'filter' | 'delete' | 'add' | 'edit' | null>(null);
    const [selectedItem, setSelectedItem] = useState<SanPhamWithPriceDTO | null>(null);

    // TODO: Replace with real data fetching
    // Example: const { data: sanPhams, isLoading } = useSWR('/api/san-pham', fetcher);
    const sanPhamWithPrices = sanPhamWithPriceData;
    const filteredData = sanPhamWithPrices.filter((s) =>
        `${s.TenSP} ${s.LoaiSanPham ?? ""} ${s.DonViTinh ?? ""} ${s.GhiChu ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase())
    );
    // --- Modal States ---
    const openAdd = () => {
        setModalType('add');
    };
    const openFilter = () => {
        setModalType('filter');
    }
    const openEdit = (sanPham: SanPhamWithPriceDTO) => {
        setSelectedItem(sanPham);
        setModalType('edit');
    };
    const openDelete = (sanPham: SanPhamWithPriceDTO) => {
        setSelectedItem(sanPham);
        setModalType('delete');
    };
    const closeModal = () => {
        setModalType(null);
        setSelectedItem(null);
    };
    // --- CRUD Handlers ---
    const handleCreate = async (newData: SanPhamWithPriceDTO) => {
        // MOCK
        console.log("Saving new kho:", newData);
        setSanPhamWithPriceData((prev) => [newData, ...prev]); // Add to top of list

        // Real App (API Call)
        /*
        try {
            await fetch('/api/kho', {
                method: 'POST',
                body: JSON.stringify(newData)
            });
            // Then refresh your data
            router.refresh(); 
        } catch (error) {
            console.error(error);
        }
        */
    };
    const handleUpdate = async (updatedData: SanPhamWithPriceDTO) => {
        // MOCK
        console.log("Updating san pham:", updatedData);
        setSanPhamWithPriceData((prev) =>
            prev.map((k) => (k.MaSP === updatedData.MaSP ? updatedData : k))
        );
        // Real App (API Call)    
    };
    const handleDelete = async (id: string) => {
        // API Call here...
        setSanPhamWithPriceData(prev => prev.filter(k => k.MaSP !== id));
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
            <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-125">
                {/* Card Header */}
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

                    {(userRole === "manager") && (<button
                        onClick={() => openAdd()}
                        className="justify-center w-30 inline-flex items-center gap-2 px-4 py-2 rounded-lg
                            bg-[#43a047] hover:bg-green-700 text-white font-medium transition-colors shadow-green-100 shadow-lg leading-none cursor-pointer"
                    >
                        <Plus size={16} className="font-white" /><span>Thêm</span>
                    </button>)}
                </div>
                <div className="overflow-x-auto px-6 pb-6">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-slate-700 uppercase tracking-wider border-b border-slate-100 bg-[#E3EDF9] border-separate">
                                <th className="py-3 pl-3 rounded-l-xl">Mã SP</th>
                                <th className="py-3">Tên sản phẩm</th>
                                <th className="py-3">Loại sản phẩm</th>
                                <th className="py-3 text-center">Đơn vị tính</th>
                                <th className="py-3">Giá bán</th>
                                <th className="py-3">Ghi chú</th>
                                <th className="py-3 px-4 text-right rounded-r-xl w-px whitespace-nowrap">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredData.map((s) => (
                                <tr key={s.MaSP} className="hover:bg-slate-50 transition-colors last:border-0 odd:bg-white even:bg-[#E3EDF9]">
                                    <td className="py-3 pl-3 font-medium text-slate-700 rounded-l-xl">{s.MaSPCode}</td>
                                    <td className="py-3 text-slate-600">{s.TenSP}</td>
                                    <td className="py-3 text-slate-600">{s.LoaiSanPham === "THUOC_THU_Y" ? "Thuốc thú y" : "Thức ăn chăn nuôi"}</td>
                                    <td className="py-3 text-slate-600 text-center">{s.DonViTinh ?? "-"}</td>
                                    <td className="py-3 text-slate-600">{s.DonGia ? s.DonGia.toLocaleString("vi-VN") + " ₫" : "-"}</td>
                                    <td className="py-3 text-slate-600 max-w-50 truncate">{s.GhiChu ?? "-"}</td>
                                    <td className="py-3 px-4 text-right rounded-r-xl w-px whitespace-nowrap">
                                        <div className="inline-flex items-center gap-2">
                                            {userRole === "manager" && (
                                                <button
                                                    onClick={() => openEdit(s)}
                                                    className="p-2 rounded-md text-slate-600 hover:bg-slate-200 cursor-pointer">
                                                    <Edit size={18} />
                                                </button>
                                            )}
                                            {userRole === "manager" && (
                                                <button
                                                    onClick={() => openDelete(s)}
                                                    className="p-2 rounded-md text-red-600 hover:bg-red-50 cursor-pointer">
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Modals */}
            {modalType === 'add' && (
                <AddSanPhamModal
                    onClose={() => closeModal()}
                    onAdd={handleCreate} />
            )}
            {modalType === 'edit' && selectedItem && (
                <EditSanPhamModal
                    sanPham={selectedItem}
                    onClose={() => closeModal()}
                    onUpdate={handleUpdate}
                />
            )}
            {modalType === 'delete' && selectedItem && (
                <DeleteSanPhamModal
                    sanPham={selectedItem}
                    onClose={() => closeModal()}
                    onDelete={handleDelete}
                />
            )}
        </>
    );
}