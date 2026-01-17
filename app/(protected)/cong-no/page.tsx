"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus, Edit, Trash2, ChevronDown, Eye, Filter } from "lucide-react";
import { CongNoHistoryResponse, CongNoTongHopResponse, CreateCongNoRequest } from "@/client/types.gen";
import { congNoService } from "@/services/cong-no.service";
import ViewCongNoModal from "@/components/cong-no/ViewCongNoModal";
import AddCongNoModal from "@/components/cong-no/AddCongNoModal";
import AddButton from "@/components/ui/AddButton";
import { toast } from 'sonner';

const filterOptions = [
    { value: "ALL", label: "Tất cả" },
    { value: "KHACH_HANG", label: "Khách hàng" },
    { value: "NHA_CUNG_CAP", label: "Nhà cung cấp" },
];

export default function CongNoPage() {
    const [query, setQuery] = useState("");
    const [filterType, setFilterType] = useState<"ALL" | "KHACH_HANG" | "NHA_CUNG_CAP">("ALL");
    const [isLoading, setIsLoading] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState<Boolean>(false);
    const [userRole] = useState("manager");
    const [congNoData, setCongNoData] = useState<CongNoTongHopResponse[]>([]);
    const [modalType, setModalType] = useState<'filter' | 'add' | 'view' | null>(null);
    const [selectedItem, setSelectedItem] = useState<CongNoTongHopResponse | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await congNoService.getAll();
            setCongNoData(data);
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi tải dữ liệu!");
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const filteredData = congNoData.filter((d) =>
        `${d.tenDoiTuong}`
            .toLowerCase()
            .includes(query.toLowerCase())
    );

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
    const formatDate = (date?: string | null) => (date ? new Date(date).toLocaleDateString("vi-VN") : "");

    // --- Modal States ---
    const openAdd = () => {
        setModalType('add');
    };
    const openView = (congNoSummary: CongNoTongHopResponse) => {
        setSelectedItem(congNoSummary);
        setModalType('view');
    };
    const openFilter = () => {
        setModalType('filter');
    };
    const closeModal = () => {
        setModalType(null);
        setSelectedItem(null);
    };
    // --- CRUD Handlers ---
    const handleCreate = async (newData: CreateCongNoRequest) => {
        try {
            await congNoService.create(newData);
            toast.success("Tạo công nợ mới thành công!");
            await fetchData();
            closeModal();
        } catch (error: any) {
            toast.error(error as string);
            throw error;
        }
    };
    const renderType = (type: string | null | undefined) => {
        if (!type) return null;

        const isNhaCungCap = type === "NHA_CUNG_CAP";

        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${isNhaCungCap
                    ? "bg-blue-100 text-blue-700"
                    : "bg-violet-100 text-violet-700"
                    }`}
            >
                {isNhaCungCap ? "NCC" : "KH"}
            </span>
        );
    };
    const getDuNoClass = (duNo?: number) => {
        const value = duNo ?? 0;
        return value > 0 ? "text-red-600" : "text-green-600";
    };
    return (
        <>
            {/* Search + Filter */}
            <div className="flex w-full justify-end mb-6">
                <div className="flex shadow-sm rounded-md bg-white border-slate-200">
                    {/* Filter Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="w-40 px-4 py-2 text-sm font-medium flex items-center justify-between gap-2 bg-[#25396f] text-white rounded-l-lg hover:bg-[#1e2e5a] transition-colors shadow-md"
                        >
                            {/* Wrap text in a span to control truncation if it gets too long */}
                            <span className="truncate">
                                {filterOptions.find((opt) => opt.value === filterType)?.label}
                            </span>

                            {/* flex-shrink-0 ensures the icon never gets squished */}
                            <ChevronDown size={16} className="shrink-0 ml-2" />
                        </button>
                        {isFilterOpen && (
                            <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
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
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-72 py-2 pl-4 pr-10 text-sm border-0 outline-none h-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                </div>
            </div>
            {/* Content Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Card Header */}
                <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            Danh sách công nợ
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
                    <table className="w-full text-sm border-separate border-spacing-y-1 table-fixed min-w-200">
                        <thead>
                            <tr className="text-left text-xs font-semibold bg-[#e9eff6] text-slate-800 uppercase tracking-wider">
                                <th className="py-3 pl-3 rounded-l-lg w-[10%]">Mã đối tượng</th>
                                <th className="py-3 w-[22%]">Tên</th>
                                <th className="py-3 w-[10%]">Đối tượng</th>
                                <th className="py-3 w-[12%]">Tổng phát sinh</th>
                                <th className="py-3 w-[12%]">Đã thanh toán</th>
                                <th className="py-3 w-[12%]">Dư nợ</th>
                                <th className="py-3 text-center w-[10%]">Hạn thanh toán</th>
                                <th className="py-3 px-4 text-right rounded-r-lg whitespace-nowrap w-[12%]">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? [...Array(5)].map((_, i) => (
                                <tr key={i}
                                    className="bg-white shadow-sm rounded-lg animate-pulse">
                                    {/* Mã đối tượng */}
                                    <td className="py-3 pl-3 rounded-l-lg w-[10%]">
                                        <div className="h-4 w-20 bg-slate-200 rounded" />
                                    </td>

                                    {/* Tên */}
                                    <td className="py-3 w-[22%]">
                                        <div className="h-4 w-44 bg-slate-200 rounded" />
                                    </td>

                                    {/* Đối tượng */}
                                    <td className="py-3 w-[10%]">
                                        <div className="h-4 w-24 bg-slate-200 rounded" />
                                    </td>

                                    {/* Tổng phát sinh */}
                                    <td className="py-3 w-[12%]">
                                        <div className="h-4 w-24 bg-slate-200 rounded" />
                                    </td>

                                    {/* Đã thanh toán */}
                                    <td className="py-3 w-[12%]">
                                        <div className="h-4 w-24 bg-slate-200 rounded " />
                                    </td>

                                    {/* Dư nợ */}
                                    <td className="py-3 w-[12%]">
                                        <div className="h-4 w-24 bg-slate-200 rounded" />
                                    </td>

                                    {/* Hạn thanh toán */}
                                    <td className="py-3 text-center w-[10%]">
                                        <div className="h-4 w-28 bg-slate-200 rounded" />
                                    </td>

                                    {/* Hành động */}
                                    <td className="py-3 px-4 text-right rounded-r-lg w-[12%] whitespace-nowrap">
                                        <div className="flex justify-end gap-2">
                                            <div className="h-8 w-8 bg-slate-200 rounded-md"></div>
                                            <div className="h-8 w-8 bg-slate-200 rounded-md"></div>
                                        </div>
                                    </td>
                                </tr>
                            )) : filteredData.map((item) => (
                                <tr
                                    key={item.maDoiTuong}
                                    className="group hover:bg-slate-50 transition-colors odd:bg-white even:bg-[#f1f5f9] text-left">
                                    <td className="py-3 pl-3 font-medium text-slate-700 border-y border-l border-slate-100 rounded-l-lg group-hover:border-slate-200">{item.maDoiTuongCode}</td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-slate-700 font-medium">{item.tenDoiTuong}</td>
                                    <td className="py-3 ">{renderType(item.loaiDoiTuong)}</td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-slate-500">{formatCurrency(item.tongPhatSinh ?? 0)}</td>
                                    <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-slate-500">{formatCurrency(item.daThanhToan ?? 0)}</td>
                                    <td
                                        className={`py-3 border-y border-slate-100 group-hover:border-slate-200 ${getDuNoClass(item.duNo)}`}
                                    >
                                        {formatCurrency(item.duNo ?? 0)}
                                    </td>
                                    <td className="py-3 text-center border-y border-slate-100 group-hover:border-slate-200 font-medium text-slate-700 ">{formatDate(item.hanThanhToanGanNhat)}</td>
                                    <td className="py-3 px-4 text-right border-y border-r border-slate-100 rounded-r-lg group-hover:border-slate-200 whitespace-nowrap">
                                        <div className="inline-flex items-center gap-2 justify-end">
                                            <button
                                                onClick={() => openView(item)}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                                                title="Xem lịch sử"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!isLoading && filteredData.length === 0 && (
                    <div className="text-center py-10 text-gray-400">Không tìm thấy dữ liệu</div>
                )}
            </div>
            {/* ViewCongNoModal */}
            {modalType === 'view' && selectedItem && (
                <ViewCongNoModal
                    onClose={closeModal}
                    onAdd={handleCreate}
                    congNoSummary={selectedItem}
                />
            )}
            {/* AddCongNoModal */}
            {modalType === 'add' && <AddCongNoModal
                onClose={closeModal}
                onAdd={handleCreate}
            />}
        </>
    );
}
