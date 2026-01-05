import { z } from "zod";

// TypeScript interface cho lịch sử công nợ
export interface CongNoHistory {
    maCongNo: string;    // UUID
    ngay: string;          // ISO string
    loaiPhieu: "PB" | "PN" | "PT" | "PC"; // loại phiếu: PB: phiếu bán, PN: phiếu nhập, PT: phiếu trả, PC: phiếu chuyển
    maPhieu: string;       // mã phiếu
    dienGiai: string;      // diễn giải / ghi chú
    phatSinhNo: number;    // tăng nợ
    phatSinhCo: number;    // giảm nợ
    soDuSau: number;       // số dư sau phát sinh
}

// Zod schema validate từng dòng lịch sử
export const CongNoHistorySchema = z.object({
    maCongNo: z.string(),
    ngay: z.string(), // có thể validate thêm ISO
    loaiPhieu: z.enum(["PB", "PN", "PT", "PC"]),
    maPhieu: z.string(),
    dienGiai: z.string(), // ghi chú
    phatSinhNo: z.number(), // tăng nợ
    phatSinhCo: z.number(), // giảm nợ
    soDuSau: z.number(), // tổng tích lũy từ đầu đến dòng đó (tính sẵn từ backend)
});

// Zod schema cho array
export const CongNoHistoryDTO = z.array(CongNoHistorySchema);

// Type từ Zod
export type CongNoHistoryItem = z.infer<typeof CongNoHistorySchema>;
export type CongNoHistoryList = z.infer<typeof CongNoHistoryDTO>;
