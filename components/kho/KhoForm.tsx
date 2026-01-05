"use client";

import type { KhoHang } from "@/types";

type Props = {
    defaultValues?: KhoHang;
    onSubmit: (data: KhoHang) => void;
    onCancel: () => void;
    submitText: string;
};

export default function KhoForm({
    defaultValues,
    onSubmit,
    onCancel,
    submitText,
}: Props) {
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);

        onSubmit({
            ...defaultValues!,
            TenKho: form.get("TenKho") as string,
            DiaChi: form.get("DiaChi") as string,
            TrangThai: form.get("TrangThai") as KhoHang["TrangThai"],
            GhiChu: (form.get("GhiChu") as string) || null,
        });
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* Tên kho */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">
                    Tên kho
                </label>
                <input
                    name="TenKho"
                    placeholder="Tên kho..."
                    defaultValue={defaultValues?.TenKho}
                    required
                    className="h-10 rounded-md bg-[#E9F1FB] px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Địa chỉ */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">
                    Địa chỉ
                </label>
                <input
                    name="DiaChi"
                    placeholder="Địa chỉ..."
                    defaultValue={defaultValues?.DiaChi}
                    className="h-10 rounded-md bg-[#E9F1FB] px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Trạng thái */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">
                    Trạng thái
                </label>
                <select
                    name="TrangThai"
                    defaultValue={defaultValues?.TrangThai ?? "HOAT_DONG"}
                    className="h-10 rounded-md bg-[#E9F1FB] px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="HOAT_DONG">Hoạt động</option>
                    <option value="NGUNG_HOAT_DONG">Ngưng hoạt động</option>
                </select>
            </div>

            {/* Ghi chú */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">
                    Ghi chú
                </label>
                <input
                    name="GhiChu"
                    placeholder="Ghi chú..."
                    defaultValue={defaultValues?.GhiChu ?? ""}
                    className="h-10 rounded-md bg-[#E9F1FB] px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Actions */}
            <div className="col-span-2 mt-6 flex items-center justify-between gap-6">
                <button
                    type="submit"
                    className="h-11 flex-1 rounded-lg bg-[#3f861e] text-white font-semibold hover:bg-[#529E29] transition-colors"
                >
                    {submitText}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="h-11 flex-1 rounded-lg border-2 border-red-500 text-red-500 font-semibold hover:bg-red-50 transition-colors"
                >
                    Hủy
                </button>
            </div>
        </form>

    );
}
