"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import KhoForm from "./KhoForm";
import { Layout } from "lucide-react";
import { CreateKhoHangRequest } from "@/client/types.gen";
interface Props {
    onClose: () => void;
    onAdd: (data: CreateKhoHangRequest) => Promise<void> | void;
}

export default function AddKhoModal({ onClose, onAdd }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    async function handleAdd(data: CreateKhoHangRequest) {
        try {
            setIsSubmitting(true);
            // Prepare the data
            const newData = {
                ...data,
            };
            await onAdd(newData);
            onClose();
        }
        catch (error) {
            console.error("Failed to add kho", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Modal size="lg">
            {/* Header Title */}
            <div className="flex items-center justify-center gap-3 mb-8">
                <Layout size={28} />
                <h2 className="text-2xl font-bold text-slate-900">Thêm kho hàng</h2>
            </div>
            <KhoForm
                submitText={isSubmitting ? "Đang thêm..." : "Thêm kho"}
                onSubmit={handleAdd}
                onCancel={onClose}
                isLoading={isSubmitting}
            />
        </Modal>
    );
}
