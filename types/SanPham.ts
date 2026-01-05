import { z } from "zod";

/**
 * TypeScript interface and Zod schema for table SanPham
 */

export type LoaiSanPham = "THUOC_THU_Y" | "THUC_AN_CHAN_NUOI";

export interface SanPham {
    MaSP: string;            // GUID
    MaSPCode: string;
    TenSP: string;
    LoaiSanPham?: LoaiSanPham | null;
    DonViTinh?: string | null;
    GhiChu?: string | null;
    NgayTao?: string;
}

export const SanPhamSchema = z.object({
    MaSP: z.uuid(),
    MaSPCode: z.string(),
    TenSP: z.string(),
    LoaiSanPham: z.enum(["THUOC_THU_Y", "THUC_AN_CHAN_NUOI"]).nullable().optional(),
    DonViTinh: z.string().nullable().optional(),
    GhiChu: z.string().nullable().optional(),
    NgayTao: z.string().optional(),
});

export type SanPhamDTO = z.infer<typeof SanPhamSchema>;
