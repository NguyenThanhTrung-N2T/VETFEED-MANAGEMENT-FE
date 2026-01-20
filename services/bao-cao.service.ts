import {
    getApiBaoCaosDoanhthuPhantich, getApiBaoCaosDoanhthuDonhang,
    getApiBaoCaosLoinhuanPhantich, getApiBaoCaosLoinhuanSanpham,
    getApiBaoCaosTonkhoPhantich, getApiBaoCaosTonkhoSanpham
} from "@/client/index";
import {
    DoanhThuPhanTichResponse, TongQuanResponse, XuHuongChartItemResponse, DoanhThuDonHangResponse, DoanhThuDonHangItemResponse,
    LoiNhuanPhanTichResponse, LoiNhuanTongQuanResponse, TopSanPhamLoiNhuanResponse, LoiNhuanSanPhamResponse, LoiNhuanSanPhamItemResponse,
    TonKhoPhanTichResponse, TonKhoTongQuanResponse, SoLuongChartItemResponse, TonKhoSanPhamResponse, TonKhoSanPhamItemResponse, PaginationMeta
} from "@/client/types.gen";

// ==========================================
// 1. REVENUE SERVICE (Doanh Thu)
// ==========================================

export const getRevenueAnalytics = async (from: string, to: string): Promise<DoanhThuPhanTichResponse> => {
    const { data, error } = await getApiBaoCaosDoanhthuPhantich({ query: { from, to } });
    if (error) throw error;
    if (!data) throw new Error("Đã xảy ra lỗi khi tải dữ liệu");
    return data;
};

export const getRevenueOrders = async (from: string, to: string, page = 1, limit = 20): Promise<DoanhThuDonHangResponse> => {
    const { data, error } = await getApiBaoCaosDoanhthuDonhang({ query: { from, to, page, limit } });
    if (error) throw error;
    if (!data) throw new Error("Đã xảy ra lỗi khi tải dữ liệu");
    return data;
};

// ==========================================
// 2. PROFIT SERVICE (Lợi Nhuận)
// ==========================================

export const getProfitAnalytics = async (from: string, to: string): Promise<LoiNhuanPhanTichResponse> => {
    const { data, error } = await getApiBaoCaosLoinhuanPhantich({ query: { from, to } });
    if (error) throw error;
    if (!data) throw new Error("Đã xảy ra lỗi khi tải dữ liệu");
    return data;
};

export const getProfitProducts = async (from: string, to: string, page = 1, limit = 20, sort_by = 'profit', order = 'desc'): Promise<LoiNhuanSanPhamResponse> => {
    const { data, error } = await getApiBaoCaosLoinhuanSanpham({ query: { from, to, sort_by, order } });
    if (error) throw error;
    if (!data) throw new Error("Đã xảy ra lỗi khi tải dữ liệu");
    return data;
};

// ==========================================
// 3. INVENTORY SERVICE (Tồn Kho)
// ==========================================

export const getInventoryAnalytics = async (maKho: string): Promise<TonKhoPhanTichResponse> => {
    const { data, error } = await getApiBaoCaosTonkhoPhantich({ query: { maKho } });
    if (error) throw error;
    if (!data) throw new Error("Đã xảy ra lỗi khi tải dữ liệu");
    return data;
};

export const getInventoryItems = async (maKho: string, page = 1, limit = 20, trangThai = 'All'): Promise<TonKhoSanPhamResponse> => {
    const { data, error } = await getApiBaoCaosTonkhoSanpham({ query: { maKho, page, limit, trangThai } });
    if (error) throw error;
    if (!data) throw new Error("Đã xảy ra lỗi khi tải dữ liệu");
    return data;
};