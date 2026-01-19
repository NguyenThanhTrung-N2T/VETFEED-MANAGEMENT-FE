"use client";

import React, { useEffect, useState, useCallback } from "react";
import Modal from "@/components/ui/Modal";
import { Plus, X, Loader2 } from "lucide-react";
import { CongNoTongHopResponse, CongNoHistoryResponse, CreateCongNoRequest } from "@/client/types.gen";
import { congNoService } from "@/services/cong-no.service";
import AddCongNoForm from "./AddCongNoForm";
import { toast } from 'sonner';
import AddButton from '@/components/ui/AddButton'
type Props = {
    onClose: () => void;
    onAdd: (data: CreateCongNoRequest) => void;
    congNoSummary: CongNoTongHopResponse;
};

export default function ViewCongNoModal({ onClose, onAdd, congNoSummary }: Props) {
    // History State
    const [history, setHistory] = useState<CongNoHistoryResponse[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    // Add Form State
    const [showAddForm, setShowAddForm] = useState(false);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);

    // 1. Fetch History Logic
    const loadHistory = useCallback(async () => {
        if (!congNoSummary?.maDoiTuong) return;

        try {
            setIsLoadingHistory(true);
            const data = await congNoService.getById(congNoSummary.maDoiTuong);
            setHistory(data);
        } catch (error) {
            console.error("Failed to load history", error);
            toast.error("Đã xảy ra lỗi khi tải dữ liệu!");
        } finally {
            setIsLoadingHistory(false);
        }
    }, [congNoSummary.maDoiTuong]);

    // 2. Load on Mount
    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    return (
        <Modal size="xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Lịch sử công nợ</h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                        Đối tượng: <span className="font-bold text-blue-700">{congNoSummary.tenDoiTuong}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    {!showAddForm && (
                        <AddButton onClick={() => setShowAddForm(true)} label="Thêm phát sinh" className="w-45 gap-2 px-4 py-2 inline-flex"
                        />
                    )}
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Add Transaction Form Section */}
            {showAddForm && (
                <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl animate-in slide-in-from-top-4 duration-300 fade-in">
                    <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                        Tạo phiếu phát sinh mới
                    </h3>
                    <AddCongNoForm
                        maDoiTuong={congNoSummary.maDoiTuong!}
                        onSubmit={onAdd} // Parent handles logic
                        onCancel={() => setShowAddForm(false)}
                        isLoading={isSubmittingForm}
                        submitText={isSubmittingForm ? "Đang lưu..." : "Lưu phiếu"}
                        hanMucCongNo={congNoSummary.hanMucCongNo}
                        duNo={congNoSummary.duNo}
                    />
                </div>
            )}

            {/* History Table */}
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                <table className="w-full text-sm border-separate border-spacing-0">
                    <thead className="sticky top-0 z-20">
                        <tr className="bg-[#E3EDF9] text-slate-700 shadow-sm">
                            {/* Fixed columns */}
                            <th className="px-4 py-3 text-left font-bold text-xs uppercase w-32 tracking-wider">Ngày</th>
                            <th className="px-4 py-3 text-left font-bold text-xs uppercase w-24 tracking-wider">Loại</th>
                            <th className="px-4 py-3 text-left font-bold text-xs uppercase w-28 tracking-wider">Mã phiếu</th>

                            <th className="px-4 py-3 text-left font-bold text-xs uppercase w-25 tracking-wider">
                                Ghi chú
                            </th>

                            <th className="px-4 py-3 text-right font-bold text-xs uppercase text-orange-600 tracking-wider whitespace-nowrap">
                                Phát sinh nợ
                            </th>
                            <th className="px-4 py-3 text-right font-bold text-xs uppercase text-green-700 tracking-wider whitespace-nowrap">
                                Đã thanh toán
                            </th>
                            <th className="px-4 py-3 text-right font-bold text-xs uppercase text-slate-800 tracking-wider whitespace-nowrap">
                                Số dư
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 bg-white">
                        {isLoadingHistory ? (
                            <tr>
                                <td colSpan={7} className="h-64 relative">
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="animate-spin text-blue-500" size={32} />
                                            <span className="text-slate-400 text-xs">Đang tải dữ liệu...</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : history.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-6 text-center text-slate-400">
                                    <p>Chưa có dữ liệu lịch sử</p>
                                </td>
                            </tr>
                        ) : (
                            history.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                                    {/* Date */}
                                    <td className="px-4 py-3 text-slate-600 border-b border-slate-100 group-last:border-0">
                                        {row.ngay ? new Date(row.ngay).toLocaleDateString("vi-VN") : "-"}
                                    </td>
                                    {/* Type */}
                                    <td className="px-4 py-3 border-b border-slate-100 group-last:border-0">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border shadow-sm ${row.loaiPhieu === "PB" ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-green-50 text-green-700 border-green-100"
                                            }`}>
                                            {row.loaiPhieu ?? "N/A"}
                                        </span>
                                    </td>
                                    {/* Code */}
                                    <td className="px-4 py-3 text-slate-500 font-mono text-xs border-b border-slate-100 group-last:border-0">
                                        {row.maPhieu ?? "-"}
                                    </td>
                                    {/* Note */}
                                    <td className="px-4 py-3 border-b border-slate-100 group-last:border-0">
                                        <div
                                            className="w-25 truncate text-slate-700 cursor-help"
                                            title={row.ghiChu ?? ""}
                                        >
                                            {row.ghiChu ?? "-"}
                                        </div>
                                    </td>

                                    {/* Financial Columns: Added whitespace-nowrap to keep currency nice */}
                                    <td className="px-4 py-3 text-right text-orange-600 font-medium border-b border-slate-100 group-last:border-0 whitespace-nowrap">
                                        {row.phatSinhNo ? row.phatSinhNo.toLocaleString("vi-VN") : "-"}
                                    </td>
                                    <td className="px-4 py-3 text-right text-green-600 font-medium border-b border-slate-100 group-last:border-0 whitespace-nowrap">
                                        {row.daThanhToan ? row.daThanhToan.toLocaleString("vi-VN") : "-"}
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold text-slate-800 border-b border-slate-100 group-last:border-0 whitespace-nowrap">
                                        {row.soDuSau?.toLocaleString("vi-VN") ?? "-"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Modal>
    );
}