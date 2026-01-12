"use client";

import Modal from "@/components/ui/Modal";
import SanPhamForm from "./SanPhamForm";
import { SanPhamWithPriceDTO } from "@/types";
import { Tag } from "lucide-react";
export default function EditSanPhamModal({
    sanPham,
    onClose,
    onUpdate,
}: {
    sanPham: SanPhamWithPriceDTO;
    onClose: () => void;
    onUpdate: (data: SanPhamWithPriceDTO) => void;
}) {
    function handleUpdate(data: SanPhamWithPriceDTO) {
        onUpdate(data);
        onClose();
    }

    return (
        <Modal>
            {/* Header Title */}
            <div className="flex items-center justify-center gap-3 mb-8">
                <Tag size={28} />
                <h2 className="text-2xl font-bold text-slate-900">Cập nhật sản phẩm</h2>
            </div>
            <SanPhamForm
                defaultValues={sanPham}
                submitText="Cập nhật"
                onSubmit={handleUpdate}
                onCancel={onClose}
            />
        </Modal>
    );
}