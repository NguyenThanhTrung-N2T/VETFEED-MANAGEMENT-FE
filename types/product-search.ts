export interface ProductSearchParams {
    Keyword?: string;
    LoaiSanPham?: string;
    Page?: number;
    PageSize?: number;
}
export type ProductSearchResult = {
    maSP?: string;
    maSPCode?: string | null;
    tenSP?: string | null;
    loaiSanPham?: string | null;
    donViCoSo?: string | null;
    donGia?: number | null; // Optional based on your response
};