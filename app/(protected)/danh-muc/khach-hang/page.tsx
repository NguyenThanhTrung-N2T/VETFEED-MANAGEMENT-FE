"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Search, ChevronDown, Plus, Eye, Filter } from "lucide-react";
import { KhachHangDTO, LoaiKhachHang } from "@/types";
import AddKhachHangModal from "@/components/khach-hang/AddKhachHangModal";
import AddButton from "@/components/ui/AddButton";

const loaiKhachHangMap: Record<LoaiKhachHang, string> = { CA_NHAN: "Cá nhân", TRANG_TRAI: "Trang trại", DAI_LY: "Đại lý", };
// TODO: Replace with real API call - fetch from /api/khach-hang
const MOCK_KhachHang: KhachHangDTO[] = [
    {
        MaKH: "kh-0001-0000-0000-000000000001",
        MaKHCode: "KH001",
        TenKH: "Lê Tú An",
        SoDienThoai: "0123781283",
        DiaChi: "HCMC",
        LoaiKhachHang: "CA_NHAN",
        HanMucCongNo: null,
        TongMua: 6000000,
        CongNoHienTai: 0,
        TrangThai: "HOAT_DONG",
        GhiChu: null,
        NgayTao: new Date().toISOString(),
    },
    {
        MaKH: "kh-0002-0000-0000-000000000002",
        MaKHCode: "KH002",
        TenKH: "Trần Hồng Xuân",
        SoDienThoai: "0138434121",
        DiaChi: "Dong Nai",
        LoaiKhachHang: "TRANG_TRAI",
        HanMucCongNo: 10000000,
        TongMua: 28500000,
        CongNoHienTai: 9000000,
        TrangThai: "HOAT_DONG",
        GhiChu: null,
        NgayTao: new Date().toISOString(),
    },
    {
        MaKH: "kh-0003-0000-0000-000000000003",
        MaKHCode: "KH003",
        TenKH: "Đoàn Quốc Tuấn",
        SoDienThoai: "0979406367",
        DiaChi: "HCMC",
        LoaiKhachHang: "CA_NHAN",
        HanMucCongNo: null,
        TongMua: 6000000,
        CongNoHienTai: 0,
        TrangThai: "HOAT_DONG",
        GhiChu: null,
        NgayTao: new Date().toISOString(),
    },
    {
        MaKH: "kh-0004-0000-0000-000000000004",
        MaKHCode: "KH004",
        TenKH: "Trần Thị Bích",
        SoDienThoai: "0979406555",
        DiaChi: "HCMC",
        LoaiKhachHang: "CA_NHAN",
        HanMucCongNo: null,
        TongMua: 6000000,
        CongNoHienTai: 0,
        TrangThai: "HOAT_DONG",
        GhiChu: null,
        NgayTao: new Date().toISOString(),
    },
    {
        MaKH: "kh-0005-0000-0000-000000000005",
        MaKHCode: "KH005",
        TenKH: "Trần Thị Kim Tuyết",
        SoDienThoai: "0979406555",
        DiaChi: "HCMC",
        LoaiKhachHang: "CA_NHAN",
        HanMucCongNo: null,
        TongMua: 6000000,
        CongNoHienTai: 0,
        TrangThai: "HOAT_DONG",
        GhiChu: null,
        NgayTao: new Date().toISOString(),
    },
    {
        MaKH: "kh-0006-0000-0000-000000000006",
        MaKHCode: "KH006",
        TenKH: "Trần Thị Kim Nhung",
        SoDienThoai: "0979406555",
        DiaChi: "HCMC",
        LoaiKhachHang: "CA_NHAN",
        HanMucCongNo: null,
        TongMua: 6000000,
        CongNoHienTai: 0,
        TrangThai: "HOAT_DONG",
        GhiChu: null,
        NgayTao: new Date().toISOString(),
    },
    {
        MaKH: "kh-0007-0000-0000-000000000007",
        MaKHCode: "KH007",
        TenKH: "Trần Anh",
        SoDienThoai: "0979406555",
        DiaChi: "HCMC",
        LoaiKhachHang: "CA_NHAN",
        HanMucCongNo: null,
        TongMua: 6000000,
        CongNoHienTai: 0,
        TrangThai: "HOAT_DONG",
        GhiChu: null,
        NgayTao: new Date().toISOString(),
    }
];

