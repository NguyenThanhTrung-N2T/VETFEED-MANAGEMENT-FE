"use client";

import React, { useState } from "react";
import { KhachHang, LoaiKhachHang, TrangThaiKH } from "@/types/KhachHang";

type Props = {
    initial?: Partial<KhachHang>;
    submitText?: string;
    onSubmit: (data: Partial<KhachHang>) => void;
    onCancel: () => void;
};

const loaiKhachHangOptions: { value: LoaiKhachHang; label: string }[] = [
    { value: "CA_NHAN", label: "Cá nhân" },
    { value: "TRANG_TRAI", label: "Trang trại" },
    { value: "DAI_LY", label: "Đại lý" },
];

const trangThaiOptions: { value: TrangThaiKH; label: string }[] = [
    { value: "HOAT_DONG", label: "Hoạt động" },
    { value: "KHOA", label: "Khóa" },
];

export default function KhachHangForm({
    initial,
    submitText = "Lưu",
    onSubmit,
    onCancel,
}: Props) {
    const [tenKH, setTenKH] = useState(initial?.TenKH ?? "");
    const [soDienThoai, setSoDienThoai] = useState(initial?.SoDienThoai ?? "");
    const [diaChi, setDiaChi] = useState(initial?.DiaChi ?? "");
    const [loaiKhachHang, setLoaiKhachHang] = useState<LoaiKhachHang | "">(
        initial?.LoaiKhachHang ?? ""
    );
    const [hanMucCongNo, setHanMucCongNo] = useState(
        initial?.HanMucCongNo?.toString() ?? ""
    );
    const [trangThai, setTrangThai] = useState<TrangThaiKH | "">(
        initial?.TrangThai ?? "HOAT_DONG"
    );
    const [ghiChu, setGhiChu] = useState(initial?.GhiChu ?? "");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!tenKH.trim()) {
            newErrors.tenKH = "Tên khách hàng là bắt buộc";
        }

        if (soDienThoai && !/^[0-9]{10,11}$/.test(soDienThoai)) {
            newErrors.soDienThoai = "Số điện thoại không hợp lệ (10-11 số)";
        }

        if (hanMucCongNo && isNaN(Number(hanMucCongNo))) {
            newErrors.hanMucCongNo = "Hạn mức công nợ phải là số";
        }

        if (hanMucCongNo && Number(hanMucCongNo) < 0) {
            newErrors.hanMucCongNo = "Hạn mức công nợ không được âm";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const data: Partial<KhachHang> = {
            TenKH: tenKH.trim(),
            SoDienThoai: soDienThoai.trim() || null,
            DiaChi: diaChi.trim() || null,
            LoaiKhachHang: loaiKhachHang || null,
            HanMucCongNo: hanMucCongNo ? Number(hanMucCongNo) : null,
            TrangThai: trangThai || null,
            GhiChu: ghiChu.trim() || null,
        };

        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tên khách hàng */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tên khách hàng <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={tenKH}
                    onChange={(e) => setTenKH(e.target.value)}
                    placeholder="Nhập tên khách hàng"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.tenKH ? "border-red-500" : "border-slate-300"
                        }`}
                />
                {errors.tenKH && (
                    <p className="text-xs text-red-600 mt-1">{errors.tenKH}</p>
                )}
            </div>

            {/* Số điện thoại và Loại khách hàng */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Số điện thoại
                    </label>
                    <input
                        type="tel"
                        value={soDienThoai}
                        onChange={(e) => setSoDienThoai(e.target.value)}
                        placeholder="0123456789"
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.soDienThoai ? "border-red-500" : "border-slate-300"
                            }`}
                    />
                    {errors.soDienThoai && (
                        <p className="text-xs text-red-600 mt-1">{errors.soDienThoai}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Loại khách hàng
                    </label>
                    <select
                        value={loaiKhachHang}
                        onChange={(e) => setLoaiKhachHang(e.target.value as LoaiKhachHang | "")}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Chọn loại --</option>
                        {loaiKhachHangOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Địa chỉ */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Địa chỉ
                </label>
                <input
                    type="text"
                    value={diaChi}
                    onChange={(e) => setDiaChi(e.target.value)}
                    placeholder="Nhập địa chỉ"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Hạn mức công nợ và Trạng thái */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Hạn mức công nợ (VNĐ)
                    </label>
                    <input
                        type="text"
                        value={hanMucCongNo}
                        onChange={(e) => setHanMucCongNo(e.target.value)}
                        placeholder="0"
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.hanMucCongNo ? "border-red-500" : "border-slate-300"
                            }`}
                        inputMode="numeric"
                    />
                    {errors.hanMucCongNo && (
                        <p className="text-xs text-red-600 mt-1">{errors.hanMucCongNo}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Trạng thái
                    </label>
                    <select
                        value={trangThai}
                        onChange={(e) => setTrangThai(e.target.value as TrangThaiKH | "")}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {trangThaiOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Ghi chú */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Ghi chú
                </label>
                <textarea
                    value={ghiChu}
                    onChange={(e) => setGhiChu(e.target.value)}
                    rows={3}
                    placeholder="Nhập ghi chú (tùy chọn)"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-4 pt-4">
                <button
                    type="submit"
                    className="flex-1 h-11 rounded-lg bg-[#3f861e] text-white font-semibold hover:bg-[#529E29] transition-colors"
                >
                    {submitText}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 h-11 rounded-lg border-2 border-red-500 text-red-500 font-semibold hover:bg-red-50 transition-colors"
                >
                    Hủy
                </button>
            </div>
        </form>
    );
}