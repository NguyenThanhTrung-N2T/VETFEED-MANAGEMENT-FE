// types/reports.ts

// --- Shared Types ---
export interface PaginationMeta {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
}

export interface DateFilterParams {
    from: string;
    to: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
}

// --- 1. REVENUE (Doanh Thu) ---
export interface RevenueAnalyticsResponse {
    tongQuan: {
        tongDoanhThu: number;
        tongDonHangCount: number;
        tongSanPhamCount: number;
    };
    xuHuongChart: Array<{
        ngay: string;
        doanhThu: number;
        donHangCount: number;
    }>;
}

export interface RevenueOrderRow {
    maPhieuBanCode: string;
    ngay: string;
    tenSanPham: string;
    maSPCode: string;
    tenKhachHang: string;
    soLuong: number;
    donGia: number;
    thanhTien: number;
}

export interface RevenueOrdersResponse {
    data: RevenueOrderRow[];
    meta: PaginationMeta;
}

// --- 2. PROFIT (Lợi Nhuận) ---
export interface ProfitAnalyticsResponse {
    tongQuan: {
        doanhThu: number;
        chiPhi: number;
        loiNhuan: number;
        tiSuat: number;
    };
    topSanPhamChart: Array<{
        tenSanPham: string;
        doanhThu: number;
        chiPhi: number;
        loiNhuan: number;
    }>;
}

export interface ProfitProductRow {
    maSPCode: string;
    tenSanPham: string;
    soLuongBan: number;
    doanhThu: number;
    chiPhi: number;
    loiNhuan: number;
    tiSuat: number;
}

export interface ProfitProductsResponse {
    data: ProfitProductRow[];
    meta: PaginationMeta;
}

// --- 3. INVENTORY (Tồn Kho) ---
export interface InventoryAnalyticsResponse {
    tongQuan: {
        tongSanPhamCount: number;
        tongSoLuong: number;
        soLuongSapHetHan: number;
    };
    soLuongChart: Array<{
        tenSanPham: string;
        soLuong: number; // Normalized to use 'soLuong' for consistency
    }>;
}

export interface InventoryItemRow {
    maSP: string;
    maSPCode: string;
    tenSanPham: string;
    maLoCode: string;
    soLuong: number;
    donVi: string;
    ngayHetHan: string;
    trangThai: 'CON_HAN' | 'SAP_HET_HAN' | 'HET_HAN';
    soNgayDenKhiHetHan: number;
}

export interface InventoryItemsResponse {
    data: InventoryItemRow[];
    meta: PaginationMeta;
}

// Helper for Warehouses (Dropdown)
export interface WarehouseOption {
    maKho: string;
    maKhoCode: string;
    tenKho: string;
    trangThai: string;
}