import {
    getApiKhachHangs,
    postApiKhachHangs,
    putApiKhachHangsByMaKh,
    deleteApiKhachHangsByMaKh,
    getApiKhachHangsByCodeByMaKhCode,
    getApiKhachHangsByPhone,
    getApiKhachHangsByMaKh
} from '@/client/sdk.gen';
import {
    KhachHangCreateRequest,
    KhachHangUpdateRequest,
    KhachHangResponse,
    KhachHangResponsePagedResult
} from '@/client/types.gen';

// Define a helper type for search params based on GetApiKhachHangsData query
export interface CustomerSearchParams {
    Keyword?: string;
    LoaiKhachHang?: string;
    TrangThai?: string;
    Page?: number;
    PageSize?: number;
}

export const khachHangService = {
    getAll: async (params?: CustomerSearchParams): Promise<KhachHangResponsePagedResult> => {
        const { data, error } = await getApiKhachHangs({ query: params });
        if (error) throw error;
        if (!data) throw new Error('Failed to fetch data!');
        return data || [];
    },
    getById: async (id: string): Promise<KhachHangResponse> => {
        const { data, error } = await getApiKhachHangsByMaKh({ path: { maKH: id } });
        if (error) throw error;
        if (!data) throw new Error('Customer not found!');
        return data;
    },
    getByKHCode: async (id: string): Promise<KhachHangResponse> => {
        const { data, error } = await getApiKhachHangsByCodeByMaKhCode({ path: { maKHCode: id } });
        if (error) throw error;
        if (!data) throw new Error('Customer not found!');
        return data;
    },
    getByPhone: async (phone?: string): Promise<KhachHangResponse> => {
        if (!phone) {
            throw new Error("Phone is required!");
        }
        const { data, error } = await getApiKhachHangsByPhone({ query: { phone } });
        if (error) throw error;
        if (!data) throw new Error('Customer not found!');
        return data;
    },
    create: async (payload: KhachHangCreateRequest) => {
        const { data, error } = await postApiKhachHangs(
            { body: payload }
        );
        if (error) throw error;
        return data;
    },
    update: async (id: string, payload: KhachHangUpdateRequest) => {
        const { data, error } = await putApiKhachHangsByMaKh({
            path: { maKH: id },
            body: payload
        })
        if (error) throw error;
        return data;
    },
    delete: async (id: string) => {
        const { data, error } = await deleteApiKhachHangsByMaKh({
            path: { maKH: id }
        })
        if (error) throw error;
        return data;
    }
}
