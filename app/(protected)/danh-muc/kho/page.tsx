"use client";

import React, { useMemo, useState } from "react";
import { Edit, Trash2, Search, ChevronDown, Plus } from "lucide-react";
import { KhoHangDTO } from "@/types";
import AddKhoModal from "@/components/kho/AddKhoModal";
import EditKhoModal from "@/components/kho/EditKhoModal";
import DeleteKhoModal from "@/components/kho/DeleteKhoModal";
// TODO: Replace with real API call - fetch from /api/kho
const MOCK_KhoHang: KhoHangDTO[] = [
    {
        MaKho: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        MaKhoCode: "KHO_HCM",
        TenKho: "Kho Vận Linh Xuân",
        DiaChi: "123 QL1A, TP. Thủ Đức, TP.HCM",
        TrangThai: "HOAT_DONG",
        GhiChu: "Note",
        NgayTao: new Date().toISOString(),
    },
    {
        MaKho: "bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        MaKhoCode: "KHO_A",
        TenKho: "Kho A",
        DiaChi: "45 Nguyễn Văn Linh, Q.7, TP.HCM",
        TrangThai: "HOAT_DONG",
        GhiChu: null,
        NgayTao: new Date().toISOString(),
    },
    {
        MaKho: "ccccccc3-cccc-cccc-cccc-cccccccccccc",
        MaKhoCode: "KHO_4",
        TenKho: "Kho 4 Non Blonds",
        DiaChi: "210 Trần Phú, TP. Long Khánh, Đồng Nai",
        TrangThai: "NGUNG_HOAT_DONG",
        GhiChu: "20kg",
        NgayTao: new Date().toISOString(),
    },
];

export default function KhoPage() {
    const [query, setQuery] = useState("");
    // TODO: Replace with real data fetching
    // Example: const { data: khoHangs, isLoading } = useSWR('/api/kho', fetcher);
    const [khoData, setKhoData] = useState<KhoHangDTO[]>(MOCK_KhoHang);

    const [modalType, setModalType] = useState<'filter' | 'delete' | 'add' | 'edit' | null>(null);
    const [selectedItem, setSelectedItem] = useState<KhoHangDTO | null>(null);

    const khoHangs = khoData;
    const filteredData = khoHangs.filter((k) =>
        `${k.TenKho} ${k.DiaChi} ${k.GhiChu ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase())
    );
    //await fetch("/api/kho", { method: "POST" })
    //await fetch(`/api/kho/${id}`, { method: "PUT" })

    // Open Add/Edit/Delete Modals
    const openAdd = () => {
        setModalType('add');
    };
    const openEdit = (kho: KhoHangDTO) => {
        setSelectedItem(kho);
        setModalType('edit');
    };
    const openDelete = (kho: KhoHangDTO) => {
        setSelectedItem(kho);
        setModalType('delete');
    };
    const closeModal = () => {
        setModalType(null);
        setSelectedItem(null); // Reset data
    };
    // --- CRUD Handlers ---
    const handleCreate = async (newData: KhoHangDTO) => {
        // MOCK
        console.log("Saving new kho:", newData);
        setKhoData((prev) => [newData, ...prev]); // Add to top of list

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
    const handleUpdate = async (updatedData: KhoHangDTO) => {
        // MOCK
        console.log("Updating kho:", updatedData);
        setKhoData((prev) =>
            prev.map((k) => (k.MaKho === updatedData.MaKho ? updatedData : k))
        );
        // Real App (API Call)    
    };
    const handleDelete = async (id: string) => {
        // API Call here...
        setKhoData(prev => prev.filter(k => k.MaKho !== id));
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
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="mb-3 flex items-center justify-between">
                    <div className="text-2xl text-black">Danh sách kho</div>

                    {(userRole === "manager") &&
                        (<button
                            onClick={() => openAdd()}
                            className="justify-center w-30 inline-flex items-center gap-2 px-4 py-2 rounded-lg
                            bg-[#43a047] hover:bg-green-700 text-white font-medium transition-colors shadow-green-100 shadow-lg leading-none "
                        >
                            <Plus size={16} className="font-white" /><span>Thêm</span>
                        </button>)}
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-xs text-slate-700 uppercase tracking-wider border-b border-slate-100 bg-[#E3EDF9] border-separate">
                            <th className="py-3 pl-3 rounded-l-xl">Mã kho</th>
                            <th className="py-3">Tên kho</th>
                            <th className="py-3">Địa chỉ</th>
                            <th className="py-3 text-center">Trạng thái</th>
                            <th className="py-3">Ghi chú</th>
                            <th className="py-3 px-4 text-right rounded-r-xl w-px whitespace-nowrap">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {filteredData.map((k) => (
                            <tr
                                key={k.MaKho}
                                className="hover:bg-slate-50 transition-colors last:border-0 odd:bg-white even:bg-[#E3EDF9]"
                            >

                                <td className="py-3 pl-3 font-medium text-slate-700 rounded-l-xl">
                                    {k.MaKhoCode}
                                </td>
                                <td className="py-3 text-slate-600">{k.TenKho}</td>
                                <td className="py-3 text-slate-600">{k.DiaChi}</td>
                                <td className="py-3 text-center">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${k.TrangThai === "HOAT_DONG"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {k.TrangThai === "HOAT_DONG"
                                            ? "Hoạt động"
                                            : "Ngưng hoạt động"}
                                    </span>
                                </td>
                                <td className="py-3 text-slate-600">{k.GhiChu ?? "-"}</td>
                                <td className="py-3 px-4 text-right rounded-r-xl w-px whitespace-nowrap">
                                    <div className="inline-flex items-center gap-2">
                                        {(userRole === "manager") && (
                                            <button
                                                onClick={() => openEdit(k)}
                                                className="p-2 rounded-md text-slate-600 hover:bg-slate-200">
                                                <Edit size={18} />
                                            </button>
                                        )}
                                        {userRole === "manager" && (
                                            <button
                                                onClick={() => openDelete(k)}
                                                className="p-2 rounded-md text-red-600 hover:bg-red-50">
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
            {modalType === 'add' && (
                <AddKhoModal
                    onClose={() => closeModal()}
                    onAdd={handleCreate}
                />
            )}
            {modalType === 'edit' && selectedItem && (
                <EditKhoModal
                    kho={selectedItem}
                    onClose={() => closeModal()}
                    onUpdate={handleUpdate}
                />
            )}
            {modalType === 'delete' && selectedItem && (
                <DeleteKhoModal
                    kho={selectedItem}
                    onClose={() => closeModal()}
                    onDelete={handleDelete}
                />
            )}
        </>
    );
}