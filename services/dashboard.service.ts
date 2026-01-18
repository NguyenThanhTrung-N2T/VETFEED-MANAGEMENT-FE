// src/services/dashboard.service.ts
import apiClient from '@/lib/axios';

// --- TYPES ---

export interface DashboardSummary {
  todayRevenue: {
    revenue: number;
    trendPercent: number;
    isIncrease: boolean;
  };
  todayOrders: {
    orderCount: number;
    trendPercent: number;
    isIncrease: boolean;
  };
  totalInventory: {
    totalQuantity: number;
  };
}

export interface MonthlyRevenue {
  year: number;
  data: number[]; // Mảng 12 phần tử tương ứng 12 tháng
}

export interface ExpiringProduct {
  maLo: string;
  maLoCode: string;
  tenSanPham: string;
  loaiSanPham: string;
  hanSuDung: string;
  soNgayConLai: number;
  soLuongTon: number;
}

// --- SERVICE ---

export const dashboardService = {
  // 1. Lấy thông tin tổng quan (Doanh thu, Đơn hàng, Tồn kho)
  getSummary: async () => {
    const res = await apiClient.get<DashboardSummary>('/api/DashBoard/summary');
    return res.data;
  },

  // 2. Lấy biểu đồ doanh thu theo năm
  getRevenue: async (year: number) => {
    const res = await apiClient.get<MonthlyRevenue>('/api/DashBoard/revenue/monthly', {
      params: { year }
    });
    return res.data;
  },

  // 3. Lấy sản phẩm sắp hết hạn
  getExpiringProducts: async (limit: number = 10, daysThreshold: number = 90) => {
    // daysThreshold: Số ngày còn lại để coi là sắp hết hạn
    const res = await apiClient.get<ExpiringProduct[]>('/api/DashBoard/products/expiring', {
      params: { limit, daysThreshold }
    });
    return res.data;
  }
};