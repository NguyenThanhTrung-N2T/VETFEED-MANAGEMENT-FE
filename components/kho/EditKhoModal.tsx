"use client";

import Modal from "@/components/ui/Modal";
import KhoForm from "./KhoForm";
import { KhoHangDTO } from "@/types";
import { Layout } from "lucide-react";

export default function EditKhoModal({
    kho,
    onClose,
    onUpdate,
}: {
    kho: KhoHangDTO;
    onClose: () => void;
    onUpdate: (data: KhoHangDTO) => void;
}) {
    function handleUpdate(data: KhoHangDTO) {
        onUpdate(data);
        onClose();
    }

    return (
        <Modal>
            {/* Header Title */}
            <div className="flex items-center justify-center gap-3 mb-8">
                <Layout size={28} />
                <h2 className="text-2xl font-bold text-slate-900">Cập nhật kho hàng</h2>
            </div>
            <KhoForm
                defaultValues={kho}
                submitText="Cập nhật"
                onSubmit={handleUpdate}
                onCancel={onClose}
            />
        </Modal>
    );
}
