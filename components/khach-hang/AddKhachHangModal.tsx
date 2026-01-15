"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import KhachHangForm from "./KhachHangForm";
import { KhachHangCreateRequest, KhachHangResponse } from "@/client/types.gen";
import { Users } from "lucide-react";

interface Props {
    onClose: () => void;
    // The parent still expects the correct API Request type
    onAdd: (data: KhachHangCreateRequest) => Promise<void> | void;
}
export default function AddKhachHangModal({ onClose, onAdd }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    async function handleAdd(data: KhachHangCreateRequest) {
        try {
            setIsSubmitting(true);
            const newData = { ...data };
            await onAdd(newData);
            onClose();
        }
        catch (error) {
        }
        finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Modal>
            {/* Header Title */}
            <div className="flex items-center justify-center gap-3 mb-8">
                <Users size={28} />
                <h2 className="text-2xl font-bold text-slate-900">Thêm khách hàng</h2>
            </div>
            <KhachHangForm
                submitText="Thêm khách hàng"
                onSubmit={handleAdd}
                onCancel={onClose}
            />
        </Modal>
    );
}