// import { z } from "zod";

/**
 * TypeScript interface and Zod schema for table NhaCungCap
 */

// export type TrangThaiNCC = "HOAT_DONG" | "NGUNG_HOAT_DONG";

// types.ts (or inside client/types.gen.ts)
export interface SanPhamCungCap {
    id: string;
    tenSanPham: string;
    giaNhap?: number;
    ghiChu?: string;
}

export interface NhaCungCapDTO {
    MaNCC: string; // ID
    MaNCCCode: string; // User visible code
    TenNCC: string;
    SoDienThoai: string;
    DiaChi: string;
    TrangThai: "HOAT_DONG" | "NGUNG_HOAT_DONG";
    GhiChu?: string | null;
    NgayTao?: string;
    sanPhamCount: number;
}
export interface NhaCungCapDetailDTO extends NhaCungCapDTO {
    SanPhams: SanPhamCungCap[]; // The actual list
}
