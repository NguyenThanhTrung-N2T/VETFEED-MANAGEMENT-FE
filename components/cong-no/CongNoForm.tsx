"use client";

import React, { useState } from "react";
import { CongNoSummary } from "@/types/index";

type Props = {
    ghiChu: string;
    onSave: (ghiChu: string) => void;
    onCancel: () => void;
};

export default function CongNoForm({ ghiChu: initialGhiChu, onSave, onCancel }: Props) {
    const [ghiChu, setGhiChu] = useState(initialGhiChu);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(ghiChu);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Ghi chú</label>
                <textarea
                    value={ghiChu}
                    onChange={(e) => setGhiChu(e.target.value)}
                    className="mt-1 p-2 border rounded-md text-sm resize-none"
                    rows={3}
                />
            </div>

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Lưu
                </button>
            </div>
        </form>
    );
}
