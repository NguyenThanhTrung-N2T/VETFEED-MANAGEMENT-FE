"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Plus, Trash2, Edit, Info, Save, Loader2, Search, AlertTriangle, Filter, RefreshCcw } from "lucide-react";
import { transferService, CTChuyenKhoItem } from "@/services/transfer.service";
import { format } from "date-fns";
import { toast } from 'sonner';

// --- TYPES ---
export interface TransferFilterParams {
    fromDate?: string;
    toDate?: string;
    sourceWarehouse?: string; // ID (để giữ trạng thái dropdown)
    destWarehouse?: string;   // ID

    // Thêm tên để logic lọc ở Page hoạt động chính xác
    sourceWarehouseName?: string;
    destWarehouseName?: string;
}

type ModalType = "filter" | "add" | "edit" | "detail" | "delete" | null;

interface TransferModalsProps {
    isOpen: boolean;
    type: ModalType;
    selectedId: string | null;
    onClose: (refresh?: boolean) => void;
    // Callback trả bộ lọc về Page
    onApplyFilter?: (params: TransferFilterParams) => void;
}

const DEFAULT_FORM = () => ({
    ngayLap: format(new Date(), "yyyy-MM-dd"),
    maKhoXuat: "",
    maKhoNhan: "",
    ghiChu: "",
});

const DEFAULT_NEW_ITEM = { maLo: "", soLuong: 1, ghiChu: "" };

