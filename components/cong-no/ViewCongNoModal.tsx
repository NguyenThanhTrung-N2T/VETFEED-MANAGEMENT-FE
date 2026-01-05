"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { X } from "lucide-react";
import { CongNoSummary, CongNoHistoryList } from "@/types/index";

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

    useEffect(() => {
        if (isOpen) {
            fetchCongNoHistory(congNoSummary.maDoiTuong).then(setHistory);
        }
    }, [isOpen, congNoSummary.maDoiTuong]);

    if (!isOpen) return null;

    return (
        <Modal>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                    Lịch sử công nợ - {congNoSummary.tenDoiTuong}
                </h2>
                <button onClick={onClose} className="p-1 rounded hover:bg-gray-200">
                    <X size={20} />
                </button>
            </div>

            {history.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Không có dữ liệu lịch sử</div>
            ) : (
                <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-3 py-2 text-left">Ngày</th>
                            <th className="px-3 py-2 text-left">Loại phiếu</th>
                            <th className="px-3 py-2 text-left">Mã phiếu</th>
                            <th className="px-3 py-2 text-left">Diễn giải</th>
                            <th className="px-3 py-2 text-right">Phát sinh Nợ</th>
                            <th className="px-3 py-2 text-right">Phát sinh Có</th>
                            <th className="px-3 py-2 text-right">Số dư sau</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((row, idx) => (
                            <tr key={row.maCongNo} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="px-3 py-2">{new Date(row.ngay).toLocaleDateString("vi-VN")}</td>
                                <td className="px-3 py-2">{row.loaiPhieu}</td>
                                <td className="px-3 py-2">{row.maPhieu}</td>
                                <td className="px-3 py-2">{row.dienGiai}</td>
                                <td className="px-3 py-2 text-right">{row.phatSinhNo.toLocaleString("vi-VN")}</td>
                                <td className="px-3 py-2 text-right">{row.phatSinhCo.toLocaleString("vi-VN")}</td>
                                <td className="px-3 py-2 text-right font-medium">{row.soDuSau.toLocaleString("vi-VN")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Modal>
    );
}
