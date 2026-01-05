import { z } from "zod";
import { NhaCungCapSchema } from "./NhaCungCap";
import { SanPhamSchema } from "./SanPham";

/**
 * TypeScript interface and Zod schema for table NhaCungCapSanPham
 * This table links NhaCungCap and SanPham
 */

export type TrangThaiNCSP = "HOAT_DONG" | "NGUNG_HOAT_DONG";

export interface NhaCungCapSanPham {
    MaNCSP: string;          // GUID
    MaNCC: string;           // FK -> NhaCungCap.MaNCC
    MaSP: string;            // FK -> SanPham.MaSP
    GiaNhapMacDinh?: number | null;
    TrangThai: TrangThaiNCSP;
    GhiChu?: string | null;
    NgayTao?: string;
}

export const NhaCungCapSanPhamSchema = z.object({
    MaNCSP: z.uuid(),
    MaNCC: z.uuid(),
    MaSP: z.uuid(),
    GiaNhapMacDinh: z.number().nonnegative().nullable().optional(),
    TrangThai: z.enum(["HOAT_DONG", "NGUNG_HOAT_DONG"]).default("HOAT_DONG"),
    GhiChu: z.string().nullable().optional(),
    NgayTao: z.string().optional(),
});

export type NhaCungCapSanPhamDTO = z.infer<typeof NhaCungCapSanPhamSchema>;
