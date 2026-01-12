import { z } from "zod";
import { SanPhamSchema } from "./SanPham";

export const SanPhamWithPriceSchema = SanPhamSchema.extend({
    DonGia: z.number().nonnegative().optional(),
});
export type SanPhamWithPriceDTO = z.infer<typeof SanPhamWithPriceSchema>;