import { z } from "zod";

/**
 * Sales report: one row per order line
 */
export const SalesItemSchema = z.object({
    date: z.string(), // ISO date
    orderId: z.string(),
    productId: z.string(),
    productName: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
    total: z.number(),
});
export type SalesItem = z.infer<typeof SalesItemSchema>;
export const SalesListSchema = z.array(SalesItemSchema);

export const SalesSummarySchema = z.object({
    totalSales: z.number(),
    totalOrders: z.number(),
    totalQuantity: z.number(),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
});
export type SalesSummary = z.infer<typeof SalesSummarySchema>;

/**
 * Profit report: aggregated by product
 */
export const ProfitItemSchema = z.object({
    productId: z.string(),
    productName: z.string(),
    revenue: z.number(),
    cost: z.number(),
    profit: z.number(),
    marginPercent: z.number(), // 0..100
});
export type ProfitItem = z.infer<typeof ProfitItemSchema>;
export const ProfitListSchema = z.array(ProfitItemSchema);

export const ProfitSummarySchema = z.object({
    totalRevenue: z.number(),
    totalCost: z.number(),
    totalProfit: z.number(),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
});
export type ProfitSummary = z.infer<typeof ProfitSummarySchema>;

/**
 * TonKho (inventory) per warehouse + lot
 */
export const TonKhoItemSchema = z.object({
    maTonKho: z.string(),
    maKho: z.string(),
    tenKho: z.string().optional(),
    maLo: z.string(),
    tenLo: z.string().optional(),
    soLuong: z.number(),
    ngayCapNhat: z.string(), // ISO datetime
});
export type TonKhoItem = z.infer<typeof TonKhoItemSchema>;
export const TonKhoListSchema = z.array(TonKhoItemSchema);

/**
 * Convenience DTOs for API responses
 */
export const BaoCaoDTO = z.object({
    salesSummary: SalesSummarySchema.optional(),
    sales: SalesListSchema.optional(),
    profitSummary: ProfitSummarySchema.optional(),
    profit: ProfitListSchema.optional(),
    tonKho: TonKhoListSchema.optional(),
});
export type BaoCaoDTO = z.infer<typeof BaoCaoDTO>;
