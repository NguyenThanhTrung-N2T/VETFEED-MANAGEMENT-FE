import { KhachHangPhieuBanResponse, PhieuBanListResponse } from "@/client/types.gen";
import { getApiPhieuBansKhachhangByMaKh } from "@/client/sdk.gen";
export const phieuBanService = {
    getPhieuBanByMKH: async (id: string): Promise<PhieuBanListResponse[]> => {
        const { data, error } = await getApiPhieuBansKhachhangByMaKh({ path: { maKH: id } });
        if (error) throw error;
        if (!data) throw new Error('Failed to fetch PB by MaKH!');
        return data.danhSachPhieuBan ?? [];
    }
}