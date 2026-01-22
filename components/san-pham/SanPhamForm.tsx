"use client";

import { useState, useMemo } from "react";
import { SanPhamResponse, DonViQuyDoiItem } from "@/client/types.gen";
import { Plus, Trash2, ArrowRight, X, UploadCloud, Loader2, Save } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

// This matches what the User sees on screen
export type SanPhamFormData = {
    tenSP: string;
    loaiSanPham: string;
    donViTinh: string;
    ghiChu?: string | null;
    price?: number | null;
    donViQuyDoi: DonViQuyDoiItem[];
    anhSanPham?: string | null;
};

type Props = {
    defaultValues?: Partial<SanPhamResponse> | null;
    onSubmit: (data: SanPhamFormData) => void;
    onCancel: () => void;
    submitText: string;
    isLoading?: boolean;
};

export default function SanPhamForm({ defaultValues, onSubmit, onCancel, submitText, isLoading = false }: Props) {

    // 1. CONTROLLED STATE
    // We group standard text fields for easier management
    const [info, setInfo] = useState({
        tenSP: defaultValues?.tenSP || "",
        loaiSanPham: defaultValues?.loaiSanPham || "THUOC_THU_Y",
        ghiChu: defaultValues?.ghiChu || "",
    });

    // Special fields state (kept separate as per your original logic)
    const [baseUnit, setBaseUnit] = useState(defaultValues?.donViCoSo || "");
    const [price, setPrice] = useState<number | undefined>(defaultValues?.donGia ?? undefined);
    const [imageUrl, setImageUrl] = useState<string | null>(defaultValues?.anhSanPham || null);

    // Unit List State
    const [units, setUnits] = useState<DonViQuyDoiItem[]>(
        (defaultValues?.donViQuyDoi as DonViQuyDoiItem[]) || []
    );

    // Temp state for adding new units
    const [newUnitName, setNewUnitName] = useState("");
    const [newUnitRatio, setNewUnitRatio] = useState<number | "">("");

    // 2. DETECT CHANGES
    const isChanged = useMemo(() => {
        // A. Helper to normalize values (treat null/undefined as "")
        const norm = (val: any) => (val ?? "").toString().trim();

        // B. Check Simple Fields
        const isInfoChanged =
            norm(info.tenSP) !== norm(defaultValues?.tenSP) ||
            norm(info.loaiSanPham) !== norm(defaultValues?.loaiSanPham || "THUOC_THU_Y") ||
            norm(info.ghiChu) !== norm(defaultValues?.ghiChu) ||
            norm(baseUnit) !== norm(defaultValues?.donViCoSo) ||
            norm(imageUrl) !== norm(defaultValues?.anhSanPham);

        // C. Check Price (Handle 0 vs undefined/null nuances)
        const initialPrice = defaultValues?.donGia ?? undefined;
        // Compare as numbers, treating null/undefined as distinct from 0 if needed, 
        // or just strict equality if your API treats null same as 0. 
        // Here we assume strict equality on the value.
        const isPriceChanged = price !== initialPrice;

        if (isInfoChanged || isPriceChanged) return true;

        // D. Check Units (Deep Compare)
        const initialUnits = (defaultValues?.donViQuyDoi as DonViQuyDoiItem[]) || [];

        if (units.length !== initialUnits.length) return true;

        // Compare content (assuming order matters in UI list)
        // We create a string signature for the list "UnitName-Ratio|UnitName-Ratio"
        const createSig = (list: DonViQuyDoiItem[]) =>
            list.map(u => `${u.donViNhap}-${u.tyLe}`).join("|");

        return createSig(units) !== createSig(initialUnits);

    }, [info, baseUnit, price, imageUrl, units, defaultValues]);


    // --- HANDLERS ---
    const handleInfoChange = (field: string, value: string) => {
        setInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleAddUnit = () => {
        if (!newUnitName || !newUnitRatio || Number(newUnitRatio) <= 1) return;

        const isDuplicateInList = units.some(u => u.donViNhap && u.donViNhap.toLowerCase() === newUnitName.toLowerCase());
        const isDuplicateBase = baseUnit.toLowerCase() === newUnitName.toLowerCase();

        if (isDuplicateInList || isDuplicateBase) {
            alert("Tên đơn vị này đã tồn tại!");
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

        // Use State directly (Cleaner than FormData since we are controlled now)
        const submitData: SanPhamFormData = {
            tenSP: info.tenSP,
            loaiSanPham: info.loaiSanPham,
            donViTinh: baseUnit,
            ghiChu: info.ghiChu || null,
            price: price || null,
            anhSanPham: imageUrl,
            donViQuyDoi: units,
        };

        onSubmit(submitData);
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* --- SECTION 0: IMAGE UPLOAD --- */}
            <div className="col-span-2 flex justify-center mb-4">
                {imageUrl ? (
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
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <CldUploadWidget
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "YOUR_UPLOAD_PRESET"}
                        onSuccess={(result) => {
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
                    // Changed to Controlled
                    value={info.tenSP}
                    onChange={(e) => handleInfoChange("tenSP", e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                />
            </div>

            {/* Loại sản phẩm */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Loại sản phẩm</label>
                <select
                    name="loaiSanPham"
                    // Changed to Controlled
                    value={info.loaiSanPham}
                    onChange={(e) => handleInfoChange("loaiSanPham", e.target.value)}
                    disabled={isLoading}
                    className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <option value="THUOC_THU_Y">Thuốc thú y</option>
                    <option value="THUC_AN_CHAN_NUOI">Thức ăn chăn nuôi</option>
                </select>
            </div>

            {/* Đơn vị tính */}
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
                    className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                />
            </div>

            {/* Giá bán */}
            <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-sm font-semibold text-slate-700">
                    Giá bán (Theo đơn vị cơ sở)
                </label>
                <div className="relative">
                    <input
                        name="priceInput"
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        // If price is 0 or undefined, show empty string
                        value={price ? new Intl.NumberFormat("vi-VN").format(price) : ""}
                        onChange={(e) => {
                            // 1. Remove non-numeric characters
                            const rawValue = e.target.value.replace(/\D/g, "");

                            // 2. Convert to number
                            const numValue = Number(rawValue);

                            // 3. LOGIC FIX: Only set price if it is GREATER than 0. 
                            // If 0, empty string, or NaN, set to undefined.
                            setPrice(numValue > 0 ? numValue : undefined);
                        }}
                        disabled={isLoading}
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
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
                    <div className="bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500 flex justify-between">
                        <span>Danh sách đơn vị</span>
                        <span>{units.length} đơn vị</span>
                    </div>

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
                                    className="ml-auto text-red-500 hover:bg-red-100 p-1 rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
                        className="h-9 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
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
                    // Changed to Controlled
                    value={info.ghiChu}
                    onChange={(e) => handleInfoChange("ghiChu", e.target.value)}
                    disabled={isLoading}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                />
            </div>

            {/* Actions */}
            <div className="col-span-2 px-4 py-2 border-t bg-white border-gray-100 flex justify-end gap-3 sticky bottom-0 text-slate-800 z-10">
                <button
                    type="submit"
                    // DISABLED IF: Loading OR Not Changed
                    disabled={isLoading || !isChanged || !price}
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
                    className="px-6 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    Hủy
                </button>
            </div>
        </form>
    );
}