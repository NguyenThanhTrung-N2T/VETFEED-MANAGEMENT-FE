"use client";

import React from "react";
import { CreateKhoHangRequest, TrangThaiKhoEnum } from "@/client/types.gen";
type FormDataType = CreateKhoHangRequest;

type Props = {
    // Partial allows us to pass empty object or just some fields when adding
    defaultValues?: Partial<FormDataType>;
    onSubmit: (data: FormDataType) => void;
    onCancel: () => void;
    submitText: string;
    isLoading?: boolean;
};

export default function KhoForm({
    defaultValues,
    onSubmit,
    onCancel,
    submitText,
    isLoading = false,
}: Props) {
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);

        // ✅ 3. Handle Enum Conversion
        // HTML Select returns strings ("0", "1"), but API expects Numbers (0, 1)
        const rawStatus = form.get("trangThai");
        const statusEnum = Number(rawStatus) as TrangThaiKhoEnum;

        // ✅ 4. Construct object using camelCase (matching API)
        const data: FormDataType = {
            tenKho: form.get("tenKho") as string,
            diaChi: form.get("diaChi") as string,
            trangThai: statusEnum,
            ghiChu: (form.get("ghiChu") as string) || null,
        };

        onSubmit(data);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4"
        >
            {/* Tên kho */}
            <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                    Tên kho <span className="text-red-500">*</span>
                </label>
                <input
                    // ✅ Name attribute must match camelCase for FormData to work logically
                    name="tenKho"
                    placeholder="Nhập tên kho..."
                    // ✅ Access props using camelCase
                    defaultValue={defaultValues?.tenKho}
                    required
                    disabled={isLoading}
                    className="h-10 rounded-md bg-[#E9F1FB] px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                />
            </div>

            {/* Địa chỉ */}
            <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                    Địa chỉ
                </label>
                <input
                    name="diaChi"
                    placeholder="Nhập địa chỉ..."
                    defaultValue={defaultValues?.diaChi}
                    disabled={isLoading}
                    className="h-10 rounded-md bg-[#E9F1FB] px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                />
            </div>

            {/* Trạng thái */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">
                    Trạng thái
                </label>
                <div className="relative">
                    <select
                        name="trangThai"
                        defaultValue={defaultValues?.trangThai ?? 1}
                        disabled={isLoading}
                        className="h-10 w-full appearance-none rounded-md bg-[#E9F1FB] px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <option value="0">Hoạt động</option>
                        <option value="1">Ngưng hoạt động</option>
                    </select>
                </div>
            </div>

            {/* Ghi chú */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">
                    Ghi chú
                </label>
                <input
                    name="ghiChu"
                    placeholder="Ghi chú thêm..."
                    defaultValue={defaultValues?.ghiChu ?? ""}
                    disabled={isLoading}
                    className="h-10 rounded-md bg-[#E9F1FB] px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                />
            </div>

            {/* Actions */}
            <div className="col-span-1 sm:col-span-2 mt-6 flex items-center justify-between gap-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex h-11 flex-1 items-center justify-center rounded-lg bg-[#3f861e] text-white font-semibold hover:bg-[#529E29] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="h-11 flex-1 rounded-lg border-2 border-red-500 text-red-500 font-semibold hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Hủy
                </button>
            </div>
        </form>
    );
}