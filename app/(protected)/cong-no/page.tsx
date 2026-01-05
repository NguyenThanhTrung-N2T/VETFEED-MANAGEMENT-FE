"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus, Edit, Trash2, ChevronDown, Eye } from "lucide-react";
import { CongNoSummary } from "@/types/index";
import ViewCongNoModal from "@/components/cong-no/ViewCongNoModal";

// Mock data thay cho API
const mockData: CongNoSummary[] = [
    {
        maDoiTuong: "KH1",
        tenDoiTuong: "Lê Tú An",
        loaiDoiTuong: "KHACH_HANG",
        tongPhatSinh: 20000000,
        daThanhToan: 6000000,
        duNo: 14000000,
        coQuaHan: false,
        hanThanhToanGanNhat: "2025-12-31",
    },
    {
        maDoiTuong: "NCC2",
        tenDoiTuong: "Vĩnh Kim",
        loaiDoiTuong: "NHA_CUNG_CAP",
        tongPhatSinh: 20000000,
        daThanhToan: 28500000,
        duNo: -8500000,
        coQuaHan: true,
        hanThanhToanGanNhat: "2025-12-31",
    },
    {
        maDoiTuong: "NCC3",
        tenDoiTuong: "Hoàng Văn Kim",
        loaiDoiTuong: "NHA_CUNG_CAP",
        tongPhatSinh: 20000000,
        daThanhToan: 28500000,
        duNo: -8500000,
        coQuaHan: false,
        hanThanhToanGanNhat: "2026-1-15",
    }
];

const filterOptions = [
    { value: "ALL", label: "Tất cả" },
    { value: "KHACH_HANG", label: "Khách hàng" },
    { value: "NHA_CUNG_CAP", label: "Nhà cung cấp" },
];

export default function CongNoPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<"ALL" | "KHACH_HANG" | "NHA_CUNG_CAP">("ALL");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCongNo, setSelectedCongNo] = useState<CongNoSummary | null>(null);
    const [userRole] = useState("manager"); // Mock user role, replace with real auth logic

    const filteredData = useMemo(() => {
        return mockData.filter((item) => {
            const matchesSearch = item.tenDoiTuong.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterType === "ALL" || item.loaiDoiTuong === filterType;
            return matchesSearch && matchesFilter;
        });
    }, [searchTerm, filterType]);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

    const formatDate = (date?: string | null) => (date ? new Date(date).toLocaleDateString("vi-VN") : "");

    const getLoaiDoiTuongLabel = (type: string) => (type === "KHACH_HANG" ? "KH" : "NCC");

    const handleEdit = (id: string) => console.log("Edit", id);
    const handleDelete = (id: string) => console.log("Delete", id);

    const handleViewHistory = (item: CongNoSummary) => {
        setSelectedCongNo(item);
        setOpenModal(true);
    }

    return (
        <>
            {/* Search + Filter */}
            <div className="flex w-full justify-end">
                <div className="flex shadow-sm rounded-md bg-white border-slate-200">
                    {/* Filter Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center justify-between w-40 bg-[#253D90] text-white px-4 py-2 rounded-l-md transition-all h-full"
                        >
                            {/* Wrap text in a span to control truncation if it gets too long */}
                            <span className="truncate">
                                {filterOptions.find((opt) => opt.value === filterType)?.label}
                            </span>

                            {/* flex-shrink-0 ensures the icon never gets squished */}
                            <ChevronDown size={16} className="shrink-0 ml-2" />
                        </button>
                        {isFilterOpen && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                {filterOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            setFilterType(opt.value as typeof filterType);
                                            setIsFilterOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors 
                                        ${filterType === opt.value ? "bg-blue-50 text-blue-600" : ""
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Search Input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-72 py-2 pl-4 pr-10 text-sm border-0 outline-none h-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                </div>
            </div>
            {/* Table */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="mb-3 flex items-center justify-between">
                    <div className="text-2xl font-semibold">Danh sách công nợ</div>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-xs text-slate-700 uppercase tracking-wider border-b border-slate-100 bg-[#E3EDF9] border-separate">
                            <th className="py-3 pl-3 text-left rounded-l-xl">Mã đối tượng</th>
                            <th className="py-3 text-left">Tên</th>
                            <th className="py-3 text-left">Đối tượng</th>
                            <th className="py-3 text-right">Tổng phát sinh</th>
                            <th className="py-3 text-right">Đã thanh toán</th>
                            <th className="py-3 text-right">Dư nợ</th>
                            <th className="py-3 text-center">Hạn thanh toán</th>
                            <th className="py-3 px-4 text-center rounded-r-xl w-px whitespace-nowrap">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item) => (
                            <tr
                                key={item.maDoiTuong}
                                className="hover:bg-slate-50 transition-colors last:border-0 odd:bg-white even:bg-[#E3EDF9]"
                            >
                                <td className="pl-3 py-3 font-medium text-slate-700 rounded-l-xl">{item.maDoiTuong}</td>
                                <td className="py-3 text-gray-600">{item.tenDoiTuong}</td>
                                <td className="py-3 text-gray-600">{getLoaiDoiTuongLabel(item.loaiDoiTuong)}</td>
                                <td className="py-3 text-right text-gray-600">{formatCurrency(item.tongPhatSinh)}</td>
                                <td className="py-3 text-right text-gray-600">{formatCurrency(item.daThanhToan)}</td>
                                <td
                                    className={`py-3 text-right font-medium ${item.duNo > 0 ? "text-red-600" : "text-green-600"
                                        }`}
                                >
                                    {formatCurrency(item.duNo)}
                                </td>
                                <td className="py-3 text-center text-gray-600">{formatDate(item.hanThanhToanGanNhat)}</td>
                                <td className="py-3 px-4 text-right rounded-r-xl w-px whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleViewHistory(item)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            title="Xem lịch sử"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        {/* {userRole == "manager" && (<button
                                            onClick={() => handleEdit(item.maDoiTuong)}
                                            className="p-2 text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
                                            title="Sửa"
                                        >
                                            <Edit size={18} />
                                        </button>)} */}
                                        {userRole == "manager" && (<button
                                            onClick={() => handleDelete(item.maDoiTuong)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                            title="Xóa"
                                        >
                                            <Trash2 size={18} />
                                        </button>)}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredData.length === 0 && (
                    <div className="text-center py-12 text-gray-500">Không tìm thấy dữ liệu</div>
                )}
            </div>
            {/* ViewCongNoModal */}
            {selectedCongNo && (
                <ViewCongNoModal
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    congNoSummary={selectedCongNo}
                />
            )}
        </>
    );
}
