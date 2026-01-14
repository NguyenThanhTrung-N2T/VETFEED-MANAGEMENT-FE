"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal"; // Assuming you have this generic Modal
import { KhachHangDTO } from "@/types";
import {
    User,
    Phone,
    MapPin,
    CreditCard,
    History,
    Calendar,
    FileText,
    CheckCircle2,
    AlertCircle,
    X,
    Clock,
    DollarSign
} from "lucide-react";

// --- 1. DEFINING THE HISTORY TYPE ---
// Simplified version of PhieuBanResponse focusing on "Important Info"
export interface PurchaseHistoryDTO {
    maPB: string;
    maPBCode: string;
    ngayBan: string;
    tongTienHang: number;     // Total goods value
    thanhTien: number;        // Final amount after discount
    tienNo: number;           // Remaining debt
    trangThaiThanhToan: "DA_THANH_TOAN" | "CHUA_THANH_TOAN" | "MOT_PHAN";
    ghiChu?: string;
}

// --- 2. MOCK API DATA GENERATOR ---
const generateMockHistory = (customerCode: string): PurchaseHistoryDTO[] => {
    // Generate deterministic mock data based on customer code
    return [
        {
            maPB: "pb-1",
            maPBCode: "PB2310001",
            ngayBan: "2023-10-15T08:30:00Z",
            tongTienHang: 1500000,
            thanhTien: 1500000,
            tienNo: 0,
            trangThaiThanhToan: "DA_THANH_TOAN",
            ghiChu: "Mua thuốc kháng sinh"
        },
        {
            maPB: "pb-2",
            maPBCode: "PB2311012",
            ngayBan: "2023-11-02T14:15:00Z",
            tongTienHang: 5200000,
            thanhTien: 5000000, // Discounted
            tienNo: 2000000,
            trangThaiThanhToan: "MOT_PHAN",
            ghiChu: "Nợ 2tr hẹn trả cuối tháng"
        },
        {
            maPB: "pb-3",
            maPBCode: "PB2312005",
            ngayBan: "2023-12-05T09:00:00Z",
            tongTienHang: 850000,
            thanhTien: 850000,
            tienNo: 0,
            trangThaiThanhToan: "DA_THANH_TOAN",
        },
        {
            maPB: "pb-4",
            maPBCode: "PB2401001",
            ngayBan: "2024-01-10T10:30:00Z",
            tongTienHang: 12000000,
            thanhTien: 11500000,
            tienNo: 11500000,
            trangThaiThanhToan: "CHUA_THANH_TOAN",
            ghiChu: "Lấy cám đợt 1 cho trại heo"
        },
    ];
};

interface Props {
    khachHang: KhachHangDTO;
    onClose: () => void;
}

