import {
    getApiSanPhams,
    postApiSanPhams,
    getApiSanPhamsByMaSp,
    putApiSanPhamsByMaSp,
    deleteApiSanPhamsByMaSp
} from '@/client/sdk.gen';

import {
    SanPhamCreateRequest,
    SanPhamUpdateRequest,
    SanPhamResponse,
    SanPhamResponsePagedResult
} from '@/client/types.gen';

// Define a helper type for search params based on GetApiSanPhamsData query
export interface ProductSearchParams {
    Keyword?: string;
    LoaiSanPham?: string;
    Page?: number;
    PageSize?: number;
}

export const sanPhamService = {
    // 1. GET LIST (With Pagination & Search)
    getAll: async (params?: ProductSearchParams): Promise<SanPhamResponsePagedResult> => {
        const { data, error } = await getApiSanPhams({ query: params });

        if (error) throw error;
        if (!data) throw new Error('Failed to fetch data!');
        return data;
    },

    // 2. GET BY ID
    getById: async (id: string): Promise<SanPhamResponse> => {
        const { data, error } = await getApiSanPhamsByMaSp({
            path: { maSP: id }
        });
        if (error) throw error;
        if (!data) throw new Error("SanPham not found");
        return data;
    },

    // 3. CREATE
    create: async (payload: SanPhamCreateRequest) => {
        const { data, error } = await postApiSanPhams({
            body: payload
        });
        if (error) throw error;
        return data;
    },

    // 4. UPDATE
    update: async (id: string, payload: SanPhamUpdateRequest) => {
        const { data, error } = await putApiSanPhamsByMaSp({
            path: { maSP: id },
            body: payload
        });
        if (error) throw error;
        return data;
    },

    // 5. DELETE
    delete: async (id: string) => {
        const { error } = await deleteApiSanPhamsByMaSp({
            path: { maSP: id }
        });
        if (error) throw error;
        return true;
    }
};