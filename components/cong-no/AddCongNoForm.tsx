"use client";

import React, { useState } from "react";
import { CreateCongNoRequest } from "@/client/types.gen";

type FormDataType = CreateCongNoRequest;

type Props = {
    maDoiTuong: string;
    defaultValues?: Partial<FormDataType>;
    onSubmit: (data: FormDataType) => void;
    onCancel: () => void;
    submitText?: string;
    isLoading?: boolean;
};

// Helper to format ISO string to YYYY-MM-DDTHH:mm for input
const toLocalISOString = (dateStr?: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    // Adjust for timezone offset to keep local time correct in input
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 16);
    return localISOTime;
};

// Helper to format ISO string to YYYY-MM-DD for date input
const toDateString = (dateStr?: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString().slice(0, 10);
};

export default function AddCongNoForm({
    maDoiTuong,
    defaultValues,
    onSubmit,
    onCancel,
    submitText = "Lưu thông tin",
    isLoading = false,
}: Props) {
    // 1. Initialize State (Controlled Component)
    const [formData, setFormData] = useState<FormDataType>({
        maDoiTuong: maDoiTuong,
        soTien: defaultValues?.soTien || 0,
        ngayPhatSinh: defaultValues?.ngayPhatSinh || new Date().toISOString(),
        hanThanhToan: defaultValues?.hanThanhToan || null,
        maPhieuCode: defaultValues?.maPhieuCode || null,
        ghiChu: defaultValues?.ghiChu || null,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // 2. Handle Input Changes
    const handleChange = (field: keyof FormDataType, value: any) => {
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

    // 3. Validation Logic
    const validate = () => {
        const newErrors: Record<string, string> = {};

        // Validate Amount
        if (!formData.soTien || formData.soTien === 0) {
            newErrors.soTien = "Số tiền không được bằng 0";
        }

        // Validate Date
        if (!formData.ngayPhatSinh) {
            newErrors.ngayPhatSinh = "Ngày phát sinh là bắt buộc";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 4. Handle Submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    // 5. Helper for input styles (Adapted from KhachHangForm)
    // I kept the bg-[#E9F1FB] from the original AddCongNoForm but applied the border logic
    const inputClass = (hasError: boolean) =>
        `w-full px-3 py-2.5 rounded-md text-sm outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed ${hasError
            ? "bg-white border border-red-500 focus:ring-2 focus:ring-red-200"
            : "bg-[#E9F1FB] border border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        }`;

    return (
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 animate-in fade-in duration-300"
        >
            {/* 1. Số tiền */}
            <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                    Số tiền (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    value={formData.soTien === 0 ? "" : formData.soTien} // Show empty if 0 for better UX
                    onChange={(e) => handleChange("soTien", parseFloat(e.target.value) || 0)}
                    placeholder="VD: 1000000 (Dương: Nợ, Âm: Trả)"
                    disabled={isLoading}
                    className={`${inputClass(!!errors.soTien)} font-mono`}
                />
                {errors.soTien ? (
                    <p className="text-xs text-red-500">{errors.soTien}</p>
                ) : (
                    <p className="text-xs text-slate-500">
                        Nhập số dương (+) để tăng nợ, số âm (-) để giảm nợ/thanh toán.
                    </p>
                )}
            </div>

            {/* 2. Ngày phát sinh */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">
                    Ngày phát sinh <span className="text-red-500">*</span>
                </label>
                <input
                    type="datetime-local"
                    value={toLocalISOString(formData.ngayPhatSinh)}
                    onChange={(e) => {
                        // Convert input value back to ISO string for state
                        const date = new Date(e.target.value);
                        handleChange("ngayPhatSinh", date.toISOString());
                    }}
                    required
                    disabled={isLoading}
                    className={inputClass(!!errors.ngayPhatSinh)}
                />
                {errors.ngayPhatSinh && (
                    <p className="text-xs text-red-500">{errors.ngayPhatSinh}</p>
                )}
            </div>

            {/* 3. Hạn thanh toán */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">
                    Hạn thanh toán (Tùy chọn)
                </label>
                <input
                    type="date"
                    value={toDateString(formData.hanThanhToan)}
                    onChange={(e) => {
                        const val = e.target.value;
                        handleChange("hanThanhToan", val ? new Date(val).toISOString() : null);
                    }}
                    disabled={isLoading}
                    className={inputClass(false)}
                />
            </div>

            {/* 4. Mã phiếu */}
            <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                    Mã phiếu (Tùy chọn)
                </label>
                <input
                    type="text"
                    placeholder="VD: PH001..."
                    value={formData.maPhieuCode || ""}
                    onChange={(e) => handleChange("maPhieuCode", e.target.value)}
                    disabled={isLoading}
                    className={inputClass(false)}
                />
            </div>

            {/* 5. Ghi chú */}
            <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">Ghi chú</label>
                <textarea
                    rows={2}
                    placeholder="Ghi chú chi tiết giao dịch..."
                    value={formData.ghiChu || ""}
                    onChange={(e) => handleChange("ghiChu", e.target.value)}
                    disabled={isLoading}
                    className={`${inputClass(false)} resize-none`}
                />
            </div>

            {/* Actions */}
            <div className="col-span-1 sm:col-span-2 mt-6 flex items-center justify-between gap-4">
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
                </button>
            </div>
        </form>
    );
}