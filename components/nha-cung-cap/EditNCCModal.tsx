"use client";

import React, { useState, useEffect } from "react";
import { Globe, Loader2 } from "lucide-react";
import NhaCungCapForm from "./NCCForm"; // Assuming your form file is named NCCForm.tsx
import Modal from "@/components/ui/Modal";
import {
    NhaCungCapCreateRequest,
    NhaCungCapDetailedResponse,
    NhaCungCapResponse
} from "@/client/types.gen";
import { nhaCungCapService } from "@/services/nha-cung-cap.service"; // Adjust path to your service

interface Props {
    // The initial data passed from the parent table (might be partial)
    data: NhaCungCapResponse | null;
    onClose: () => void;
    onUpdate: (id: string, data: NhaCungCapCreateRequest) => Promise<void>;
}

export default function EditNCCModal({ data, onClose, onUpdate }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false); // Submitting state
    const [isFetching, setIsFetching] = useState(true); // Initial fetching state

    // We store the full detailed response here
    const [detailData, setDetailData] = useState<NhaCungCapDetailedResponse | undefined>(undefined);

    // Fetch full details when modal opens with specific ID
    useEffect(() => {
        const fetchDetails = async () => {
            if (!data?.maNCC) return;

            try {
                setIsFetching(true);
                // We must fetch by ID to ensure we get the latest 'sanPhams' list
                // which might not be present in the Table Row data
                const response = await nhaCungCapService.getById(data.maNCC);
                setDetailData(response);
            } catch (error) {
                console.error("Failed to fetch provider details:", error);
                onClose(); // Close if we can't load data
            } finally {
                setIsFetching(false);
            }
        };

        fetchDetails();
    }, [data, onClose]);

    const handleSubmit = async (formData: NhaCungCapCreateRequest) => {
        if (!data?.maNCC) return;

        try {
            setIsSubmitting(true);
            await onUpdate(data.maNCC, formData);
        } catch (error) {
            console.error("Failed to update provider", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Don't render if no data passed
    if (!data) return null;

    return (
        <Modal size="xl">
            {/* Header Title */}
            <div className="flex flex-col items-center justify-center gap-2 mb-8">
                <div className="flex items-center gap-3">
                    <Globe size={28} />
                    <h2 className="text-2xl font-bold text-slate-900">Cập nhật nhà cung cấp</h2>
                </div>
                {/* Display the code for reference */}
                <div className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {data.maNCCCode || "..."}
                </div>
            </div>

            {/* Content */}
            {isFetching ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                    <Loader2 size={32} className="animate-spin text-blue-500" />
                    <span className="text-sm">Đang tải thông tin chi tiết...</span>
                </div>
            ) : (
                <NhaCungCapForm
                    defaultValues={detailData}
                    isLoading={isSubmitting}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                    submitText={isSubmitting ? "Đang lưu..." : "Cập nhật"}
                />
            )}
        </Modal>
    );
}