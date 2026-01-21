"use client";

import { useState, useEffect } from "react";
import { Filter, RotateCcw } from "lucide-react";
import Modal from "@/components/ui/Modal"; // Adjust path if your Modal is elsewhere

// Define the shape of your filter object
export type NhaCungCapFilterValues = {
    tenNCC?: string;
    soDienThoai?: string;
    diaChi?: string;
    trangThai?: "ALL" | "HOAT_DONG" | "NGUNG_HOAT_DONG";
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: NhaCungCapFilterValues) => void;
    onReset: () => void;
    initialFilters?: NhaCungCapFilterValues;
};

export default function FilterNCCModal({
    isOpen,
    onClose,
    onApply,
    onReset,
    initialFilters
}: Props) {
    // 1. Local state for the filter inputs
    const [filters, setFilters] = useState<NhaCungCapFilterValues>({
        tenNCC: "",
        soDienThoai: "",
        diaChi: "",
        trangThai: "ALL",
    });

    // 2. Sync state when modal opens
    useEffect(() => {
        if (isOpen) {
            if (initialFilters) {
                setFilters(initialFilters);
            } else {
                setFilters({
                    tenNCC: "",
                    soDienThoai: "",
                    diaChi: "",
                    trangThai: "ALL",
                });
            }
        }
    }, [isOpen, initialFilters]);

    // 3. Handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const handleReset = () => {
        setFilters({
            tenNCC: "",
            soDienThoai: "",
            diaChi: "",
            trangThai: "ALL",
        });
        onReset();
    };

    if (!isOpen) return null;

    return (
        /* We use size="md" which maps to max-w-lg (approx 512px), fitting the design well */
        <Modal size="md">
            <div className="flex flex-col h-full">

                {/* --- HEADER --- */}
                <div className="flex flex-col items-center justify-center pt-2 mb-6">
                    <Filter className="w-10 h-10 text-slate-700 mb-3" strokeWidth={1.5} />
                    <h2 className="text-xl font-bold text-slate-800">Lọc nhà cung cấp</h2>
                </div>

                {/* --- BODY --- */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">

                        {/* 1. Tên nhà cung cấp */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500">
                                Tên nhà cung cấp
                            </label>
                            <input
                                name="tenNCC"
                                value={filters.tenNCC || ""}
                                onChange={handleChange}
                                placeholder="Nhập tên NCC..."
                                className="h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                            />
                        </div>

                        {/* 2. Số điện thoại */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500">
                                Số điện thoại
                            </label>
                            <input
                                name="soDienThoai"
                                value={filters.soDienThoai || ""}
                                onChange={handleChange}
                                placeholder="Nhập SĐT..."
                                className="h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                            />
                        </div>

                        {/* 3. Địa chỉ */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500">
                                Địa chỉ
                            </label>
                            <input
                                name="diaChi"
                                value={filters.diaChi || ""}
                                onChange={handleChange}
                                placeholder="Nhập địa chỉ..."
                                className="h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                            />
                        </div>

                        {/* 4. Trạng thái */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500">
                                Trạng thái
                            </label>
                            <div className="relative">
                                <select
                                    name="trangThai"
                                    value={filters.trangThai || "ALL"}
                                    onChange={handleChange}
                                    className="w-full h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none transition-all appearance-none"
                                >
                                    <option value="ALL">Tất cả</option>
                                    <option value="HOAT_DONG">Hoạt động</option>
                                    <option value="NGUNG_HOAT_DONG">Ngưng hoạt động</option>
                                </select>
                                {/* Custom arrow */}
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- FOOTER ACTIONS --- */}
                <div className="flex items-center justify-between gap-3 pt-2">
                    {/* Apply Button (Green) */}
                    <button
                        onClick={handleApply}
                        className="flex-1 h-11 bg-[#3f861e] hover:bg-[#529E29] text-white font-bold rounded-lg transition-colors shadow-sm active:scale-[0.98]"
                    >
                        Áp dụng lọc
                    </button>

                    {/* Reset Button (Icon only) */}
                    <button
                        onClick={handleReset}
                        title="Đặt lại bộ lọc"
                        className="h-11 w-14 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                    >
                        <RotateCcw size={20} />
                    </button>

                    {/* Close Button (Red Outline) */}
                    <button
                        onClick={onClose}
                        className="flex-1 h-11 bg-white border border-red-500 text-red-600 hover:bg-red-50 font-bold rounded-lg transition-colors active:scale-[0.98]"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </Modal>
    );
}