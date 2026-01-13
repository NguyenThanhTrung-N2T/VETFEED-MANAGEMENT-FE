"use client";

import { useState } from "react";
import { SanPhamWithPriceDTO, UnitConversionDTO } from "@/types/SanPhamWithPrice";
import { Plus, Trash2, ArrowRight } from "lucide-react";

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
    isLoading = false,
}: Props) {
    // State to manage the list of conversion units
    const [units, setUnits] = useState<UnitConversionDTO[]>(defaultValues?.DonViQuyDoi || []);

    // Temporary state for the "Add Unit" inputs
    const [newUnitName, setNewUnitName] = useState("");
    const [newUnitRatio, setNewUnitRatio] = useState<number | "">("");
    const [baseUnit, setBaseUnit] = useState(defaultValues?.DonViCoSo || "");

    // Add a unit to the list
    const handleAddUnit = () => {
        if (!newUnitName || !newUnitRatio || Number(newUnitRatio) <= 1) return;

        // Prevent duplicate names
        if (units.some(u => u.DonViNhap.toLowerCase() === newUnitName.toLowerCase())) {
            alert("Đơn vị này đã tồn tại!");
            return;
        }

        setUnits([...units, { DonViNhap: newUnitName, TyLe: Number(newUnitRatio) }]);
        setNewUnitName("");
        setNewUnitRatio("");
    };

    // Remove a unit from the list
    const handleRemoveUnit = (index: number) => {
        setUnits(units.filter((_, i) => i !== index));
    };

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);

        onSubmit({
            ...defaultValues!,
            // Using crypto.randomUUID for ID if it's missing (handled in parent usually, but safe here)
            MaSP: defaultValues?.MaSP,
            MaSPCode: defaultValues?.MaSPCode || "", // Code handled by backend usually
            TenSP: form.get("TenSP") as string,
            LoaiSanPham: form.get("LoaiSanPham") as SanPhamWithPriceDTO["LoaiSanPham"],
            DonViCoSo: form.get("DonViCoSo") as string,
            DonGia: Number(form.get("DonGia")),
            GhiChu: (form.get("GhiChu") as string) || null,
            DonViQuyDoi: units, // Include the dynamic list
        });
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* --- SECTION 1: BASIC INFO --- */}

            {/* Tên sản phẩm */}
            <div className="flex flex-col gap-1 col-span-2">
                <label className="text-sm font-medium text-slate-700">Tên sản phẩm <span className="text-red-500">*</span></label>
                <input
                    name="TenSP"
                    placeholder="VD: Amoxicillin 15%"
                    defaultValue={defaultValues?.TenSP}
                    required
                    disabled={isLoading}
                    className="h-10 rounded-md bg-[#E9F1FB] px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Loại sản phẩm */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Loại sản phẩm</label>
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

            {/* Đơn vị cơ sở (Base Unit) */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">
                    Đơn vị cơ sở (Nhỏ nhất) <span className="text-red-500">*</span>
                </label>
                <input
                    name="DonViCoSo"
                    placeholder="VD: Viên, Lọ, Kg..."
                    value={baseUnit}
                    onChange={(e) => setBaseUnit(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-10 rounded-md bg-[#E9F1FB] px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Đơn giá */}
            <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-sm font-semibold text-slate-700">
                    Giá bán (Theo đơn vị cơ sở)
                </label>
                <div className="relative">
                    <input
                        name="DonGia"
                        type="number"
                        placeholder="0"
                        defaultValue={defaultValues?.DonGia}
                        disabled={isLoading}
                        className="h-11 w-full rounded-xl bg-[#E9F1FB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-slate-400"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">
                        VNĐ / {baseUnit || "..."}
                    </span>
                </div>
            </div>

            {/* --- SECTION 2: UNIT CONVERSION --- */}
            <div className="col-span-2 mt-2 pt-4 border-t border-slate-200">
                <label className="text-sm font-bold text-slate-800 mb-3 block">
                    Đơn vị quy đổi (Bán buôn)
                </label>

                <div className="mb-3 border border-slate-200 rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500 flex justify-between">
                        <span>Danh sách đơn vị</span>
                        <span>{units.length} đơn vị</span>
                    </div>
                    {/* List of added units */}
                    <div className="max-h-50 overflow-y-auto p-2 space-y-2 bg-slate-50/50">
                        {units.map((unit, index) => (
                            <div key={index} className="flex items-center gap-3 bg-slate-50 p-2 rounded border border-slate-200">
                                <span className="font-semibold text-blue-700 w-24">{unit.DonViNhap}</span>
                                <ArrowRight size={16} className="text-slate-400" />
                                <span className="text-slate-600">
                                    1 {unit.DonViNhap} = <span className="font-bold text-slate-800">{unit.TyLe}</span> {baseUnit || "(Đơn vị cơ sở)"}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveUnit(index)}
                                    className="ml-auto text-red-500 hover:bg-red-100 p-1 rounded transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {units.length === 0 && (
                            <p className="text-xs text-slate-400 italic">Chưa có đơn vị quy đổi nào (VD: Hộp, Thùng)</p>
                        )}
                    </div>
                </div>

                {/* Add new unit input row */}
                <div className="flex items-end gap-2 bg-[#F1F5F9] p-3 rounded-lg">
                    <div className="flex-1">
                        <label className="text-xs text-slate-500 mb-1 block">Tên đơn vị (VD: Hộp)</label>
                        <input
                            value={newUnitName}
                            onChange={(e) => setNewUnitName(e.target.value)}
                            className="w-full h-9 rounded border border-slate-300 px-2 text-sm"
                            placeholder="Tên đơn vị..."
                        />
                    </div>
                    <div className="w-32">
                        <label className="text-xs text-slate-500 mb-1 block">SL Quy đổi</label>
                        <input
                            type="number"
                            value={newUnitRatio}
                            onChange={(e) => setNewUnitRatio(Number(e.target.value))}
                            className="w-full h-9 rounded border border-slate-300 px-2 text-sm"
                            placeholder="SL..."
                        />
                    </div>
                    <div className="pb-1 text-sm text-slate-500 font-medium">
                        {baseUnit}
                    </div>
                    <button
                        type="button"
                        onClick={handleAddUnit}
                        disabled={!newUnitName || !newUnitRatio}
                        className="h-9 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            {/* Ghi chú */}
            <div className="flex flex-col col-span-2 gap-1 mt-2">
                <label className="text-sm font-medium text-slate-700">Ghi chú</label>
                <textarea
                    name="GhiChu"
                    rows={2}
                    placeholder="Ghi chú thêm..."
                    defaultValue={defaultValues?.GhiChu ?? ""}
                    disabled={isLoading}
                    className="w-full rounded-md bg-[#E9F1FB] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
            </div>

            {/* Actions */}
            <div className="col-span-2 mt-6 flex items-center justify-end gap-3">
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