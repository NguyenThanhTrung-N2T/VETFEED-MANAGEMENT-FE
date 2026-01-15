export interface TonKhoItem {
    maLo: string;
    tenSP: string;
    maPNCode: string; // Mã phiếu nhập
    donGia: number;
    soLuong: number;
}

export interface KhoHangTonKho {
    maKho: string;
    tenKho: string;
    danhSachTonKho: TonKhoItem[];
}