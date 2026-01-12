"use client";

import type { KhoHangDTO } from "@/types"; // use the correct type import

type Props = {
    defaultValues?: Partial<KhoHangDTO>; // Use Partial because "Add" mode might not have all fields
    onSubmit: (data: KhoHangDTO) => void;
    onCancel: () => void;
    submitText: string;
    isLoading?: boolean; // loading state prop
};

export default function KhoForm({
    defaultValues,
    onSubmit,
    onCancel,
    submitText,
    isLoading = false, // Default to false
}: Props) {
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);

        // Construct the object carefully
        // logic: if it's Edit mode, keep old ID, otherwise parent handles ID
        const data = {
            ...defaultValues,
            TenKho: form.get("TenKho") as string,
            DiaChi: form.get("DiaChi") as string,
            // Cast strictly to your specific Enum type
            TrangThai: form.get("TrangThai") as any,
            GhiChu: (form.get("GhiChu") as string) || null,
        } as KhoHangDTO;

        onSubmit(data);
    }

    return (
        <form
            onSubmit={handleSubmit}
            // Responsive Grid (1 col on mobile, 2 cols on tablet/desktop)
            className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4"
        >
            {/* Tên kho */}
            <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                    Tên kho <span className="text-red-500">*</span>
                </label>
                <input
                    name="TenKho"
                    placeholder="Nhập tên kho..."
                    defaultValue={defaultValues?.TenKho}
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
                    name="DiaChi"
                    placeholder="Nhập địa chỉ..."
                    defaultValue={defaultValues?.DiaChi}
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
                        name="TrangThai"
                        defaultValue={defaultValues?.TrangThai ?? "HOAT_DONG"}
                        disabled={isLoading}
                        className="h-10 w-full appearance-none rounded-md bg-[#E9F1FB] px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <option value="HOAT_DONG">Hoạt động</option>
                        <option value="NGUNG_HOAT_DONG">Ngưng hoạt động</option>
                    </select>
                    {/* Optional: Add a custom arrow icon here if you want to hide default browser arrow */}
                </div>
            </div>

            {/* Ghi chú */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">
                    Ghi chú
                </label>
                <input
                    name="GhiChu"
                    placeholder="Ghi chú thêm..."
                    defaultValue={defaultValues?.GhiChu ?? ""}
                    disabled={isLoading}
                    className="h-10 rounded-md bg-[#E9F1FB] px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                />
            </div>

            {/* Actions */}
            {/* Use col-span-full so buttons take full width on mobile or bottom of form */}
            <div className="col-span-1 sm:col-span-2 mt-6 flex items-center justify-between gap-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex h-11 flex-1 items-center justify-center rounded-lg bg-[#3f861e] text-white font-semibold hover:bg-[#529E29] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            {/* Simple CSS Spinner */}
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