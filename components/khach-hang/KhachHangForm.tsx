"use client";

import React, { useState, useEffect, useMemo } from "react";
import { User, Phone, MapPin, CreditCard, FileText, Activity, Users, Loader2, Save } from "lucide-react";
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

const HAN_MUC_BY_LOAI: Record<number, number> = {
    0: 500_000,    // Cá nhân
    1: 10_000_000, // Trang trại
    2: 2_000_000,  // Đại lý
};

export default function KhachHangForm({ initialData, onSubmit, onCancel, isLoading = false, submitText = "Lưu thông tin" }: Props) {

    // 1. Capture Original Data for comparison
    const originalData = useMemo(() => ({
        ...DEFAULT_VALUES,
        ...initialData,
    }), [initialData]);

    // 2. Initialize State
    const [formData, setFormData] = useState<KhachHangCreateRequest>(originalData);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // 3. Detect Changes
    const isChanged = useMemo(() => {
        // Helper to handle null vs "" or "0" vs 0 differences
        const normalizeStr = (val: any) => (val || "").toString().trim();
        const normalizeNum = (val: any) => Number(val ?? 0);

        return (
            normalizeStr(formData.tenKH) !== normalizeStr(originalData.tenKH) ||
            normalizeStr(formData.soDienThoai) !== normalizeStr(originalData.soDienThoai) ||
            normalizeStr(formData.diaChi) !== normalizeStr(originalData.diaChi) ||
            normalizeStr(formData.ghiChu) !== normalizeStr(originalData.ghiChu) ||
            normalizeNum(formData.loaiKhachHang) !== normalizeNum(originalData.loaiKhachHang) ||
            normalizeNum(formData.trangThai) !== normalizeNum(originalData.trangThai)
            // Note: We don't check hanMucCongNo here because it auto-updates based on loaiKhachHang
        );
    }, [formData, originalData]);

    // Auto-calculate Limit when Type changes
    useEffect(() => {
        const hanMuc = HAN_MUC_BY_LOAI[Number(formData.loaiKhachHang)] ?? 0;

        // Only update if it's actually different to avoid infinite loops/unnecessary renders
        if (formData.hanMucCongNo !== hanMuc) {
            setFormData(prev => ({
                ...prev,
                hanMucCongNo: hanMuc,
            }));
        }
    }, [formData.loaiKhachHang, formData.hanMucCongNo]);

    // Handle Input Changes
    const handleChange = (field: keyof KhachHangCreateRequest, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

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
            // Ensure Enums are numbers before sending
            const submitData = { ...formData };
            submitData.loaiKhachHang = Number(formData.loaiKhachHang) as LoaiKhachHangEnum;
            submitData.trangThai = Number(formData.trangThai) as TrangThaiKhachHangEnum;

            onSubmit(submitData);
        }
    };

    // Helper for input styles
    const inputClass = (hasError: boolean) =>
        `w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${hasError
            ? "border-red-500 focus:ring-red-200"
            : "border-slate-300 focus:ring-blue-500 focus:border-blue-500"
        }`;

    const formatVND = (value: number) =>
        new Intl.NumberFormat("vi-VN").format(value);

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
                            onChange={(e) => handleChange("loaiKhachHang", Number(e.target.value))}
                            className={inputClass(false)}
                        >
                            <option value="0">Cá nhân</option>
                            <option value="2">Đại lý</option>
                            <option value="1">Trang trại</option>
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
                            type="text"
                            disabled
                            value={formatVND(formData.hanMucCongNo ?? 0)}
                            className={inputClass(false)}
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
            <div className="px-4 py-2 border-t border-gray-100 bg-white flex justify-end gap-3 sticky bottom-0 text-slate-800 z-10">
                <button
                    type="submit"
                    // DISABLED if: Loading OR Not Changed
                    disabled={isLoading || !isChanged}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold disabled:opacity-50 disabled:hover:bg-emerald-600 disabled:bg-emerald-600 disabled:hover:cursor-default transition-colors cursor-pointer"
                >
                    {isLoading ? (
                        <Loader2 className="animate-spin" size={18} />
                    ) : (
                        <Save size={18} />
                    )}
                    {isLoading ? "Đang lưu..." : submitText}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="px-6 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    Hủy
                </button>
            </div>
        </form>
    );
}