"use client";

import { useState } from "react";
import { Tag } from "lucide-react";
import { SanPhamUpdateRequest, SanPhamResponse } from "@/client/types.gen";
import SanPhamForm, { SanPhamFormData } from "./SanPhamForm";
import Modal from "@/components/ui/Modal";

interface Props {
    sanPham: SanPhamResponse;
    onClose: () => void;
    // Renamed from onAdd to onUpdate for clarity
    onUpdate: (id: string, data: SanPhamUpdateRequest) => Promise<void> | void;
}

export default function EditSanPhamModal({ sanPham, onClose, onUpdate }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    async function handleSubmit(formData: SanPhamFormData) {
        if (!sanPham.maSP) {
            console.error("Cannot update: Missing Product ID");
            return;
        }
        try {
            setIsSubmitting(true);

            // Transform Form Data -> API Update Request
            const requestData: SanPhamUpdateRequest = {
                tenSP: formData.tenSP,
                loaiSanPham: formData.loaiSanPham,
                donViTinh: formData.donViTinh,
                ghiChu: formData.ghiChu,
                donViQuyDoi: formData.donViQuyDoi,
                anhSanPham: formData.anhSanPham,
                // MAPPING: Map the form's generic 'price' to 'giaMoi' (New Price) for updates
                giaMoi: formData.price ?? undefined,
            };

            await onUpdate(sanPham.maSP, requestData);
            onClose();
        } catch (error) {
            console.error("Failed to update product", error);
            // Optional: Add toast notification here
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Modal size="lg">
            {/* Header Title */}
            <div className="flex items-center justify-center gap-3 mb-8">
                {/* Blue color typically indicates 'Edit' state */}
                <Tag size={28} />
                <h2 className="text-2xl font-bold text-slate-900">Cập nhật sản phẩm</h2>
            </div>

            <SanPhamForm
                // !!! CRITICAL: Pass the existing data to populate the form !!!
                defaultValues={sanPham}
                submitText={isSubmitting ? "Đang lưu..." : "Cập nhật"}
                onSubmit={handleSubmit}
                onCancel={onClose}
                isLoading={isSubmitting}
            />
        </Modal>
    );
}