export default function ViewKhachHangModal({ khachHang, onClose }: Props) {
    const [activeTab, setActiveTab] = useState<"INFO" | "HISTORY">("INFO");
    const [history, setHistory] = useState<PurchaseHistoryDTO[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    // Simulate Fetching Data
    useEffect(() => {
        if (activeTab === "HISTORY") {
            setIsLoadingHistory(true);
            // Simulate network delay
            setTimeout(() => {
                const data = generateMockHistory(khachHang.MaKHCode);
                // Sort by date desc
                setHistory(data.sort((a, b) => new Date(b.ngayBan).getTime() - new Date(a.ngayBan).getTime()));
                setIsLoadingHistory(false);
            }, 600);
        }
    }, [activeTab, khachHang.MaKHCode]);

    // Helpers
    const formatCurrency = (val: number) => val.toLocaleString("vi-VN") + " ₫";
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("vi-VN") + " " + d.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case "TRANG_TRAI": return "Trang trại";
            case "DAI_LY": return "Đại lý";
            default: return "Cá nhân";
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "DA_THANH_TOAN":
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"><CheckCircle2 size={12} /> Đã thanh toán</span>;
            case "CHUA_THANH_TOAN":
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700"><AlertCircle size={12} /> Chưa thanh toán</span>;
            case "MOT_PHAN":
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700"><Clock size={12} /> Nợ một phần</span>;
            default:
                return status;
        }
    };

    return (
        <Modal size="lg">
            {/* Header Area */}
            <div className="relative mb-6">
                <button onClick={onClose} className="absolute -top-2 -right-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors">
                    <X size={20} />
                </button>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg
                        ${khachHang.LoaiKhachHang === 'TRANG_TRAI' ? 'bg-orange-500' : 'bg-blue-600'}`}>
                        {khachHang.TenKH.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{khachHang.TenKH}</h2>
                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-200">
                                {khachHang.MaKHCode}
                            </span>
                            <span className="flex items-center gap-1">
                                <User size={14} /> {getTypeLabel(khachHang.LoaiKhachHang || "")}
                            </span>
                            {khachHang.TrangThai === 'KHOA' && (
                                <span className="text-red-600 font-semibold text-xs px-2 py-0.5 bg-red-50 rounded-full border border-red-100">
                                    Đã khóa
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6">
                <button
                    onClick={() => setActiveTab("INFO")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2
                    ${activeTab === "INFO" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                >
                    <User size={16} /> Thông tin chung
                </button>
                <button
                    onClick={() => setActiveTab("HISTORY")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2
                    ${activeTab === "HISTORY" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                >
                    <History size={16} /> Lịch sử mua hàng
                </button>
            </div>

            {/* TAB CONTENT: INFO */}
            {activeTab === "INFO" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                            <div className="flex items-center gap-2 text-green-700 mb-1">
                                <DollarSign size={18} />
                                <span className="text-sm font-medium">Tổng đã mua</span>
                            </div>
                            <p className="text-xl font-bold text-green-800">{formatCurrency(khachHang.TongMua)}</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                            <div className="flex items-center gap-2 text-red-700 mb-1">
                                <CreditCard size={18} />
                                <span className="text-sm font-medium">Công nợ hiện tại</span>
                            </div>
                            <p className="text-xl font-bold text-red-800">{formatCurrency(khachHang.CongNoHienTai)}</p>
                        </div>
                    </div>

                    {/* Detailed Info Grid */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <FileText size={16} /> Chi tiết liên hệ
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                            <div>
                                <label className="text-xs text-slate-500 block mb-1">Số điện thoại</label>
                                <div className="flex items-center gap-2 text-slate-800 font-medium">
                                    <Phone size={16} className="text-slate-400" />
                                    {khachHang.SoDienThoai || "---"}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 block mb-1">Địa chỉ</label>
                                <div className="flex items-center gap-2 text-slate-800 font-medium">
                                    <MapPin size={16} className="text-slate-400" />
                                    {khachHang.DiaChi || "---"}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 block mb-1">Ngày tạo hồ sơ</label>
                                <div className="flex items-center gap-2 text-slate-800 font-medium">
                                    <Calendar size={16} className="text-slate-400" />
                                    {new Date(khachHang.NgayTao || "").toLocaleDateString("vi-VN")}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 block mb-1">Hạn mức công nợ cho phép</label>
                                <div className="flex items-center gap-2 text-slate-800 font-medium">
                                    <CreditCard size={16} className="text-slate-400" />
                                    {khachHang.HanMucCongNo ? formatCurrency(khachHang.HanMucCongNo) : "Không giới hạn"}
                                </div>
                            </div>
                        </div>
                        {khachHang.GhiChu && (
                            <div className="mt-4 pt-4 border-t border-slate-200">
                                <label className="text-xs text-slate-500 block mb-1">Ghi chú</label>
                                <p className="text-sm text-slate-600 italic">"{khachHang.GhiChu}"</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB CONTENT: HISTORY */}
            {activeTab === "HISTORY" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {isLoadingHistory ? (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                            <span className="text-sm">Đang tải lịch sử giao dịch...</span>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-lg border border-slate-200">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                                    <tr>
                                        <th className="py-3 px-4">Mã phiếu</th>
                                        <th className="py-3 px-4">Ngày mua</th>
                                        <th className="py-3 px-4 text-right">Tổng tiền</th>
                                        <th className="py-3 px-4 text-right">Còn nợ</th>
                                        <th className="py-3 px-4 text-center">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {history.length > 0 ? history.map((item) => (
                                        <tr key={item.maPB} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-3 px-4 font-medium text-blue-600">
                                                {item.maPBCode}
                                                {item.ghiChu && (
                                                    <div className="text-xs text-slate-400 font-normal truncate max-w-37.5">{item.ghiChu}</div>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-slate-600">
                                                {formatDate(item.ngayBan)}
                                            </td>
                                            <td className="py-3 px-4 text-right font-medium text-slate-800">
                                                {formatCurrency(item.thanhTien)}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                {item.tienNo > 0 ? (
                                                    <span className="text-red-600 font-bold">{formatCurrency(item.tienNo)}</span>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {getStatusBadge(item.trangThaiThanhToan)}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                                                Chưa có lịch sử mua hàng nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="mt-8 flex justify-end">
                <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                >
                    Đóng
                </button>
            </div>
        </Modal>
    );
}