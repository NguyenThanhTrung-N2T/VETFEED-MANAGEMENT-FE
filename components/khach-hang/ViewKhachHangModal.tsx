"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import KhachHangForm from "./KhachHangForm";
import { phieuBanService } from "@/services/phieu-ban.service";
import {
    KhachHangUpdateRequest, KhachHangResponse, LoaiKhachHangEnum, TrangThaiKhachHangEnum,
    PhieuBanListResponse, KhachHangPhieuBanResponse
} from "@/client/types.gen";
import {
    User, Phone, MapPin, CreditCard, History, Calendar, FileText,
    CheckCircle2, AlertCircle, Clock, DollarSign, Edit, ArrowLeft
} from "lucide-react";
// HELPER: Map string from DB/Response to the Enum required by the Form/Request
const mapStringToLoaiKH = (type?: string | null): LoaiKhachHangEnum => {
    switch (type) {
        case "TRANG_TRAI":
            return 1;
        case "DAI_LY":
            return 2;
        case "CA_NHAN":
        default:
            return 0;
    }
};
const mapStringToTrangThaiKH = (type?: string | null): TrangThaiKhachHangEnum => {
    switch (type) {
        case "KHOA":
            return 1;
        case "HOAT_DONG":
        default:
            return 0;
    }
};
// trangThaiThanhToan: "TIEN_MAT" | "CHUYEN_KHOAN" | "CONG_NO";

interface Props {
    khachHang: KhachHangResponse;
    onClose: () => void;
    // New prop to handle the actual API update
    onUpdate: (id: string, data: KhachHangUpdateRequest) => Promise<void> | void;
}

