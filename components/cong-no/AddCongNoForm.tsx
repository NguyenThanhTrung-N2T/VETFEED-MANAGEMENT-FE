"use client";
import React, { useState } from "react";
import { CongNoSchema, CongNoInput } from "@/types/CongNo";

type Props = {
    initial?: Partial<CongNoInput>;
    onCancel: () => void;
    onSubmit: (payload: CongNoInput) => Promise<void>;
};

export default function AddCongNoForm({ initial, onCancel, onSubmit }: Props) {
    const [maDoiTuong, setMaDoiTuong] = useState(initial?.maDoiTuong ?? "");
    const [maPhieu, setMaPhieu] = useState(initial?.maPhieu ?? "");
    const [soTienRaw, setSoTienRaw] = useState(initial?.soTien?.toString() ?? "");
    const [ngayPhatSinh, setNgayPhatSinh] = useState(
        initial?.ngayPhatSinh ?? new Date().toISOString().slice(0, 16) // local datetime-local format
    );
    const [hanThanhToan, setHanThanhToan] = useState(initial?.hanThanhToan ?? "");
    const [ghiChu, setGhiChu] = useState(initial?.ghiChu ?? "");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const parseNumber = (s: string) => {
        // allow comma or dot thousand separators
        const cleaned = s.replace(/[.,\s]/g, "");
        const n = Number(cleaned);
        return Number.isFinite(n) ? n : NaN;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        const payload = {
            maDoiTuong: maDoiTuong.trim(),
            maPhieu: maPhieu?.trim() === "" ? null : maPhieu.trim(),
            soTien: parseNumber(soTienRaw),
            ngayPhatSinh: ngayPhatSinh ? new Date(ngayPhatSinh).toISOString() : undefined,
            hanThanhToan: hanThanhToan || null,
            ghiChu: ghiChu?.trim() || null,
        };

        const result = CongNoSchema.safeParse(payload);
        if (!result.success) {
            const zErr: Record<string, string> = {};
            for (const [k, v] of Object.entries(result.error.flatten().fieldErrors)) {
                zErr[k] = v?.[0] ?? "Invalid";
            }
            setErrors(zErr);
            return;
        }

        try {
            setSubmitting(true);
            await onSubmit(result.data);
        } catch (err: any) {
            setErrors({ _form: err?.message ?? "Lỗi khi tạo công nợ" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {errors._form && (
                <div className="text-sm text-red-600">{errors._form}</div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700">Nhà cung cấp (MaDoiTuong)</label>
                <input
                    value={maDoiTuong}
                    onChange={(e) => setMaDoiTuong(e.target.value)}
                    placeholder="UUID nhà cung cấp (chọn từ danh sách nếu có)"
                    className="mt-1 block w-full rounded border px-3 py-2 text-sm"
                />
                {errors.maDoiTuong && <div className="text-xs text-red-600 mt-1">{errors.maDoiTuong}</div>}
                <p className="text-xs text-gray-400 mt-1">Lưu ý: only NHA_CUNG_CAP allowed. Bạn có thể dán MaDoiTuong hoặc chọn từ danh sách (modal cung cấp).</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Mã phiếu (tuỳ chọn)</label>
                <input
                    value={maPhieu}
                    onChange={(e) => setMaPhieu(e.target.value)}
                    placeholder="uuid của phiếu (nếu có)"
                    className="mt-1 block w-full rounded border px-3 py-2 text-sm"
                />
                {errors.maPhieu && <div className="text-xs text-red-600 mt-1">{errors.maPhieu}</div>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Số tiền (VND)</label>
                <input
                    value={soTienRaw}
                    onChange={(e) => setSoTienRaw(e.target.value)}
                    placeholder="ví dụ: 1000000 (âm để giảm nợ)"
                    className="mt-1 block w-full rounded border px-3 py-2 text-sm"
                    inputMode="numeric"
                />
                {errors.soTien && <div className="text-xs text-red-600 mt-1">{errors.soTien}</div>}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày phát sinh</label>
                    <input
                        type="datetime-local"
                        value={ngayPhatSinh}
                        onChange={(e) => setNgayPhatSinh(e.target.value)}
                        className="mt-1 block w-full rounded border px-3 py-2 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Hạn thanh toán (tuỳ chọn)</label>
                    <input
                        type="date"
                        value={hanThanhToan}
                        onChange={(e) => setHanThanhToan(e.target.value)}
                        className="mt-1 block w-full rounded border px-3 py-2 text-sm"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Ghi chú (tuỳ chọn)</label>
                <textarea
                    value={ghiChu}
                    onChange={(e) => setGhiChu(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded border px-3 py-2 text-sm"
                />
                {errors.ghiChu && <div className="text-xs text-red-600 mt-1">{errors.ghiChu}</div>}
            </div>

            <div className="col-span-2 mt-6 flex items-center justify-between gap-6">
                <button type="submit" disabled={submitting} className="h-11 flex-1 rounded-lg bg-[#3f861e] text-white font-semibold hover:bg-[#529E29] transition-colors">
                    {submitting ? "Đang gửi..." : "Thêm công nợ"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="h-11 flex-1 rounded-lg border-2 border-red-500 text-red-500 font-semibold hover:bg-red-50 transition-colors"
                >
                    Hủy
                </button>
            </div>
        </form>
    );
}
