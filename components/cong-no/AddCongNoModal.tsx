"use client";

import React, { useState, useEffect, useCallback } from "react";
import Modal from "@/components/ui/Modal";
import { Search, User, Briefcase, X, ChevronRight, ArrowLeft, Loader2 } from "lucide-react";
import AddCongNoForm from "./AddCongNoForm";
import { khachHangService } from "@/services/khach-hang.service"
import { CreateCongNoRequest, KhachHangResponse } from "@/client/types.gen";

type KhachHangOption = Pick<
    KhachHangResponse,
    "maKH" | "maKHCode" | "tenKH" | "loaiKhachHang" | "diaChi" | "hanMucCongNo"
>;

interface Props {
    onClose: () => void;
    // The parent handles the API call, returning a Promise allows us to show loading state here
    onAdd: (data: CreateCongNoRequest) => Promise<void> | void;
}

export default function AddCongNoModal({ onClose, onAdd }: Props) {
    // --- State ---
    const [step, setStep] = useState<1 | 2>(1); // 1: Select Subject, 2: Enter Form
    const selectedType = 'KH'; // Hardcoded to Customer for now

    // Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<KhachHangOption[]>([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    // Selection State
    const [selectedItem, setSelectedSubject] = useState<KhachHangOption | null>(null);

    // Submission State
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);

    const mapToOption = (kh: KhachHangResponse): KhachHangOption => ({
        maKH: kh.maKH!,
        maKHCode: kh.maKHCode,
        tenKH: kh.tenKH ?? "",
        loaiKhachHang: kh.loaiKhachHang,
        hanMucCongNo: kh.hanMucCongNo,
        diaChi: kh.diaChi
    });
    // --- Effects ---
    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(searchQuery, 1, false);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // --- Handlers ---
    const PAGE_SIZE = 10;

    const handleSearch = useCallback(
        async (query: string = "", page = 1, append = false) => {
            append ? setIsLoadingMore(true) : setLoadingSearch(true);
            try {
                const res = await khachHangService.getAll({
                    Keyword: query,
                    Page: page,
                    PageSize: PAGE_SIZE,
                });
                const items = res.items ? res.items.map(mapToOption) : [];

                setSearchResults(prev =>
                    append ? [...prev, ...items] : items
                );
                setTotal(res.total!);
                setCurrentPage(res.page!);
            } catch (error) {
                console.error(error);
            } finally {
                append ? setIsLoadingMore(false) : setLoadingSearch(false);
            }
        },
        []
    );

    const handleSelectSubject = (subject: KhachHangOption) => {
        setSelectedSubject(subject);
        setStep(2); // Move to form
    };

    // Wrapper to handle the async onAdd call from parent
    const handleAdd = async (data: CreateCongNoRequest) => {
        try {
            setIsSubmitting(true);
            await onAdd(data); // Wait for parent to finish API call
            onClose();
        } catch (error) {
            console.error("Failed to add cong no", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Render ---
    return (
        <Modal>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    {step === 2 && (
                        <button
                            onClick={() => setStep(1)}
                            className="p-1 hover:bg-slate-100 rounded-full mr-1 text-slate-500 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <h2 className="text-xl font-bold text-slate-800">
                        {step === 1 ? "Chọn đối tượng công nợ" : "Tạo phiếu công nợ"}
                    </h2>
                </div>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-600 transition-colors duration-200 
               hover:bg-slate-100 rounded-full p-1 flex items-center justify-center 
               cursor-pointer active:scale-95"
                >
                    <X size={24} />
                </button>
            </div>

            {/* STEP 1: Select Customer */}
            {step === 1 && (
                <div className="space-y-4">
                    {/* Tabs (Visual only for now) */}
                    <div className="flex p-1 bg-slate-100 rounded-lg">
                        <button className="flex-1 py-2 text-sm font-medium rounded-md bg-white shadow-sm text-blue-700 flex items-center justify-center gap-2">
                            <User size={16} /> Khách hàng
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm tên, mã khách hàng..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            autoFocus
                        />
                    </div>

                    {/* Results List */}
                    <div className="h-64 border border-slate-200 rounded-lg overflow-hidden flex flex-col">
                        {/* Results List (scrollable) */}
                        <div className="overflow-y-auto flex-1 custom-scrollbar">
                            {loadingSearch ? (
                                <div className="flex justify-center items-center h-full text-slate-400 text-sm">
                                    <Loader2 className="animate-spin mr-2" /> Đang tìm kiếm...
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
                                    <p>Không tìm thấy dữ liệu.</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-slate-100">
                                    {searchResults.map((item) => (
                                        <li key={item.maKH}>
                                            <button
                                                onClick={() => handleSelectSubject(item)}
                                                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex justify-between items-center group cursor-pointer"
                                            >
                                                <div>
                                                    <div className="font-semibold text-slate-700">{item.tenKH}</div>
                                                    <div className="text-xs text-slate-500 flex gap-2">
                                                        <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{item.maKHCode}</span>
                                                        {item.diaChi && <span>📍 {item.diaChi}</span>}
                                                    </div>
                                                </div>
                                                <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Sticky Footer */}
                        {(total > searchResults.length || searchResults.length < total) && (
                            <div className="sticky bottom-0 bg-white border-t border-slate-100 px-4 py-2 flex justify-between items-center text-xs text-slate-500 z-10">
                                {total > searchResults.length && (
                                    <div>+ {total - searchResults.length} khách hàng khác</div>
                                )}
                                {searchResults.length < total && (
                                    <button
                                        onClick={() => handleSearch(searchQuery, currentPage + 1, true)}
                                        disabled={isLoadingMore}
                                        className="text-blue-600 hover:underline disabled:text-slate-400 cursor-pointer"
                                    >
                                        {isLoadingMore ? "Đang tải..." : "Xem thêm"}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            )}

            {/* STEP 2: Fill Form */}
            {step === 2 && selectedItem && (
                <div className="animate-in slide-in-from-right-4 duration-300">
                    {/* Selected Subject Summary */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-5 flex items-start gap-3">
                        <div className="bg-white p-2 rounded-full border border-blue-100 text-blue-600">
                            {selectedItem.loaiKhachHang === 'KH' ? <User size={20} /> : <Briefcase size={20} />}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">{selectedItem.tenKH}</p>
                            <p className="text-xs text-slate-500">Mã: {selectedItem.maKHCode}</p>
                        </div>
                        <button
                            onClick={() => setStep(1)}
                            className="ml-auto text-xs text-blue-600 hover:underline mt-1 font-medium"
                        >
                            Thay đổi
                        </button>
                    </div>

                    {/* Form */}
                    <AddCongNoForm
                        maDoiTuong={selectedItem.maKH!}
                        onSubmit={handleAdd} // Calls wrapper which calls parent onAdd
                        onCancel={onClose}
                        isLoading={isSubmitting}
                        submitText={isSubmitting ? "Đang lưu..." : "Lưu phiếu"}
                    />
                </div>
            )}
        </Modal>
    );
}