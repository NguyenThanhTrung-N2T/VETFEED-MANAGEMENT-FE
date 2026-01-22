// src/services/sales.service.ts
import apiClient from '@/lib/axios';

// --- TYPES ---

// 1. Danh sách phiếu bán
export interface PhieuBan {
  maPB: string;
  maPBCode: string;
  tenKhachHang: string;
  ngayBan: string;
  tongTienHang: number;
  thanhTien: number;
  hinhThucThanhToan: string; // BE trả về text
  trangThaiThanhToan: string;
  ghiChu: string;
}

// 2. Chi tiết phiếu bán
export interface PhieuBanDetail {
  maPB: string;
  maPBCode: string;
  maKH: string;
  tenKhachHang: string;
  ngayBan: string;
  tongTienHang: number;
  chietKhauPhanTram: number;
  tienChietKhau: number;
  thanhTien: number;
  tienCoc: number;
  tienNo: number;
  hinhThucThanhToan: string;
  hanTra?: string;
  ghiChu: string;
  danhSachChiTiet: CTPhieuBan[];
}

export interface CTPhieuBan {
  maLo: string;
  maLoCode?: string;
  tenSanPham?: string;
  soLuong: number;
  donGia: number;
  thanhTienVon?: number;
  ghiChu?: string;
}

// 3. Request Tạo phiếu
export interface CreatePhieuBanPayload {
  maKH: string;
  ngayBan: string; // ISO String
  chietKhauPhanTram: number;
  hinhThucThanhToan: number; // 0, 1, 2
  tienCoc: number;
  hanTra?: string; // ISO String (bắt buộc nếu công nợ)
  ghiChu?: string;
  danhSachChiTiet: {
    maLo: string;
    soLuong: number;
    donGia: number;
    ghiChu?: string;
  }[];
}

// 4. Helper Types
export interface Customer {
  maKH: string;
  tenKH: string;
  soDienThoai: string;
  hanMucCongNo: number;
  congNoHienTai: number;
}

export interface Batch {
  maLo: string;
  maLoCode: string;
  maSP: string; // Dùng để lấy giá
  tenSP: string;
  hanSuDung: string;
}

export interface PriceResponse {
  donGiaBan: number;
  // ... các trường khác
}

// --- SERVICE ---
export const salesService = {
  // 1. Lấy danh sách
  getAll: async () => {
    const res = await apiClient.get<PhieuBan[]>('/api/PhieuBans');
    return res.data;
  },

  // 2. Lấy chi tiết
  getById: async (id: string) => {
    const res = await apiClient.get<PhieuBanDetail>(`/api/PhieuBans/${id}`);
    return res.data;
  },

  // 3. Tạo phiếu
  create: async (data: CreatePhieuBanPayload) => {
    return await apiClient.post('/api/PhieuBans', data);
  },

  // 4. Xóa phiếu
  delete: async (id: string) => {
    return await apiClient.delete(`/api/PhieuBans/${id}`);
  },

  // --- HELPER APIs ---
  
  getCustomers: async () => {
    const res = await apiClient.get<{ items: Customer[] }>('/api/KhachHangs?PageSize=1000'); // Lấy hết để chọn
    return res.data.items || [];
  },

  getBatches: async () => {
    const res = await apiClient.get<Batch[]>('/api/LoHangs');
    return res.data;
  },

  // Lấy giá bán hiện tại
  getCurrentPrice: async (maSP: string) => {
    const res = await apiClient.get<PriceResponse>('/api/GiaBans/current', {
      params: { maSP }
    });
    return res.data;
  },

  // Check tồn kho (Check all kho)
  checkStock: async (maLo: string, soLuongCan: number) => {
    // API trả về 200 OK nếu đủ, lỗi nếu thiếu
    return await apiClient.post('/api/TonKhos/checkallkho', { maLo, soLuongCan });
  },

  // Lấy tồn kho
  getInventory: async () => {
    const res = await apiClient.get<any[]>('/api/TonKhos');
    return res.data;
  },
};