export default function KhachHangPage() {
    const [query, setQuery] = useState("");
    const [khachHangData, setKhachHangData] = useState<KhachHangDTO[]>(MOCK_KhachHang);

    const [modalType, setModalType] = useState<'filter' | 'delete' | 'add' | 'view' | null>(null);
    const [selectedItem, setSelectedItem] = useState<KhachHangDTO | null>(null);
    // TODO: Replace with real data fetching
    // Example: const { data: khachHangs, isLoading } = useSWR('/api/khach-hang', fetcher);
    const khachHangs = khachHangData;

    const filteredData = khachHangs.filter((c) =>
        `${c.TenKH} ${c.SoDienThoai ?? ""} ${c.LoaiKhachHang ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase())
    );

    // TODO: Get real role from auth/session
    // --- Modal States ---
    const openAdd = () => {
        setModalType('add');
    };
    const openView = (khachHang: KhachHangDTO) => {
        setSelectedItem(khachHang);
        setModalType('view');
    };
    const openDelete = (khachHang: KhachHangDTO) => {
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
    const handleCreate = async (newData: KhachHangDTO) => {
        // MOCK
        console.log("Saving new KhachHang:", newData);
        setKhachHangData((prev) => [newData, ...prev]); // Add to top of list

        // Real App (API Call)
        /*
        try {
            await fetch('/api/khachHang', {
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
    const handleUpdate = async (updatedData: KhachHangDTO) => {
        // MOCK
        console.log("Updating kho:", updatedData);
        setKhachHangData((prev) =>
            prev.map((k) => (k.MaKH === updatedData.MaKH ? updatedData : k))
        );
        // Real App (API Call)    
    };
    const handleDelete = async (id: string) => {
        // API Call here...
        setKhachHangData(prev => prev.filter(k => k.MaKH !== id));
    };
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
                            Danh sách khách hàng
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

                <div className="overflow-x-auto px-6 pb-6">
                    <table className="w-full text-sm border-separate border-spacing-y-1">
                        <thead>
                            <tr className="text-left text-xs font-semibold bg-[#e9eff6] text-slate-800 uppercase tracking-wider">
                                <th className="py-3 pl-3 rounded-l-lg">Mã KH</th>
                                <th className="py-3">Họ tên</th>
                                <th className="py-3">Loại KH</th>
                                <th className="py-3">Số điện thoại</th>
                                <th className="py-3 text-right">Tổng mua (VNĐ)</th>
                                <th className="py-3 text-right">Công nợ (VNĐ)</th>
                                <th className="py-3 px-4 text-right rounded-r-lg w-px whitespace-nowrap">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredData.map((c) => (
                                <tr
                                    key={c.MaKH}
                                    className="group hover:bg-slate-50 transition-colors odd:bg-white even:bg-[#f1f5f9]"
                                >
                                    <td className="py-3 pl-3 font-medium text-slate-700 border-y border-l border-slate-100 rounded-l-lg group-hover:border-slate-200">
                                        {c.MaKHCode}
                                    </td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-slate-700 font-medium">
                                        {c.TenKH}
                                    </td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 font-medium text-slate-700">{c.LoaiKhachHang ? loaiKhachHangMap[c.LoaiKhachHang] : "-"}</td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 font-medium text-slate-700">{c.SoDienThoai ?? "-"}</td>
                                    <td className="py-3 text-right font-medium text-slate-800">
                                        {c.TongMua.toLocaleString("vi-VN")}
                                    </td>
                                    <td className="py-3 text-right font-medium text-red-600">
                                        {c.CongNoHienTai.toLocaleString("vi-VN")}
                                    </td>
                                    <td className="py-3 px-4 text-right border-y border-r border-slate-100 rounded-r-lg group-hover:border-slate-200 w-px whitespace-nowrap">
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div >
            {/* Add Modal */}
            {modalType === 'add' && (
                <AddKhachHangModal
                    onClose={() => closeModal()}
                    onAdd={handleCreate}
                />
            )}
        </>
    );
}