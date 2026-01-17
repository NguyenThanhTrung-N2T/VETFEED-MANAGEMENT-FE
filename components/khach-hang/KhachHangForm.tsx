"use client";

import React, { useState, useEffect } from "react";
import { User, Phone, MapPin, CreditCard, FileText, Activity, Users } from "lucide-react";
// Assuming these are your generated types. Adjust path if necessary.
import { KhachHangCreateRequest, LoaiKhachHangEnum, TrangThaiKhachHangEnum } from "@/client/types.gen";

interface Props {
    initialData?: Partial<KhachHangCreateRequest>;
    onSubmit: (data: KhachHangCreateRequest) => void;
    onCancel: () => void;
    isLoading?: boolean;
    submitText?: string;
}
const DEFAULT_VALUES: KhachHangCreateRequest = {
    tenKH: "",
    soDienThoai: "",
    diaChi: "",
    loaiKhachHang: 0,
    hanMucCongNo: 0,
    trangThai: 0,
    ghiChu: "",
};
export default function KhachHangForm({ initialData, onSubmit, onCancel, isLoading = false, submitText = "Lưu thông tin" }: Props) {
    // Merge default values with any initial data (for edit mode)
    const [formData, setFormData] = useState<KhachHangCreateRequest>({
        ...DEFAULT_VALUES,
        ...initialData,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Handle Input Changes
    const handleChange = (field: keyof KhachHangCreateRequest, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.tenKH?.trim()) {
            newErrors.TenKH = "Tên khách hàng không được để trống";
        }

        if (formData.soDienThoai && !/^[0-9]{10,11}$/.test(formData.soDienThoai)) {
            newErrors.SoDienThoai = "Số điện thoại không hợp lệ (10-11 số)";
        }

        if (formData.hanMucCongNo !== undefined && formData.hanMucCongNo !== null && formData.hanMucCongNo < 0) {
            newErrors.HanMucCongNo = "Hạn mức công nợ không được âm";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            const typeEnum = Number(formData.loaiKhachHang) as LoaiKhachHangEnum;
            const statusEnum = Number(formData.trangThai) as TrangThaiKhachHangEnum;
            formData.loaiKhachHang = typeEnum;
            formData.trangThai = statusEnum;
            onSubmit(formData);
        }
    };

    // Helper for input styles
    const inputClass = (hasError: boolean) =>
        `w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${hasError
            ? "border-red-500 focus:ring-red-200"
            : "border-slate-300 focus:ring-blue-500 focus:border-blue-500"
        }`;

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Tên Khách Hàng */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tên khách hàng <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <User className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                        type="text"
                        disabled={isLoading}
                        value={formData.tenKH || ""}
                        onChange={(e) => handleChange("tenKH", e.target.value)}
                        placeholder="Ví dụ: Nguyễn Văn A"
                        className={inputClass(!!errors.TenKH)}
                    />
                </div>
                {errors.TenKH && <p className="text-xs text-red-500 mt-1">{errors.TenKH}</p>}
            </div>

            {/* 2. SĐT & Loại KH */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Số điện thoại
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input
                            type="text"
                            disabled={isLoading}
                            value={formData.soDienThoai || ""}
                            onChange={(e) => handleChange("soDienThoai", e.target.value)}
                            placeholder="0912..."
                            className={inputClass(!!errors.SoDienThoai)}
                        />
                    </div>
                    {errors.SoDienThoai && (
                        <p className="text-xs text-red-500 mt-1">{errors.SoDienThoai}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Loại khách hàng
                    </label>
                    <div className="relative">
                        <Users className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <select
                            disabled={isLoading}
                            value={formData.loaiKhachHang || 0}
                            onChange={(e) => handleChange("loaiKhachHang", e.target.value)}
                            className={inputClass(false)}
                        >
                            <option value="0">Cá nhân</option>
                            <option value="1">Trang trại</option>
                            <option value="2">Đại lý</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 3. Địa chỉ */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Địa chỉ
                </label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                        type="text"
                        disabled={isLoading}
                        value={formData.diaChi || ""}
                        onChange={(e) => handleChange("diaChi", e.target.value)}
                        placeholder="Số nhà, thôn, xã..."
                        className={inputClass(false)}
                    />
                </div>
            </div>

            {/* 4. Hạn mức & Trạng thái */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Hạn mức nợ (VNĐ)
                    </label>
                    <div className="relative">
                        <CreditCard className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input
                            type="number"
                            disabled={isLoading}
                            value={formData.hanMucCongNo ?? '0'}
                            onChange={(e) =>
                                handleChange("hanMucCongNo", parseFloat(e.target.value) || 0)
                            }
                            className={inputClass(!!errors.HanMucCongNo)}
                        />
                    </div>
                    {errors.HanMucCongNo && (
                        <p className="text-xs text-red-500 mt-1">{errors.HanMucCongNo}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Trạng thái
                    </label>
                    <div className="relative">
                        <Activity className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <select
                            disabled={isLoading}
                            value={formData.trangThai || 0}
                            onChange={(e) => handleChange("trangThai", e.target.value)}
                            className={inputClass(false)}
                        >
                            <option value="0">Hoạt động</option>
                            <option value="1">Đang khóa</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 5. Ghi chú */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Ghi chú
                </label>
                <div className="relative">
                    <FileText className="absolute left-3 top-3 text-slate-400" size={18} />
                    <textarea
                        disabled={isLoading}
                        rows={2}
                        value={formData.ghiChu || ""}
                        onChange={(e) => handleChange("ghiChu", e.target.value)}
                        placeholder="Ghi chú thêm..."
                        className={`w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="col-span-2 mt-6 flex items-center justify-end gap-3">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex h-11 flex-1 items-center justify-center rounded-lg bg-[#3f861e] text-white font-semibold hover:bg-[#529E29] transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                            <span>Đang lưu...</span>
                        </div>
                    ) : (
                        submitText
                    )}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="h-11 flex-1 rounded-lg border-2 border-red-500 text-red-500 font-semibold hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                    Hủy
                    {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                </button>
            </div>
        </form>
    );
}