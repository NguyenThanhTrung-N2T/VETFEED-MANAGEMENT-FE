"use client";

import React, { useState, useEffect } from "react";
import { Globe, Loader2 } from "lucide-react";
import NhaCungCapForm from "./NCCForm";
import Modal from "@/components/ui/Modal";
import { NhaCungCapResponse, NhaCungCapCreateRequest, NhaCungCapDetailedResponse, NhaCungCapSanPhamItemDto } from "@/client/types.gen";
import { nhaCungCapService } from "@/services/nha-cung-cap.service";

interface Props {
    data: NhaCungCapResponse | null;
    onClose: () => void;
    onEdit: (id: string, data: NhaCungCapCreateRequest) => Promise<void>;
}

export default function EditNCCModal({ data, onClose, onEdit }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true); // Initial data loading state

    // State to hold the converted data for the form
    const [formData, setFormData] = useState<Partial<NhaCungCapCreateRequest>>({});

    useEffect(() => {
        if (data?.maNCC) {
            fetchDetails(data.maNCC);
        }
    }, [data]);

    const fetchDetails = async (id: string) => {
        try {
            setIsFetching(true);

            // 1. Fetch detailed data (includes product list)
            const response: NhaCungCapDetailedResponse = await nhaCungCapService.getById(id);

            // 2. Map Response to Request DTO
            // The Form expects NhaCungCapSanPhamItemDto[] (maSP, giaNhapMacDinh, etc.)
            // The Response has NhaCungCapSanPhamResponse[] (likely has tenSanPham, maSP, etc.)
            const mappedProducts: NhaCungCapSanPhamItemDto[] = (response.sanPhams || []).map((p: any) => ({
                maSP: p.maSP,
                giaNhapMacDinh: p.giaNhapMacDinh ?? p.giaNhap ?? 0,
                trangThai: p.trangThai ?? "HOAT_DONG",
                ghiChu: p.ghiChu ?? "",
                // Note: If your Form supports a hidden 'tempName' or similar field in the DTO extension,
                // you could hack it in here like: (p as any).tenSanPham
            }));

            // 3. Set the default values for the form
            setFormData({
                tenNCC: response.tenNCC,
                soDienThoai: response.soDienThoai,
                diaChi: response.diaChi,
                ghiChu: response.ghiChu,
                trangThai: response.trangThai,
                sanPhams: mappedProducts
            });

        } catch (error) {
            console.error("Failed to fetch provider details:", error);
            onClose(); // Close if we can't get data
        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = async (submitData: NhaCungCapCreateRequest) => {
        if (!data?.maNCC) return;

        try {
            setIsLoading(true);
            await onEdit(data.maNCC, submitData);
        } catch (error) {
            console.error("Failed to update provider", error);
        } finally {
            setIsLoading(false);
        }
    };

    // If no data passed initially, don't render
    if (!data) return null;

    return (
        <Modal size="lg">
            {/* Header */}
            <div className="flex flex-col items-center justify-center gap-2 mb-6 pt-4">
                <Globe size={28} />
                <h2 className="text-2xl font-bold text-slate-900">Cập nhật nhà cung cấp</h2>
            </div>

            {/* Content */}
            {isFetching ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                    <Loader2 size={32} className="animate-spin text-blue-500" />
                    <span className="text-sm">Đang tải thông tin...</span>
                </div>
            ) : (
                <NhaCungCapForm
                    defaultValues={formData}
                    isLoading={isLoading}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                    submitText="Lưu thay đổi"
                />
            )}
        </Modal>
    );
}