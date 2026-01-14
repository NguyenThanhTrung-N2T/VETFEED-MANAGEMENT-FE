"use client";

import React, { useState, useEffect } from "react";
import { Edit, Trash2, Search, ChevronDown, Filter, Tag } from "lucide-react";
import { NhaCungCapDTO } from "@/types";
import AddButton from "@/components/ui/AddButton";
import AddNCCModal from "@/components/nha-cung-cap/AddNCCModal";
//import EditNhaCungCapModal from "@/components/nha-cung-cap/EditNhaCungCapModal";
// Assume DeleteModal exists or reuse generic one
import DeleteKhoModal from "@/components/kho/DeleteKhoModal";

// MOCK DATA (Includes SanPhams now)
const MOCK_NhaCungCap: NhaCungCapDTO[] = [
    {
        MaNCC: "1",
        MaNCCCode: "NCC001",
        TenNCC: "Công ty Thuốc Thú Y An Phát",
        SoDienThoai: "0123781283",
        DiaChi: "123 QL1A, TP. Thủ Đức, TP.HCM",
        TrangThai: "HOAT_DONG",
        GhiChu: "Đối tác chiến lược",
        sanPhamCount: 2
    },
    {
        MaNCC: "2",
        MaNCCCode: "NCC002",
        TenNCC: "Công ty Vaccine Gia Cầm Việt",
        SoDienThoai: "0138434121",
        DiaChi: "45 Nguyễn Văn Linh, Q.7, TP.HCM",
        TrangThai: "HOAT_DONG",
        GhiChu: null,
        sanPhamCount: 0
    },
];

export default function NhaCungCapPage() {
    const [query, setQuery] = useState("");
    const [nhaCungCapData, setNhaCungCapData] = useState<NhaCungCapDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [modalType, setModalType] = useState<'filter' | 'delete' | 'add' | 'edit' | null>(null);
    const [selectedItem, setSelectedItem] = useState<NhaCungCapDTO | null>(null);

    // Mock Fetch
    useEffect(() => {
        const fetch = async () => {
            setIsLoading(true);
            // Simulate API delay
            await new Promise(r => setTimeout(r, 600));
            setNhaCungCapData(MOCK_NhaCungCap);
            setIsLoading(false);
        };
        fetch();
    }, []);

    const filteredData = nhaCungCapData.filter((n) =>
        `${n.TenNCC} ${n.DiaChi ?? ""} ${n.SoDienThoai}`
            .toLowerCase()
            .includes(query.toLowerCase())
    );

    // --- Modal Handlers ---
    const openAdd = () => setModalType('add');
    const openEdit = (item: NhaCungCapDTO) => {
        setSelectedItem(item);
        setModalType('edit');
    };
    const openDelete = (item: NhaCungCapDTO) => {
        setSelectedItem(item);
        setModalType('delete');
    };
    const openFilter = () => setModalType('filter');
    const closeModal = () => {
        setModalType(null);
        setSelectedItem(null);
    };

    // --- CRUD Handlers ---
    const handleCreate = async (newData: any) => {
        // In real app: API call here
        const newEntry = { ...newData, MaNCC: Date.now().toString(), TrangThai: "HOAT_DONG" };
        setNhaCungCapData((prev) => [newEntry, ...prev]);
        closeModal();
    };

    const handleUpdate = async (updatedData: NhaCungCapDTO) => {
        setNhaCungCapData((prev) => prev.map((k) => (k.MaNCC === updatedData.MaNCC ? updatedData : k)));
        closeModal();
    };

    const handleDelete = async (id: string) => {
        setNhaCungCapData(prev => prev.filter(k => k.MaNCC !== id));
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

            {/* Content Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-125 border border-slate-100">
                <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            Danh sách nhà cung cấp
                            <Filter
                                onClick={() => openFilter()}
                                className="cursor-pointer hover:text-green-600 transition-colors ml-1"
                                size={20}
                                strokeWidth={1.5}
                            />
                        </h2>
                    </div>
                    {userRole === "manager" && <AddButton onClick={openAdd} />}
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
                        <tbody className="text-sm">
                            {isLoading ? (
                                // --- SKELETON LOADER ---
                                [...Array(5)].map((_, index) => (
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
                                    <tr
                                        key={n.MaNCC}
                                        className="group hover:bg-slate-50 transition-colors odd:bg-white even:bg-[#f1f5f9] text-left">

                                        <td className="py-3 pl-3 font-medium text-slate-700 border-y border-l border-slate-100 rounded-l-lg group-hover:border-slate-200">
                                            {n.MaNCCCode}
                                        </td>

                                        <td className="py-3 border-y border-slate-100 group-hover:border-slate-200">
                                            <div className="font-medium text-slate-700 truncate" title={n.TenNCC}>{n.TenNCC}</div>
                                        </td>

                                        <td className="py-3 border-y border-slate-100 group-hover:border-slate-200">
                                            <div className="text-slate-500 truncate" title={n.DiaChi}>{n.DiaChi ?? "-"}</div>
                                        </td>

                                        <td className="py-3 border-y text-center border-slate-100 group-hover:border-slate-200 text-slate-700">
                                            {n.SoDienThoai}
                                        </td>

                                        {/* Products Count Badge */}
                                        <td className="py-3 border-y text-center border-slate-100 group-hover:border-slate-200">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                ${(n.sanPhamCount) > 0 ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-100 text-slate-500'}
                                            `}>
                                                <Tag size={12} />
                                                {n.sanPhamCount}
                                            </span>
                                        </td>

                                        <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-slate-500 truncate">
                                            {n.GhiChu ?? "-"}
                                        </td>

                                        <td className="py-3 px-4 text-right border-y border-r border-slate-100 rounded-r-lg group-hover:border-slate-200 whitespace-nowrap">
                                            <div className="inline-flex items-center gap-2 justify-end">
                                                {userRole === "manager" && (
                                                    <button
                                                        onClick={() => openEdit(n)}
                                                        className="p-2 rounded-md text-slate-600 hover:bg-slate-200 cursor-pointer transition-colors"
                                                        title="Chỉnh sửa & Xem sản phẩm"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                )}
                                                {userRole === "manager" && (
                                                    <button
                                                        onClick={() => openDelete(n)}
                                                        className="p-2 rounded-md text-red-600 hover:bg-red-50 cursor-pointer transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {modalType === 'add' && (
                <AddNCCModal onClose={closeModal} onAdd={handleCreate} />
            )}
            {/* {modalType === 'edit' && selectedItem && (
                <EditNCCModal data={selectedItem} onClose={closeModal} onUpdate={handleUpdate} />
            )}
            {modalType === 'delete' && selectedItem && (
                // Reusing your existing DeleteKhoModal (or create a generic one)
                <DeleteKhoModal
                    kho={selectedItem as any} // Cast temporarily if types mismatch, better to make modal Generic
                    onClose={closeModal}
                    onDelete={handleDelete}
                />
            )} */}
        </>
    );
}