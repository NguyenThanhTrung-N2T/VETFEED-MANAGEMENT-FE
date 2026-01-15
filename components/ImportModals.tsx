"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Trash2, Save, AlertTriangle, Loader2, Search, Plus, Edit, Info } from "lucide-react";
import { importService, SanPhamNCC, CTPhieuNhap } from "@/services/import.service";
import { format } from "date-fns";

type ModalType = "filter" | "add" | "edit" | "detail" | "delete" | null;

interface ImportModalsProps {
    isOpen: boolean;
    type: ModalType;
    selectedId: string | null;
    onClose: (refresh?: boolean) => void;
}

const DEFAULT_FORM = {
    maNCC: "",
    maKho: "",
    ghiChu: "",
    trangThai: "DA_DAT", // Default
};

const DEFAULT_NEW_ITEM = {
    maSP: "",
    tenSP: "",
    soLuong: 1,
    donGia: 0,
    donViNhap: "",
    hanSuDung: "",
    ngaySanXuat: "",
};

export default function ImportModals({ isOpen, type, selectedId, onClose }: ImportModalsProps) {
    // --- Master Data ---
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);

    // --- Data for Selection ---
    const [availableProducts, setAvailableProducts] = useState<SanPhamNCC[]>([]);
    const [selectedProductUnits, setSelectedProductUnits] = useState<{ name: string; rate: number }[]>([]);

    // --- Form State ---
    const [formData, setFormData] = useState(DEFAULT_FORM);
    const [itemList, setItemList] = useState<CTPhieuNhap[]>([]);

    // --- New Item State ---
    const [newItem, setNewItem] = useState(DEFAULT_NEW_ITEM);

    // --- Product Search UI ---
    const [productKeyword, setProductKeyword] = useState("");
    const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
    const [activeProductIndex, setActiveProductIndex] = useState(0);
    const productSearchWrapRef = useRef<HTMLDivElement | null>(null);
    const qtyRef = useRef<HTMLInputElement | null>(null);

    // --- UI State ---
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [newItemError, setNewItemError] = useState<string | null>(null);
    const [flashRowIndex, setFlashRowIndex] = useState<number | null>(null);

    // Unsaved changes guard
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const isDetail = type === "detail";
    const isEdit = type === "edit";
    const isAdd = type === "add";

    // --- EFFECT: Init Data ---
    useEffect(() => {
        if (!isOpen) return;

        loadInitialData();

        setFormError(null);
        setNewItemError(null);
        setFlashRowIndex(null);

        if (type === "add") {
            resetForm();
            setHasUnsavedChanges(false);
        } else if ((type === "edit" || type === "detail") && selectedId) {
            fetchDetail(selectedId);
            setHasUnsavedChanges(false);
        }
    }, [isOpen, type, selectedId]);

    // Close dropdown when click outside
    useEffect(() => {
        function onDocMouseDown(e: MouseEvent) {
            if (!productSearchWrapRef.current) return;
            const target = e.target as Node;
            if (!productSearchWrapRef.current.contains(target)) {
                setIsProductDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", onDocMouseDown);
        return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, []);

    const loadInitialData = async () => {
        try {
            const [ncc, kho] = await Promise.all([importService.getSuppliers(), importService.getWarehouses()]);
            setSuppliers(ncc);
            setWarehouses(kho);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchDetail = async (id: string) => {
        setIsLoading(true);
        try {
            const data = await importService.getById(id);
            setFormData({
                maNCC: data.maNCC,
                maKho: data.maKho,
                ghiChu: data.ghiChu,
                trangThai: data.trangThai,
            });
            if (data.maNCC) await loadProductsOfSupplier(data.maNCC);
            setItemList(data.danhSachChiTiet || []);
            // Reset add-item UI
            resetNewItem();
            setProductKeyword("");
            setIsProductDropdownOpen(false);
            setActiveProductIndex(0);
        } catch (error) {
            console.error(error);
            setFormError("Không thể tải chi tiết phiếu.");
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData(DEFAULT_FORM);
        setItemList([]);
        setAvailableProducts([]);
        resetNewItem();
        setProductKeyword("");
        setIsProductDropdownOpen(false);
        setActiveProductIndex(0);
        setFormError(null);
        setNewItemError(null);
    };

    const resetNewItem = () => {
        setNewItem(DEFAULT_NEW_ITEM);
        setSelectedProductUnits([]);
        setNewItemError(null);
    };

    // --- HANDLERS ---
    const markDirty = () => {
        if (!isDetail) setHasUnsavedChanges(true);
    };

    const handleRequestClose = (refresh?: boolean) => {
        if (!refresh && !isDetail && hasUnsavedChanges) {
            const ok = window.confirm("Bạn có thay đổi chưa lưu. Bạn chắc chắn muốn đóng?");
            if (!ok) return;
        }
        onClose(refresh);
    };

    const handleSupplierChange = async (maNCC: string) => {
        setFormData((prev) => ({ ...prev, maNCC }));
        setFormError(null);
        markDirty();

        // reset product selection / items on supplier change when creating new
        await loadProductsOfSupplier(maNCC);
        if (isAdd) setItemList([]);
        resetNewItem();
        setProductKeyword("");
        setIsProductDropdownOpen(false);
    };

    const loadProductsOfSupplier = async (maNCC: string) => {
        try {
            const data = await importService.getSupplierDetail(maNCC);
            setAvailableProducts(data.sanPhams || []);
        } catch (err) {
            console.error(err);
            setFormError("Không thể tải danh sách sản phẩm của NCC.");
        }
    };

    const handleProductSelect = async (product: SanPhamNCC) => {
        setProductKeyword(product.tenSP);
        setIsProductDropdownOpen(false);
        setActiveProductIndex(0);

        await handleProductChange(product.maSP);
        // Focus quantity for fast input
        setTimeout(() => qtyRef.current?.focus(), 0);
    };

    const handleProductChange = async (maSP: string) => {
        const productBasic = availableProducts.find(p => p.maSP === maSP);
        if (!productBasic) return;

        // Set thông tin cơ bản
        setNewItem(prev => ({
            ...prev,
            maSP,
            tenSP: productBasic.tenSP,
            donGia: productBasic.giaNhapMacDinh || 0
        }));

        try {
            // Gọi API lấy chi tiết để lấy Đơn vị quy đổi
            const detail = await importService.getProductDetail(maSP);

            // [LOGIC MỚI] Chỉ lấy danh sách đơn vị quy đổi (bỏ đơn vị cơ sở)
            const units = detail.donViQuyDoi?.map(d => ({ name: d.donViNhap, rate: d.tyLe })) || [];

            setSelectedProductUnits(units);

            // Tự động chọn đơn vị quy đổi đầu tiên nếu có
            if (units.length > 0) {
                setNewItem(prev => ({ ...prev, donViNhap: units[0].name }));
            } else {
                setNewItem(prev => ({ ...prev, donViNhap: '' }));
                // Có thể cảnh báo nếu sản phẩm không có đơn vị quy đổi
                // alert("Sản phẩm này chưa cấu hình đơn vị quy đổi!");
            }
        } catch (err) { console.error(err); }
    };

    const calculateTotal = () => itemList.reduce((sum, item) => sum + item.soLuong * (item.donGia || 0), 0);

    const money = (v: number) => new Intl.NumberFormat("vi-VN").format(v);

    const validateNewItem = () => {
        if (!newItem.maSP) return "Vui lòng chọn sản phẩm.";
        if (!newItem.donViNhap) return "Vui lòng chọn đơn vị tính.";
        if (!newItem.hanSuDung) return "Hạn sử dụng là bắt buộc.";
        if (newItem.soLuong <= 0) return "Số lượng phải lớn hơn 0.";
        return null;
    };

    const handleAddItem = () => {
        const err = validateNewItem();
        if (err) {
            setNewItemError(err);
            return;
        }

        const item: CTPhieuNhap = {
            maSP: newItem.maSP,
            tenSP: newItem.tenSP,
            soLuong: newItem.soLuong,
            donGia: newItem.donGia,
            donViNhap: newItem.donViNhap,
            hanSuDung: new Date(newItem.hanSuDung).toISOString(),
            ngaySanXuat: newItem.ngaySanXuat ? new Date(newItem.ngaySanXuat).toISOString() : undefined,
        };

        setItemList((prev) => {
            const next = [...prev, item];
            setFlashRowIndex(next.length - 1);
            // remove highlight after a moment
            setTimeout(() => setFlashRowIndex(null), 800);
            return next;
        });

        resetNewItem();
        setProductKeyword("");
        setIsProductDropdownOpen(false);
        markDirty();
    };

    const handleRemoveItem = (index: number) => {
        setItemList((prev) => {
            const next = [...prev];
            next.splice(index, 1);
            return next;
        });
        markDirty();
    };

    const handleSubmit = async () => {
        setFormError(null);

        if (!formData.maNCC || !formData.maKho) {
            setFormError("Vui lòng chọn Nhà cung cấp và Kho nhận.");
            return;
        }
        if (itemList.length === 0) {
            setFormError("Chưa có sản phẩm nào trong phiếu.");
            return;
        }

        if (formData.trangThai === "DA_NHAN") {
            const hasZeroPrice = itemList.some((i) => !i.donGia || i.donGia <= 0);
            if (hasZeroPrice) {
                setFormError("Khi chọn trạng thái ĐÃ NHẬN, tất cả sản phẩm phải có Đơn giá > 0.");
                return;
            }
        }

        setIsSubmitting(true);
        try {
            if (type === "add") {
                const payload = {
                    maNCC: formData.maNCC,
                    maKho: formData.maKho,
                    ghiChu: formData.ghiChu,
                    danhSachChiTiet: itemList.map((i) => ({
                        maSP: i.maSP,
                        soLuong: i.soLuong,
                        donGia: i.donGia,
                        donViNhap: i.donViNhap,
                        hanSuDung: i.hanSuDung!,
                        ngaySanXuat: i.ngaySanXuat,
                    })),
                };
                await importService.create(payload);
            } else if (type === "edit" && selectedId) {
                const payload = {
                    maNCC: formData.maNCC,
                    maKho: formData.maKho,
                    trangThai: formData.trangThai,
                    ghiChu: formData.ghiChu,
                    thanhTien: calculateTotal(),
                    danhSachChiTiet: itemList,
                };
                await importService.update(selectedId, payload);
            }
            setHasUnsavedChanges(false);
            handleRequestClose(true);
        } catch (error: any) {
            setFormError("Lỗi: " + (error.response?.data?.detail || error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedId) return;
        setIsSubmitting(true);
        try {
            await importService.delete(selectedId);
            handleRequestClose(true);
        } catch (error) {
            setFormError("Không thể xóa phiếu này.");
        } finally {
            setIsSubmitting(false);
        }
    };



    const filteredProducts = useMemo(() => {
        const kw = productKeyword.trim().toLowerCase();
        if (!kw) return availableProducts.slice(0, 12);
        // basic fuzzy-ish: contains in name, then startsWith priority via sort
        const list = availableProducts
            .filter((p) => (p.tenSP || "").toLowerCase().includes(kw))
            .sort((a, b) => {
                const an = (a.tenSP || "").toLowerCase();
                const bn = (b.tenSP || "").toLowerCase();
                const aStarts = an.startsWith(kw) ? 0 : 1;
                const bStarts = bn.startsWith(kw) ? 0 : 1;
                if (aStarts !== bStarts) return aStarts - bStarts;
                return an.localeCompare(bn);
            });
        return list.slice(0, 12);
    }, [availableProducts, productKeyword]);

    const disableNewItemFields = !newItem.maSP;
    if (!isOpen) return null;

    // --- RENDER ---
    // Modal Delete
    if (type === "delete") {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-slate-800">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] p-6 animate-in fade-in zoom-in duration-200 text-center text-slate-800">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                        <AlertTriangle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Xác nhận xóa?</h3>
                    <p className="text-slate-500 mb-6">Hành động này không thể hoàn tác.</p>

                    {formError && (
                        <div className="mb-4 text-left bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg p-3">
                            {formError}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={() => handleRequestClose()}
                            className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-60"
                        >
                            {isSubmitting ? "Đang xóa..." : "Xóa ngay"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-slate-800">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 text-slate-800">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            {type === "add" ? <Plus size={28} /> : isEdit ? <Edit size={28} /> : <Info size={28} />}
                            {type === "add" ? "Tạo phiếu nhập hàng" : isEdit ? "Cập nhật phiếu nhập" : "Chi tiết phiếu nhập"}
                        </h2>
                        {!isDetail && (
                            <p className="text-xs text-slate-500 mt-1">
                                Mẹo: chọn sản phẩm → nhập số lượng → Enter để thêm nhanh.
                            </p>
                        )}
                    </div>
                    <button onClick={() => handleRequestClose()} className="text-slate-400 hover:text-red-500">
                        <X size={28} />
                    </button>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <Loader2 className="animate-spin text-emerald-600" size={40} />
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc]">
                        {/* Error banner */}
                        {formError && (
                            <div className="mb-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl p-4">
                                <div className="font-semibold mb-1">Không thể cập nhật</div>
                            </div>
                        )}

                        {/* 1. General Info */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 text-slate-800">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-600">Nhà cung cấp</label>
                                    <select
                                        disabled={isDetail || isEdit}
                                        className="mt-1 w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                        value={formData.maNCC}
                                        onChange={(e) => handleSupplierChange(e.target.value)}
                                    >
                                        <option value="">-- Chọn NCC --</option>
                                        {suppliers.map((s) => (
                                            <option key={s.maNCC} value={s.maNCC}>
                                                {s.tenNCC}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-600">Kho nhận</label>
                                    <select
                                        disabled={isDetail}
                                        className="mt-1 w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                        value={formData.maKho}
                                        onChange={(e) => {
                                            setFormData((prev) => ({ ...prev, maKho: e.target.value }));
                                            markDirty();
                                        }}
                                    >
                                        <option value="">-- Chọn Kho --</option>
                                        {warehouses.map((w) => (
                                            <option key={w.maKho} value={w.maKho}>
                                                {w.tenKho}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Hide status on add, only show when Edit/Detail */}
                                {type !== "add" && (
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600">Trạng thái</label>
                                        <select
                                            disabled={isDetail}
                                            className="mt-1 w-full p-2.5 border border-slate-200 rounded-lg text-sm font-bold text-emerald-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                            value={formData.trangThai}
                                            onChange={(e) => {
                                                setFormData((prev) => ({ ...prev, trangThai: e.target.value }));
                                                markDirty();
                                            }}
                                        >
                                            <option value="DA_DAT">Đã đặt hàng</option>
                                            <option value="DA_NHAN">Đã nhận hàng</option>
                                            <option value="DA_HUY">Đã hủy</option>
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="text-xs font-semibold text-slate-600">Tạm tính</label>
                                    <div className="mt-1 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-800 text-right">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(calculateTotal())}
                                    </div>
                                </div>

                                <div className="md:col-span-4">
                                    <label className="text-xs font-semibold text-slate-600">Ghi chú</label>
                                    <input
                                        disabled={isDetail}
                                        type="text"
                                        placeholder="Ví dụ: giao buổi chiều, kiểm hàng trước khi nhập kho..."
                                        className="mt-1 w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                        value={formData.ghiChu}
                                        onChange={(e) => {
                                            setFormData((prev) => ({ ...prev, ghiChu: e.target.value }));
                                            markDirty();
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Add Product Form (Hidden in Detail) */}
                        {!isDetail && (
                            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mb-4 text-slate-800">
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div className="text-sm font-bold text-emerald-900">Thêm sản phẩm</div>
                                    <div className="text-xs text-emerald-800/80">
                                        {formData.maNCC ? "Gõ tên để tìm nhanh" : "Chọn NCC trước để tải sản phẩm"}
                                    </div>
                                </div>

                                {/* Row 1: Product + Unit + Qty + Add */}
                                <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                                    {/* Product search */}
                                    <div className="md:col-span-6" ref={productSearchWrapRef}>
                                        <label className="text-xs font-bold text-emerald-900 mb-1 block">Sản phẩm</label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                <Search size={16} />
                                            </div>
                                            <input
                                                disabled={!formData.maNCC}
                                                value={productKeyword}
                                                onChange={(e) => {
                                                    setProductKeyword(e.target.value);
                                                    setIsProductDropdownOpen(true);
                                                    setActiveProductIndex(0);
                                                }}
                                                onFocus={() => {
                                                    if (formData.maNCC) setIsProductDropdownOpen(true);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (!isProductDropdownOpen) return;

                                                    if (e.key === "ArrowDown") {
                                                        e.preventDefault();
                                                        setActiveProductIndex((i) => Math.min(i + 1, filteredProducts.length - 1));
                                                    } else if (e.key === "ArrowUp") {
                                                        e.preventDefault();
                                                        setActiveProductIndex((i) => Math.max(i - 1, 0));
                                                    } else if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        const p = filteredProducts[activeProductIndex];
                                                        if (p) handleProductSelect(p);
                                                    } else if (e.key === "Escape") {
                                                        setIsProductDropdownOpen(false);
                                                    }
                                                }}
                                                placeholder={formData.maNCC ? "Gõ tên sản phẩm..." : "Chọn Nhà cung cấp trước"}
                                                className="w-full pl-10 pr-3 py-2.5 border border-emerald-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-slate-100 disabled:text-slate-500"
                                            />

                                            {isProductDropdownOpen && formData.maNCC && (
                                                <div className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden text-slate-800">
                                                    <div className="max-h-64 overflow-auto">
                                                        {filteredProducts.length === 0 ? (
                                                            <div className="px-3 py-3 text-sm text-slate-500">Không tìm thấy sản phẩm phù hợp.</div>
                                                        ) : (
                                                            filteredProducts.map((p, idx) => (
                                                                <button
                                                                    type="button"
                                                                    key={p.maSP}
                                                                    onClick={() => handleProductSelect(p)}
                                                                    className={[
                                                                        "w-full text-left px-3 py-2.5 hover:bg-emerald-50",
                                                                        idx === activeProductIndex ? "bg-emerald-50" : "",
                                                                    ].join(" ")}
                                                                >
                                                                    <div className="flex items-start justify-between gap-2">
                                                                        <div className="min-w-0">
                                                                            <div className="font-medium text-slate-800 truncate">{p.tenSP}</div>
                                                                            <div className="text-xs text-slate-500">
                                                                                Mã: <span className="font-mono">{p.maSP}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-xs text-slate-600 whitespace-nowrap">
                                                                            {p.giaNhapMacDinh ? `${money(p.giaNhapMacDinh)} đ` : "—"}
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {newItemError && (
                                            <p className="mt-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-2">
                                                ⚠ {newItemError}
                                            </p>
                                        )}
                                    </div>

                                    {/* Unit */}
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold text-emerald-900 mb-1 block">ĐVT</label>
                                        <select
                                            disabled={disableNewItemFields}
                                            className="w-full p-2.5 border border-emerald-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-slate-100"
                                            value={newItem.donViNhap}
                                            onChange={(e) => {
                                                setNewItem((prev) => ({ ...prev, donViNhap: e.target.value }));
                                                setNewItemError(null);
                                                markDirty();
                                            }}
                                        >
                                            <option value="">{disableNewItemFields ? "--" : "-- Chọn --"}</option>
                                            {selectedProductUnits.map((u, idx) => (
                                                <option key={idx} value={u.name}>
                                                    {u.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Quantity */}
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold text-emerald-900 mb-1 block">Số lượng</label>
                                        <input
                                            ref={qtyRef}
                                            disabled={disableNewItemFields}
                                            type="number"
                                            min={1}
                                            className="w-full p-2.5 border border-emerald-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-slate-100"
                                            value={newItem.soLuong}
                                            onChange={(e) => {
                                                setNewItem((prev) => ({ ...prev, soLuong: Number(e.target.value) }));
                                                setNewItemError(null);
                                                markDirty();
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleAddItem();
                                            }}
                                        />
                                    </div>

                                    {/* Add */}
                                    <div className="md:col-span-2">
                                        <button
                                            type="button"
                                            onClick={handleAddItem}
                                            disabled={!formData.maNCC}
                                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            + Thêm
                                        </button>
                                    </div>
                                </div>

                                {/* Row 2: Price + MFG + EXP */}
                                <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                                    <div className="md:col-span-4">
                                        <label className="text-xs font-bold text-emerald-900 mb-1 block">Đơn giá</label>
                                        <input
                                            disabled={disableNewItemFields}
                                            type="number"
                                            min={0}
                                            className="w-full p-2.5 border border-emerald-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-slate-100"
                                            value={newItem.donGia}
                                            onChange={(e) => {
                                                setNewItem((prev) => ({ ...prev, donGia: Number(e.target.value) }));
                                                setNewItemError(null);
                                                markDirty();
                                            }}
                                        />
                                    </div>

                                    <div className="md:col-span-4">
                                        <label className="text-xs font-bold text-emerald-900 mb-1 block">Ngày SX (tuỳ chọn)</label>
                                        <input
                                            disabled={disableNewItemFields}
                                            type="date"
                                            className="w-full p-2.5 border border-emerald-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-slate-100"
                                            value={newItem.ngaySanXuat}
                                            onChange={(e) => {
                                                setNewItem((prev) => ({ ...prev, ngaySanXuat: e.target.value }));
                                                setNewItemError(null);
                                                markDirty();
                                            }}
                                        />
                                    </div>

                                    <div className="md:col-span-4">
                                        <label className="text-xs font-bold text-emerald-900 mb-1 block">Hạn SD *</label>
                                        <input
                                            disabled={disableNewItemFields}
                                            type="date"
                                            className="w-full p-2.5 border border-emerald-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-slate-100"
                                            value={newItem.hanSuDung}
                                            onChange={(e) => {
                                                setNewItem((prev) => ({ ...prev, hanSuDung: e.target.value }));
                                                setNewItemError(null);
                                                markDirty();
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleAddItem();
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. Product Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-slate-800">
                            {isEdit && (
                                <div className="px-4 py-3 border-b border-slate-100 text-xs text-slate-600 bg-slate-50">
                                    ✏️ Bạn có thể chỉnh sửa <b>Số lượng</b> và <b>Đơn giá</b> trực tiếp trong bảng.
                                </div>
                            )}

                            <div className="overflow-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 z-10">
                                        <tr>
                                            <th className="p-3 w-12">#</th>
                                            <th className="p-3 min-w-[220px]">Tên SP</th>
                                            <th className="p-3 w-28">ĐVT</th>
                                            <th className="p-3 text-center w-28">Số lượng</th>
                                            <th className="p-3 text-right w-36">Đơn giá</th>
                                            <th className="p-3 text-right w-40">Thành tiền</th>
                                            <th className="p-3 w-32">Ngày SX</th>
                                            <th className="p-3 w-32">Hạn SD</th>
                                            {!isDetail && <th className="p-3 text-center w-16">Xóa</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {itemList.map((item, index) => (
                                            <tr
                                                key={index}
                                                className={[
                                                    "hover:bg-slate-50 transition-colors",
                                                    flashRowIndex === index ? "bg-emerald-50" : "",
                                                ].join(" ")}
                                            >
                                                <td className="p-3">{index + 1}</td>
                                                <td className="p-3 font-medium">{item.tenSP}</td>
                                                <td className="p-3">{item.donViNhap}</td>

                                                <td className="p-3 text-center">
                                                    {isEdit ? (
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            className="w-20 text-center border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-200"
                                                            value={item.soLuong}
                                                            onChange={(e) => {
                                                                const v = Number(e.target.value);
                                                                setItemList((prev) => {
                                                                    const next = [...prev];
                                                                    next[index].soLuong = v;
                                                                    return next;
                                                                });
                                                                markDirty();
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="font-bold">{item.soLuong}</span>
                                                    )}
                                                </td>

                                                <td className="p-3 text-right">
                                                    {isEdit ? (
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            className="w-28 text-right border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-200"
                                                            value={item.donGia}
                                                            onChange={(e) => {
                                                                const v = Number(e.target.value);
                                                                setItemList((prev) => {
                                                                    const next = [...prev];
                                                                    next[index].donGia = v;
                                                                    return next;
                                                                });
                                                                markDirty();
                                                            }}
                                                        />
                                                    ) : (
                                                        money(item.donGia || 0)
                                                    )}
                                                </td>

                                                <td className="p-3 text-right font-bold text-emerald-700">
                                                    {money(item.soLuong * (item.donGia || 0))}
                                                </td>

                                                <td className="p-3 text-xs text-slate-500">
                                                    {item.ngaySanXuat ? format(new Date(item.ngaySanXuat), "dd/MM/yyyy") : "-"}
                                                </td>
                                                <td className="p-3 text-xs text-slate-500">
                                                    {item.hanSuDung ? format(new Date(item.hanSuDung), "dd/MM/yyyy") : "-"}
                                                </td>

                                                {!isDetail && (
                                                    <td className="p-3 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveItem(index)}
                                                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-red-500 hover:bg-red-50"
                                                            title="Xóa dòng"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                        {itemList.length === 0 && (
                                            <tr>
                                                <td colSpan={9} className="p-10 text-center text-slate-400">
                                                    Chưa có sản phẩm
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table footer: summary */}
                            <div className="px-4 py-3 border-t border-slate-100 bg-white flex items-center justify-between">
                                <div className="text-xs text-slate-500">
                                    Tổng dòng: <span className="font-semibold text-slate-700">{itemList.length}</span>
                                </div>
                                <div className="text-sm font-bold text-slate-800">
                                    Tổng tiền:{" "}
                                    <span className="text-emerald-700">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(calculateTotal())}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer (sticky) */}
                <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white sticky bottom-0 text-slate-800">
                    {!isDetail && (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || itemList.length === 0}
                            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            {isEdit ? "Lưu thay đổi" : "Tạo phiếu nhập"}
                        </button>
                    )}
                    <button
                        onClick={() => handleRequestClose()}
                        className="px-6 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold"
                    >
                        {isDetail ? "Đóng" : "Hủy"}
                    </button>
                </div>
            </div>
        </div>
    );
}
