// src/types/KhachHang.ts
import { z } from "zod";

/**
 * TypeScript interface and Zod schema for table KhachHang
 */

export type LoaiKhachHang = "CA_NHAN" | "TRANG_TRAI" | "DAI_LY";
export type TrangThaiKH = "HOAT_DONG" | "KHOA";

export interface KhachHang {
    MaKH: string;            // GUID
    MaKHCode: string;
    TenKH: string;
    SoDienThoai?: string | null;
    DiaChi?: string | null;
    LoaiKhachHang?: LoaiKhachHang | null;
    HanMucCongNo?: number | null;
    TongMua: number;
    CongNoHienTai: number;
    TrangThai?: TrangThaiKH | null;
    GhiChu?: string | null;
    NgayTao?: string;
}

export const KhachHangSchema = z.object({
    MaKH: z.uuid(),
    MaKHCode: z.string(),
    TenKH: z.string(),
    SoDienThoai: z.string().nullable().optional(),
    DiaChi: z.string().nullable().optional(),
    LoaiKhachHang: z.enum(["CA_NHAN", "TRANG_TRAI", "DAI_LY"]).nullable().optional(),
    HanMucCongNo: z.number().nullable().optional(),
    TongMua: z.number().nonnegative().default(0),
    CongNoHienTai: z.number().nonnegative().default(0),
    TrangThai: z.enum(["HOAT_DONG", "KHOA"]).nullable().optional(),
    GhiChu: z.string().nullable().optional(),
    NgayTao: z.string().optional(),
});

export type KhachHangDTO = z.infer<typeof KhachHangSchema>;
