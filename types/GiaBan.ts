import { z } from "zod";

/**
 * TypeScript interface and Zod schema for table GiaBan
 * Note: TuNgay and DenNgay are datetime strings (ISO). DenNgay can be null.
 */

export interface GiaBan {
    MaGia: string;           // GUID
    MaSP: string;            // FK -> SanPham.MaSP
    GiaBan: number;
    TuNgay: string;          // ISO datetime
    DenNgay?: string | null; // ISO datetime or null
    GhiChu?: string | null;
    NgayTao?: string;
}

export const GiaBanSchema = z.object({
    MaGia: z.uuid(),
    MaSP: z.uuid(),
    GiaBan: z.number().nonnegative(),
    TuNgay: z.string(),
    DenNgay: z.string().nullable().optional(),
    GhiChu: z.string().nullable().optional(),
    NgayTao: z.string().optional(),
});

export type GiaBanDTO = z.infer<typeof GiaBanSchema>;
