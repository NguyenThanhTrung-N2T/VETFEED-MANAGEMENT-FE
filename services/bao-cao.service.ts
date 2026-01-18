// services/reportService.ts

import {
    RevenueAnalyticsResponse, RevenueOrdersResponse,
    ProfitAnalyticsResponse, ProfitProductsResponse,
    InventoryAnalyticsResponse, InventoryItemsResponse,
    WarehouseOption
} from '../types/reports';

// --- Helper for Simulation ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Warehouses ---
export const getWarehouses = async (): Promise<WarehouseOption[]> => {
    await delay(300);
    return [
        { maKho: "kho-1", maKhoCode: "KHO01", tenKho: "Kho Trung Tâm HCM", trangThai: "HOAT_DONG" },
        { maKho: "kho-2", maKhoCode: "KHO02", tenKho: "Kho Miền Bắc", trangThai: "HOAT_DONG" },
        { maKho: "kho-3", maKhoCode: "KHO03", tenKho: "Kho Miền Trung", trangThai: "HOAT_DONG" },
    ];
};

// ==========================================
// 1. REVENUE SERVICE (Doanh Thu)
// ==========================================

export const getRevenueAnalytics = async (from: string, to: string): Promise<RevenueAnalyticsResponse> => {
    await delay(500);
    return {
        tongQuan: {
            tongDoanhThu: 299000000,
            tongDonHangCount: 85,
            tongSanPhamCount: 490
        },
        xuHuongChart: [
            { ngay: "2026-01-09", doanhThu: 45000000, donHangCount: 12 },
            { ngay: "2026-01-10", doanhThu: 52000000, donHangCount: 15 },
            { ngay: "2026-01-11", doanhThu: 38000000, donHangCount: 8 },
            { ngay: "2026-01-12", doanhThu: 61000000, donHangCount: 18 },
            { ngay: "2026-01-13", doanhThu: 48000000, donHangCount: 14 },
            { ngay: "2026-01-14", doanhThu: 55000000, donHangCount: 16 },
            { ngay: "2026-01-15", doanhThu: 42000000, donHangCount: 10 },
        ]
    };
};

export const getRevenueOrders = async (from: string, to: string, page = 1, limit = 20): Promise<RevenueOrdersResponse> => {
    await delay(800); // Table usually takes longer
    return {
        data: Array.from({ length: limit }).map((_, i) => ({
            maPhieuBanCode: `PB${2000 + i + (page - 1) * limit}`,
            ngay: "2026-01-15T10:30:00Z",
            tenSanPham: i % 2 === 0 ? "Vitamin B-Complex cho gia súc" : "Thuốc tẩy giun Ivermectin",
            maSPCode: i % 2 === 0 ? "SP001" : "SP002",
            tenKhachHang: i % 3 === 0 ? "Trang trại Bình Minh" : "Đại lý Thức ăn Gia súc",
            soLuong: 10 * (i + 1),
            donGia: 150000,
            thanhTien: 10 * (i + 1) * 150000
        })),
        meta: {
            page: page,
            limit: limit,
            total_items: 85,
            total_pages: 5
        }
    };
};

// ==========================================
// 2. PROFIT SERVICE (Lợi Nhuận)
// ==========================================

export const getProfitAnalytics = async (from: string, to: string): Promise<ProfitAnalyticsResponse> => {
    await delay(500);
    return {
        tongQuan: {
            doanhThu: 64800000,
            chiPhi: 51000000,
            loiNhuan: 13800000,
            tiSuat: 21.30
        },
        topSanPhamChart: [
            { tenSanPham: "Vitamin B-Complex", doanhThu: 27000000, chiPhi: 21000000, loiNhuan: 6000000 },
            { tenSanPham: "Thuốc tẩy giun", doanhThu: 15000000, chiPhi: 12000000, loiNhuan: 3000000 },
            { tenSanPham: "Thức ăn gà", doanhThu: 12000000, chiPhi: 10000000, loiNhuan: 2000000 },
            { tenSanPham: "Kháng sinh", doanhThu: 8000000, chiPhi: 6000000, loiNhuan: 2000000 },
            { tenSanPham: "Vắc xin", doanhThu: 5000000, chiPhi: 4200000, loiNhuan: 800000 }
        ]
    };
};

export const getProfitProducts = async (from: string, to: string, page = 1, limit = 20, sortBy = 'profit', order = 'desc'): Promise<ProfitProductsResponse> => {
    await delay(600);
    return {
        data: Array.from({ length: limit }).map((_, i) => ({
            maSPCode: `SP00${i + 1}`,
            tenSanPham: ["Vitamin B-Complex", "Thuốc tẩy giun", "Thức ăn hỗn hợp", "Kháng sinh Amox", "Vắc xin Newcastle"][i % 5],
            soLuongBan: 100 + i * 10,
            doanhThu: 20000000 + (i * 1000000),
            chiPhi: 15000000 + (i * 800000),
            loiNhuan: 5000000 + (i * 200000),
            tiSuat: 20 + (i % 5)
        })),
        meta: {
            page: page,
            limit: limit,
            total_items: 45,
            total_pages: 3
        }
    };
};

// ==========================================
// 3. INVENTORY SERVICE (Tồn Kho)
// ==========================================

export const getInventoryAnalytics = async (maKho: string): Promise<InventoryAnalyticsResponse> => {
    await delay(500);
    return {
        tongQuan: {
            tongSanPhamCount: 125, // Unique SKUs
            tongSoLuong: 1240,     // Total items
            soLuongSapHetHan: 5    // Items needing attention
        },
        soLuongChart: [
            { tenSanPham: "Vitamin B-Complex", soLuong: 500 },
            { tenSanPham: "Thuốc tẩy giun", soLuong: 300 },
            { tenSanPham: "Vắc xin", soLuong: 200 },
            { tenSanPham: "Kháng sinh", soLuong: 150 },
            { tenSanPham: "Thức ăn gà", soLuong: 100 },
            { tenSanPham: "Khác", soLuong: 240 }
        ]
    };
};

export const getInventoryItems = async (maKho: string, page = 1, limit = 20, trangThai = 'All'): Promise<InventoryItemsResponse> => {
    await delay(700);
    const statuses: Array<'CON_HAN' | 'SAP_HET_HAN' | 'HET_HAN'> = ['CON_HAN', 'CON_HAN', 'SAP_HET_HAN', 'HET_HAN', 'CON_HAN'];

    return {
        data: Array.from({ length: limit }).map((_, i) => {
            const status = statuses[i % 5];
            let daysLeft = 300;
            if (status === 'SAP_HET_HAN') daysLeft = 15;
            if (status === 'HET_HAN') daysLeft = -10;

            return {
                maSP: `INV_${1000 + i}`,
                maSPCode: `SP00${(i % 5) + 1}`,
                tenSanPham: ["Vitamin B-Complex", "Thuốc tẩy giun", "Thức ăn hỗn hợp", "Kháng sinh Amox", "Vắc xin Newcastle"][i % 5],
                maLoCode: `LOT${2024 + i}_ABC`,
                soLuong: 50 + (i * 5),
                donVi: ["Hộp", "Chai", "Bao", "Vỉ", "Lọ"][i % 5],
                ngayHetHan: status === 'HET_HAN' ? "2025-12-31" : "2026-06-30",
                trangThai: status,
                soNgayDenKhiHetHan: daysLeft
            };
        }),
        meta: {
            page: page,
            limit: limit,
            total_items: 125,
            total_pages: 7
        }
    };
};