import { format } from "date-fns"; // Assuming you use date-fns, or use native Date
import { TonKhoSanPhamItemResponse, DoanhThuDonHangItemResponse, LoiNhuanSanPhamItemResponse } from "@/client/types.gen";
// ============================================================================
// 1. THE CORE ENGINE (Generic)
// ============================================================================
export const exportToCSV = (filename: string, data: any[]): void => {
    if (!data || data.length === 0) {
        console.warn("No data available to export");
        return;
    }

    // 1. Get Headers from the first object keys
    const headers = Object.keys(data[0]);

    // 2. Map data to CSV rows
    const csvRows = data.map((row) => {
        return headers
            .map((fieldName) => {
                const value = row[fieldName];

                // Handle null/undefined
                if (value === null || value === undefined) return "";

                // Escape quotes (replace " with "") and wrap in quotes
                const stringValue = String(value).replace(/"/g, '""');
                return `"${stringValue}"`;
            })
            .join(",");
    });

    // 3. Combine headers and rows
    const csvContent = [headers.join(","), ...csvRows].join("\r\n");

    // 4. Create Blob with BOM (\uFEFF) so Excel reads Vietnamese correctly
    const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
    });

    // 5. Trigger Download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// ============================================================================
// 2. DATA PREPARERS (Specific for your 3 Pages)
// ============================================================================

/**
 * 1. SALES REPORT (Doanh Thu)
 * Formatting logic for Sales Table
 */
export const prepareRevenueData = (data: DoanhThuDonHangItemResponse[]) => {
    if (!data) return [];

    return data.map((item) => ({
        "Ngày": item.ngay ? new Date(item.ngay).toLocaleDateString('vi-VN') : "",
        "Mã Phiếu": item.maPhieuBanCode,
        "Mã SP": item.maSPCode,
        "Sản Phẩm": item.tenSanPham,
        "Khách Hàng": item.tenKhachHang,
        "Đơn Giá": item.donGia,       // Keep raw for Excel math
        "Số Lượng": item.soLuong,     // Keep raw for Excel math
        "Thành Tiền": item.thanhTien, // Keep raw for Excel math
    }));
};
/**
 * 2. PROFIT REPORT (Lợi Nhuận)
 * Formatting logic for Profit Table
 */
export const prepareProfitData = (data: LoiNhuanSanPhamItemResponse[]) => {
    if (!data) return [];

    return data.map((item) => ({
        "Mã SP": item.maSPCode,
        "Sản Phẩm": item.tenSanPham,
        "Số Lượng Bán": item.soLuongBan,
        "Doanh Thu": item.doanhThu,
        "Chi Phí": item.chiPhi,
        "Lợi Nhuận": item.loiNhuan,
        "Tỷ Suất (%)": item.tiSuat ? Number(item.tiSuat.toFixed(2)) : 0,
    }));
};
/**
 * 3. INVENTORY REPORT (Tồn Kho)
 * Formatting logic for Inventory Table
 */
const mapInventoryStatus = (status?: string | null) => {
    switch (status) {
        case 'CON_HAN': return 'Còn hạn';
        case 'SAP_HET_HAN': return 'Sắp hết hạn';
        case 'HET_HAN':
        default:
            return 'Hết hạn';
    }
};
export const prepareInventoryData = (data: TonKhoSanPhamItemResponse[]) => {
    if (!data) return [];

    return data.map((item) => ({
        "Mã Sản Phẩm": item.maSPCode,
        "Tên Sản Phẩm": item.tenSanPham,
        "Mã Lô": item.maLoCode,
        "Số Lượng": item.soLuong,
        "Đơn Vị": item.donVi,
        "Hạn Sử Dụng": item.ngayHetHan ? new Date(item.ngayHetHan).toLocaleDateString('vi-VN') : "",
        "Ngày Còn Lại": item.soNgayDenKhiHetHan,
        "Trạng Thái": mapInventoryStatus(item.trangThai)
    }));
};