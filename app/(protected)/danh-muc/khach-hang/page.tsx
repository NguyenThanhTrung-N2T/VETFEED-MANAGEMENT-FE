"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Search, ChevronDown, Plus, Eye } from "lucide-react";
import { KhachHangDTO, LoaiKhachHang } from "@/types";
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
    const [openAddModal, setOpenAddModal] = useState(false);

    // TODO: Replace with real data fetching
    // Example: const { data: khachHangs, isLoading } = useSWR('/api/khach-hang', fetcher);
    const khachHangs = useMemo(() => MOCK_KhachHang, []);

    const filteredData = khachHangs.filter((c) =>
        `${c.TenKH} ${c.SoDienThoai ?? ""} ${c.LoaiKhachHang ?? ""}`
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
                    <div className="text-2xl text-black">Danh sách khách hàng</div>

                    <button
                        onClick={() => setOpenAddModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                                bg-[#3f861e] text-white text-sm font-medium
                                hover:bg-[#529E29] transition-colors leading-none justify-center w-30"
                    >
                        <Plus size={16} className="font-white" /><span>Thêm</span>
                    </button>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-xs text-slate-700 uppercase tracking-wider border-b border-slate-100 bg-[#E3EDF9] border-separate">
                            <th className="py-3 pl-3 rounded-l-xl">Mã KH</th>
                            <th className="py-3">Họ tên</th>
                            <th className="py-3">Loại KH</th>
                            <th className="py-3">Số điện thoại</th>
                            <th className="py-3 text-right">Tổng mua (VNĐ)</th>
                            <th className="py-3 text-right">Công nợ (VNĐ)</th>
                            <th className="py-3 px-4 text-right rounded-r-xl w-px whitespace-nowrap">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {filteredData.map((c) => (
                            <tr
                                key={c.MaKH}
                                className="hover:bg-slate-100 transition-colors last:border-0 odd:bg-white even:bg-[#E3EDF9]"
                            >
                                <td className="py-3 pl-3 font-medium text-slate-700 rounded-l-xl">
                                    {c.MaKHCode}
                                </td>
                                <td className="py-3 font-medium text-slate-700">
                                    {c.TenKH}
                                </td>
                                <td className="py-3 text-slate-600">{c.LoaiKhachHang ? loaiKhachHangMap[c.LoaiKhachHang] : "-"}</td>
                                <td className="py-3 text-slate-600">{c.SoDienThoai ?? "-"}</td>
                                <td className="py-3 text-right font-medium text-slate-800">
                                    {c.TongMua.toLocaleString("vi-VN")}
                                </td>
                                <td className="py-3 text-right font-medium text-red-600">
                                    {c.CongNoHienTai.toLocaleString("vi-VN")}
                                </td>
                                <td className="py-3 px-4 text-right rounded-r-xl w-px whitespace-nowrap">
                                    <div className="inline-flex items-center gap-2">
                                        <button className="p-2 rounded-md text-blue-600 hover:bg-blue-50">
                                            <Eye size={18} />
                                        </button>
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
            </div >
        </>
    );
}