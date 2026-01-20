"use client"
import { useState } from "react";
import { Tag } from "lucide-react";
import { SanPhamCreateRequest } from "@/client/types.gen";
import SanPhamForm, { SanPhamFormData } from "./SanPhamForm";
import Modal from "@/components/ui/Modal";

interface Props {
    onClose: () => void;
    // The parent still expects the correct API Request type
    onAdd: (data: SanPhamCreateRequest) => Promise<void> | void;
}

export default function AddSanPhamModal({ onClose, onAdd }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // The Form returns generic data (SanPhamFormData)
    async function handleAdd(formData: SanPhamFormData) {
        try {
            setIsSubmitting(true);

            // 1. Transform Form Data -> API Create Request
            const requestData: SanPhamCreateRequest = {
                tenSP: formData.tenSP,
                loaiSanPham: formData.loaiSanPham,
                donViTinh: formData.donViTinh,
                ghiChu: formData.ghiChu,
                donViQuyDoi: formData.donViQuyDoi,
                anhSanPham: formData.anhSanPham,
                // MAPPING: Map the form's generic 'price' to 'giaBanDau' for creation
                giaBanDau: formData.price ?? undefined,
            };
            await onAdd(requestData);
            onClose();
        } catch (error) {
            console.error("Failed to add product", error);
            // Add toast notification here
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Modal size="lg">
            {/* Header Title */}
            <div className="flex items-center justify-center gap-3 mb-8">
                <Tag size={28} className="text-[#3f861e]" />
                <h2 className="text-2xl font-bold text-slate-900">Thêm sản phẩm</h2>
            </div>

            <SanPhamForm
                submitText={isSubmitting ? "Đang xử lý..." : "Lưu sản phẩm"}
                onSubmit={handleAdd}
                onCancel={onClose}
                isLoading={isSubmitting}
            />
        </Modal>
    );
}