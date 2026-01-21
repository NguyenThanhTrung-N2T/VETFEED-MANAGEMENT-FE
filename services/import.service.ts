// src/services/import.service.ts
import apiClient from '@/lib/axios';

// --- TYPES ---

// 1. Phiếu Nhập (List Item)
export interface PhieuNhap {
  maPN: string;
  maPNCode: string;
  tenNCC: string;
  tenKho: string;
  thanhTien: number;
  trangThai: string; // "DA_DAT" | "DA_NHAN" | "DA_HUY"
  ghiChu: string;
  ngayCapNhat: string;
}

// 2. Chi Tiết Phiếu Nhập (Detail)
export interface PhieuNhapDetail {
  maPN: string;
  maPNCode: string;
  maNCC: string;
  tenNCC: string;
  maKho: string;
  tenKho: string;
  thanhTien: number;
  trangThai: string;
  ghiChu: string;
  danhSachChiTiet: CTPhieuNhap[];
}

export interface CTPhieuNhap {
  maCTPN?: string;
  maSP: string;
  tenSP?: string;       // BE trả về tên SP
  maLoCode?: string;    // Nếu có lô
  soLuong: number;
  donGia: number;       // Có thể null/0
  donViNhap: string;    // Đơn vị user chọn
  thanhTien?: number;
  hanSuDung?: string;   // ISO Date
  ngaySanXuat?: string; // ISO Date
}

// 3. Payload Tạo/Sửa
export interface CreatePhieuNhapPayload {
  maNCC: string;
  maKho: string;
  ghiChu?: string;
  danhSachChiTiet: {
    maSP: string;
    soLuong: number;
    donGia: number;
    donViNhap: string;
    ngaySanXuat?: string;
    hanSuDung: string;
  }[];
}

export interface UpdatePhieuNhapPayload {
  maNCC: string;
  maKho: string;
  trangThai: string;
  ghiChu?: string;
  thanhTien: number; // Bắt buộc khi update
  danhSachChiTiet: CTPhieuNhap[];
}

// 4. Helper Types (Dropdowns)
export interface NhaCungCap {
  maNCC: string;
  tenNCC: string;
}

export interface SanPhamNCC {
  maSP: string;
  maSanPhamCode: string;
  tenSanPham: string;
  giaNhapMacDinh?: number;
}

export interface DonViQuyDoi {
  donViNhap: string;
  tyLe: number;
}

export interface SanPhamDetail {
  maSP: string;
  tenSP: string;
  donViCoSo: string;
  donViQuyDoi: DonViQuyDoi[];
}

// --- SERVICE ---
export const importService = {
  // 1. Lấy danh sách phiếu nhập
  getAll: async () => {
    const res = await apiClient.get<PhieuNhap[]>('/api/PhieuNhaps');
    return res.data;
  },

  // 2. Lấy chi tiết phiếu
  getById: async (id: string) => {
    const res = await apiClient.get<PhieuNhapDetail>(`/api/PhieuNhaps/${id}`);
    return res.data;
  },

  // 3. Tạo phiếu
  create: async (data: CreatePhieuNhapPayload) => {
    return await apiClient.post('/api/PhieuNhaps', data);
  },

  // 4. Cập nhật phiếu
  update: async (id: string, data: UpdatePhieuNhapPayload) => {
    return await apiClient.put(`/api/PhieuNhaps/${id}`, data);
  },

  // 5. Xóa phiếu
  delete: async (id: string) => {
    return await apiClient.delete(`/api/PhieuNhaps/${id}`);
  },

  // --- HELPER APIs ---
  
  // Lấy danh sách NCC
  getSuppliers: async () => {
    const res = await apiClient.get<NhaCungCap[]>('/api/NhaCungCaps');
    return res.data;
  },

  // Lấy chi tiết NCC (để lấy danh sách sản phẩm của NCC đó)
  getSupplierDetail: async (id: string) => {
    // API này trả về detail bao gồm mảng `sanPhams`
    const res = await apiClient.get<{ sanPhams: SanPhamNCC[] }>(`/api/NhaCungCaps/${id}`);
    return res.data;
  },

  // Lấy danh sách Kho
  getWarehouses: async () => {
    const res = await apiClient.get<any[]>('/api/KhoHangs'); // Reuse type kho nếu cần
    return res.data;
  },

  // Lấy chi tiết Sản phẩm (để lấy đơn vị quy đổi)
  getProductDetail: async (id: string) => {
    const res = await apiClient.get<SanPhamDetail>(`/api/SanPhams/${id}`);
    return res.data;
  }
};