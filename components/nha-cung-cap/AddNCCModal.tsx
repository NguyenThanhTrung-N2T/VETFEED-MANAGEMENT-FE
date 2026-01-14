import React, { useState, useEffect } from "react";
import { X, Globe } from "lucide-react";
import NhaCungCapForm from "./NCCForm";
import Modal from "@/components/ui/Modal";
import { NhaCungCapDetailDTO } from "@/types";
//import { nhaCungCapService } from "@/services/nha-cung-cap.service"; 
interface Props {
    //data: NhaCungCapDTO; // This is the lightweight data from the table
    onClose: () => void;
    onAdd: (data: any) => Promise<void>;
}

export default function AddNCCModal({ onClose, onAdd }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingDetails, setIsFetchingDetails] = useState(true);
    // We start with the basic data
    // const [detailData, setDetailData] = useState<Partial<NhaCungCapDetailDTO>>({
    //     ...data,
    //     SanPhams: [] // Start empty
    // });
    // --- BEST PRACTICE: Fetch Products when Modal Opens ---
    // useEffect(() => {
    //     const fetchDetails = async () => {
    //         try {
    //             setIsFetchingDetails(true);
    //             // Call API: GET /api/nha-cung-cap/{id}/san-pham
    //             const products = await nhaCungCapService.getProductsBySupplier(data.MaNCC);

    // setDetailData(prev => ({
    //     ...prev,
    //     SanPhams: products
    // }));
    //         } catch (error) {
    //             console.error("Failed to load products");
    //             // Optional: Show toast error
    //         } finally {
    //             setIsFetchingDetails(false);
    //         }
    //     };

    //     fetchDetails();
    // }, [data.MaNCC]);
    const handleSubmit = async (data: any) => {
        try {
            setIsLoading(true);
            await onAdd(data);
        } catch (error) {
            console.error("Failed to create", error);
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
            <NhaCungCapForm
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onCancel={onClose}
                submitText="Tạo nhà cung cấp"
            />
        </Modal>
    );
}