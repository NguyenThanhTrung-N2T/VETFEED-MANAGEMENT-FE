"use client";

import { useState, useEffect } from "react";
import { Filter, RotateCcw } from "lucide-react";
import Modal from "@/components/ui/Modal";

export type CongNoFilterValues = {
    tenDoiTuong?: string;
    loaiDoiTuong?: string; // "ALL" | "KHACH_HANG" | "NHA_CUNG_CAP"
    trangThaiNo?: string;  // "ALL" | "CON_NO" | "HET_NO"
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: CongNoFilterValues) => void;
    onReset: () => void;
    initialFilters?: CongNoFilterValues;
};

export default function FilterCongNoModal({
    isOpen,
    onClose,
    onApply,
    onReset,
    initialFilters
}: Props) {
    // 1. Local state
    const [filters, setFilters] = useState<CongNoFilterValues>({
        tenDoiTuong: "",
        loaiDoiTuong: "ALL",
        trangThaiNo: "ALL"
    });

    // 2. Sync state on open
    useEffect(() => {
        if (isOpen) {
            setFilters(initialFilters || {
                tenDoiTuong: "",
                loaiDoiTuong: "ALL",
                trangThaiNo: "ALL"
            });
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
            tenDoiTuong: "",
            loaiDoiTuong: "ALL",
            trangThaiNo: "ALL"
        });
        onReset();
    };

    if (!isOpen) return null;

    return (
        <Modal size="md">
            <div className="flex flex-col h-full">
                {/* --- HEADER --- */}
                <div className="flex flex-col items-center justify-center pt-2 mb-6">
                    <Filter className="w-10 h-10 text-slate-700 mb-3" strokeWidth={1.5} />
                    <h2 className="text-xl font-bold text-slate-800">Lọc công nợ</h2>
                </div>

                {/* --- BODY --- */}
                <div className="mb-8">
                    <div className="flex flex-col gap-4">

                        {/* 1. Tên đối tượng */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500">
                                Tên đối tượng
                            </label>
                            <input
                                name="tenDoiTuong"
                                value={filters.tenDoiTuong || ""}
                                onChange={handleChange}
                                placeholder="Nhập tên..."
                                className="h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                            />
                        </div>

                        {/* 2. Loại đối tượng */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500">
                                Loại đối tượng
                            </label>
                            <div className="relative">
                                <select
                                    name="loaiDoiTuong"
                                    value={filters.loaiDoiTuong || "ALL"}
                                    onChange={handleChange}
                                    className="w-full h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none transition-all appearance-none"
                                >
                                    <option value="ALL">Tất cả</option>
                                    <option value="KHACH_HANG">Khách hàng</option>
                                    <option value="NHA_CUNG_CAP">Nhà cung cấp</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* 3. Trạng thái nợ */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500">
                                Trạng thái nợ
                            </label>
                            <div className="relative">
                                <select
                                    name="trangThaiNo"
                                    value={filters.trangThaiNo || "ALL"}
                                    onChange={handleChange}
                                    className="w-full h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none transition-all appearance-none"
                                >
                                    <option value="ALL">Tất cả</option>
                                    <option value="CON_NO">Còn nợ</option>
                                    <option value="HET_NO">Hết nợ</option>
                                </select>
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
                    <button
                        onClick={handleApply}
                        className="flex-1 h-11 bg-[#3f861e] hover:bg-[#529E29] text-white font-bold rounded-lg transition-colors shadow-sm active:scale-[0.98]"
                    >
                        Áp dụng lọc
                    </button>

                    <button
                        onClick={handleReset}
                        title="Đặt lại bộ lọc"
                        className="h-11 w-14 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                    >
                        <RotateCcw size={20} />
                    </button>

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