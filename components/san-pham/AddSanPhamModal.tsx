"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import SanPhamForm from "./SanPhamForm";
import { SanPhamWithPriceDTO } from "@/types/SanPhamWithPrice";
import { Tag } from "lucide-react";

interface Props {
    onClose: () => void;
    onAdd: (data: SanPhamWithPriceDTO) => Promise<void> | void;
}

export default function AddSanPhamModal({ onClose, onAdd }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleAdd(data: SanPhamWithPriceDTO) {
        try {
            setIsSubmitting(true);
            const newData: SanPhamWithPriceDTO = {
                ...data,
                MaSP: crypto.randomUUID(),
                MaSPCode: "SP_AUTO", // This should come from backend
                NgayTao: new Date().toISOString(),
            };
            await onAdd(newData);
            onClose();
        } catch (error) {
            console.error("Failed to add product", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Modal size="lg">
            {/* Header Title */}
            <div className="flex items-center justify-center gap-3 mb-8">
                <Tag size={28} />
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