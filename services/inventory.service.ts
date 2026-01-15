import apiClient from '@/lib/axios';
import { KhoHangTonKho } from '@/types/inventory';

export const inventoryService = {
  // Lấy danh sách tồn kho phân theo kho
  getAll: async () => {
    const res = await apiClient.get<KhoHangTonKho[]>('/api/TonKhos');
    return res.data;
  },
  
  // API Check tồn kho (Giữ lại để dùng cho các màn hình khác nếu cần)
  checkStock: async (payload: { maKhoXuat: string; maLo: string; soLuongChuyen: number }) => {
    return await apiClient.post('/api/TonKhos/check', payload);
  }
};