"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import AddCongNoForm from "./AddCongNoForm";
import { CongNoInput } from "@/types/CongNo";
import { X } from "lucide-react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    // optional callback to refresh parent list or handle new created item
    onCreated?: (created: any) => void;
    // optional candidates: array of { maDoiTuong, tenDoiTuong } to populate supplier select
    candidates?: { maDoiTuong: string; tenDoiTuong: string }[] | null;
};

export default function AddCongNoModal({ isOpen, onClose, onCreated, candidates = null }: Props) {
    const [loadingSuppliers, setLoadingSuppliers] = useState(false);
    const [supplierOptions, setSupplierOptions] = useState<{ maDoiTuong: string; tenDoiTuong: string }[]>(
        candidates ?? []
    );

    // If no candidates passed, try to fetch supplier list automatically
    useEffect(() => {
        if (candidates || !isOpen) return;
        (async () => {
            setLoadingSuppliers(true);
            try {
                // replace with your real endpoint for suppliers
                const res = await fetch("/api/doi-tuong?loai=NHA_CUNG_CAP");
                if (!res.ok) throw new Error("Không lấy được danh sách NCC");
                const json = await res.json();
                // expect json to be array of { maDoiTuong, tenDoiTuong }
                setSupplierOptions(
                    Array.isArray(json) ? json.map((x: any) => ({ maDoiTuong: x.maDoiTuong, tenDoiTuong: x.tenDoiTuong })) : []
                );
            } catch (err) {
                // silently ignore — user can still paste uuid
                console.warn(err);
            } finally {
                setLoadingSuppliers(false);
            }
        })();
    }, [isOpen, candidates]);

    if (!isOpen) return null;

    const handleCancel = () => onClose();

    const handleSubmit = async (
        payload: Omit<CongNoInput, "loaiDoiTuong">) => {
        const body: CongNoInput = {
            ...payload,
            loaiDoiTuong: "NHA_CUNG_CAP",
        };

        const res = await fetch("/api/cong-no", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const t = await res.text();
            throw new Error(t || `Create failed: ${res.status}`);
        }

        const created = await res.json().catch(() => null);
        onCreated?.(created);
        onClose();
    };

    return (
        <Modal>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-semibold">Thêm công nợ (Nhà cung cấp)</h3>
                    <p className="text-sm text-gray-500">Tạo 1 bản ghi công nợ phát sinh cho nhà cung cấp</p>
                </div>
                <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
                    <X size={20} />
                </button>
            </div>

            <div className="space-y-4">
                {/* If we have supplier options, show a small helper to copy id */}
                {loadingSuppliers ? (
                    <div className="text-sm text-gray-500">Loading suppliers...</div>
                ) : supplierOptions.length > 0 ? (
                    <div className="text-sm text-gray-600">
                        <div className="mb-2">Chọn nhà cung cấp từ danh sách (click để copy ID):</div>
                        <div className="flex flex-wrap gap-2">
                            {supplierOptions.map((s) => (
                                <button
                                    key={s.maDoiTuong}
                                    onClick={() => {
                                        // copy uuid to clipboard for convenience
                                        navigator.clipboard?.writeText(s.maDoiTuong);
                                        // give small feedback
                                        alert(`Copied ${s.tenDoiTuong} id to clipboard`);
                                    }}
                                    className="px-2 py-1 text-xs border rounded bg-white hover:bg-gray-50"
                                >
                                    {s.tenDoiTuong}
                                </button>
                            ))}
                        </div>
                        <div className="text-xs text-gray-400 mt-2">(Click một supplier để copy MaDoiTuong, sau đó dán vào ô MaDoiTuong)</div>
                    </div>
                ) : (
                    <div className="text-sm text-gray-500">Không có danh sách NCC — dán MaDoiTuong trực tiếp vào form.</div>
                )}

                <AddCongNoForm
                    onCancel={handleCancel}
                    onSubmit={handleSubmit}
                />
            </div>
        </Modal>
    );
}
