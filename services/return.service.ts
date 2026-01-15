// src/services/return.service.ts
import apiClient from '@/lib/axios';

// --- TYPES ---

// 1. Danh sách phiếu trả
export interface PhieuTra {
  maPT: string;
  maPTCode: string;
  ngayTra: string;
  maPB: string;
  maPBCode: string;
  maKH: string;
  tenKhachHang: string;
  thanhTien: number;
  hinhThucHoanTien: string; // BE trả về text
}

// 2. Chi tiết phiếu trả
export interface PhieuTraDetail {
  maPT: string;
  maPTCode: string;
  maPB: string;
  maPBCode: string;
  maKH: string;
  tenKhachHang: string;
  ngayTra: string;
  thanhTien: number;
  lyDoTra: string;
  hinhThucHoanTien: string;
  danhSachChiTiet: CTPhieuTra[];
}

export interface CTPhieuTra {
  maLo: string;
  maLoCode?: string;
  tenSanPham?: string;
  donViCoSo?: string;
  donViTra?: string; // Đơn vị lúc bán
  soLuongTra: number;
  donGiaHoan: number;
  thanhTienTra: number;
}

// 3. Payload Tạo phiếu trả
export interface CreatePhieuTraPayload {
  maPB: string;
  hinhThucHoanTien: number; // 0: Tiền mặt, 1: Chuyển khoản
  lyDoTra?: string;
  danhSachChiTiet: {
    maLo: string;
    soLuong: number;
    ghiChu?: string;
  }[];
}

// 4. Helper Types (Dùng cho Modal Thêm)
export interface PhieuBanLookup {
  maPB: string;
  maPBCode: string;
  tenKhachHang: string;
  ngayBan: string;
}

export interface SaleDetailForReturn {
  maPB: string;
  maPBCode: string;
  danhSachChiTiet: {
    maLo: string;
    maLoCode: string;
    tenSanPham: string;
    soLuong: number; // Số lượng đã mua
    donGia: number;
    hanSuDung: string;
  }[];
}

// --- SERVICE ---
export const returnService = {
  // 1. Lấy danh sách phiếu trả
  getAll: async () => {
    const res = await apiClient.get<PhieuTra[]>('/api/PhieuTras');
    return res.data;
  },

  // 2. Lấy chi tiết phiếu trả
  getById: async (id: string) => {
    const res = await apiClient.get<PhieuTraDetail>(`/api/PhieuTras/${id}`);
    return res.data;
  },

  // 3. Tạo phiếu trả
  create: async (data: CreatePhieuTraPayload) => {
    return await apiClient.post('/api/PhieuTras', data);
  },

  // 4. Xóa phiếu trả
  delete: async (id: string) => {
    return await apiClient.delete(`/api/PhieuTras/${id}`);
  },

  // --- HELPER APIs ---

  // Lấy danh sách phiếu bán (để chọn khi tạo phiếu trả)
  getSales: async () => {
    const res = await apiClient.get<PhieuBanLookup[]>('/api/PhieuBans'); 
    return res.data;
  },

  // Lấy chi tiết phiếu bán (để chọn sản phẩm trả)
  getSaleDetail: async (maPB: string) => {
    const res = await apiClient.get<SaleDetailForReturn>(`/api/PhieuBans/${maPB}`);
    return res.data;
  },

  // Check số lượng có thể trả (QUAN TRỌNG)
  checkReturnable: async (maPB: string, maLo: string, soLuong: number) => {
    // API trả về true/false
    const res = await apiClient.post<boolean>('/api/PhieuTras/check-returnable', {
      maPB,
      maLo,
      soLuong
    });
    return res.data;
  }
};