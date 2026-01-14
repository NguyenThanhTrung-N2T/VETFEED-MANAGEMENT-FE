"use client";

import { useState } from "react";
import { NhaCungCapDTO, SanPhamCungCap } from "@/types"; // Adjust path if needed
import { Plus, Trash2, Package } from "lucide-react";

type Props = {
    defaultValues?: Partial<NhaCungCapDTO>;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    submitText: string;
    isLoading?: boolean;
};

export default function NhaCungCapForm({
    defaultValues,
    onSubmit,
    onCancel,
    submitText,
    isLoading = false,
}: Props) {
    // State to manage the list of products
    const [products, setProducts] = useState<SanPhamCungCap[]>([]);

    // Temporary state for the "Add Product" inputs
    const [newProdName, setNewProdName] = useState("");
    const [newProdPrice, setNewProdPrice] = useState<number | "">("");

    // Add a product to the list
    const handleAddProduct = () => {
        if (!newProdName.trim()) return;

        // Prevent duplicate names? (Optional, removed strict check to allow same name diff price if needed, but usually good to warn)

        const newProduct: SanPhamCungCap = {
            id: Date.now().toString(), // Temp ID
            tenSanPham: newProdName,
            giaNhap: Number(newProdPrice) || 0
        };

        setProducts([...products, newProduct]);
        setNewProdName("");
        setNewProdPrice("");
    };

    // Remove a product from the list
    const handleRemoveProduct = (index: number) => {
        setProducts(products.filter((_, i) => i !== index));
    };

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);

        onSubmit({
            ...defaultValues,
            MaNCC: defaultValues?.MaNCC, // Keep ID if editing
            MaNCCCode: defaultValues?.MaNCCCode || "",
            TenNCC: form.get("TenNCC") as string,
            SoDienThoai: form.get("SoDienThoai") as string,
            DiaChi: form.get("DiaChi") as string,
            GhiChu: (form.get("GhiChu") as string) || null,
            TrangThai: defaultValues?.TrangThai || "HOAT_DONG",
            SanPhams: products, // Include the dynamic list
        });
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* --- SECTION 1: BASIC INFO --- */}

            {/* Tên NCC */}
            <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                <label className="text-sm font-medium text-slate-700">Tên nhà cung cấp <span className="text-red-500">*</span></label>
                <input
                    name="TenNCC"
                    placeholder="VD: Công ty An Bình"
                    defaultValue={defaultValues?.TenNCC}
                    required
                    disabled={isLoading}
                    className="h-10 rounded-md bg-[#E9F1FB] px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Mã NCC */}
            <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                <label className="text-sm font-medium text-slate-700">Mã NCC</label>
                <input
                    name="MaNCCCode"
                    placeholder="Tự động tạo..."
                    defaultValue={defaultValues?.MaNCCCode}
                    disabled
                    className="h-10 rounded-md bg-slate-100 text-slate-500 px-3 text-sm outline-none cursor-not-allowed border border-slate-200"
                />
            </div>

            {/* Số điện thoại */}
            <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                <label className="text-sm font-medium text-slate-700">Số điện thoại</label>
                <input
                    name="SoDienThoai"
                    type="tel"
                    placeholder="VD: 0909..."
                    defaultValue={defaultValues?.SoDienThoai}
                    disabled={isLoading}
                    className="h-10 rounded-md bg-[#E9F1FB] px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Địa chỉ */}
            <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                <label className="text-sm font-medium text-slate-700">Địa chỉ</label>
                <input
                    name="DiaChi"
                    placeholder="VD: Q.Thủ Đức, TP.HCM"
                    defaultValue={defaultValues?.DiaChi}
                    disabled={isLoading}
                    className="h-10 rounded-md bg-[#E9F1FB] px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* --- SECTION 2: PRODUCTS LIST --- */}
            <div className="col-span-2 mt-2 pt-4 border-t border-slate-200">
                <label className="text-sm font-bold text-slate-800 mb-3 block">
                    Sản phẩm cung cấp
                </label>

                <div className="mb-3 border border-slate-200 rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500 flex justify-between">
                        <span>Danh sách sản phẩm</span>
                        <span>{products.length} sản phẩm</span>
                    </div>
                    {/* List of added products */}
                    <div className="max-h-50 overflow-y-auto p-2 space-y-2 bg-slate-50/50 custom-scrollbar">
                        {products.map((prod, index) => (
                            <div key={index} className="flex items-center gap-3 bg-slate-50 p-2 rounded border border-slate-200 group hover:border-blue-200 transition-colors">
                                <Package size={16} className="text-slate-400 group-hover:text-blue-500" />
                                <span className="font-semibold text-slate-700 flex-1 truncate" title={prod.tenSanPham}>
                                    {prod.tenSanPham}
                                </span>
                                <div className="text-sm text-slate-600 bg-white px-2 py-1 rounded border border-slate-100">
                                    <span className="font-medium">{prod.giaNhap?.toLocaleString() ?? 0}</span> <span className="text-[10px] text-slate-400">VNĐ</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveProduct(index)}
                                    className="ml-2 text-red-500 hover:bg-red-100 p-1.5 rounded transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {products.length === 0 && (
                            <p className="text-xs text-slate-400 italic p-2 text-center">Chưa có sản phẩm nào.</p>
                        )}
                    </div>
                </div>

                {/* Add new product input row */}
                <div className="flex items-end gap-2 bg-[#F1F5F9] p-3 rounded-lg">
                    <div className="flex-1">
                        <label className="text-xs text-slate-500 mb-1 block">Tên sản phẩm</label>
                        <input
                            value={newProdName}
                            onChange={(e) => setNewProdName(e.target.value)}
                            className="w-full h-9 rounded border border-slate-300 px-2 text-sm focus:border-blue-500 outline-none"
                            placeholder="Nhập tên..."
                        />
                    </div>
                    <div className="w-32">
                        <label className="text-xs text-slate-500 mb-1 block">Giá nhập</label>
                        <input
                            type="number"
                            value={newProdPrice}
                            onChange={(e) => setNewProdPrice(e.target.value === "" ? "" : Number(e.target.value))}
                            className="w-full h-9 rounded border border-slate-300 px-2 text-sm focus:border-blue-500 outline-none"
                            placeholder="0"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleAddProduct}
                        disabled={!newProdName.trim()}
                        className="h-9 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
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