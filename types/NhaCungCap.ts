import { z } from "zod";

/**
 * TypeScript interface and Zod schema for table NhaCungCap
 */

export type TrangThaiNCC = "HOAT_DONG" | "NGUNG_HOAT_DONG";

export interface NhaCungCap {
    MaNCC: string;           // GUID
    MaNCCCode: string;
    TenNCC: string;
    SoDienThoai: string;
    DiaChi?: string | null;
    TrangThai?: TrangThaiNCC | null;
    GhiChu?: string | null;
    NgayTao?: string;
}

export const NhaCungCapSchema = z.object({
    MaNCC: z.uuid(),
    MaNCCCode: z.string(),
    TenNCC: z.string(),
    SoDienThoai: z.string(),
    DiaChi: z.string().nullable().optional(),
    TrangThai: z.enum(["HOAT_DONG", "NGUNG_HOAT_DONG"]).nullable().optional(),
    GhiChu: z.string().nullable().optional(),
    NgayTao: z.string().optional(),
});

export type NhaCungCapDTO = z.infer<typeof NhaCungCapSchema>;
