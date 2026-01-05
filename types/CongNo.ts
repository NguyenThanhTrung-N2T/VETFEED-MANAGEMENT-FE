import { z } from "zod";

//  TypeScript interface cho CongNo
export interface CongNo {
    maCongNo: string;          // UUID
    loaiDoiTuong: "KHACH_HANG" | "NHA_CUNG_CAP";
    maDoiTuong: string;        // MaKH hoặc MaNCC
    maPhieu?: string | null;   // Phiếu liên quan
    soTien: number;            // >0 tăng nợ, <0 giảm nợ
    ngayPhatSinh: string;      // ISO string
    hanThanhToan?: string | null; // ISO date string
    ghiChu?: string;
}

//  Zod schema để validate input (create / update)
export const CongNoSchema = z.object({
    loaiDoiTuong: z.enum(["KHACH_HANG", "NHA_CUNG_CAP"]),
    maDoiTuong: z.string(),
    maPhieu: z.string().optional().nullable(),
    soTien: z.number().refine(val => val !== 0, { message: "Số tiền không được bằng 0" }),
    ngayPhatSinh: z.string().optional(),  // có thể để default là hiện tại
    hanThanhToan: z.string().optional().nullable(),
    ghiChu: z.string().max(500).optional(),
});

//  DTO schema (API response)
export const CongNoDTO = z.object({
    maDoiTuong: z.string(),
    tenDoiTuong: z.string(),
    loaiDoiTuong: z.enum(["KHACH_HANG", "NHA_CUNG_CAP"]),
    tongPhatSinh: z.number(),
    daThanhToan: z.number(),
    duNo: z.number(),
    coQuaHan: z.boolean(),
    hanThanhToanGanNhat: z.string().nullable(),
});

//  Tạo type từ Zod (tuỳ chọn)
export type CongNoInput = z.infer<typeof CongNoSchema>;
export type CongNoSummary = z.infer<typeof CongNoDTO>;