export default function TransferModals({ isOpen, type, selectedId, onClose, onApplyFilter }: TransferModalsProps) {
    // --- Master Data ---
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);

    // --- Filter State ---
    const [filterState, setFilterState] = useState<TransferFilterParams>({
        fromDate: '',
        toDate: '',
        sourceWarehouse: '',
        destWarehouse: ''
    });

    // --- Form State ---
    const [formData, setFormData] = useState(DEFAULT_FORM());
    const [itemList, setItemList] = useState<CTChuyenKhoItem[]>([]);

    // --- Adding Item State ---
    const [newItem, setNewItem] = useState<{ maLo: string; soLuong: number; ghiChu: string }>(DEFAULT_NEW_ITEM);

    // --- UI State ---
    const [isCheckingStock, setIsCheckingStock] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formError, setFormError] = useState<string | null>(null);
    const [newItemError, setNewItemError] = useState<string | null>(null);

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [flashRowIndex, setFlashRowIndex] = useState<number | null>(null);

    // --- Batch Search UI ---
    const [batchKeyword, setBatchKeyword] = useState("");
    const [isBatchDropdownOpen, setIsBatchDropdownOpen] = useState(false);
    const [activeBatchIndex, setActiveBatchIndex] = useState(0);
    const batchSearchWrapRef = useRef<HTMLDivElement | null>(null);

    // --- Quantity editing helper ---
    const prevQtyRef = useRef<number>(0);

    // --- Derived flags ---
    const isDetail = type === "detail";
    const isEdit = type === "edit";
    const isAdd = type === "add";
    const isReadOnly = isDetail;

    const markDirty = () => {
        if (!isReadOnly) setHasUnsavedChanges(true);
    };

    const handleRequestClose = (refresh?: boolean) => {
        if (!refresh && !isReadOnly && hasUnsavedChanges) {
            const ok = window.confirm("Bạn có thay đổi chưa lưu. Bạn chắc chắn muốn đóng?");
            if (!ok) return;
        }
        onClose(refresh);
    };

    // --- Memo: filtered batches ---
    const filteredBatches = useMemo(() => {
        const kw = batchKeyword.trim().toLowerCase();
        if (!kw) return batches.slice(0, 12);
        const list = (batches || [])
            .filter((b: any) => {
                const code = (b.maLoCode || "").toLowerCase();
                const name = (b.tenSP || "").toLowerCase();
                return code.includes(kw) || name.includes(kw);
            })
            .sort((a: any, b: any) => {
                const ac = (a.maLoCode || "").toLowerCase();
                const bc = (b.maLoCode || "").toLowerCase();
                const aStarts = ac.startsWith(kw) ? 0 : 1;
                const bStarts = bc.startsWith(kw) ? 0 : 1;
                if (aStarts !== bStarts) return aStarts - bStarts;
                return ac.localeCompare(bc);
            });
        return list.slice(0, 12);
    }, [batches, batchKeyword]);

    // Close dropdown when click outside
    useEffect(() => {
        function onDocMouseDown(e: MouseEvent) {
            if (!batchSearchWrapRef.current) return;
            const target = e.target as Node;
            if (!batchSearchWrapRef.current.contains(target)) setIsBatchDropdownOpen(false);
        }
        document.addEventListener("mousedown", onDocMouseDown);
        return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, []);

    // --- Effects ---
    useEffect(() => {
        if (!isOpen) return;

        setFormError(null);
        setNewItemError(null);
        setFlashRowIndex(null);

        // Luôn load data kho để dùng cho Filter
        loadMasterData();

        if (type === "add") {
            setFormData(DEFAULT_FORM());
            setItemList([]);
            setNewItem(DEFAULT_NEW_ITEM);
            setBatchKeyword("");
            setIsBatchDropdownOpen(false);
            setActiveBatchIndex(0);
            setHasUnsavedChanges(false);
        } else if ((type === "edit" || type === "detail") && selectedId) {
            fetchDetail(selectedId);
            setHasUnsavedChanges(false);
        }
    }, [isOpen, type, selectedId]);

    const loadMasterData = async () => {
        try {
            const [ws, bs] = await Promise.all([transferService.getWarehouses(), transferService.getBatches()]);
            setWarehouses(ws);
            setBatches(bs);
        } catch (error) {
            console.error("Load master data failed", error);
            setFormError("Không thể tải dữ liệu kho / lô hàng. Vui lòng thử lại.");
        }
    };

    const parseStatus = (status: string | number): number => {
        if (typeof status === "number") return status;
        switch (status) {
            case "TAO": return 0;
            case "DANG_CHUYEN": return 1;
            case "DA_NHAN": return 2;
            default: return 0;
        }
    };

    const fetchDetail = async (id: string) => {
        setIsLoading(true);
        try {
            const data = await transferService.getById(id);
            setFormData({
                ngayLap: data.ngayLap ? format(new Date(data.ngayLap), "yyyy-MM-dd") : "",
                maKhoXuat: data.maKhoXuat,
                maKhoNhan: data.maKhoNhan,
                ghiChu: data.ghiChu || "",
            });

            const mappedItems = (data.danhSachSanPham || []).map((item: any) => ({
                ...item,
                trangThai: parseStatus(item.trangThai),
            }));

            setItemList(mappedItems);
            setNewItem(DEFAULT_NEW_ITEM);
            setBatchKeyword("");
            setIsBatchDropdownOpen(false);
            setActiveBatchIndex(0);
        } catch (error) {
            console.error(error);
            setFormError("Không thể tải chi tiết phiếu chuyển.");
        } finally {
            setIsLoading(false);
        }
    };

    const visibleItems = useMemo(() => itemList.filter((i) => !i.isDeleted), [itemList]);
    const disableAddItem = !formData.maKhoXuat || isCheckingStock;

    // --- Filter Handlers ---
    const handleFilterSubmit = () => {
        if (onApplyFilter) {
            // Tìm tên kho dựa trên ID đã chọn trong dropdown
            const sourceName = warehouses.find(w => w.maKho === filterState.sourceWarehouse)?.tenKho;
            const destName = warehouses.find(w => w.maKho === filterState.destWarehouse)?.tenKho;

            onApplyFilter({
                ...filterState,
                sourceWarehouseName: sourceName,
                destWarehouseName: destName
            });
        }
        handleRequestClose(false);
    };

    const handleResetFilter = () => {
        const emptyFilter = { fromDate: '', toDate: '', sourceWarehouse: '', destWarehouse: '', sourceWarehouseName: '', destWarehouseName: '' };
        setFilterState(emptyFilter);
        if (onApplyFilter) {
            onApplyFilter(emptyFilter);
        }
        handleRequestClose(false);
    };

    // --- Handlers (Form) ---
    const validateNewItem = () => {
        if (!formData.maKhoXuat) return "Vui lòng chọn Kho xuất trước.";
        if (!newItem.maLo) return "Vui lòng chọn Lô hàng.";
        if (newItem.soLuong <= 0) return "Số lượng phải > 0.";
        return null;
    };

    const handleBatchSelect = (b: any) => {
        setNewItem((prev) => ({ ...prev, maLo: b.maLo }));
        setBatchKeyword(`${b.maLoCode} - ${b.tenSP}`);
        setIsBatchDropdownOpen(false);
        setActiveBatchIndex(0);
        setNewItemError(null);
        markDirty();
    };

    const handleAddItem = async () => {
        const err = validateNewItem();
        if (err) {
            setNewItemError(err);
            return;
        }

        setIsCheckingStock(true);
        try {
            await transferService.checkInventory(formData.maKhoXuat, newItem.maLo, newItem.soLuong);

            const batchInfo = batches.find((b: any) => b.maLo === newItem.maLo);

            const item: CTChuyenKhoItem = {
                maLo: newItem.maLo,
                maLoCode: batchInfo?.maLoCode || "N/A",
                tenSanPham: batchInfo?.tenSP || "Unknown",
                soLuongChuyen: newItem.soLuong,
                ghiChu: newItem.ghiChu,
                trangThai: 0,
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
            setNewItemError(null);
            markDirty();
        } catch (error: any) {
            toast.error("Không đủ tồn kho!");
        } finally {
            setIsCheckingStock(false);
        }
    };

    const handleQuantityBlur = async (index: number, newQty: number) => {
        const originalQty = prevQtyRef.current;
        if (newQty === originalQty) return;
        if (newQty <= 0) {
            setFormError("Số lượng phải lớn hơn 0.");
            setItemList((prev) => {
                const next = [...prev];
                next[index].soLuongChuyen = originalQty;
                return next;
            });
            return;
        }

        try {
            await transferService.checkInventory(formData.maKhoXuat, visibleItems[index].maLo, newQty);

            setItemList((prev) => {
                const item = visibleItems[index];
                const realIndex = prev.findIndex((x) => x === item);
                if (realIndex === -1) return prev;
                const next = [...prev];
                next[realIndex].soLuongChuyen = newQty;
                return next;
            });
            markDirty();
        } catch (error: any) {
            setFormError(`Lỗi: ${error.response?.data?.detail || "Không đủ hàng trong kho!"}`);
            setItemList((prev) => {
                const item = visibleItems[index];
                const realIndex = prev.findIndex((x) => x === item);
                if (realIndex === -1) return prev;
                const next = [...prev];
                next[realIndex].soLuongChuyen = originalQty;
                return next;
            });
        }
    };

    const handleQuantityChangeInput = (index: number, val: string) => {
        const num = Number(val);
        setItemList((prev) => {
            const item = visibleItems[index];
            const realIndex = prev.findIndex((x) => x === item);
            if (realIndex === -1) return prev;
            const next = [...prev];
            next[realIndex].soLuongChuyen = num;
            return next;
        });
    };

    const handleRemoveItem = (index: number) => {
        const item = visibleItems[index];
        if (type === "add") {
            setItemList((prev) => prev.filter((x) => x !== item));
        } else {
            setItemList((prev) => {
                const realIndex = prev.findIndex((x) => x === item);
                if (realIndex === -1) return prev;
                const next = [...prev];
                if ((next[realIndex] as any).maCTCK) (next[realIndex] as any).isDeleted = true;
                else next.splice(realIndex, 1);
                return next;
            });
        }
        markDirty();
    };

    const validateForm = () => {
        if (!formData.maKhoXuat) return "Vui lòng chọn Kho xuất.";
        if (!formData.maKhoNhan) return "Vui lòng chọn Kho nhận.";
        if (formData.maKhoNhan === formData.maKhoXuat) return "Kho nhận không được trùng Kho xuất.";
        if (visibleItems.length === 0) return "Chưa có sản phẩm nào trong phiếu.";
        return null;
    };

    const handleSubmit = async () => {
        setFormError(null);
        const err = validateForm();
        if (err) {
            setFormError(err);
            return;
        }

        setIsSubmitting(true);
        try {
            if (type === "add") {
                const payload = {
                    ngayLap: new Date(formData.ngayLap).toISOString(),
                    maKhoXuat: formData.maKhoXuat,
                    maKhoNhan: formData.maKhoNhan,
                    ghiChu: formData.ghiChu,
                    danhSachSanPham: visibleItems.map((i) => ({
                        maLo: i.maLo,
                        soLuongChuyen: i.soLuongChuyen,
                        ghiChu: i.ghiChu,
                    })),
                };
                await transferService.create(payload);
            } else if (type === "edit" && selectedId) {
                const payload = {
                    maCK: selectedId,
                    ngayLap: new Date(formData.ngayLap).toISOString(),
                    maKhoNhan: formData.maKhoNhan,
                    ghiChu: formData.ghiChu,
                    danhSachChiTiet: itemList,
                };
                await transferService.update(selectedId, payload);
            }
            setHasUnsavedChanges(false);
            handleRequestClose(true);
            toast.success("Thao tác thành công!");
        } catch (error: any) {
            setFormError("Có lỗi xảy ra: " + (error.response?.data?.detail || error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateStatus = async (maCTCK: string, newStatus: number) => {
        setFormError(null);
        if (newStatus === 2) {
            if (!confirm("Xác nhận đã nhận hàng? Hành động này sẽ cập nhật tồn kho.")) return;
            try {
                await transferService.updateDetailStatus(maCTCK, 2);
                setItemList((prev) => prev.map((i: any) => (i.maCTCK === maCTCK ? { ...i, trangThai: 2 } : i)));
                markDirty();
            } catch (error: any) {
                setFormError("Lỗi cập nhật trạng thái: " + (error.response?.data?.detail || "Không xác định"));
            }
        } else {
            setItemList((prev) => prev.map((i: any) => (i.maCTCK === maCTCK ? { ...i, trangThai: newStatus } : i)));
            markDirty();
        }
    };

    const handleDelete = async () => {
        if (!selectedId) return;
        setIsSubmitting(true);
        try {
            await transferService.delete(selectedId);
            handleRequestClose(true);
            toast.success("Xóa phiếu chuyển thành công!");
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
                        <h2 className="text-2xl font-bold mb-8 text-slate-800">Lọc phiếu chuyển</h2>

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
                                <label className="block text-xs font-medium text-slate-500 mb-1">Kho xuất</label>
                                <select
                                    className="w-full p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-sm outline-none text-slate-800 focus:border-emerald-500"
                                    value={filterState.sourceWarehouse || ''}
                                    onChange={(e) => setFilterState({ ...filterState, sourceWarehouse: e.target.value })}
                                >
                                    <option value="">-- Tất cả --</option>
                                    {warehouses.map(w => (
                                        <option key={w.maKho} value={w.maKho}>{w.tenKho}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Kho nhập</label>
                                <select
                                    className="w-full p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-sm outline-none text-slate-800 focus:border-emerald-500"
                                    value={filterState.destWarehouse || ''}
                                    onChange={(e) => setFilterState({ ...filterState, destWarehouse: e.target.value })}
                                >
                                    <option value="">-- Tất cả --</option>
                                    {warehouses.map(w => (
                                        <option key={w.maKho} value={w.maKho}>{w.tenKho}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4 w-full mt-8">
                            <button
                                onClick={handleFilterSubmit}
                                className="flex-1 py-3 bg-[#43a047] hover:bg-green-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-green-100"
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
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Xác nhận xóa phiếu chuyển?</h3>
                    <p className="text-slate-500 mb-6">Hành động này không thể hoàn tác.</p>

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
                            {isSubmitting ? "Đang xóa..." : "Xóa bỏ"}
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-slate-800">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 text-slate-800">
                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white text-slate-800">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            {type === "add" ? <Plus size={28} /> : isEdit ? <Edit size={28} /> : <Info size={28} />}
                            {type === "add" ? "Tạo phiếu chuyển kho" : isEdit ? "Cập nhật phiếu chuyển" : "Chi tiết phiếu chuyển"}
                        </h2>
                        {!isDetail && <p className="text-xs text-slate-500 mt-1">Mẹo: Chọn lô → nhập số lượng → Enter để thêm nhanh.</p>}
                    </div>
                    <button onClick={() => handleRequestClose()} className="text-slate-400 hover:text-red-500">
                        <X size={28} />
                    </button>
                </div>

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

                        {/* 1. General Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-slate-800">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-slate-700">Ngày lập phiếu</label>
                                    <input
                                        type="date"
                                        disabled={isReadOnly}
                                        value={formData.ngayLap}
                                        onChange={(e) => {
                                            setFormData({ ...formData, ngayLap: e.target.value });
                                            markDirty();
                                        }}
                                        className="mt-1 w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-200 bg-white text-slate-800 disabled:bg-slate-100"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-slate-700">Kho xuất hàng</label>
                                    <select
                                        disabled={isReadOnly || isEdit}
                                        value={formData.maKhoXuat}
                                        onChange={(e) => {
                                            setFormData({ ...formData, maKhoXuat: e.target.value });
                                            // reset add-item state when kho xuat changes
                                            setNewItem(DEFAULT_NEW_ITEM);
                                            setBatchKeyword("");
                                            setIsBatchDropdownOpen(false);
                                            setNewItemError(null);
                                            markDirty();
                                        }}
                                        className="mt-1 w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-200 bg-white text-slate-800 disabled:bg-slate-100"
                                    >
                                        <option value="">-- Chọn kho xuất --</option>
                                        {warehouses.map((w) => (
                                            <option key={w.maKho} value={w.maKho}>
                                                {w.tenKho}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-slate-700">Ghi chú</label>
                                    <input
                                        type="text"
                                        disabled={isReadOnly}
                                        value={formData.ghiChu}
                                        onChange={(e) => {
                                            setFormData({ ...formData, ghiChu: e.target.value });
                                            markDirty();
                                        }}
                                        placeholder="Ví dụ: ưu tiên lô gần hết hạn..."
                                        className="mt-1 w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-200 bg-white text-slate-800 disabled:bg-slate-100"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-slate-700">Kho nhận hàng</label>
                                    <select
                                        disabled={isReadOnly}
                                        value={formData.maKhoNhan}
                                        onChange={(e) => {
                                            setFormData({ ...formData, maKhoNhan: e.target.value });
                                            markDirty();
                                        }}
                                        className="mt-1 w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-200 bg-white text-slate-800 disabled:bg-slate-100"
                                    >
                                        <option value="">-- Chọn kho nhận --</option>
                                        {warehouses.map((w) => (
                                            <option key={w.maKho} value={w.maKho}>
                                                {w.tenKho}
                                            </option>
                                        ))}
                                    </select>

                                    {formData.maKhoNhan && formData.maKhoXuat && formData.maKhoNhan === formData.maKhoXuat && (
                                        <p className="mt-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-2">
                                            ⚠ Kho nhận không được trùng Kho xuất.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 2. Add Batch Section (Hidden in Detail) */}
                        {!isDetail && (
                            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 mb-6 shadow-sm text-slate-800">
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div className="text-sm font-bold text-emerald-900">Thêm lô chuyển</div>
                                    <div className="text-xs text-emerald-800/80">
                                        {formData.maKhoXuat ? "Gõ mã lô / tên SP để tìm nhanh" : "Chọn Kho xuất trước"}
                                    </div>
                                </div>

                                <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                                    {/* Batch search */}
                                    <div className="md:col-span-6" ref={batchSearchWrapRef}>
                                        <label className="text-xs font-bold text-emerald-900 mb-1 block">Lô hàng</label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                <Search size={16} />
                                            </div>
                                            <input
                                                disabled={!formData.maKhoXuat}
                                                value={batchKeyword}
                                                onChange={(e) => {
                                                    setBatchKeyword(e.target.value);
                                                    setIsBatchDropdownOpen(true);
                                                    setActiveBatchIndex(0);
                                                }}
                                                onFocus={() => {
                                                    if (formData.maKhoXuat) setIsBatchDropdownOpen(true);
                                                }}
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
                                                placeholder={formData.maKhoXuat ? "Gõ mã lô hoặc tên sản phẩm..." : "Chọn Kho xuất trước"}
                                                className="w-full pl-10 pr-3 py-2.5 border border-emerald-200 rounded-xl text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-slate-100 disabled:text-slate-500"
                                            />

                                            {isBatchDropdownOpen && formData.maKhoXuat && (
                                                <div className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden text-slate-800">
                                                    <div className="max-h-64 overflow-auto">
                                                        {filteredBatches.length === 0 ? (
                                                            <div className="px-3 py-3 text-sm text-slate-500">Không tìm thấy lô phù hợp.</div>
                                                        ) : (
                                                            filteredBatches.map((b: any, idx: number) => (
                                                                <button
                                                                    type="button"
                                                                    key={b.maLo}
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

                                    {/* Qty */}
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold text-emerald-900 mb-1 block">Số lượng</label>
                                        <input
                                            disabled={!formData.maKhoXuat}
                                            type="number"
                                            min={1}
                                            className="w-full p-2.5 border border-emerald-200 rounded-xl text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-slate-100"
                                            value={newItem.soLuong}
                                            onChange={(e) => {
                                                setNewItem({ ...newItem, soLuong: Number(e.target.value) });
                                                setNewItemError(null);
                                                markDirty();
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleAddItem();
                                            }}
                                        />
                                    </div>

                                    {/* Note */}
                                    <div className="md:col-span-3">
                                        <label className="text-xs font-bold text-emerald-900 mb-1 block">Ghi chú SP</label>
                                        <input
                                            disabled={!formData.maKhoXuat}
                                            type="text"
                                            className="w-full p-2.5 border border-emerald-200 rounded-xl text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-slate-100"
                                            value={newItem.ghiChu}
                                            onChange={(e) => {
                                                setNewItem({ ...newItem, ghiChu: e.target.value });
                                                markDirty();
                                            }}
                                            placeholder="Tuỳ chọn"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleAddItem();
                                            }}
                                        />
                                    </div>

                                    {/* Add */}
                                    <div className="md:col-span-1">
                                        <button
                                            type="button"
                                            onClick={handleAddItem}
                                            disabled={disableAddItem}
                                            className="h-[42px] w-full px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                            title={!formData.maKhoXuat ? "Chọn Kho xuất trước" : "Thêm lô"}
                                        >
                                            {isCheckingStock ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                                            Thêm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. Product Table */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden text-slate-800">
                            {isEdit && (
                                <div className="px-4 py-3 border-b border-slate-100 text-xs text-slate-600 bg-slate-50">
                                    ✏️ Bạn có thể chỉnh sửa <b>Số lượng</b> khi trạng thái chưa “Đã nhận”.
                                </div>
                            )}

                            <div className="overflow-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-xs sticky top-0 z-10">
                                        <tr>
                                            <th className="p-3 w-12">#</th>
                                            <th className="p-3 w-40">Mã Lô</th>
                                            <th className="p-3 min-w-[240px]">Tên Sản Phẩm</th>
                                            <th className="p-3 text-center w-28">Số lượng</th>
                                            <th className="p-3 min-w-[200px]">Ghi chú</th>
                                            <th className="p-3 w-40">Trạng thái</th>
                                            {!isDetail && <th className="p-3 text-center w-16">Xóa</th>}
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {visibleItems.map((item: any, index: number) => (
                                            <tr
                                                key={index}
                                                className={[
                                                    "hover:bg-slate-50 transition-colors",
                                                    flashRowIndex === index ? "bg-emerald-50" : "",
                                                ].join(" ")}
                                            >
                                                <td className="p-3">{index + 1}</td>
                                                <td className="p-3 font-medium text-emerald-700">{item.maLoCode || "N/A"}</td>
                                                <td className="p-3 text-slate-800">{item.tenSanPham}</td>

                                                {/* Qty edit */}
                                                <td className="p-3 text-center">
                                                    {isEdit && item.trangThai !== 2 ? (
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            className="w-24 p-2 border border-slate-200 rounded-xl text-center outline-none focus:ring-2 focus:ring-emerald-200 font-bold text-slate-800 bg-white"
                                                            value={item.soLuongChuyen}
                                                            onFocus={() => {
                                                                prevQtyRef.current = Number(item.soLuongChuyen || 0);
                                                                setFormError(null);
                                                            }}
                                                            onChange={(e) => handleQuantityChangeInput(index, e.target.value)}
                                                            onBlur={(e) => handleQuantityBlur(index, Number(e.target.value))}
                                                        />
                                                    ) : (
                                                        <span className="font-bold text-slate-800">{item.soLuongChuyen}</span>
                                                    )}
                                                </td>

                                                <td className="p-3 text-slate-500 italic">{item.ghiChu || "-"}</td>

                                                <td className="p-3">
                                                    {isEdit && item.maCTCK && item.trangThai !== 2 ? (
                                                        <select
                                                            value={item.trangThai ?? 0}
                                                            onChange={(e) => handleUpdateStatus(item.maCTCK!, Number(e.target.value))}
                                                            className={[
                                                                "text-xs font-bold py-1.5 px-2.5 rounded-xl border border-slate-200 outline-none cursor-pointer bg-white text-slate-800",
                                                                item.trangThai === 0
                                                                    ? "bg-blue-50 text-blue-700 border-blue-100"
                                                                    : item.trangThai === 1
                                                                        ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                                                                        : "bg-green-50 text-green-700 border-green-100",
                                                            ].join(" ")}
                                                        >
                                                            <option value={0}>Tạo mới</option>
                                                            <option value={1}>Đang chuyển</option>
                                                            <option value={2}>Đã nhận</option>
                                                        </select>
                                                    ) : (
                                                        <span
                                                            className={[
                                                                "inline-flex px-2.5 py-1.5 rounded-xl text-xs font-bold border",
                                                                item.trangThai === 0
                                                                    ? "bg-blue-50 text-blue-700 border-blue-100"
                                                                    : item.trangThai === 1
                                                                        ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                                                                        : item.trangThai === 2
                                                                            ? "bg-green-50 text-green-700 border-green-100"
                                                                            : "bg-gray-50 text-gray-700 border-gray-100",
                                                            ].join(" ")}
                                                        >
                                                            {item.trangThai === 0 ? "Tạo mới" : item.trangThai === 1 ? "Đang chuyển" : item.trangThai === 2 ? "Đã nhận" : "N/A"}
                                                        </span>
                                                    )}
                                                </td>

                                                {!isDetail && (
                                                    <td className="p-3 text-center">
                                                        {item.trangThai !== 2 && (
                                                            <button
                                                                onClick={() => handleRemoveItem(index)}
                                                                className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-red-500 hover:bg-red-50"
                                                                title="Xóa dòng"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        ))}

                                        {visibleItems.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="p-10 text-center text-slate-400">
                                                    Chưa có sản phẩm nào
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table footer */}
                            <div className="px-4 py-3 border-t border-slate-100 bg-white flex items-center justify-between text-slate-800">
                                <div className="text-xs text-slate-500">
                                    Tổng dòng: <span className="font-semibold text-slate-700">{visibleItems.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Buttons (sticky) */}
                <div className="p-5 border-t border-gray-100 flex justify-end gap-4 bg-white sticky bottom-0 text-slate-800">
                    {!isDetail && (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || visibleItems.length === 0}
                            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={20} />}
                            {isEdit ? "Lưu thay đổi" : "Tạo phiếu chuyển"}
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