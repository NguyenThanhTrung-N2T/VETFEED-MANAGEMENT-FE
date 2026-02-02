import apiClient from "@/lib/axios";

// Định nghĩa kiểu dữ liệu dựa trên Swagger
export interface Product {
  maSP: string;
  maSPCode?: string;
  tenSP: string;
  loaiSanPham?: string; // Ví dụ: "Thuốc", "Thức ăn", "Vắc xin"
  donViCoSo?: string;
  donGia?: number;
  anhSanPham?: string; // URL ảnh
  ghiChu?: string;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const productService = {
  // Hàm lấy danh sách có hỗ trợ filter
  getProducts: async (params?: {
    Keyword?: string;
    LoaiSanPham?: string;
    Page?: number;
    PageSize?: number;
  }) => {
    const res = await apiClient.get<PagedResult<Product>>("/api/SanPhams", {
      params,
    });
    return res.data || { items: [], total: 0, page: 1, pageSize: 10 };
  },
};
