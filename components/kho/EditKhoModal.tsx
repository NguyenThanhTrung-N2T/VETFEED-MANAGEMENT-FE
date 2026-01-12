"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import KhoForm from "./KhoForm";
import { KhoHangDTO } from "@/types";
import { Layout } from "lucide-react";

interface Props {
    kho: KhoHangDTO;
    onClose: () => void;
    onUpdate: (data: KhoHangDTO) => void;
}

export default function EditKhoModal({ kho, onClose, onUpdate }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    async function handleUpdate(data: KhoHangDTO) {
        try {
            setIsSubmitting(true);
            // Await the parent action (e.g., API call)
            await onUpdate({ ...kho, ...data });
            onClose();
        }
        catch (error) {
            console.error("Failed to update kho", error);
            // Optional: Set an error state here to show a message
        } finally {
            setIsSubmitting(false);
        }
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
                isLoading={isSubmitting}
            />
        </Modal>
    );
}
