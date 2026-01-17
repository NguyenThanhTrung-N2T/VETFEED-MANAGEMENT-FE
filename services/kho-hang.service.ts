import {
    getApiKhoHangs,
    postApiKhoHangs,
    putApiKhoHangsByMaKho,
    deleteApiKhoHangsByMaKho
} from '@/client/sdk.gen';
import {
    KhoHangResponse,
    CreateKhoHangRequest,
    UpdateKhoHangRequest
} from '@/client/types.gen';

export const khoHangService = {
    getAll: async (): Promise<KhoHangResponse[]> => {
        const { data, error } = await getApiKhoHangs();
        if (error) throw error;
        // The generator types 'data' as 'KhoHangResponse[]' automatically
        return data || [];
    },

    create: async (payload: CreateKhoHangRequest) => {
        const { data, error } = await postApiKhoHangs({ body: payload });
        if (error) throw error;
        return data;
    },

    update: async (id: string, payload: UpdateKhoHangRequest) => {
        const { data, error } = await putApiKhoHangsByMaKho({
            path: { maKho: id },
            body: payload
        });
        if (error) throw error;
        return data;
    },

    delete: async (id: string) => {
        const { data, error } = await deleteApiKhoHangsByMaKho({
            path: { maKho: id }
        });
        if (error) throw error;
    }
};