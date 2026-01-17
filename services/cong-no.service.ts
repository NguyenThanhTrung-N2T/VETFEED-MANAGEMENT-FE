import { CongNoTongHopResponse, CreateCongNoRequest, CongNoHistoryResponse } from "@/client/types.gen";
import { getApiCongNosByMaDoiTuongDetail, getApiCongNosSummary, postApiCongNos } from "@/client/sdk.gen";

export const congNoService = {
    getAll: async (): Promise<CongNoTongHopResponse[]> => {
        const { data, error } = await getApiCongNosSummary();
        if (error) throw error;
        return data || [];
    },
    getById: async (id: string): Promise<CongNoHistoryResponse[]> => {
        const { data, error } = await getApiCongNosByMaDoiTuongDetail({ path: { maDoiTuong: id } });
        if (error) throw error;
        return data || [];
    },
    create: async (payload: CreateCongNoRequest): Promise<void> => {
        const { data, error } = await postApiCongNos({ body: payload });
        if (error) throw error;
    }
}