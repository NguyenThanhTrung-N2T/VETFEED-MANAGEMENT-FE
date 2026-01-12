import { z } from "zod";

/**
 * TypeScript interface and Zod schema for table KhoHang
 * Keep property names exactly as in the database (Vietnamese).
 */

export type TrangThaiKho = "HOAT_DONG" | "NGUNG_HOAT_DONG";

export interface KhoHang {
    MaKho: string;           // GUID
    MaKhoCode: string;
    TenKho: string;
    DiaChi: string;
    TrangThai: TrangThaiKho;
    GhiChu?: string | null;
    NgayTao?: string;        // ISO date string
}

export const KhoHangSchema = z.object({
    MaKho: z.uuid(),
    MaKhoCode: z.string(),
    TenKho: z.string(),
    DiaChi: z.string(),
    TrangThai: z.enum(["HOAT_DONG", "NGUNG_HOAT_DONG"]),
    GhiChu: z.string().nullable().optional(),
    NgayTao: z.string().optional(),
});

export type KhoHangDTO = z.infer<typeof KhoHangSchema>;
