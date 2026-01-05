"use client";

import Modal from "@/components/ui/Modal";
import KhoForm from "./KhoForm";
import { KhoHangDTO } from "@/types";
import { Layout } from "lucide-react";

export default function AddKhoModal({ onClose, onAdd }: {
    onClose: () => void;
    onAdd: (data: KhoHangDTO) => void;
}) {
    function handleAdd(data: KhoHangDTO) {
        onAdd({
            ...data,
            MaKho: crypto.randomUUID(),
            MaKhoCode: "KHO_MOCK",
            NgayTao: new Date().toISOString(),
        });
        onClose();
    }

    return (
        <Modal>
            {/* Header Title */}
            <div className="flex items-center justify-center gap-3 mb-8">
                <Layout size={28} />
                <h2 className="text-2xl font-bold text-slate-900">Thêm kho hàng</h2>
            </div>
            <KhoForm
                submitText="Thêm"
                onSubmit={handleAdd}
                onCancel={onClose}
            />
        </Modal>
    );
}
