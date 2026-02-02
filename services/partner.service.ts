import apiClient from "@/lib/axios";

export interface Partner {
  maNCC: string;
  maNCCCode?: string;
  tenNCC: string;
  soDienThoai?: string;
  diaChi?: string;
  sanPhamCount?: number; // Số lượng sản phẩm cung cấp
  trangThai?: string;
}

export const partnerService = {
  getAll: async () => {
    // Gọi API lấy danh sách nhà cung cấp
    const res = await apiClient.get<Partner[]>("/api/NhaCungCaps");
    return res.data || [];
  },
};
