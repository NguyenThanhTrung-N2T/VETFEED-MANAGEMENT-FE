"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Plus, Trash2, Info, Save, FileText, Loader2, AlertTriangle, Search } from "lucide-react";
import {
    returnService,
    PhieuBanLookup,
    SaleDetailForReturn,
    PhieuTraDetail,
} from "@/services/return.service";
import { format } from "date-fns";
import { toast } from 'sonner';

type ModalType = "filter" | "add" | "edit" | "detail" | "delete" | null;

interface ReturnModalsProps {
    isOpen: boolean;
    type: ModalType;
    selectedId: string | null;
    onClose: (refresh?: boolean) => void;
}

const money = (v: number) => new Intl.NumberFormat("vi-VN").format(v);

const DEFAULT_FORM = () => ({
    lyDoTra: "",
    hinhThucHoanTien: 0 as 0 | 1, // 0: Tiền mặt, 1: Chuyển khoản
});

const DEFAULT_NEW_ITEM = () => ({
    maLo: "",
    soLuong: 1,
    ghiChu: "",
});

export default function ReturnModals({ isOpen, type, selectedId, onClose }: ReturnModalsProps) {
    // --- Data Sources ---
    const [sales, setSales] = useState<PhieuBanLookup[]>([]);

    // --- Add Flow ---
    const [selectedSaleId, setSelectedSaleId] = useState("");
    const [saleDetail, setSaleDetail] = useState<SaleDetailForReturn | null>(null);

    const [returnItems, setReturnItems] = useState<
        {
            maLo: string;
            maLoCode: string;
            tenSanPham: string;
            soLuong: number;
            donGia: number;
            ghiChu: string;
        }[]
    >([]);

    const [formData, setFormData] = useState(DEFAULT_FORM());
    const [newItem, setNewItem] = useState(DEFAULT_NEW_ITEM());

    // --- Detail View Data ---
    const [detailData, setDetailData] = useState<PhieuTraDetail | null>(null);

    // --- UI States ---
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingReturnable, setIsCheckingReturnable] = useState(false);

    const [formError, setFormError] = useState<string | null>(null);
    const [newItemError, setNewItemError] = useState<string | null>(null);

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [flashRowIndex, setFlashRowIndex] = useState<number | null>(null);

    // --- Autocomplete: Sale ---
    const [saleKeyword, setSaleKeyword] = useState("");
    const [isSaleDropdownOpen, setIsSaleDropdownOpen] = useState(false);
    const [activeSaleIndex, setActiveSaleIndex] = useState(0);
    const saleWrapRef = useRef<HTMLDivElement | null>(null);

    // --- Autocomplete: Product-in-sale ---
    const [productKeyword, setProductKeyword] = useState("");
    const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
    const [activeProductIndex, setActiveProductIndex] = useState(0);
    const productWrapRef = useRef<HTMLDivElement | null>(null);
    const qtyRef = useRef<HTMLInputElement | null>(null);

    const isDetail = type === "detail";

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

    // --- Derived ---
    const totalRefund = useMemo(() => {
        return returnItems.reduce((sum, i) => sum + i.soLuong * i.donGia, 0);
    }, [returnItems]);

    const filteredSales = useMemo(() => {
        const kw = saleKeyword.trim().toLowerCase();
        if (!kw) return sales.slice(0, 12);
        const list = sales
            .filter((s) => {
                const code = (s.maPBCode || "").toLowerCase();
                const name = (s.tenKhachHang || "").toLowerCase();
                return code.includes(kw) || name.includes(kw);
            })
            .sort((a, b) => (a.maPBCode || "").localeCompare(b.maPBCode || ""));
        return list.slice(0, 12);
    }, [sales, saleKeyword]);

    const saleProducts = saleDetail?.danhSachChiTiet || [];

    const filteredSaleProducts = useMemo(() => {
        const kw = productKeyword.trim().toLowerCase();
        if (!kw) return saleProducts.slice(0, 12);
        const list = saleProducts
            .filter((p) => {
                const name = (p.tenSanPham || "").toLowerCase();
                const code = (p.maLoCode || "").toLowerCase();
                return name.includes(kw) || code.includes(kw);
            })
            .sort((a, b) => (a.tenSanPham || "").localeCompare(b.tenSanPham || ""));
        return list.slice(0, 12);
    }, [saleProducts, productKeyword]);

    // Close dropdowns on outside click
    useEffect(() => {
        function onDocMouseDown(e: MouseEvent) {
            const t = e.target as Node;
            if (saleWrapRef.current && !saleWrapRef.current.contains(t)) setIsSaleDropdownOpen(false);
            if (productWrapRef.current && !productWrapRef.current.contains(t)) setIsProductDropdownOpen(false);
        }
        document.addEventListener("mousedown", onDocMouseDown);
        return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, []);

    // --- Init ---
    useEffect(() => {
        if (!isOpen) return;

        setFormError(null);
        setNewItemError(null);
        setFlashRowIndex(null);

        if (type === "add") {
            loadSales();
            resetForm();
            setHasUnsavedChanges(false);
        } else if (type === "detail" && selectedId) {
            fetchReturnDetail(selectedId);
            setHasUnsavedChanges(false);
        }
    }, [isOpen, type, selectedId]);

    const loadSales = async () => {
        try {
            const res = await returnService.getSales();
            setSales(res);
        } catch (err) {
            console.error(err);
            setFormError("Không thể tải danh sách phiếu bán.");
        }
    };

    const fetchReturnDetail = async (id: string) => {
        setIsLoading(true);
        try {
            const data = await returnService.getById(id);
            setDetailData(data);
        } catch (err) {
            console.error(err);
            setFormError("Không thể tải chi tiết phiếu trả.");
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setSelectedSaleId("");
        setSaleDetail(null);
        setReturnItems([]);
        setFormData(DEFAULT_FORM());
        setNewItem(DEFAULT_NEW_ITEM());

        setSaleKeyword("");
        setIsSaleDropdownOpen(false);
        setActiveSaleIndex(0);

        setProductKeyword("");
        setIsProductDropdownOpen(false);
        setActiveProductIndex(0);

        setFormError(null);
        setNewItemError(null);
    };

    // --- Handlers (Add Mode) ---
    const handleSaleSelect = async (s: PhieuBanLookup) => {
        setSelectedSaleId(s.maPB);
        setSaleKeyword(`${s.maPBCode} - ${s.tenKhachHang}`);
        setIsSaleDropdownOpen(false);
        setActiveSaleIndex(0);

        setReturnItems([]);
        setSaleDetail(null);

        setProductKeyword("");
        setIsProductDropdownOpen(false);
        setActiveProductIndex(0);
        setNewItem(DEFAULT_NEW_ITEM());

        setIsLoading(true);
        try {
            const detail = await returnService.getSaleDetail(s.maPB);
            setSaleDetail(detail);
            setFormError(null);
            markDirty();
        } catch (error) {
            console.error(error);
            setFormError("Không thể tải chi tiết phiếu bán.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleProductSelect = (p: any) => {
        setNewItem((prev) => ({ ...prev, maLo: p.maLo }));
        setProductKeyword(`${p.tenSanPham} - ${p.maLoCode}`);
        setIsProductDropdownOpen(false);
        setActiveProductIndex(0);
        setNewItemError(null);
        markDirty();
        setTimeout(() => qtyRef.current?.focus(), 0);
    };

    const validateNewItem = () => {
        if (!selectedSaleId) return "Vui lòng chọn phiếu bán trước.";
        if (!newItem.maLo) return "Vui lòng chọn sản phẩm trong đơn.";
        if (newItem.soLuong <= 0) return "Số lượng trả phải > 0.";
        if (!saleDetail) return "Chưa tải xong chi tiết phiếu bán.";
        const product = saleDetail.danhSachChiTiet.find((x) => x.maLo === newItem.maLo);
        if (!product) return "Sản phẩm không hợp lệ.";
        if (returnItems.some((i) => i.maLo === newItem.maLo)) return "Sản phẩm này đã có trong danh sách trả.";
        return null;
    };

    const handleAddReturnItem = async () => {
        setNewItemError(null);

        const err = validateNewItem();
        if (err) {
            setNewItemError(err);
            return;
        }
        if (!saleDetail) return;

        const product = saleDetail.danhSachChiTiet.find((p) => p.maLo === newItem.maLo);
        if (!product) return;

        setIsCheckingReturnable(true);
        try {
            const isReturnable = await returnService.checkReturnable(selectedSaleId, newItem.maLo, newItem.soLuong);
            if (!isReturnable) {
                setNewItemError("Số lượng trả vượt quá số lượng mua khả dụng (hoặc đã trả trước đó).");
                return;
            }

            setReturnItems((prev) => {
                const next = [
                    ...prev,
                    {
                        maLo: newItem.maLo,
                        maLoCode: product.maLoCode,
                        tenSanPham: product.tenSanPham,
                        soLuong: newItem.soLuong,
                        donGia: product.donGia,
                        ghiChu: newItem.ghiChu,
                    },
                ];
                setFlashRowIndex(next.length - 1);
                setTimeout(() => setFlashRowIndex(null), 800);
                return next;
            });

            setNewItem(DEFAULT_NEW_ITEM());
            setProductKeyword("");
            setIsProductDropdownOpen(false);
            setNewItemError(null);
            markDirty();
        } catch (error: any) {
            setNewItemError(error.response?.data?.detail || "Lỗi kiểm tra số lượng trả.");
        } finally {
            setIsCheckingReturnable(false);
        }
    };

    const handleRemoveItem = (index: number) => {
        setReturnItems((prev) => {
            const next = [...prev];
            next.splice(index, 1);
            return next;
        });
        markDirty();
    };

    const validateSubmit = () => {
        if (!selectedSaleId) return "Chưa chọn phiếu bán.";
        if (returnItems.length === 0) return "Chưa có sản phẩm nào để trả.";
        return null;
    };

    const handleSubmit = async () => {
        setFormError(null);

        const err = validateSubmit();
        if (err) {
            setFormError(err);
            return;
        }

        setIsSubmitting(true);
        try {
            await returnService.create({
                maPB: selectedSaleId,
                hinhThucHoanTien: formData.hinhThucHoanTien,
                lyDoTra: formData.lyDoTra,
                danhSachChiTiet: returnItems.map((i) => ({
                    maLo: i.maLo,
                    soLuong: i.soLuong,
                    ghiChu: i.ghiChu,
                })),
            });
            setHasUnsavedChanges(false);
            handleRequestClose(true);
            toast.success("Thêm phiếu trả thành công!");
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
            await returnService.delete(selectedId);
            handleRequestClose(true);
            toast.success("Xóa phiếu trả thành công!");
        } catch (error) {
            setFormError("Không thể xóa phiếu trả này!");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    // --- RENDER ---
    if (type === "delete") {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-slate-800">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[460px] p-8 animate-in fade-in zoom-in duration-200 text-center text-slate-800">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                        <AlertTriangle size={30} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Xác nhận xóa?</h3>
                    <p className="text-slate-500 mb-6">
                        Bạn có chắc chắn muốn xóa phiếu trả hàng này không? Hành động này sẽ hoàn tác tồn kho.
                    </p>

                    {formError && (
                        <div className="mb-4 text-left bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl p-4">
                            {formError}
                        </div>
                    )}

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-60"
                        >
                            {isSubmitting ? "Đang xóa..." : "Xóa ngay"}
                        </button>
                        <button
                            onClick={() => handleRequestClose()}
                            className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-bold"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const viewData = isDetail ? detailData : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-slate-800">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 text-slate-800">
                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white text-slate-800">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            {isDetail ? <Info size={24} /> : <FileText size={24} />}
                            {isDetail ? "Chi tiết phiếu trả" : "Tạo phiếu trả hàng"}
                        </h2>
                        {!isDetail && (
                            <p className="text-xs text-slate-500 mt-1">Mẹo: chọn phiếu bán → chọn sản phẩm → Enter để thêm nhanh.</p>
                        )}
                    </div>
                    <button onClick={() => handleRequestClose()} className="text-slate-400 hover:text-red-500">
                        <X size={28} />
                    </button>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center text-slate-800">
                        <Loader2 className="animate-spin text-emerald-600" size={40} />
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-8 bg-[#f8fafc] text-slate-800">
                        {/* Error banner */}
                        {formError && (
                            <div className="mb-5 bg-red-50 border border-red-100 text-red-700 text-sm rounded-2xl p-4">
                                <div className="font-semibold mb-1">Không thể tiếp tục</div>
                                <div>{formError}</div>
                            </div>
                        )}

                        {/* Selection Section (Add) */}
                        {!isDetail && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 text-slate-800">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Sale autocomplete */}
                                    <div ref={saleWrapRef}>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Chọn Phiếu Bán để trả hàng</label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                <Search size={16} />
                                            </div>
                                            <input
                                                value={saleKeyword}
                                                onChange={(e) => {
                                                    setSaleKeyword(e.target.value);
                                                    setIsSaleDropdownOpen(true);
                                                    setActiveSaleIndex(0);
                                                    setSelectedSaleId("");
                                                    setSaleDetail(null);
                                                    setReturnItems([]);
                                                    markDirty();
                                                }}
                                                onFocus={() => setIsSaleDropdownOpen(true)}
                                                onKeyDown={(e) => {
                                                    if (!isSaleDropdownOpen) return;
                                                    if (e.key === "ArrowDown") {
                                                        e.preventDefault();
                                                        setActiveSaleIndex((i) => Math.min(i + 1, filteredSales.length - 1));
                                                    } else if (e.key === "ArrowUp") {
                                                        e.preventDefault();
                                                        setActiveSaleIndex((i) => Math.max(i - 1, 0));
                                                    } else if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        const s = filteredSales[activeSaleIndex];
                                                        if (s) handleSaleSelect(s);
                                                    } else if (e.key === "Escape") {
                                                        setIsSaleDropdownOpen(false);
                                                    }
                                                }}
                                                placeholder="Gõ mã phiếu / tên khách hàng..."
                                                className="w-full pl-10 pr-3 py-2.5 border border-blue-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-200 bg-white text-slate-800"
                                            />
                                            {isSaleDropdownOpen && (
                                                <div className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden text-slate-800">
                                                    <div className="max-h-64 overflow-auto">
                                                        {filteredSales.length === 0 ? (
                                                            <div className="px-3 py-3 text-sm text-slate-500">Không tìm thấy phiếu bán.</div>
                                                        ) : (
                                                            filteredSales.map((s, idx) => (
                                                                <button
                                                                    type="button"
                                                                    key={s.maPB}
                                                                    onClick={() => handleSaleSelect(s)}
                                                                    className={[
                                                                        "w-full text-left px-3 py-2.5 hover:bg-emerald-50",
                                                                        idx === activeSaleIndex ? "bg-emerald-50" : "",
                                                                    ].join(" ")}
                                                                >
                                                                    <div className="flex items-start justify-between gap-2">
                                                                        <div className="min-w-0">
                                                                            <div className="font-medium text-slate-800 truncate">
                                                                                {s.maPBCode} <span className="text-slate-400">•</span> {s.tenKhachHang}
                                                                            </div>
                                                                            <div className="text-xs text-slate-500">
                                                                                Ngày bán: {s.ngayBan ? format(new Date(s.ngayBan), "dd/MM/yyyy") : "—"}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {!selectedSaleId && (
                                            <p className="mt-2 text-xs text-slate-500">Chọn đúng phiếu bán để hệ thống tính giới hạn trả.</p>
                                        )}
                                    </div>

                                    {/* Refund method */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Hình thức hoàn tiền</label>
                                        <select
                                            className="w-full p-2.5 border border-blue-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-200 bg-white text-slate-800"
                                            value={formData.hinhThucHoanTien}
                                            onChange={(e) => {
                                                setFormData((p) => ({ ...p, hinhThucHoanTien: Number(e.target.value) as 0 | 1 }));
                                                markDirty();
                                            }}
                                        >
                                            <option value={0}>Tiền mặt</option>
                                            <option value={1}>Chuyển khoản</option>
                                        </select>
                                    </div>

                                    {/* Reason */}
                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Lý do trả hàng</label>
                                        <input
                                            type="text"
                                            className="w-full p-2.5 border border-blue-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-200 bg-white text-slate-800"
                                            value={formData.lyDoTra}
                                            onChange={(e) => {
                                                setFormData((p) => ({ ...p, lyDoTra: e.target.value }));
                                                markDirty();
                                            }}
                                            placeholder="Ví dụ: Hàng lỗi, hết hạn..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Detail header */}
                        {isDetail && viewData && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-800">
                                <div>
                                    <span className="font-bold text-slate-500">Mã Phiếu Trả:</span>{" "}
                                    <span className="text-slate-800">{viewData.maPTCode}</span>
                                </div>
                                <div>
                                    <span className="font-bold text-slate-500">Thuộc Phiếu Bán:</span>{" "}
                                    <span className="text-slate-800">{viewData.maPBCode}</span>
                                </div>
                                <div>
                                    <span className="font-bold text-slate-500">Khách hàng:</span>{" "}
                                    <span className="text-slate-800">{viewData.tenKhachHang}</span>
                                </div>
                                <div>
                                    <span className="font-bold text-slate-500">Ngày trả:</span>{" "}
                                    <span className="text-slate-800">{format(new Date(viewData.ngayTra), "dd/MM/yyyy HH:mm")}</span>
                                </div>
                                <div className="md:col-span-2">
                                    <span className="font-bold text-slate-500">Lý do:</span>{" "}
                                    <span className="text-slate-800">{viewData.lyDoTra}</span>
                                </div>
                            </div>
                        )}

                        {/* Add Item (Add + sale selected) */}
                        {!isDetail && saleDetail && (
                            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-6 shadow-sm text-slate-800">
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div className="text-sm font-bold text-blue-900">Thêm sản phẩm trả</div>
                                    <div className="text-xs text-blue-800/80">Gõ tên SP / mã lô, ↑↓ Enter để chọn</div>
                                </div>

                                <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                                    {/* Product autocomplete */}
                                    <div className="md:col-span-6" ref={productWrapRef}>
                                        <label className="text-xs font-bold text-slate-700 mb-1 block">Sản phẩm trong đơn</label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                <Search size={16} />
                                            </div>
                                            <input
                                                value={productKeyword}
                                                onChange={(e) => {
                                                    setProductKeyword(e.target.value);
                                                    setIsProductDropdownOpen(true);
                                                    setActiveProductIndex(0);
                                                    setNewItem((p) => ({ ...p, maLo: "" }));
                                                    setNewItemError(null);
                                                    markDirty();
                                                }}
                                                onFocus={() => setIsProductDropdownOpen(true)}
                                                onKeyDown={(e) => {
                                                    if (!isProductDropdownOpen) return;
                                                    if (e.key === "ArrowDown") {
                                                        e.preventDefault();
                                                        setActiveProductIndex((i) => Math.min(i + 1, filteredSaleProducts.length - 1));
                                                    } else if (e.key === "ArrowUp") {
                                                        e.preventDefault();
                                                        setActiveProductIndex((i) => Math.max(i - 1, 0));
                                                    } else if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        const p = filteredSaleProducts[activeProductIndex];
                                                        if (p) handleProductSelect(p);
                                                    } else if (e.key === "Escape") {
                                                        setIsProductDropdownOpen(false);
                                                    }
                                                }}
                                                placeholder="Gõ tên sản phẩm hoặc mã lô..."
                                                className="w-full pl-10 pr-3 py-2.5 border border-blue-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-200 bg-white text-slate-800"
                                            />
                                            {isProductDropdownOpen && (
                                                <div className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden text-slate-800">
                                                    <div className="max-h-64 overflow-auto">
                                                        {filteredSaleProducts.length === 0 ? (
                                                            <div className="px-3 py-3 text-sm text-slate-500">Không tìm thấy sản phẩm.</div>
                                                        ) : (
                                                            filteredSaleProducts.map((p: any, idx: number) => (
                                                                <button
                                                                    type="button"
                                                                    key={p.maLo}
                                                                    onClick={() => handleProductSelect(p)}
                                                                    className={[
                                                                        "w-full text-left px-3 py-2.5 hover:bg-emerald-50",
                                                                        idx === activeProductIndex ? "bg-emerald-50" : "",
                                                                    ].join(" ")}
                                                                >
                                                                    <div className="flex items-start justify-between gap-2">
                                                                        <div className="min-w-0">
                                                                            <div className="font-medium text-slate-800 truncate">
                                                                                {p.tenSanPham} <span className="text-slate-400">•</span> {p.maLoCode}
                                                                            </div>
                                                                            <div className="text-xs text-slate-500">
                                                                                Đã mua: <span className="font-semibold text-slate-700">{p.soLuong}</span> • Đơn giá:{" "}
                                                                                <span className="font-semibold text-slate-700">{money(p.donGia)}đ</span>
                                                                            </div>
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

                                    {/* Qty */}
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold text-slate-700 mb-1 block">SL Trả</label>
                                        <input
                                            ref={qtyRef}
                                            type="number"
                                            min={1}
                                            step="1"
                                            className="w-full p-2.5 border border-blue-200 rounded-xl text-sm text-center font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-200 bg-white"
                                            value={newItem.soLuong}
                                            onChange={(e) => {
                                                setNewItem((p) => ({ ...p, soLuong: Number(e.target.value) }));
                                                setNewItemError(null);
                                                markDirty();
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleAddReturnItem();
                                            }}
                                        />
                                    </div>

                                    {/* Note */}
                                    <div className="md:col-span-3">
                                        <label className="text-xs font-bold text-slate-700 mb-1 block">Ghi chú SP</label>
                                        <input
                                            type="text"
                                            className="w-full p-2.5 border border-blue-200 rounded-xl text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-200 bg-white"
                                            value={newItem.ghiChu}
                                            onChange={(e) => {
                                                setNewItem((p) => ({ ...p, ghiChu: e.target.value }));
                                                markDirty();
                                            }}
                                            placeholder="Tuỳ chọn"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleAddReturnItem();
                                            }}
                                        />
                                    </div>

                                    {/* Add */}
                                    <div className="md:col-span-1">
                                        <button
                                            type="button"
                                            onClick={handleAddReturnItem}
                                            disabled={isCheckingReturnable}
                                            className="h-[42px] w-full px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
                                        >
                                            {isCheckingReturnable ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                                            Thêm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Table */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-slate-800">
                            <div className="overflow-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 z-10">
                                        <tr>
                                            <th className="p-3 w-12">#</th>
                                            <th className="p-3 w-40">Mã Lô</th>
                                            <th className="p-3 min-w-[260px]">Tên Sản Phẩm</th>
                                            <th className="p-3 text-center w-28">SL Trả</th>
                                            <th className="p-3 text-right w-32">Đơn giá hoàn</th>
                                            <th className="p-3 text-right w-36">Thành tiền</th>
                                            <th className="p-3 min-w-[180px]">Ghi chú</th>
                                            {!isDetail && <th className="p-3 text-center w-16">Xóa</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {(isDetail ? viewData?.danhSachChiTiet || [] : returnItems).map((item: any, index: number) => {
                                            const qty = item.soLuong ?? item.soLuongTra ?? 0;
                                            const price = item.donGia ?? item.donGiaHoan ?? 0;
                                            return (
                                                <tr
                                                    key={index}
                                                    className={[
                                                        "hover:bg-slate-50 transition-colors",
                                                        !isDetail && flashRowIndex === index ? "bg-emerald-50" : "",
                                                    ].join(" ")}
                                                >
                                                    <td className="p-3">{index + 1}</td>
                                                    <td className="p-3 font-mono text-slate-600">{item.maLoCode || "—"}</td>
                                                    <td className="p-3 font-medium text-slate-800">{item.tenSanPham}</td>
                                                    <td className="p-3 text-center font-bold text-red-600">{qty}</td>
                                                    <td className="p-3 text-right text-slate-800">{Number(price).toLocaleString()}</td>
                                                    <td className="p-3 text-right font-bold text-emerald-700">{(qty * price).toLocaleString()}</td>
                                                    <td className="p-3 text-slate-500 italic">{item.ghiChu || "—"}</td>
                                                    {!isDetail && (
                                                        <td className="p-3 text-center">
                                                            <button
                                                                onClick={() => handleRemoveItem(index)}
                                                                className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-red-500 hover:bg-red-50"
                                                                title="Xóa dòng"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    )}
                                                </tr>
                                            );
                                        })}

                                        {(isDetail ? (viewData?.danhSachChiTiet?.length || 0) : returnItems.length) === 0 && (
                                            <tr>
                                                <td colSpan={8} className="p-10 text-center text-slate-400">
                                                    Chưa có sản phẩm trả
                                                </td>
                                            </tr>
                                        )}

                                        <tr className="bg-slate-50 font-bold">
                                            <td colSpan={5} className="p-3 text-right text-slate-700">
                                                Tổng hoàn trả:
                                            </td>
                                            <td className="p-3 text-right text-emerald-700 text-lg">
                                                {(isDetail ? viewData?.thanhTien : totalRefund)?.toLocaleString()} đ
                                            </td>
                                            <td colSpan={2}></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer (sticky) */}
                <div className="p-5 border-t border-gray-100 flex justify-end gap-4 bg-white sticky bottom-0 text-slate-800">
                    {!isDetail && (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || returnItems.length === 0}
                            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Hoàn tất phiếu trả
                        </button>
                    )}
                    <button
                        onClick={() => handleRequestClose()}
                        className="px-8 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold"
                    >
                        {isDetail ? "Đóng" : "Hủy bỏ"}
                    </button>
                </div>
            </div>
        </div>
    );
}
