"use client";

import Modal from "@/components/ui/Modal";
import KhachHangForm from "./KhachHangForm";
import { KhachHang } from "@/types/KhachHang";
import { Users } from "lucide-react";

export default function AddKhachHangModal({
    onClose,
    onAdd,
}: {
    onClose: () => void;
    onAdd: (data: KhachHang) => void;
}) {
    function handleAdd(data: Partial<KhachHang>) {
        onAdd({
            ...data,
            MaKH: crypto.randomUUID(),
            MaKHCode: "KH_MOCK", // TODO: Generate proper customer code
            TenKH: data.TenKH!,
            TongMua: 0,
            CongNoHienTai: 0,
            NgayTao: new Date().toISOString(),
        } as KhachHang);
        onClose();
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