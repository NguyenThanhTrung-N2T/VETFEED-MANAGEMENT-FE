import { z } from "zod";

// Define the schema for a single conversion unit (e.g., 1 Box = 10 Base Units)
export const UnitConversionSchema = z.object({
    MaQD: z.string().optional(), // ID (optional for new units)
    DonViNhap: z.string().min(1, "Tên đơn vị không được để trống"), // e.g., "Hộp"
    TyLe: z.number().min(1, "Tỷ lệ phải lớn hơn 0"), // e.g., 10
});

export type UnitConversionDTO = z.infer<typeof UnitConversionSchema>;

// Update the main Product Schema
export const SanPhamWithPriceSchema = z.object({
    MaSP: z.string().optional(), // Optional for new creation
    MaSPCode: z.string(),
    TenSP: z.string().min(1, "Tên sản phẩm bắt buộc"),
    LoaiSanPham: z.enum(["THUOC_THU_Y", "THUC_AN_CHAN_NUOI"]),

    // Changed from DonViTinh to DonViCoSo for clarity
    DonViCoSo: z.string().min(1, "Đơn vị cơ sở bắt buộc"),

    // List of exchange units
    DonViQuyDoi: z.array(UnitConversionSchema).default([]),

    DonGia: z.number().nonnegative().optional(),
    GhiChu: z.string().nullable().optional(),
    NgayTao: z.string().optional(),
});

export type SanPhamWithPriceDTO = z.infer<typeof SanPhamWithPriceSchema>;