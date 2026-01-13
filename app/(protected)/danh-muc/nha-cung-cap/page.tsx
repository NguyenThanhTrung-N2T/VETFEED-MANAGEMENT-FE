"use client";

import React, { useMemo, useState } from "react";
import { Edit, Trash2, Search, ChevronDown, Plus, Filter } from "lucide-react";
import { NhaCungCapDTO } from "@/types";
import AddButton from "@/components/ui/AddButton";

// TODO: Replace with real API call - fetch from /api/nha-cung-cap
const MOCK_NhaCungCap: NhaCungCapDTO[] = [
    {
        MaNCC: "11111111-1111-1111-1111-111111111111",
        MaNCCCode: "NCC001",
        TenNCC: "Công ty Thuốc Thú Y An Phát",
        SoDienThoai: "0123781283",
        DiaChi: "123 QL1A, TP. Thủ Đức, TP.HCM",
        TrangThai: "HOAT_DONG",
        GhiChu: "Note",
        NgayTao: new Date().toISOString(),
    },
    {
        MaNCC: "22222222-2222-2222-2222-222222222222",
        MaNCCCode: "NCC002",
        TenNCC: "Công ty Vaccine Gia Cầm Việt",
        SoDienThoai: "0138434121",
        DiaChi: "45 Nguyễn Văn Linh, Q.7, TP.HCM",
        TrangThai: "HOAT_DONG",
        GhiChu: null,
        NgayTao: new Date().toISOString(),
    },
    {
        MaNCC: "33333333-3333-3333-3333-333333333333",
        MaNCCCode: "NCC003",
        TenNCC: "Đại lý Thức ăn Chăn nuôi Hòa Phát",
        SoDienThoai: "0939493121",
        DiaChi: "78 Lê Hồng Phong, TP. Biên Hòa, Đồng Nai",
        TrangThai: "HOAT_DONG",
        GhiChu: "Ghi chú",
        NgayTao: new Date().toISOString(),
    },
];

export default function NhaCungCapPage() {
    const [query, setQuery] = useState("");
    const [nhaCungCapData, setNhaCungCapData] = useState<NhaCungCapDTO[]>(MOCK_NhaCungCap);
    const [modalType, setModalType] = useState<'filter' | 'delete' | 'add' | 'edit' | null>(null);
    const [selectedItem, setSelectedItem] = useState<NhaCungCapDTO | null>(null);

    // TODO: Replace with real data fetching
    // Example: const { data: nhaCungCaps, isLoading } = useSWR('/api/nha-cung-cap', fetcher);

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
    const openFilter = () => {
        setModalType('filter');
    }
    const closeModal = () => {
        setModalType(null);
        setSelectedItem(null);
    };

    // --- CRUD Handlers ---
    const handleCreate = async (newData: NhaCungCapDTO) => {
        setNhaCungCapData((prev) => [newData, ...prev]);
    };

    const handleUpdate = async (updatedData: NhaCungCapDTO) => {
        setNhaCungCapData((prev) => prev.map((k) => (k.MaNCC === updatedData.MaNCC ? updatedData : k)));
    };

    const handleDelete = async (id: string) => {
        setNhaCungCapData(prev => prev.filter(k => k.MaNCC !== id));
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
                            Danh sách nhà cung cấp
                            <Filter
                                onClick={() => openFilter()}
                                className="cursor-pointer hover:text-green-600 transition-colors ml-1"
                                size={20}
                                strokeWidth={1.5}
                            />
                        </h2>
                    </div>

                    {(userRole === "manager") && (<AddButton onClick={() => openAdd()} />
                    )}
                </div>
                {/* transition-transform duration-300 group-hover:-rotate-90 */}
                <div className="overflow-x-auto px-6 pb-6">
                    <table className="w-full text-sm border-separate border-spacing-y-1">
                        <thead>
                            <tr className="text-left text-xs font-semibold bg-[#e9eff6] text-slate-800 uppercase tracking-wider">
                                <th className="py-3 pl-3 rounded-l-lg">Mã NCC</th>
                                <th className="py-3">Nhà cung cấp</th>
                                <th className="py-3">Địa chỉ</th>
                                <th className="py-3 text-center">Số điện thoại</th>
                                <th className="py-3">Ghi chú</th>
                                <th className="py-3 px-4 text-right rounded-r-lg w-px whitespace-nowrap">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredData.map((n) => (
                                <tr
                                    key={n.MaNCC}
                                    className="group hover:bg-slate-50 transition-colors odd:bg-white even:bg-[#f1f5f9]">
                                    <td className="py-3 pl-3 font-medium text-slate-700 border-y border-l border-slate-100 rounded-l-lg group-hover:border-slate-200">
                                        {n.MaNCCCode}
                                    </td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-slate-700 font-medium">{n.TenNCC}</td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-slate-500">{n.DiaChi ?? "-"}</td>
                                    <td className="py-3 border-y text-center border-slate-100 group-hover:border-slate-200 text-slate-700">{n.SoDienThoai}</td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-slate-500">{n.GhiChu ?? "-"}</td>
                                    <td className="py-3 px-4 text-right border-y border-r border-slate-100 rounded-r-lg group-hover:border-slate-200 w-px whitespace-nowrap">
                                        <div className="inline-flex items-center gap-2">
                                            {(userRole === "manager") && (
                                                <button
                                                    onClick={() => openEdit(n)}
                                                    className="p-2 rounded-md text-slate-600 hover:bg-slate-200 cursor-pointer">
                                                    <Edit size={18} />
                                                </button>
                                            )}
                                            {userRole === "manager" && (
                                                <button
                                                    onClick={() => openDelete(n)}
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
        </>
    );
}