"use client";

import { useState, useEffect } from "react";
import { SanPhamCreateRequest, SanPhamResponse, DonViQuyDoiItem } from "@/client/types.gen";
import { Plus, Trash2, ArrowRight, Image as ImageIcon, X, UploadCloud } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

// This matches what the User sees on screen, not exactly the API request
export type SanPhamFormData = {
    tenSP: string;
    loaiSanPham: string;
    donViTinh: string; // Base unit
    ghiChu?: string | null;
    price?: number | null; // Generic price (maps to giaBanDau OR giaMoi)
    donViQuyDoi: DonViQuyDoiItem[];
    anhSanPham?: string | null;
};

type Props = {
    // We accept a partial Response (for editing) or Partial CreateRequest
    defaultValues?: Partial<SanPhamResponse> | null;
    onSubmit: (data: SanPhamFormData) => void;
    onCancel: () => void;
    submitText: string;
    isLoading?: boolean;
};

export default function SanPhamForm({ defaultValues, onSubmit, onCancel, submitText, isLoading = false }: Props) {
    // --- STATE MANAGEMENT ---
    console.log(defaultValues?.anhSanPham);
    // Map default units. We assume the backend returns an array matching the Item shape.
    // We explicitly cast to LocalDonViQuyDoiItem[] if types.gen doesn't fully match the inferred shape.
    const [units, setUnits] = useState<DonViQuyDoiItem[]>(
        (defaultValues?.donViQuyDoi as DonViQuyDoiItem[]) || []
    );

    // Form states
    const [baseUnit, setBaseUnit] = useState(defaultValues?.donViCoSo || "");
    const [price, setPrice] = useState<number | undefined>(
        defaultValues?.donGia ?? undefined
    );

    // Temporary state for the "Add Unit" inputs
    const [newUnitName, setNewUnitName] = useState("");
    const [newUnitRatio, setNewUnitRatio] = useState<number | "">("");
    const [imageUrl, setImageUrl] = useState<string | null>(
        defaultValues?.anhSanPham || null
    );
    // --- HANDLERS ---

    const handleAddUnit = () => {
        if (!newUnitName || !newUnitRatio || Number(newUnitRatio) <= 1) return;

        // Prevent duplicate names (check against list AND base unit)
        const isDuplicateInList = units.some(u => u.donViNhap && u.donViNhap.toLowerCase() === newUnitName.toLowerCase());
        const isDuplicateBase = baseUnit.toLowerCase() === newUnitName.toLowerCase();

        if (isDuplicateInList || isDuplicateBase) {
            alert("Tên đơn vị này đã tồn tại (trùng với danh sách hoặc đơn vị cơ sở)!");
            return;
        }

        setUnits([...units, { donViNhap: newUnitName, tyLe: Number(newUnitRatio) }]);
        setNewUnitName("");
        setNewUnitRatio("");
    };

    const handleRemoveUnit = (index: number) => {
        setUnits(units.filter((_, i) => i !== index));
    };

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);

        // Construct the neutral data object
        const formData: SanPhamFormData = {
            tenSP: form.get("tenSP") as string,
            loaiSanPham: form.get("loaiSanPham") as string,
            donViTinh: baseUnit,
            ghiChu: (form.get("ghiChu") as string) || null,
            price: price || null, // Pass the state value
            anhSanPham: imageUrl,
            donViQuyDoi: units as unknown as DonViQuyDoiItem[],
        };

        onSubmit(formData);
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* --- SECTION 0: IMAGE UPLOAD --- */}
            <div className="col-span-2 flex justify-center mb-4">
                {imageUrl ? (
                    // Display uploaded image
                    <div className="relative h-40 w-40 rounded-xl border-2 border-slate-200 overflow-hidden group bg-white">
                        <Image
                            src={imageUrl}
                            alt="Product preview"
                            fill
                            className="object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => setImageUrl(null)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    // Display Upload Button
                    <CldUploadWidget
                        // REPLACE THIS with your specific Upload Preset from Cloudinary Settings
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "YOUR_UPLOAD_PRESET_HERE"}
                        onSuccess={(result) => {
                            // Validating result structure from Cloudinary
                            if (typeof result.info === 'object' && 'secure_url' in result.info) {
                                setImageUrl(result.info.secure_url);
                            }
                        }}
                        options={{
                            maxFiles: 1,
                            resourceType: "image",
                            clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
                        }}
                    >
                        {({ open }) => (
                            <div
                                onClick={() => open()}
                                className="h-40 w-40 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-colors"
                            >
                                <div className="bg-blue-100 p-3 rounded-full mb-2">
                                    <UploadCloud className="text-blue-600" size={24} />
                                </div>
                                <span className="text-xs font-semibold text-slate-500">Tải ảnh lên</span>
                            </div>
                        )}
                    </CldUploadWidget>
                )}
            </div>
            {/* --- SECTION 1: BASIC INFO --- */}

            {/* Tên sản phẩm */}
            <div className="flex flex-col gap-1 col-span-2">
                <label className="text-sm font-medium text-slate-700">
                    Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                    name="tenSP"
                    placeholder="VD: Amoxicillin 15%"
                    defaultValue={defaultValues?.tenSP || ""}
                    required
                    disabled={isLoading}
                    className="h-10 rounded-md bg-[#E9F1FB] px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                />
            </div>

            {/* Loại sản phẩm */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Loại sản phẩm</label>
                <select
                    name="loaiSanPham"
                    defaultValue={defaultValues?.loaiSanPham ?? "THUOC_THU_Y"}
                    disabled={isLoading}
                    className="h-10 rounded-md bg-[#E9F1FB] px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <option value="THUOC_THU_Y">Thuốc thú y</option>
                    <option value="THUC_AN_CHAN_NUOI">Thức ăn chăn nuôi</option>
                    <option value="KHAC">Khác</option>
                </select>
            </div>

            {/* Đơn vị tính (formerly DonViCoSo) */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">
                    Đơn vị cơ sở (Nhỏ nhất) <span className="text-red-500">*</span>
                </label>
                <input
                    name="donViTinh"
                    placeholder="VD: Viên, Lọ, Kg..."
                    value={baseUnit}
                    onChange={(e) => setBaseUnit(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-10 rounded-md bg-[#E9F1FB] px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                />
            </div>

            {/* Giá bán */}
            <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-sm font-semibold text-slate-700">
                    Giá bán (Theo đơn vị cơ sở)
                </label>
                <div className="relative">
                    <input
                        name="priceInput" // Logic handled via state, not direct form data submit for safety
                        type="number"
                        placeholder="0"
                        value={price ?? ""}
                        onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : undefined)}
                        disabled={isLoading}
                        className="h-11 w-full rounded-xl bg-[#E9F1FB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
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
                                <span className="font-semibold text-blue-700 w-24 truncate" title={unit.donViNhap ?? ''}>
                                    {unit.donViNhap}
                                </span>
                                <ArrowRight size={16} className="text-slate-400" />
                                <span className="text-slate-600 flex-1">
                                    1 {unit.donViNhap} = <span className="font-bold text-slate-800">{unit.tyLe}</span> {baseUnit || "(Đơn vị cơ sở)"}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveUnit(index)}
                                    className="ml-auto text-red-500 hover:bg-red-100 p-1 rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {units.length === 0 && (
                            <p className="text-xs text-slate-400 italic">
                                Chưa có đơn vị quy đổi nào (VD: 1 Hộp = 10 Lọ)
                            </p>
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
                            className="w-full h-9 rounded border border-slate-300 px-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                            placeholder="Tên đơn vị..."
                        />
                    </div>
                    <div className="w-32">
                        <label className="text-xs text-slate-500 mb-1 block">SL Quy đổi</label>
                        <input
                            type="number"
                            value={newUnitRatio}
                            onChange={(e) => setNewUnitRatio(Number(e.target.value))}
                            className="w-full h-9 rounded border border-slate-300 px-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                            placeholder="SL..."
                        />
                    </div>
                    <div className="pb-1 text-sm text-slate-500 font-medium whitespace-nowrap">
                        {baseUnit ? `(${baseUnit})` : "(Base)"}
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
                    name="ghiChu"
                    rows={2}
                    placeholder="Ghi chú thêm..."
                    defaultValue={defaultValues?.ghiChu ?? ""}
                    disabled={isLoading}
                    className="w-full rounded-md bg-[#E9F1FB] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                />
            </div>

            {/* Actions */}
            <div className="col-span-2 mt-6 flex items-center justify-end gap-3">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex h-11 flex-1 items-center justify-center rounded-lg bg-[#3f861e] text-white font-semibold hover:bg-[#529E29] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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
                    className="h-11 flex-1 rounded-lg border-2 border-red-500 text-red-500 font-semibold hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    Hủy
                </button>
            </div>
        </form>
    );
}