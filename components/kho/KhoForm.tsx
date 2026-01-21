"use client";

import React from "react";
import { CreateKhoHangRequest, TrangThaiKhoEnum } from "@/client/types.gen";
import { ChevronDown, Save, Loader2 } from "lucide-react";
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

        // HTML Select returns strings ("0", "1"), but API expects Numbers (0, 1)
        const rawStatus = form.get("trangThai");
        const statusEnum = Number(rawStatus) as TrangThaiKhoEnum;

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
                    name="tenKho"
                    placeholder="Nhập tên kho..."
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
                        defaultValue={defaultValues?.trangThai ?? 0}
                        disabled={isLoading}
                        className="h-10 w-full appearance-none rounded-md bg-[#E9F1FB] px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <option value="0">Hoạt động</option>
                        <option value="1">Ngưng hoạt động</option>
                    </select>
                    <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
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
            <div className="col-span-1 sm:col-span-2 px-4 py-2 border-t border-gray-100 bg-white flex justify-end gap-3  sticky bottom-0 text-slate-800 z-10">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
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