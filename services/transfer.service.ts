// src/services/transfer.service.ts
import apiClient from '@/lib/axios';

// --- TYPES ---
export interface PhieuChuyenKho {
  maCK: string;
  maCKCode: string;
  ngayLap: string;
  tenKhoXuat: string;
  tenKhoNhan: string;
  ghiChu: string;
  trangThai?: string; // Mặc định BE trả về text hoặc int tùy cấu hình
}

export interface ChiTietPhieuChuyen {
  maCK: string;
  maCKCode: string;
  ngayLap: string;
  maKhoXuat: string;
  tenKhoXuat: string;
  maKhoNhan: string;
  tenKhoNhan: string;
  ghiChu: string;
  danhSachSanPham: CTChuyenKhoItem[];
}

export interface CTChuyenKhoItem {
  maCTCK?: string | null; // Null nếu là item mới thêm khi sửa
  maLo: string;
  maLoCode?: string;
  tenSanPham?: string;
  loaiSanPham?: string;
  donViCoSo?: string;
  soLuongChuyen: number;
  donGia?: number;
  hanSuDung?: string;
  ghiChu?: string;
  trangThai?: number; // 0: Tạo, 1: Đang chuyển, 2: Đã nhận
  isDeleted?: boolean; // Dùng khi update
}

// Payload Tạo
export interface CreateTransferPayload {
  ngayLap: string;
  maKhoXuat: string;
  maKhoNhan: string;
  ghiChu: string;
  danhSachSanPham: { maLo: string; soLuongChuyen: number; ghiChu?: string }[];
}

// Payload Sửa
export interface UpdateTransferPayload {
  maCK: string;
  ngayLap: string;
  maKhoNhan: string;
  ghiChu: string;
  danhSachChiTiet: CTChuyenKhoItem[];
}

// --- SERVICE ---
export const transferService = {
  // 1. Lấy danh sách phiếu chuyển
  getAll: async () => {
    const res = await apiClient.get<PhieuChuyenKho[]>('/api/PhieuChuyenKhos');
    return res.data;
  },

  // 2. Lấy chi tiết phiếu chuyển
  getById: async (id: string) => {
    const res = await apiClient.get<ChiTietPhieuChuyen>(`/api/PhieuChuyenKhos/${id}`);
    return res.data;
  },

  // 3. Tạo phiếu chuyển
  create: async (data: CreateTransferPayload) => {
    return await apiClient.post('/api/PhieuChuyenKhos', data);
  },

  // 4. Cập nhật phiếu chuyển
  update: async (id: string, data: UpdateTransferPayload) => {
    return await apiClient.put(`/api/PhieuChuyenKhos/${id}`, data);
  },

  // 5. Xóa phiếu chuyển
  delete: async (id: string) => {
    return await apiClient.delete(`/api/PhieuChuyenKhos/${id}`);
  },

  // 6. Cập nhật trạng thái chi tiết (Khi nhận hàng)
  updateDetailStatus: async (maCTCK: string, trangThai: number) => {
    return await apiClient.put(`/api/PhieuChuyenKhos/chitiet/${maCTCK}/trangthai`, { trangThai });
  },

  // --- HELPER APIs ---
  // Lấy danh sách kho
  getWarehouses: async () => {
    const res = await apiClient.get('/api/KhoHangs');
    return res.data;
  },

  // Lấy danh sách lô hàng (Sản phẩm)
  getBatches: async () => {
    const res = await apiClient.get('/api/LoHangs');
    return res.data;
  },
  
  // Lấy lô hàng theo sản phẩm (Optional nếu cần lọc kỹ)
  getBatchesByProduct: async (maSP: string) => {
      const res = await apiClient.get(`/api/LoHangs/bysanpham/${maSP}`);
      return res.data;
  },

  // Check tồn kho
  checkInventory: async (maKhoXuat: string, maLo: string, soLuongChuyen: number) => {
    // API trả về 200 OK nếu đủ, hoặc lỗi 400 nếu thiếu
    return await apiClient.post('/api/TonKhos/check', {
      maKhoXuat,
      maLo,
      soLuongChuyen
    });
  }
};