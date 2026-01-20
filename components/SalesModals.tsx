"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Plus, Trash2, Save, Loader2, Search, AlertTriangle, Info, Filter, RefreshCcw } from "lucide-react";
import { salesService, Customer, Batch, CTPhieuBan } from "@/services/sales.service";
import { format } from "date-fns";
import { toast } from 'sonner';

// --- TYPES ---
export interface SalesFilterParams {
    fromDate?: string;
    toDate?: string;
    customerName?: string;
    minTotal?: number;
}

type ModalType = "filter" | "add" | "edit" | "detail" | "delete" | null;

interface SalesModalsProps {
    isOpen: boolean;
    type: ModalType;
    selectedId: string | null;
    onClose: (refresh?: boolean) => void;
    // Callback trả dữ liệu lọc về Page
    onApplyFilter?: (params: SalesFilterParams) => void;
}

const toDateTimeLocal = (d: Date) => format(d, "yyyy-MM-dd'T'HH:mm");

const DEFAULT_FORM = () => ({
    maKH: "",
    ngayBan: toDateTimeLocal(new Date()),
    chietKhauPhanTram: 0,
    hinhThucThanhToan: 0 as 0 | 1 | 2, // 0: TM, 1: CK, 2: CN
    tienCoc: 0,
    hanTra: "",
    ghiChu: "",
});

const DEFAULT_NEW_ITEM = { maLo: "", tenSP: "", soLuong: 1, donGia: 0, ghiChu: "" };

