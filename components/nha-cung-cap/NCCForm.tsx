"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Package, AlertCircle } from "lucide-react";
import ProductSearch from "@/components/ProductSearch";
import { ProductSearchResult } from "@/types/product-search"
import {
    NhaCungCapCreateRequest,
    NhaCungCapDetailedResponse,
    NhaCungCapSanPhamItemDto,
    NhaCungCapSanPhamResponse
} from "@/client/types.gen";

type Props = {
    // When editing, we pass the full Detailed Response
    defaultValues?: Partial<NhaCungCapDetailedResponse>;
    onSubmit: (data: NhaCungCapCreateRequest) => void;
    onCancel: () => void;
    submitText: string;
    isLoading?: boolean;
};

export default function NhaCungCapForm({
    defaultValues,
    onSubmit,
    onCancel,
    submitText,
    isLoading = false
}: Props) {

    // 1. MAIN PRODUCT LIST STATE
    const [rows, setRows] = useState<NhaCungCapSanPhamResponse[]>([]);

    // 2. INPUT AREA STATE
    const [selectedSearch, setSelectedSearch] = useState<ProductSearchResult | null>(null);
    const [inputPrice, setInputPrice] = useState<number | "">("");
    const [inputNote, setInputNote] = useState("");
    const [duplicateError, setDuplicateError] = useState<string | null>(null);

    const [deletedRow, setDeletedRow] = useState<NhaCungCapSanPhamResponse | null>(null);
    const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    // 3. INITIALIZATION (Mapping Response -> UI State)
    useEffect(() => {
        if (defaultValues?.sanPhams && Array.isArray(defaultValues.sanPhams)) {
            const mappedRows: NhaCungCapSanPhamResponse[] = defaultValues.sanPhams.map((p, idx) => ({
                maNCSP: p.maNCSP, // Keep the link ID if editing
                maSP: p.maSP,
                tenSanPham: p.tenSanPham,
                maSanPhamCode: p.maSanPhamCode,
                donViCoSo: p.donViCoSo,
                giaNhapMacDinh: p.giaNhapMacDinh,
                ghiChu: p.ghiChu || "",
                trangThai: p.trangThai || "HOAT_DONG"
            }));
            setRows(mappedRows);
        }
    }, [defaultValues]);

    // 4. ADD HANDLER
    const handleAddRow = () => {
        if (!selectedSearch) return;

        // Duplicate Check
        const isDuplicate = rows.some(r => r.maSP === selectedSearch.maSP);
        if (isDuplicate) {
            setDuplicateError(`Sản phẩm "${selectedSearch.tenSP}" đã có trong danh sách.`);
            return;
        }

        // Create UI Row
        const newRow: NhaCungCapSanPhamResponse = {
            maNCSP: crypto.randomUUID(),
            maSP: selectedSearch.maSP,
            tenSanPham: selectedSearch.tenSP,
            maSanPhamCode: selectedSearch.maSPCode,
            donViCoSo: selectedSearch.donViCoSo,
            giaNhapMacDinh: Number(inputPrice) || 0,
            ghiChu: inputNote,
            trangThai: "HOAT_DONG"
        };
        // Cancel undo if user performs a new action
        finalizeUndo();
        setRows(prev => [...prev, newRow]);

        // Reset Inputs
        setDuplicateError(null);
        setSelectedSearch(null);
        setInputPrice("");
        setInputNote("");
    };

    // 5. REMOVE HANDLER
    const handleRemoveRow = (uiId: string) => {
        const row = rows.find(r => r.maNCSP === uiId);
        if (!row) return;

        // Remove immediately
        setRows(prev => prev.filter(r => r.maNCSP !== uiId));

        // Save for undo
        setDeletedRow(row);

        // Clear old timeout if exists
        if (undoTimeoutRef.current) {
            clearTimeout(undoTimeoutRef.current);
        }

        // Finalize delete after 5 seconds
        undoTimeoutRef.current = setTimeout(() => {
            setDeletedRow(null);
            undoTimeoutRef.current = null;
            // 👉 If you need API delete later, call it here
        }, 5000);
    };

    // 6. SUBMIT HANDLER
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        finalizeUndo();
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Map UI Rows -> Request DTO
        const sanPhamsRequest: NhaCungCapSanPhamItemDto[] = rows.map(r => ({
            maSP: r.maSP,
            giaNhapMacDinh: r.giaNhapMacDinh,
            ghiChu: r.ghiChu || null,
            trangThai: "HOAT_DONG"
        }));

        const submitData: NhaCungCapCreateRequest = {
            tenNCC: formData.get("tenNCC") as string,
            soDienThoai: (formData.get("soDienThoai") as string) || null,
            diaChi: (formData.get("diaChi") as string) || null,
            ghiChu: (formData.get("ghiChu") as string) || null,
            trangThai: (formData.get("trangThai") as string) || "HOAT_DONG",
            sanPhams: sanPhamsRequest
        };
        console.log(submitData);
        onSubmit(submitData);
    };
    const finalizeUndo = () => {
        if (undoTimeoutRef.current) {
            clearTimeout(undoTimeoutRef.current);
            undoTimeoutRef.current = null;
        }
        setDeletedRow(null);
    };
    const handleUndo = () => {
        if (!deletedRow) return;
        setRows(prev => [...prev, deletedRow]);
        setDeletedRow(null);

        if (undoTimeoutRef.current) {
            clearTimeout(undoTimeoutRef.current);
            undoTimeoutRef.current = null;
        }
    }
    const formatVND = (value?: number | null): string => {
        if (value == null) return "";
        return value.toLocaleString("vi-VN");
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* --- SECTION 1: GENERAL INFO --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* TenNCC */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-700">
                        Tên nhà cung cấp <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="tenNCC"
                        required
                        defaultValue={defaultValues?.tenNCC ?? ''}
                        disabled={isLoading}
                        placeholder="VD: Công ty ABC"
                        className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>

                {/* SoDienThoai */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-700">Số điện thoại</label>
                    <input
                        name="soDienThoai"
                        defaultValue={defaultValues?.soDienThoai ?? ""}
                        disabled={isLoading}
                        placeholder="09xx..."
                        className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>

                {/* DiaChi */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-700">Địa chỉ</label>
                    <input
                        name="diaChi"
                        defaultValue={defaultValues?.diaChi ?? ""}
                        disabled={isLoading}
                        placeholder="Địa chỉ liên hệ..."
                        className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
                {/* TrangThai */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-700">Trạng thái</label>
                    <div className="relative">
                        <select
                            name="trangThai"
                            disabled={isLoading}
                            defaultValue={defaultValues?.trangThai || 'HOAT_DONG'}
                            className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        >
                            <option value="HOAT_DONG">Hoạt động</option>
                            <option value="NGUNG_HOAT_DONG">Ngưng hoạt động</option>
                        </select>
                    </div>
                </div>
                {/* GhiChu */}
                <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-sm font-medium text-slate-700">Ghi chú</label>
                    <textarea
                        name="ghiChu"
                        rows={1}
                        defaultValue={defaultValues?.ghiChu ?? ""}
                        disabled={isLoading}
                        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
                    />
                </div>
            </div>

            {/* --- SECTION 2: PRODUCTS --- */}
            <div className="border-t border-slate-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-800">Danh mục hàng hóa cung cấp</h3>
                    <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                        {rows.length} sản phẩm
                    </span>
                </div>

                {/* A. INPUT AREA (Top) */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4 shadow-sm">
                    <div className="grid grid-cols-12 gap-3 items-end">
                        {/* Search */}
                        <div className="col-span-12 md:col-span-5">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">
                                Tìm sản phẩm
                            </label>
                            <ProductSearch
                                selectedItem={selectedSearch}
                                onSelect={(item) => {
                                    setSelectedSearch(item);
                                    setDuplicateError(null);
                                }}
                                onClear={() => {
                                    setSelectedSearch(null);
                                    setDuplicateError(null);
                                }}
                            />

                        </div>

                        {/* Price */}
                        <div className="col-span-6 md:col-span-3">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">
                                Giá nhập
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={inputPrice}
                                onChange={(e) => setInputPrice(e.target.value === "" ? "" : Number(e.target.value))}
                                className="w-full h-10 rounded-md border border-slate-300 px-3 text-right text-sm focus:border-blue-500 outline-none"
                            />
                        </div>

                        {/* Note */}
                        <div className="col-span-6 md:col-span-3">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">
                                Ghi chú SP
                            </label>
                            <input
                                value={inputNote}
                                onChange={(e) => setInputNote(e.target.value)}
                                placeholder="..."
                                className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm focus:border-blue-500 outline-none"
                            />
                        </div>

                        {/* Button */}
                        <div className="col-span-12 md:col-span-1">
                            <button
                                type="button"
                                onClick={handleAddRow}
                                disabled={!selectedSearch}
                                className="w-full h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-default cursor-pointer flex items-center justify-center transition-colors"
                                title="Thêm vào danh sách"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                    {duplicateError ? (
                        <div className="col-span-12 flex items-center gap-2 text-[12px] text-red-600 mt-1">
                            <AlertCircle size={14} />
                            <span>{duplicateError}</span>
                        </div>
                    ) : (<div className="mt-2 flex items-center gap-1.5 text-[12px] text-slate-400">
                        <AlertCircle size={12} />
                        <span>Sử dụng ô tìm kiếm để chọn sản phẩm.</span>
                    </div>)}
                </div>

                {/* B. TABLE LIST (Bottom) */}
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 w-28">Mã SP</th>
                                <th className="px-4 py-3">Tên sản phẩm</th>
                                <th className="px-4 py-3 text-center w-24">ĐVT</th>
                                <th className="px-4 py-3 text-right w-32">Giá nhập</th>
                                <th className="px-4 py-3">Ghi chú</th>
                                <th className="px-4 py-3 w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12">
                                        <div className="text-center text-slate-400 italic flex flex-col items-center justify-center gap-2">
                                            <Package size={24} className="opacity-40" />
                                            <span>Chưa có sản phẩm nào được gán.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row) => (
                                    <tr key={row.maNCSP || row.maSP} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-2.5 font-mono text-xs text-slate-500">
                                            {row.maSanPhamCode || row.maSP?.substring(0, 6)}
                                        </td>

                                        <td className="px-4 py-2.5 font-medium text-slate-700">
                                            {row.tenSanPham}
                                        </td>

                                        <td className="px-4 py-2.5 text-center text-slate-500 text-xs">
                                            {row.donViCoSo}
                                        </td>

                                        <td className="px-4 py-2.5 text-right font-medium text-slate-700">
                                            {formatVND(row.giaNhapMacDinh)}
                                        </td>

                                        <td className="px-4 py-2.5 text-slate-500 truncate max-w-37.5">
                                            {row.ghiChu}
                                        </td>
                                        <td className="px-4 py-2.5 text-right">
                                            <button type="button" onClick={() => handleRemoveRow(row.maNCSP!)} className="text-slate-300 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-all cursor-pointer">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- ACTIONS --- */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
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
                    {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                </button>
            </div>
            {deletedRow && (
                <div
                    className="fixed bottom-6 right-6 z-50 flex items-center justify-between max-w-xs w-full gap-4 rounded-lg bg-[#0f172a] px-4 py-3 text-sm text-white shadow-lg border border-[#1d2d54] animate-toast-in"
                >
                    {/* Icon */}
                    <div className="flex items-center gap-3">
                        <Trash2 className="h-5 w-5 text-white" />
                        <span className="truncate">
                            Đã xóa <b>{deletedRow.tenSanPham}</b>
                        </span>
                    </div>

                    {/* Undo Button */}
                    <button
                        type="button"
                        onClick={handleUndo}
                        className="ml-auto font-medium text-green-200 hover:text-white transition-colors cursor-pointer hover:underline"
                    >
                        Hoàn tác
                    </button>
                </div>
            )}


        </form>
    );
}