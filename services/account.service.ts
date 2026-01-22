import apiClient from '@/lib/axios';

export interface UpdateProfilePayload {
    hoTen?: string;
    soDienThoai?: string;
    email?: string;
    anhDaiDien?: string;
}

export interface ResetPasswordPayload {
    email: string;
    password: string; // Mật khẩu mới
}

// Interface thông tin tài khoản trả về từ API GetById
export interface AccountProfile {
    maTK: string;
    hoTen: string;
    email: string;
    soDienThoai: string;
    anhDaiDien: string;
    role: string;
}

export const accountService = {

    // Lấy thông tin chi tiết tài khoản
    getProfile: async (maTK: string) => {
        const res = await apiClient.get<AccountProfile>(`/api/TaiKhoans/${maTK}`);
        return res.data;
    },
    
    // API Cập nhật thông tin: PUT /api/TaiKhoans/{maTK}
    updateProfile: async (maTK: string, data: UpdateProfilePayload) => {
        return await apiClient.put(`/api/TaiKhoans/${maTK}`, data);
    },

    // API Đổi mật khẩu: POST /api/TaiKhoans/reset-password
    changePassword: async (data: ResetPasswordPayload) => {
        return await apiClient.post('/api/TaiKhoans/reset-password', data);
    }
};