"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { Plus, X } from "lucide-react";
import { CongNoSummary, CongNoHistoryList } from "@/types/index";
import AddCongNoForm from "./AddCongNoForm";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    congNoSummary: CongNoSummary; // object info (tenDoiTuong, maDoiTuong)
};

// MOCK fetch for history (replace with your API)
async function fetchCongNoHistory(maDoiTuong: string): Promise<CongNoHistoryList> {
    return [
        {
            maCongNo: "1",
            ngay: "2025-01-01",
            loaiPhieu: "PB",
            maPhieu: "PB001",
            dienGiai: "Bán hàng",
            phatSinhNo: 10000000,
            phatSinhCo: 0,
            soDuSau: 10000000,
        },
        {
            maCongNo: "2",
            ngay: "2025-01-05",
            loaiPhieu: "PT",
            maPhieu: "PT003",
            dienGiai: "Thu tiền",
            phatSinhNo: 0,
            phatSinhCo: 4000000,
            soDuSau: 6000000,
        },
    ];
}

export default function ViewCongNoModal({ isOpen, onClose, congNoSummary }: Props) {
    const [history, setHistory] = useState<CongNoHistoryList>([]);
    const [showAddTransaction, setShowAddTransaction] = useState(false);
    const [maPhieu, setMaPhieu] = useState("");
    const [soTien, setSoTien] = useState("");
    const [ngayPhatSinh, setNgayPhatSinh] = useState(new Date().toISOString().slice(0, 16));
    const [hanThanhToan, setHanThanhToan] = useState("");
    const [ghiChu, setGhiChu] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        if (isOpen) {
            fetchCongNoHistory(congNoSummary.maDoiTuong).then(setHistory);
        }
    }, [isOpen, congNoSummary.maDoiTuong]);

    if (!isOpen) return null;

    // ADD THIS FUNCTION
    const handleAddTransaction = async () => {
        setError("");
        const soTienNum = parseFloat(soTien.replace(/[.,\s]/g, ""));

        if (isNaN(soTienNum) || soTienNum === 0) {
            setError("Số tiền không hợp lệ");
            return;
        }

        try {
            setSubmitting(true);

            // TODO: Call your API here
            // await createCongNoTransaction({
            //     loaiDoiTuong: congNoSummary.loaiDoiTuong,
            //     maDoiTuong: congNoSummary.maDoiTuong,
            //     maPhieu: maPhieu || null,
            //     soTien: soTienNum,
            //     ngayPhatSinh: new Date(ngayPhatSinh).toISOString(),
            //     hanThanhToan: hanThanhToan || null,
            //     ghiChu: ghiChu || null,
            // });

            // Refresh history
            const updated = await fetchCongNoHistory(congNoSummary.maDoiTuong);
            setHistory(updated);

            // Reset form
            setShowAddTransaction(false);
            setMaPhieu("");
            setSoTien("");
            setNgayPhatSinh(new Date().toISOString().slice(0, 16));
            setHanThanhToan("");
            setGhiChu("");
        } catch (err: any) {
            setError(err?.message || "Lỗi khi thêm phát sinh");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Lịch sử công nợ</h2>
                    <p className="text-sm text-slate-500 font-medium">
                        Đối tượng: <span className="font-bold">{congNoSummary.tenDoiTuong}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowAddTransaction(!showAddTransaction)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showAddTransaction
                            ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                            : "bg-[#3f861e] text-white hover:bg-[#529E29]"
                            }`}
                    >
                        <Plus size={16} />
                        <span>{showAddTransaction ? "Hủy" : "Thêm phát sinh"}</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Add Transaction Form */}
            {showAddTransaction && (
                <div className="mb-8 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Số tiền (VND) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={soTien}
                                onChange={(e) => setSoTien(e.target.value)}
                                placeholder="Nhập số tiền (dương: tăng nợ, âm: giảm nợ)"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                inputMode="numeric"
                            />
                            <p className="text-xs text-slate-500 mt-1">VD: 1000000 hoặc -500000</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Mã phiếu (tùy chọn)
                            </label>
                            <input
                                type="text"
                                value={maPhieu}
                                onChange={(e) => setMaPhieu(e.target.value)}
                                placeholder="UUID phiếu liên quan"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Ngày phát sinh <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                value={ngayPhatSinh}
                                onChange={(e) => setNgayPhatSinh(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Hạn thanh toán (tùy chọn)
                            </label>
                            <input
                                type="date"
                                value={hanThanhToan}
                                onChange={(e) => setHanThanhToan(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Ghi chú (tùy chọn)
                            </label>
                            <textarea
                                value={ghiChu}
                                onChange={(e) => setGhiChu(e.target.value)}
                                rows={1}
                                placeholder="Nhập ghi chú..."
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-center mt-4">
                        <button
                            onClick={handleAddTransaction}
                            disabled={submitting}
                            className="px-6 py-2.5 bg-[#3f861e] text-white font-medium rounded-lg hover:bg-[#529E29] transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Đang xử lý..." : "Xác nhận"}
                        </button>
                    </div>
                </div>
            )}

            {/* Buy history */}
            {history.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
                    Không có dữ liệu lịch sử
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                    {/* Scrollable wrapper */}
                    <div className="max-h-96 overflow-auto"> {/* max-h-96 = ~24rem; adjust as needed */}
                        <table className="w-full text-sm border-separate border-spacing-0">
                            <thead>
                                <tr className="bg-[#E3EDF9] text-slate-700">
                                    <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs">
                                        Ngày
                                    </th>
                                    <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs">
                                        Loại phiếu
                                    </th>
                                    <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs">
                                        Mã phiếu
                                    </th>
                                    <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs">
                                        Diễn giải
                                    </th>
                                    <th className="px-4 py-3 text-right font-bold uppercase tracking-wider text-xs text-yellow-500">
                                        P.Sinh Nợ
                                    </th>
                                    <th className="px-4 py-3 text-right font-bold uppercase tracking-wider text-xs text-green-700">
                                        P.Sinh Có
                                    </th>
                                    <th className="px-4 py-3 text-right font-bold uppercase tracking-wider text-xs">
                                        Số dư sau
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {history.map((row) => (
                                    <tr
                                        key={row.maCongNo}
                                        className="hover:bg-slate-100 transition-colors odd:bg-white even:bg-[#E3EDF9]"
                                    >
                                        <td className="px-4 py-3.5 text-slate-600 font-medium">
                                            {new Date(row.ngay).toLocaleDateString("vi-VN")}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${row.loaiPhieu === "PB"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-green-100 text-green-700"
                                                    }`}
                                            >
                                                {row.loaiPhieu}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-500 font-mono text-xs">{row.maPhieu}</td>
                                        <td
                                            className="px-4 py-3.5 text-slate-600 max-w-50 truncate"
                                            title={row.dienGiai}
                                        >
                                            {row.dienGiai}
                                        </td>
                                        <td className="px-4 py-3.5 text-right text-yellow-500 font-semibold">
                                            {row.phatSinhNo > 0 ? row.phatSinhNo.toLocaleString("vi-VN") + " ₫" : "-"}
                                        </td>
                                        <td className="px-4 py-3.5 text-right text-green-600 font-semibold">
                                            {row.phatSinhCo > 0 ? row.phatSinhCo.toLocaleString("vi-VN") + " ₫" : "-"}
                                        </td>
                                        <td className="px-4 py-3.5 text-right font-bold text-slate-800">
                                            {row.soDuSau.toLocaleString("vi-VN")} ₫
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </Modal>
    );
}
