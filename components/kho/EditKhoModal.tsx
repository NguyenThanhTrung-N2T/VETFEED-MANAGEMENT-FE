"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import KhoForm from "./KhoForm";
import { KhoHangResponse, UpdateKhoHangRequest, TrangThaiKhoEnum } from "@/client/types.gen";
import { Layout } from "lucide-react";

interface Props {
    kho: KhoHangResponse;
    onClose: () => void;
    onUpdate: (id: string, data: UpdateKhoHangRequest) => Promise<void>;
}

export default function EditKhoModal({ kho, onClose, onUpdate }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const getSafeStatus = (val: string | number | null | undefined): TrangThaiKhoEnum => {
        if (val === 1 || val === "1" || val === "NGUNG_HOAT_DONG" || val === "Inactive") {
            return 1; // Return Number 1
        }
        return 0; // Return Number 0 for everything else
    };
    // Prepare default values (Cast to UpdateRequest for the form)
    // We use 'as unknown' because KhoHangResponse has extra fields (ID, Code) 
    // that UpdateKhoHangRequest doesn't need, but the overlap is fine.
    const defaultValues: UpdateKhoHangRequest = {
        tenKho: kho.tenKho || "",
        diaChi: kho.diaChi || "",
        ghiChu: kho.ghiChu || "",
        trangThai: getSafeStatus(kho.trangThai)
    };
    async function handleUpdate(formData: UpdateKhoHangRequest) {
        if (!kho.maKho) {
            console.error("Cannot update: Missing Warehouse ID");
            return;
        }

        try {
            setIsSubmitting(true);
            await onUpdate(kho.maKho, formData);
            onClose();
        }
        catch (error) {
            console.error("Failed to update kho", error);
            // logic to show error message (toast)
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Modal>
            <div className="flex items-center justify-center gap-3 mb-8">
                <Layout size={28} />
                <h2 className="text-2xl font-bold text-slate-900">Cập nhật kho hàng</h2>
            </div>

            <KhoForm
                defaultValues={defaultValues}
                submitText="Cập nhật"
                onSubmit={handleUpdate}
                onCancel={onClose}
                isLoading={isSubmitting}
            />
        </Modal>
    );
}