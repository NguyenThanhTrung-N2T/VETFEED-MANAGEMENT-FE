export interface AuthResponse {
  maTK: string;
  email: string;
  hoTen: string;
  soDienThoai: string | null;
  anhDaiDien: string | null;
  role: string; // "NHAN_VIEN" | "QUAN_LY"
  trangThai: string; // "HOAT_DONG"
  accessToken: string; // Token JWT
}

export interface UserInfo {
  maTK: string;
  email: string;
  soDienThoai?: string | null;
  hoTen: string;
  role: string;
  avatar?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  hoTen: string;
  email: string;
  password: string;
}