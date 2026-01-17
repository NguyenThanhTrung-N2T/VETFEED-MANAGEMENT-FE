"use client";

import React, { useState } from "react";
import { Globe } from "lucide-react";
import NhaCungCapForm from "./NCCForm";
import Modal from "@/components/ui/Modal";
import { NhaCungCapCreateRequest } from "@/client/types.gen";

interface Props {
    onClose: () => void;
    onAdd: (data: NhaCungCapCreateRequest) => Promise<void>;
}

export default function AddNCCModal({ onClose, onAdd }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: NhaCungCapCreateRequest) => {
        try {
            setIsLoading(true);
            await onAdd(formData);
        } catch (error) {
            console.error("Failed to create provider", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal size="lg">
            {/* Header Title */}
            <div className="flex items-center justify-center gap-3 mb-8">
                <Globe size={28} />
                <h2 className="text-2xl font-bold text-slate-900">Thêm nhà cung cấp</h2>
            </div>

            {/* 
                We don't pass 'defaultValues' here because it's a fresh form.
                The Form component will handle the empty states.
            */}
            <NhaCungCapForm
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onCancel={onClose}
                submitText="Tạo nhà cung cấp"
            />
        </Modal>
    );
}