export default function SalesModals({ isOpen, type, selectedId, onClose, onApplyFilter }: SalesModalsProps) {
    // --- Master Data ---
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);

    // --- Filter State ---
    const [filterState, setFilterState] = useState<SalesFilterParams>({
        fromDate: '',
        toDate: '',
        customerName: '',
        minTotal: undefined
    });

    // --- Form State (Add) ---
    const [formData, setFormData] = useState(DEFAULT_FORM());
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const [itemList, setItemList] = useState<CTPhieuBan[]>([]);
    const [newItem, setNewItem] = useState(DEFAULT_NEW_ITEM);

    // --- UI State ---
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingStock, setIsCheckingStock] = useState(false);

    const [detailData, setDetailData] = useState<any>(null);

    const [formError, setFormError] = useState<string | null>(null);
    const [newItemError, setNewItemError] = useState<string | null>(null);

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [flashRowIndex, setFlashRowIndex] = useState<number | null>(null);

    // --- Autocomplete: Customer ---
    const [customerKeyword, setCustomerKeyword] = useState("");
    const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
    const [activeCustomerIndex, setActiveCustomerIndex] = useState(0);
    const customerWrapRef = useRef<HTMLDivElement | null>(null);

    // --- Autocomplete: Batch ---
    const [batchKeyword, setBatchKeyword] = useState("");
    const [isBatchDropdownOpen, setIsBatchDropdownOpen] = useState(false);
    const [activeBatchIndex, setActiveBatchIndex] = useState(0);
    const batchWrapRef = useRef<HTMLDivElement | null>(null);
    const qtyRef = useRef<HTMLInputElement | null>(null);

    // --- Derived flags ---
    const isDetail = type === "detail";

    const markDirty = () => {
        if (!isDetail) setHasUnsavedChanges(true);
    };

    const handleRequestClose = (refresh?: boolean) => {
        onClose(refresh);
    };

    // Close dropdowns when click outside
    useEffect(() => {
        function onDocMouseDown(e: MouseEvent) {
            const t = e.target as Node;
            if (customerWrapRef.current && !customerWrapRef.current.contains(t)) setIsCustomerDropdownOpen(false);
            if (batchWrapRef.current && !batchWrapRef.current.contains(t)) setIsBatchDropdownOpen(false);
        }
        document.addEventListener("mousedown", onDocMouseDown);
        return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, []);

    // --- Memos ---
    const filteredCustomers = useMemo(() => {
        const kw = customerKeyword.trim().toLowerCase();
        if (!kw) return customers.slice(0, 12);
        const list = customers
            .filter((c) => {
                const name = (c.tenKH || "").toLowerCase();
                const phone = (c.soDienThoai || "").toLowerCase();
                return name.includes(kw) || phone.includes(kw);
            })
            .sort((a, b) => (a.tenKH || "").localeCompare(b.tenKH || ""));
        return list.slice(0, 12);
    }, [customers, customerKeyword]);

    const filteredBatches = useMemo(() => {
        const kw = batchKeyword.trim().toLowerCase();
        if (!kw) return batches.slice(0, 12);
        const list = batches
            .filter((b) => {
                const code = (b.maLoCode || "").toLowerCase();
                const name = (b.tenSP || "").toLowerCase();
                return code.includes(kw) || name.includes(kw);
            })
            .sort((a, b) => {
                const ac = (a.maLoCode || "").toLowerCase();
                const bc = (b.maLoCode || "").toLowerCase();
                const aStarts = ac.startsWith(kw) ? 0 : 1;
                const bStarts = bc.startsWith(kw) ? 0 : 1;
                if (aStarts !== bStarts) return aStarts - bStarts;
                return ac.localeCompare(bc);
            });
        return list.slice(0, 12);
    }, [batches, batchKeyword]);

    const totals = useMemo(() => {
        const totalAmount = itemList.reduce((sum, item) => sum + item.soLuong * item.donGia, 0);
        const discountAmount = totalAmount * (Number(formData.chietKhauPhanTram || 0) / 100);
        const finalAmount = totalAmount - discountAmount;
        const debtAmountUI = Math.max(0, finalAmount - Number(formData.tienCoc || 0));
        return { totalAmount, discountAmount, finalAmount, debtAmountUI };
    }, [itemList, formData.chietKhauPhanTram, formData.tienCoc]);

    const money = (v: number) => new Intl.NumberFormat("vi-VN").format(v);

    // --- Effects ---
    useEffect(() => {
        if (!isOpen) return;

        setFormError(null);
        setNewItemError(null);
        setFlashRowIndex(null);

        if (type === "add") {
            loadMasterData();
            resetForm();
            setHasUnsavedChanges(false);
        } else if (type === "detail" && selectedId) {
            fetchDetail(selectedId);
            setHasUnsavedChanges(false);
        }
    }, [isOpen, type, selectedId]);

    const loadMasterData = async () => {
        try {
            const [custs, bts] = await Promise.all([salesService.getCustomers(), salesService.getBatches()]);
            setCustomers(custs);
            setBatches(bts);
        } catch (err) {
            console.error(err);
            setFormError("Không thể tải dữ liệu khách hàng / lô hàng.");
        }
    };

    const fetchDetail = async (id: string) => {
        setIsLoading(true);
        try {
            const data = await salesService.getById(id);
            setDetailData(data);
        } catch (err) {
            console.error(err);
            setFormError("Không thể tải chi tiết đơn hàng.");
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData(DEFAULT_FORM());
        setItemList([]);
        setSelectedCustomer(null);
        setNewItem(DEFAULT_NEW_ITEM);

        setCustomerKeyword("");
        setIsCustomerDropdownOpen(false);
        setActiveCustomerIndex(0);

        setBatchKeyword("");
        setIsBatchDropdownOpen(false);
        setActiveBatchIndex(0);

        setFormError(null);
        setNewItemError(null);
    };

    // --- Handlers (Filter) ---
    const handleFilterSubmit = () => {
        if (onApplyFilter) {
            onApplyFilter(filterState);
        }
        handleRequestClose(false);
    };

    const handleResetFilter = () => {
        const emptyFilter = { fromDate: '', toDate: '', customerName: '', minTotal: undefined };
        setFilterState(emptyFilter);
        if (onApplyFilter) {
            onApplyFilter(emptyFilter);
        }
        handleRequestClose(false);
    };

    // --- Handlers (Add Mode) ---
    const handleCustomerSelect = (cust: Customer) => {
        setFormData((prev) => ({ ...prev, maKH: cust.maKH }));
        setSelectedCustomer(cust);
        setCustomerKeyword(cust.tenKH);
        setIsCustomerDropdownOpen(false);
        setActiveCustomerIndex(0);
        setFormError(null);
        markDirty();
    };

    const handleBatchSelect = async (batch: Batch) => {
        setBatchKeyword(`${batch.maLoCode} - ${batch.tenSP}`);
        setIsBatchDropdownOpen(false);
        setActiveBatchIndex(0);

        try {
            const priceData = await salesService.getCurrentPrice(batch.maSP);
            setNewItem((prev) => ({
                ...prev,
                maLo: batch.maLo,
                tenSP: batch.tenSP,
                donGia: priceData.donGiaBan || 0,
            }));
            setNewItemError(null);
            markDirty();
            setTimeout(() => qtyRef.current?.focus(), 0);
        } catch (err) {
            console.error("Lỗi lấy giá:", err);
            setNewItem((prev) => ({ ...prev, maLo: batch.maLo, tenSP: batch.tenSP, donGia: 0 }));
            setNewItemError("Không thể lấy giá hiện tại. Vui lòng thử lại.");
        }
    };

    const validateNewItem = () => {
        if (!newItem.maLo) return "Vui lòng chọn lô hàng.";
        if (newItem.soLuong <= 0) return "Số lượng phải > 0.";
        return null;
    };

    const handleAddItem = async () => {
        setNewItemError(null);

        const err = validateNewItem();
        if (err) {
            setNewItemError(err);
            return;
        }

        setIsCheckingStock(true);
        try {
            await salesService.checkStock(newItem.maLo, newItem.soLuong);

            const batchInfo = batches.find((b) => b.maLo === newItem.maLo);

            const item: CTPhieuBan = {
                maLo: newItem.maLo,
                maLoCode: batchInfo?.maLoCode,
                tenSanPham: newItem.tenSP,
                soLuong: newItem.soLuong,
                donGia: newItem.donGia,
                thanhTienVon: newItem.soLuong * newItem.donGia,
                ghiChu: newItem.ghiChu,
            };

            setItemList((prev) => {
                const next = [...prev, item];
                setFlashRowIndex(next.length - 1);
                setTimeout(() => setFlashRowIndex(null), 800);
                return next;
            });

            setNewItem(DEFAULT_NEW_ITEM);
            setBatchKeyword("");
            setIsBatchDropdownOpen(false);

            markDirty();
        } catch (error: any) {
            toast.error("Không đủ tồn kho!");
        } finally {
            setIsCheckingStock(false);
        }
    };

    const handleRemoveItem = (index: number) => {
        setItemList((prev) => {
            const next = [...prev];
            next.splice(index, 1);
            return next;
        });
        markDirty();
    };

    // --- SUBMIT ---
    const validateSubmit = () => {
        if (!formData.maKH) return "Vui lòng chọn khách hàng.";
        if (itemList.length === 0) return "Giỏ hàng đang trống.";
        if (formData.hinhThucThanhToan === 2) {
            if (!formData.hanTra) return "Vui lòng chọn hạn trả nợ.";
            else return null; // Logic check hạn mức ở dưới
        }
        return null;
    };

    const handleSubmit = async () => {
        setFormError(null);

        const err = validateSubmit();
        if (err) {
            toast.error(err);
            return;
        }

        // [LOGIC MỚI] Xử lý tiền cọc
        let submitTienCoc = 0;

        submitTienCoc = Number(formData.tienCoc || 0);

        // Validate hạn mức công nợ
        const currentDebt = totals.finalAmount - submitTienCoc;
        const newTotalDebt = (selectedCustomer?.congNoHienTai || 0) + currentDebt;

        if (selectedCustomer?.hanMucCongNo && newTotalDebt > selectedCustomer.hanMucCongNo) {
            toast.error("Khách hàng vượt quá hạn mức công nợ!");
            setFormError(`Hạn mức: ${money(selectedCustomer.hanMucCongNo)}, Nợ hiện tại: ${money(selectedCustomer.congNoHienTai)}, Nợ thêm: ${money(currentDebt)}`);
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                maKH: formData.maKH,
                ngayBan: new Date(formData.ngayBan).toISOString(),
                chietKhauPhanTram: Number(formData.chietKhauPhanTram || 0),
                hinhThucThanhToan: formData.hinhThucThanhToan,
                tienCoc: submitTienCoc, // Gửi giá trị đã xử lý logic
                hanTra:
                    formData.hinhThucThanhToan === 2 && formData.hanTra ? new Date(formData.hanTra).toISOString() : undefined,
                ghiChu: formData.ghiChu,
                danhSachChiTiet: itemList.map((i) => ({
                    maLo: i.maLo,
                    soLuong: i.soLuong,
                    donGia: i.donGia,
                    ghiChu: i.ghiChu,
                })),
            };

            await salesService.create(payload);
            setHasUnsavedChanges(false);
            handleRequestClose(true);
            toast.success("Thêm phiếu bán thành công!");
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
            await salesService.delete(selectedId);
            handleRequestClose(true);
            toast.success("Xóa phiếu bán thành công!");
        } catch (error) {
            setFormError("Không thể xóa phiếu này!");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    // --- RENDER 1: FILTER MODAL ---
    if (type === 'filter') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-slate-800">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[600px] animate-in fade-in zoom-in duration-200">
                    <div className="p-8 flex flex-col items-center">
                        <Filter size={48} strokeWidth={1} className="text-slate-800 mb-2" />
                        <h2 className="text-2xl font-bold mb-8 text-slate-800">Lọc phiếu bán</h2>

                        <div className="w-full grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Từ ngày</label>
                                <input
                                    type="date"
                                    className="w-full p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-sm outline-none text-slate-800 focus:border-emerald-500"
                                    value={filterState.fromDate || ''}
                                    onChange={(e) => setFilterState({ ...filterState, fromDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Đến ngày</label>
                                <input
                                    type="date"
                                    className="w-full p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-sm outline-none text-slate-800 focus:border-emerald-500"
                                    value={filterState.toDate || ''}
                                    onChange={(e) => setFilterState({ ...filterState, toDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Khách hàng</label>
                                <input
                                    type="text"
                                    placeholder="Tên khách hàng..."
                                    className="w-full p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-sm outline-none text-slate-800 focus:border-emerald-500"
                                    value={filterState.customerName || ''}
                                    onChange={(e) => setFilterState({ ...filterState, customerName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Tiền tối thiểu (VNĐ)</label>
                                <input
                                    type="number"
                                    placeholder="Ví dụ: 100000"
                                    className="w-full p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-sm outline-none text-slate-800 focus:border-emerald-500"
                                    value={filterState.minTotal || ''}
                                    onChange={(e) => setFilterState({ ...filterState, minTotal: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 w-full mt-8">
                            <button
                                onClick={handleFilterSubmit}
                                className="flex-1 py-3 bg-[#388e3c] hover:bg-green-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-green-100"
                            >
                                Áp dụng lọc
                            </button>
                            <button
                                onClick={handleResetFilter}
                                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-slate-600 font-bold rounded-lg transition-colors"
                                title="Xóa bộ lọc"
                            >
                                <RefreshCcw size={20} />
                            </button>
                            <button
                                onClick={() => handleRequestClose()}
                                className="flex-1 py-3 border border-red-500 text-red-600 hover:bg-red-50 font-bold rounded-lg transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER 2: DELETE MODAL ---
    if (type === "delete") {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-slate-800">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[460px] p-8 animate-in fade-in zoom-in duration-200 text-center text-slate-800">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                        <AlertTriangle size={30} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Xác nhận xóa?</h3>
                    <p className="text-slate-500 mb-6">
                        Bạn có chắc chắn muốn xóa phiếu bán này không? Hành động này sẽ hoàn trả tồn kho.
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

    // --- RENDER 3: MAIN FORM MODAL ---
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-slate-800">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 text-slate-800">
                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white text-slate-800">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Info size={26} />
                            {isDetail ? "Chi tiết đơn hàng" : "Tạo phiếu bán hàng"}
                        </h2>
                        {!isDetail && <p className="text-xs text-slate-500 mt-1">Mẹo: chọn lô → nhập số lượng → Enter để thêm nhanh.</p>}
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
                                <div className="font-semibold mb-1">{formError}</div>
                            </div>
                        )}

                        {/* 1. Thông tin chung */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                            {/* Left */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-slate-800">
                                <h3 className="font-bold text-slate-800 mb-4">Thông tin phiếu</h3>

                                {/* Customer autocomplete */}
                                <div className="mb-4" ref={customerWrapRef}>
                                    <label className="text-xs font-semibold text-slate-500">Khách hàng</label>

                                    {isDetail ? (
                                        <input
                                            disabled
                                            value={viewData?.tenKhachHang || ""}
                                            className="mt-1 w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800"
                                        />
                                    ) : (
                                        <div className="relative mt-1">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                <Search size={16} />
                                            </div>
                                            <input
                                                value={customerKeyword}
                                                onChange={(e) => {
                                                    setCustomerKeyword(e.target.value);
                                                    setIsCustomerDropdownOpen(true);
                                                    setActiveCustomerIndex(0);
                                                    setFormData((p) => ({ ...p, maKH: "" }));
                                                    setSelectedCustomer(null);
                                                    markDirty();
                                                }}
                                                onFocus={() => setIsCustomerDropdownOpen(true)}
                                                onKeyDown={(e) => {
                                                    if (!isCustomerDropdownOpen) return;
                                                    if (e.key === "ArrowDown") {
                                                        e.preventDefault();
                                                        setActiveCustomerIndex((i) => Math.min(i + 1, filteredCustomers.length - 1));
                                                    } else if (e.key === "ArrowUp") {
                                                        e.preventDefault();
                                                        setActiveCustomerIndex((i) => Math.max(i - 1, 0));
                                                    } else if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        const c = filteredCustomers[activeCustomerIndex];
                                                        if (c) handleCustomerSelect(c);
                                                    } else if (e.key === "Escape") {
                                                        setIsCustomerDropdownOpen(false);
                                                    }
                                                }}
                                                placeholder="Gõ tên / SĐT khách hàng..."
                                                className="w-full pl-10 pr-3 py-2.5 bg-white border border-blue-200 rounded-xl text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-200"
                                            />

                                            {isCustomerDropdownOpen && (
                                                <div className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden text-slate-800">
                                                    <div className="max-h-64 overflow-auto">
                                                        {filteredCustomers.length === 0 ? (
                                                            <div className="px-3 py-3 text-sm text-slate-500">Không tìm thấy khách hàng.</div>
                                                        ) : (
                                                            filteredCustomers.map((c, idx) => (
                                                                <button
                                                                    key={c.maKH}
                                                                    type="button"
                                                                    onClick={() => handleCustomerSelect(c)}
                                                                    className={[
                                                                        "w-full text-left px-3 py-2.5 hover:bg-emerald-50",
                                                                        idx === activeCustomerIndex ? "bg-emerald-50" : "",
                                                                    ].join(" ")}
                                                                >
                                                                    <div className="flex items-start justify-between gap-2">
                                                                        <div className="min-w-0">
                                                                            <div className="font-medium text-slate-800 truncate">{c.tenKH}</div>
                                                                            <div className="text-xs text-slate-500">
                                                                                SĐT: {c.soDienThoai || "—"} • Nợ: {money(c.congNoHienTai || 0)}đ
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
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500">Ngày bán</label>
                                        <input
                                            type="datetime-local"
                                            disabled={isDetail}
                                            value={isDetail ? (viewData?.ngayBan ? toDateTimeLocal(new Date(viewData.ngayBan)) : "") : formData.ngayBan}
                                            onChange={(e) => {
                                                setFormData((p) => ({ ...p, ngayBan: e.target.value }));
                                                markDirty();
                                            }}
                                            className="mt-1 w-full bg-white border border-blue-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-slate-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-500">Hình thức TT</label>
                                        <select
                                            disabled={isDetail}
                                            className="mt-1 w-full bg-white border border-blue-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-slate-100"
                                            value={isDetail ? 0 : formData.hinhThucThanhToan}
                                            onChange={(e) => {
                                                const v = Number(e.target.value) as 0 | 1 | 2;
                                                setFormData((p) => ({ ...p, hinhThucThanhToan: v, tienCoc: v === 2 ? p.tienCoc : 0, hanTra: v === 2 ? p.hanTra : "" }));
                                                markDirty();
                                            }}
                                        >
                                            <option value={0}>Tiền mặt</option>
                                            <option value={1}>Chuyển khoản</option>
                                            <option value={2}>Công nợ</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="text-xs font-semibold text-slate-500">Ghi chú</label>
                                    <input
                                        disabled={isDetail}
                                        value={isDetail ? viewData?.ghiChu || "" : formData.ghiChu}
                                        onChange={(e) => {
                                            setFormData((p) => ({ ...p, ghiChu: e.target.value }));
                                            markDirty();
                                        }}
                                        placeholder="Ví dụ: giao buổi chiều, gọi trước..."
                                        className="mt-1 w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-slate-100"
                                    />
                                </div>
                            </div>

                            {/* Right: payment */}
                            <div className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-100 text-slate-800">
                                <h3 className="font-bold text-emerald-900 mb-4">Thanh toán</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500">Chiết khấu (%)</label>
                                        <input
                                            type="number"
                                            min={0}
                                            max={100}
                                            disabled={isDetail}
                                            value={isDetail ? viewData?.chietKhauPhanTram || 0 : formData.chietKhauPhanTram}
                                            onChange={(e) => {
                                                setFormData((p) => ({ ...p, chietKhauPhanTram: Number(e.target.value) }));
                                                markDirty();
                                            }}
                                            className="mt-1 w-full border border-emerald-200 rounded-xl px-3 py-2.5 text-sm text-right font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-slate-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-500">Tổng thanh toán</label>
                                        <div className="mt-1 w-full border border-emerald-200 rounded-xl px-3 py-2.5 text-sm text-right font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-slate-100">
                                            {(isDetail ? viewData?.thanhTien || 0 : totals.finalAmount).toLocaleString()} đ
                                        </div>
                                    </div>

                                    {/* Logic Công Nợ */}
                                    {((!isDetail && formData.hinhThucThanhToan === 2) || (isDetail && (viewData?.tienNo || 0) > 0)) && (
                                        <>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500">Tiền cọc / Trả trước</label>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    disabled={isDetail}
                                                    value={isDetail ? viewData?.tienCoc || 0 : formData.tienCoc}
                                                    onChange={(e) => {
                                                        setFormData((p) => ({ ...p, tienCoc: Number(e.target.value) }));
                                                        markDirty();
                                                    }}
                                                    className="mt-1 w-full border border-orange-200 bg-orange-50 rounded-xl px-3 py-2.5 text-sm text-right font-bold text-slate-800 outline-none focus:ring-2 focus:ring-orange-200 disabled:bg-slate-100"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-slate-500">Tiền nợ lại</label>
                                                <div className="mt-1 w-full px-3 py-2.5 text-md font-bold text-red-600 text-right bg-red-50 rounded-xl border border-red-100">
                                                    {isDetail ? (viewData?.tienNo || 0).toLocaleString() : totals.debtAmountUI.toLocaleString()} đ
                                                </div>
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="text-xs font-semibold text-slate-500">Hạn trả nợ</label>
                                                <input
                                                    type="datetime-local"
                                                    disabled={isDetail}
                                                    value={isDetail ? (viewData?.hanTra ? toDateTimeLocal(new Date(viewData.hanTra)) : "") : formData.hanTra}
                                                    onChange={(e) => {
                                                        setFormData((p) => ({ ...p, hanTra: e.target.value }));
                                                        markDirty();
                                                    }}
                                                    className="mt-1 w-full border border-red-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-red-200 disabled:bg-slate-100"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Add product */}
                        {!isDetail && (
                            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-4 text-slate-800">
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div className="text-sm font-bold text-blue-900">Thêm sản phẩm</div>
                                    <div className="text-xs text-blue-800/80">Gõ mã lô / tên SP để tìm nhanh</div>
                                </div>

                                <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                                    <div className="md:col-span-6" ref={batchWrapRef}>
                                        <label className="text-xs text-slate-600 font-semibold block mb-1">Lô hàng (Sản phẩm)</label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                <Search size={16} />
                                            </div>
                                            <input
                                                value={batchKeyword}
                                                onChange={(e) => {
                                                    setBatchKeyword(e.target.value);
                                                    setIsBatchDropdownOpen(true);
                                                    setActiveBatchIndex(0);
                                                    setNewItem((p) => ({ ...p, maLo: "", tenSP: "", donGia: 0 }));
                                                    setNewItemError(null);
                                                    markDirty();
                                                }}
                                                onFocus={() => setIsBatchDropdownOpen(true)}
                                                onKeyDown={(e) => {
                                                    if (!isBatchDropdownOpen) return;
                                                    if (e.key === "ArrowDown") {
                                                        e.preventDefault();
                                                        setActiveBatchIndex((i) => Math.min(i + 1, filteredBatches.length - 1));
                                                    } else if (e.key === "ArrowUp") {
                                                        e.preventDefault();
                                                        setActiveBatchIndex((i) => Math.max(i - 1, 0));
                                                    } else if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        const b = filteredBatches[activeBatchIndex];
                                                        if (b) handleBatchSelect(b);
                                                    } else if (e.key === "Escape") {
                                                        setIsBatchDropdownOpen(false);
                                                    }
                                                }}
                                                placeholder="Gõ mã lô hoặc tên sản phẩm..."
                                                className="w-full pl-10 pr-3 py-2.5 bg-white border border-blue-200 rounded-xl text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-200"
                                            />

                                            {isBatchDropdownOpen && (
                                                <div className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden text-slate-800">
                                                    <div className="max-h-64 overflow-auto">
                                                        {filteredBatches.length === 0 ? (
                                                            <div className="px-3 py-3 text-sm text-slate-500">Không tìm thấy lô phù hợp.</div>
                                                        ) : (
                                                            filteredBatches.map((b, idx) => (
                                                                <button
                                                                    key={b.maLo}
                                                                    type="button"
                                                                    onClick={() => handleBatchSelect(b)}
                                                                    className={[
                                                                        "w-full text-left px-3 py-2.5 hover:bg-emerald-50",
                                                                        idx === activeBatchIndex ? "bg-emerald-50" : "",
                                                                    ].join(" ")}
                                                                >
                                                                    <div className="flex items-start justify-between gap-2">
                                                                        <div className="min-w-0">
                                                                            <div className="font-medium text-slate-800 truncate">
                                                                                {b.maLoCode} <span className="text-slate-400">•</span> {b.tenSP}
                                                                            </div>
                                                                            <div className="text-xs text-slate-500">
                                                                                HSD: {b.hanSuDung ? format(new Date(b.hanSuDung), "dd/MM/yyyy") : "—"}
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
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-xs text-slate-600 font-semibold block mb-1">Đơn giá</label>
                                        <input
                                            type="number"
                                            disabled
                                            value={newItem.donGia}
                                            className="w-full bg-slate-100 border border-blue-200 rounded-xl px-3 py-2.5 text-sm text-right font-bold text-slate-800"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-xs text-slate-600 font-semibold block mb-1">Số lượng</label>
                                        <input
                                            ref={qtyRef}
                                            type="number"
                                            min={1}
                                            value={newItem.soLuong}
                                            onChange={(e) => {
                                                setNewItem((p) => ({ ...p, soLuong: Number(e.target.value) }));
                                                setNewItemError(null);
                                                markDirty();
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleAddItem();
                                            }}
                                            className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2.5 text-sm text-center font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-200"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <button
                                            onClick={handleAddItem}
                                            disabled={isCheckingStock}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
                                        >
                                            {isCheckingStock ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
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
                                            <th className="p-3 w-32">Mã Lô</th>
                                            <th className="p-3 min-w-[260px]">Tên Sản Phẩm</th>
                                            <th className="p-3 text-center w-28">Số lượng</th>
                                            <th className="p-3 text-right w-32">Đơn giá</th>
                                            <th className="p-3 text-right w-36">Thành tiền</th>
                                            {!isDetail && <th className="p-3 text-center w-16">Xóa</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {(isDetail ? viewData?.danhSachChiTiet || [] : itemList).map((item: any, index: number) => (
                                            <tr
                                                key={index}
                                                className={[
                                                    "hover:bg-slate-50 transition-colors",
                                                    !isDetail && flashRowIndex === index ? "bg-emerald-50" : "",
                                                ].join(" ")}
                                            >
                                                <td className="p-3">{index + 1}</td>
                                                <td className="p-3 font-mono text-slate-600">{item.maLoCode || "N/A"}</td>
                                                <td className="p-3 font-medium text-slate-800">{item.tenSanPham || item.tenSP}</td>
                                                <td className="p-3 text-center font-bold text-slate-800">{item.soLuong}</td>
                                                <td className="p-3 text-right text-slate-800">{Number(item.donGia || 0).toLocaleString()}</td>
                                                <td className="p-3 text-right font-bold text-emerald-700">
                                                    {(Number(item.soLuong || 0) * Number(item.donGia || 0)).toLocaleString()}
                                                </td>
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
                                        ))}
                                        {(isDetail ? (viewData?.danhSachChiTiet?.length || 0) : itemList.length) === 0 && (
                                            <tr>
                                                <td colSpan={7} className="p-10 text-center text-slate-400">
                                                    Giỏ hàng trống
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="px-4 py-3 border-t border-slate-100 bg-white flex items-center justify-between text-slate-800">
                                <div className="text-xs text-slate-500">
                                    Tổng dòng: <span className="font-semibold text-slate-700">{isDetail ? (viewData?.danhSachChiTiet?.length || 0) : itemList.length}</span>
                                </div>
                                {!isDetail && (
                                    <div className="text-sm font-bold text-slate-800">
                                        Tổng phải thu: <span className="text-emerald-700">{money(totals.finalAmount)} đ</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 flex justify-end gap-4 bg-white sticky bottom-0 text-slate-800">
                    {!isDetail && (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || itemList.length === 0}
                            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={20} />}
                            Hoàn tất đơn hàng
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