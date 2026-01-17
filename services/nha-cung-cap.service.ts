import { getApiNhaCungCaps, getApiNhaCungCapsById, putApiNhaCungCapsById, postApiNhaCungCaps, deleteApiNhaCungCapsById } from "@/client/sdk.gen";
import { NhaCungCapCreateRequest, NhaCungCapDetailedResponse, NhaCungCapResponse, NhaCungCapUpdateRequest, NhaCungCapSanPhamItemDto, NhaCungCapSanPhamResponse } from "@/client/types.gen";

export const nhaCungCapService = {
    getAll: async (): Promise<NhaCungCapResponse[]> => {
        const { data, error } = await getApiNhaCungCaps();
        if (error) throw error;
        return data || [];
    },
    getById: async (id: string): Promise<NhaCungCapDetailedResponse> => {
        const { data, error } = await getApiNhaCungCapsById({ path: { id: id } })
        if (error) throw error;
        return data;
    },
    create: async (payload: NhaCungCapCreateRequest): Promise<NhaCungCapDetailedResponse> => {
        const { data, error } = await postApiNhaCungCaps({ body: payload });
        if (error) throw error;
        return data;
    },
    update: async (id: string, payload: NhaCungCapUpdateRequest): Promise<NhaCungCapDetailedResponse> => {
        const { data, error } = await putApiNhaCungCapsById({ path: { id: id }, body: payload });
        if (error) throw error;
        return data;
    },
    delete: async (id: string): Promise<void> => {
        const { data, error } = await deleteApiNhaCungCapsById({ path: { id: id } });
        if (error) throw error;
    }
}