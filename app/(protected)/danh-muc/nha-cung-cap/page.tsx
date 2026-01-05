"use client";

import React, { useMemo, useState } from "react";
import { Edit, Trash2, Search, ChevronDown, Plus } from "lucide-react";
import { NhaCungCapDTO } from "@/types";

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
    const [openAddModal, setOpenAddModal] = useState(false);
    // TODO: Replace with real data fetching
    // Example: const { data: nhaCungCaps, isLoading } = useSWR('/api/nha-cung-cap', fetcher);
    const nhaCungCaps = useMemo(() => MOCK_NhaCungCap, []);

    const filteredData = nhaCungCaps.filter((n) =>
        `${n.TenNCC} ${n.DiaChi ?? ""} ${n.SoDienThoai}`
            .toLowerCase()
            .includes(query.toLowerCase())
    );

    // TODO: Get real role from auth/session
    const userRole: "manager" | "staff" = "manager";

    return (
        <>
            {/* Search Bar */}
            <div className="flex justify-end w-full">
                <div className="flex shadow-sm rounded-md overflow-hidden bg-white border-slate-200">
                    {/* Dropdown */}
                    <button className="flex items-center gap-2 bg-[#253D90] text-white px-4 py-2 text-sm font-medium hover:bg-[#1e3276] transition-colors">
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
                    <div className="text-2xl text-black">Danh sách nhà cung cấp</div>

                    {(userRole === "manager") && (<button
                        onClick={() => setOpenAddModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                                bg-[#3f861e] text-white text-sm font-medium
                                hover:bg-[#529E29] transition-colors leading-none justify-center w-30"
                    >
                        <Plus size={16} className="font-white" /><span>Thêm</span>
                    </button>)}
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-xs text-slate-700 uppercase tracking-wider border-b border-slate-100 bg-[#E3EDF9] border-separate">
                            <th className="py-3 pl-3 rounded-l-xl">Mã NCC</th>
                            <th className="py-3">Nhà cung cấp</th>
                            <th className="py-3">Địa chỉ</th>
                            <th className="py-3">Số điện thoại</th>
                            <th className="py-3">Ghi chú</th>
                            <th className="py-3 px-4 text-right rounded-r-xl w-px whitespace-nowrap">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {filteredData.map((n) => (
                            <tr
                                key={n.MaNCC}
                                className="hover:bg-slate-100 transition-colors last:border-0 odd:bg-white even:bg-[#E3EDF9]"
                            >
                                <td className="py-3 pl-3 font-medium text-slate-700 rounded-l-xl">
                                    {n.MaNCCCode}
                                </td>
                                <td className="py-3 text-slate-600">{n.TenNCC}</td>
                                <td className="py-3 text-slate-600">{n.DiaChi ?? "-"}</td>
                                <td className="py-3 text-slate-600">{n.SoDienThoai}</td>
                                <td className="py-3 text-slate-600">{n.GhiChu ?? "-"}</td>
                                <td className="py-3 px-4 text-right rounded-r-xl w-px whitespace-nowrap">
                                    <div className="inline-flex items-center gap-2">
                                        {(userRole === "manager") && (
                                            <button className="p-2 rounded-md text-slate-600 hover:bg-slate-200">
                                                <Edit size={18} />
                                            </button>
                                        )}
                                        {userRole === "manager" && (
                                            <button className="p-2 rounded-md text-red-600 hover:bg-red-50">
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
        </>
    );
}