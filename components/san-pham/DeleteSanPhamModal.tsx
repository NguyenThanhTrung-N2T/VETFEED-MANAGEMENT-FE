"use client";

import { useState } from "react";
import type { SanPhamWithPriceDTO } from "@/types"; // Adjust this import path to match your project

interface Props {
    sanPham: SanPhamWithPriceDTO;
    onClose: () => void;
    onDelete: (id: string) => Promise<void> | void;
}

export default function DeleteSanPhamModal({ sanPham, onClose, onDelete }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            // Pass the ID to the parent's delete function
            await onDelete(sanPham.MaSP);
            onClose();
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            // You could add a toast error notification here
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            {/* Modal Content */}
            <div className="bg-white rounded-xl shadow-2xl w-120 p-8 animate-in fade-in zoom-in duration-200 text-center relative">

                {/* Title / Question */}
                <h3 className="text-xl font-bold text-slate-800 mb-8 font-sans leading-relaxed">
                    Bạn có chắc là muốn xóa sản phẩm <br />
                    <span className="text-red-600">"{sanPham.TenSP}"</span> không?
                </h3>

                {/* Actions */}
                <div className="flex gap-4 justify-center">
                    {/* Confirm Delete Button (Green based on your snippet) */}
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1 py-2.5 bg-[#43a047] text-white rounded-lg font-bold hover:bg-green-700 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isDeleting ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                Đang xóa...
                            </span>
                        ) : (
                            "Xóa"
                        )}
                    </button>

                    {/* Cancel Button */}
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 py-2.5 border border-red-500 text-red-600 rounded-lg font-bold hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
}