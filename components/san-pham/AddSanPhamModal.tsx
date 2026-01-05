"use client";

import Modal from "@/components/ui/Modal";
import SanPhamForm from "./SanPhamForm";
import { SanPhamWithPriceDTO } from "@/types";
import { Tag } from "lucide-react";

export default function AddSanPhamModal({
    onClose,
    onAdd
}: {
    onClose: () => void;
    onAdd: (data: SanPhamWithPriceDTO) => void;
}) {
    function handleAdd(data: SanPhamWithPriceDTO) {
        onAdd({
            ...data,
            MaSP: crypto.randomUUID(),
            MaSPCode: "SP_MOCK",
            NgayTao: new Date().toISOString(),
        });
        onClose();
    }

    return (
        <Modal>
            {/* Header Title */}
            <div className="flex items-center justify-center gap-3 mb-8">
                <Tag size={28} />
                <h2 className="text-2xl font-bold text-slate-900">Thêm sản phẩm</h2>
            </div>
            <SanPhamForm
                submitText="Thêm"
                onSubmit={handleAdd}
                onCancel={onClose}
            />
        </Modal>
    );
}