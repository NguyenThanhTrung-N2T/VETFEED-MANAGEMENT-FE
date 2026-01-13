"use client";

import { SanPhamWithPriceDTO } from "@/types";

type Props = {
    defaultValues?: SanPhamWithPriceDTO;
    onSubmit: (data: SanPhamWithPriceDTO) => void;
    onCancel: () => void;
    submitText: string;
    isLoading?: boolean;
};

export default function SanPhamForm({
    defaultValues,
    onSubmit,
    onCancel,
    submitText,
    isLoading = false, // Default to false
}: Props) {
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);

        onSubmit({
            ...defaultValues!,
            TenSP: form.get("TenSP") as string,
            LoaiSanPham: form.get("LoaiSanPham") as SanPhamWithPriceDTO["LoaiSanPham"],
            DonViTinh: form.get("DonViTinh") as string,
            DonGia: Number(form.get("DonGia")),
            GhiChu: (form.get("GhiChu") as string) || null,
        });
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* Tên sản phẩm */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">
                    Tên sản phẩm
                </label>
                <input
                    name="TenSP"
                    placeholder="Tên sản phẩm..."
                    defaultValue={defaultValues?.TenSP}
                    required
                    disabled={isLoading}
                    className="h-10 rounded-md bg-[#E9F1FB] px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Loại sản phẩm */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">
                    Loại sản phẩm
                </label>
                <select
                    name="LoaiSanPham"
                    defaultValue={defaultValues?.LoaiSanPham ?? "THUOC_THU_Y"}
                    disabled={isLoading}
                    className="h-10 rounded-md bg-[#E9F1FB] px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="THUOC_THU_Y">Thuốc thú y</option>
                    <option value="THUC_AN_CHAN_NUOI">Thức ăn chăn nuôi</option>
                </select>
            </div>

            {/* Đơn vị tính */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">
                    Đơn vị tính
                </label>
                <input
                    name="DonViTinh"
                    placeholder="Đơn vị tính..."
                    defaultValue={defaultValues?.DonViTinh!}
                    required
                    disabled={isLoading}
                    className="h-10 rounded-md bg-[#E9F1FB] px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            {/* Đơn giá */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-500 ml-1">
                    Đơn giá
                </label>
                <input
                    name="DonGia"
                    type="number"
                    placeholder="Đơn giá..."
                    defaultValue={defaultValues?.DonGia}
                    disabled={isLoading}
                    className="h-11 rounded-xl bg-[#E9F1FB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-slate-400"
                />
            </div>
            {/* Ghi chú */}
            <div className="flex flex-col col-span-2 gap-1">
                <label className="text-sm font-medium text-slate-700">
                    Ghi chú
                </label>
                <input
                    name="GhiChu"
                    placeholder="Ghi chú..."
                    defaultValue={defaultValues?.GhiChu ?? ""}
                    disabled={isLoading}
                    className="h-10 rounded-md bg-[#E9F1FB] px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Actions */}
            <div className="col-span-2 mt-6 flex items-center justify-between gap-6">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="h-11 flex-1 rounded-lg bg-[#3f861e] text-white font-semibold hover:bg-[#529E29] transition-colors"
                >
                    {submitText}
                </button>

                <button
                    type="button"
                    disabled={isLoading}
                    onClick={onCancel}
                    className="h-11 flex-1 rounded-lg border-2 border-red-500 text-red-500 font-semibold hover:bg-red-50 transition-colors"
                >
                    Hủy
                </button>
            </div>
        </form>
    );
}