export default function ViewKhachHangModal({ khachHang, onClose, onUpdate }: Props) {
    const [activeTab, setActiveTab] = useState<"INFO" | "HISTORY">("INFO");
    const [isEditing, setIsEditing] = useState(false);
    const [history, setHistory] = useState<PhieuBanListResponse[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const fetchPhieuBanList = async () => {
        try {
            setIsLoadingHistory(true);
            if (!(khachHang && khachHang.maKH)) {
                throw new Error('Cannot find maKH!');
            }
            const data = await phieuBanService.getPhieuBanByMKH(khachHang.maKH);
            setHistory(data);
        }
        catch (error) {
            console.log('Failed to fetch PhieuBanList in modal!');
        }
        finally {
            setIsLoadingHistory(false);
        }
    }
    // --- EFFECT: Load History ---
    useEffect(() => {
        if (activeTab === "HISTORY" && !isEditing) {
            fetchPhieuBanList();
        }
    }, [activeTab, khachHang.maKHCode, isEditing]);

    // --- HANDLERS ---
    const handleSaveEdit = async (data: KhachHangUpdateRequest) => {
        try {
            setIsSaving(true);
            // Assuming KhachHangDTO has an 'Id' field. 
            // If your ID field is named differently (e.g., 'MaKH'), change it here.
            await onUpdate(khachHang.maKH!, data);
            setIsEditing(false); // Switch back to view mode on success
        } catch (error) {
            console.error("Failed to update", error);
        } finally {
            setIsSaving(false);
        }
    };

    // --- HELPERS ---
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

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case "TIEN_MAT": return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"><CheckCircle2 size={12} /> Đã thanh toán</span>;
            case "CONG_NO": return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700"><AlertCircle size={12} /> Chưa thanh toán</span>;
            case "CHUYEN_KHOAN": return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700"><Clock size={12} /> Nợ một phần</span>;
            default: return '-';
        }
    };

    // --- RENDER CONTENT ---
    return (
        <Modal size="lg">
            {/* 1. Header Area - Changes based on Edit Mode */}
            <div className="relative mb-6">
                {isEditing ? (
                    // HEADER: EDIT MODE
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-slate-800">Chỉnh sửa thông tin</h2>
                    </div>
                ) : (
                    // HEADER: VIEW MODE
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg
                                ${khachHang.loaiKhachHang === 'TRANG_TRAI' ? 'bg-orange-500' : 'bg-blue-600'}`}>
                                {khachHang.tenKH ? khachHang.tenKH.charAt(0).toUpperCase() : '-'}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">{khachHang.tenKH}</h2>
                                <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-200">
                                        {khachHang.maKHCode}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <User size={14} /> {getTypeLabel(khachHang.loaiKhachHang || "")}
                                    </span>
                                    {khachHang.trangThai === 'KHOA' && (
                                        <span className="text-red-600 font-semibold text-xs px-2 py-0.5 bg-red-50 rounded-full border border-red-100">
                                            Đã khóa
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Edit Button */}
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-500 hover:border-blue-200 transition-all shadow-sm cursor-pointer"
                        >
                            <Edit size={16} />
                            Sửa thông tin
                        </button>
                    </div>
                )}
            </div>

            {/* 2. Body Content */}
            {isEditing ? (
                // --- MODE: EDIT FORM ---
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <KhachHangForm
                        initialData={{
                            tenKH: khachHang.tenKH ?? '',
                            soDienThoai: khachHang.soDienThoai,
                            diaChi: khachHang.diaChi,
                            loaiKhachHang: mapStringToLoaiKH(khachHang.loaiKhachHang),
                            hanMucCongNo: khachHang.hanMucCongNo,
                            trangThai: mapStringToTrangThaiKH(khachHang.trangThai),
                            ghiChu: khachHang.ghiChu
                        }}
                        isLoading={isSaving}
                        submitText="Lưu thay đổi"
                        onSubmit={handleSaveEdit}
                        onCancel={() => setIsEditing(false)}
                    />
                </div>
            ) : (
                // --- MODE: VIEW TABS ---
                <>
                    <div className="flex border-b border-slate-200 mb-6">
                        <button
                            onClick={() => setActiveTab("INFO")}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer
                            ${activeTab === "INFO" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                        >
                            <User size={16} /> Thông tin chung
                        </button>
                        <button
                            onClick={() => setActiveTab("HISTORY")}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer
                            ${activeTab === "HISTORY" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                        >
                            <History size={16} /> Lịch sử mua hàng
                        </button>
                    </div>

                    {activeTab === "INFO" && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                    <div className="flex items-center gap-2 text-green-700 mb-1">
                                        <DollarSign size={18} />
                                        <span className="text-sm font-medium">Tổng đã mua</span>
                                    </div>
                                    <p className="text-xl font-bold text-green-800">{formatCurrency(khachHang.tongMua ?? 0)}</p>
                                </div>
                                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                    <div className="flex items-center gap-2 text-red-700 mb-1">
                                        <CreditCard size={18} />
                                        <span className="text-sm font-medium">Công nợ hiện tại</span>
                                    </div>
                                    <p className="text-xl font-bold text-red-800">{formatCurrency(khachHang.congNoHienTai ?? 0)}</p>
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
                                            {khachHang.soDienThoai || "---"}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 block mb-1">Địa chỉ</label>
                                        <div className="flex items-center gap-2 text-slate-800 font-medium">
                                            <MapPin size={16} className="text-slate-400" />
                                            {khachHang.diaChi || "---"}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 block mb-1">Ngày tạo hồ sơ</label>
                                        <div className="flex items-center gap-2 text-slate-800 font-medium">
                                            <Calendar size={16} className="text-slate-400" />
                                            {new Date(khachHang.ngayTao || "").toLocaleDateString("vi-VN")}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 block mb-1">Hạn mức công nợ cho phép</label>
                                        <div className="flex items-center gap-2 text-slate-800 font-medium">
                                            <CreditCard size={16} className="text-slate-400" />
                                            {(khachHang.hanMucCongNo !== null && khachHang.hanMucCongNo !== undefined) ? formatCurrency(khachHang.hanMucCongNo) : "Không giới hạn"}
                                        </div>
                                    </div>
                                </div>
                                {khachHang.ghiChu && (
                                    <div className="mt-4 pt-4 border-t border-slate-200">
                                        <label className="text-xs text-slate-500 block mb-1">Ghi chú</label>
                                        <p className="text-sm text-slate-600 italic">{khachHang.ghiChu}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

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
                                                        {formatDate(item.ngayBan ?? '-')}
                                                    </td>
                                                    <td className="py-3 px-4 text-right font-medium text-slate-800">
                                                        {formatCurrency(item.thanhTien ?? 0)}
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        {item.tienNo ? (
                                                            <span className="text-red-600 font-bold">{formatCurrency(item.tienNo ?? 0)}</span>
                                                        ) : (
                                                            <span className="text-slate-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        {getStatusBadge(item.trangThaiThanhToan ?? '-')}
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

                    {/* View Mode Footer - Only show Close if not editing */}
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                            Đóng
                        </button>
                    </div>
                </>
            )}
        </Modal>
    );
}