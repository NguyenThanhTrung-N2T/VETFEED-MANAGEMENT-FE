"use client";

import React, { useEffect, useState } from "react";
import {
    Calendar,
    Download,
    TrendingUp,
    Package,
    DollarSign,
    Warehouse,
    AlertTriangle,
    BarChart3
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar
} from "recharts";

// Import types (in real app, this would be from '@/types/report.types')
interface SalesReportRow {
    ngayBan: string;
    maPBCode: string;
    maSPCode: string;
    tenSP: string;
    soLuong: number;
    donGia: number;
    thanhTien: number;
    tenKH: string;
}

interface SalesSummary {
    tongDoanhThu: number;
    tongSoPhieu: number;
    tongSoLuong: number;
    fromDate: string;
    toDate: string;
}

interface SalesChartData {
    date: string;
    doanhThu: number;
    soPhieu: number;
}

interface ProfitReportRow {
    maSPCode: string;
    tenSP: string;
    soLuongBan: number;
    doanhThu: number;
    giaNhap: number;
    chiPhi: number;
    loiNhuan: number;
    tyLeLoiNhuan: number;
}

interface ProfitSummary {
    tongDoanhThu: number;
    tongChiPhi: number;
    tongLoiNhuan: number;
    tyLeLoiNhuanTrungBinh: number;
    fromDate: string;
    toDate: string;
}

interface InventoryReportRow {
    maTonKho: string;
    maSPCode: string;
    tenSP: string;
    maLoCode: string;
    soLuong: number;
    donViTinh: string;
    hanSuDung: string;
    ngayCapNhat: string;
    trangThaiHSD: 'CON_HAN' | 'SAP_HET_HAN' | 'HET_HAN';
}

interface InventoryPieChartData {
    maSPCode: string;
    tenSP: string;
    tongSoLuong: number;
    phanTram: number;
}

interface InventorySummary {
    tenKho: string;
    maKhoCode: string;
    tongSanPham: number;
    tongSoLuong: number;
    sanPhamSapHetHan: number;
}

interface WarehouseOption {
    maKho: string;
    maKhoCode: string;
    tenKho: string;
    trangThai: string;
}

type ReportType = "sales" | "profit" | "inventory";

// Mock Data Functions
async function fetchWarehouses(): Promise<WarehouseOption[]> {
    return [
        { maKho: "kho-1", maKhoCode: "KHO01", tenKho: "Kho Trung Tâm HCM", trangThai: "HOAT_DONG" },
        { maKho: "kho-2", maKhoCode: "KHO02", tenKho: "Kho Miền Bắc", trangThai: "HOAT_DONG" },
        { maKho: "kho-3", maKhoCode: "KHO03", tenKho: "Kho Miền Trung", trangThai: "HOAT_DONG" },
    ];
}

async function fetchSalesReport(fromDate: string, toDate: string) {
    const chartData: SalesChartData[] = [
        { date: "2025-01-01", doanhThu: 45000000, soPhieu: 12 },
        { date: "2025-01-02", doanhThu: 52000000, soPhieu: 15 },
        { date: "2025-01-03", doanhThu: 38000000, soPhieu: 10 },
        { date: "2025-01-04", doanhThu: 61000000, soPhieu: 18 },
        { date: "2025-01-05", doanhThu: 48000000, soPhieu: 14 },
        { date: "2025-01-06", doanhThu: 55000000, soPhieu: 16 },
    ];

    const details: SalesReportRow[] = [
        {
            ngayBan: "2025-01-01T08:30:00Z",
            maPBCode: "PB001",
            maSPCode: "SP001",
            tenSP: "Vitamin B-Complex cho gia súc",
            soLuong: 100,
            donGia: 150000,
            thanhTien: 15000000,
            tenKH: "Trang trại Bình Minh"
        },
        {
            ngayBan: "2025-01-01T10:15:00Z",
            maPBCode: "PB002",
            maSPCode: "SP002",
            tenSP: "Thuốc tẩy giun Ivermectin",
            soLuong: 50,
            donGia: 200000,
            thanhTien: 10000000,
            tenKH: "Chăn nuôi Hoàng Gia"
        },
        {
            ngayBan: "2025-01-02T09:00:00Z",
            maPBCode: "PB003",
            maSPCode: "SP003",
            tenSP: "Thức ăn hỗn hợp cho gà",
            soLuong: 200,
            donGia: 85000,
            thanhTien: 17000000,
            tenKH: "Trang trại Phú Quý"
        },
        {
            ngayBan: "2025-01-02T14:30:00Z",
            maPBCode: "PB004",
            maSPCode: "SP001",
            tenSP: "Vitamin B-Complex cho gia súc",
            soLuong: 80,
            donGia: 150000,
            thanhTien: 12000000,
            tenKH: "Đại lý Miền Nam"
        },
        {
            ngayBan: "2025-01-03T11:20:00Z",
            maPBCode: "PB005",
            maSPCode: "SP004",
            tenSP: "Kháng sinh Amoxicillin",
            soLuong: 60,
            donGia: 180000,
            thanhTien: 10800000,
            tenKH: "Trang trại Bình Minh"
        },
    ];

    const summary: SalesSummary = {
        tongDoanhThu: chartData.reduce((sum, d) => sum + d.doanhThu, 0),
        tongSoPhieu: chartData.reduce((sum, d) => sum + d.soPhieu, 0),
        tongSoLuong: details.reduce((sum, d) => sum + d.soLuong, 0),
        fromDate,
        toDate
    };

    return { summary, chartData, details };
}

async function fetchProfitReport(fromDate: string, toDate: string) {
    const details: ProfitReportRow[] = [
        {
            maSPCode: "SP001",
            tenSP: "Vitamin B-Complex cho gia súc",
            soLuongBan: 180,
            doanhThu: 27000000,
            giaNhap: 120000,
            chiPhi: 21600000,
            loiNhuan: 5400000,
            tyLeLoiNhuan: 20.0
        },
        {
            maSPCode: "SP002",
            tenSP: "Thuốc tẩy giun Ivermectin",
            soLuongBan: 50,
            doanhThu: 10000000,
            giaNhap: 160000,
            chiPhi: 8000000,
            loiNhuan: 2000000,
            tyLeLoiNhuan: 20.0
        },
        {
            maSPCode: "SP003",
            tenSP: "Thức ăn hỗn hợp cho gà",
            soLuongBan: 200,
            doanhThu: 17000000,
            giaNhap: 65000,
            chiPhi: 13000000,
            loiNhuan: 4000000,
            tyLeLoiNhuan: 23.53
        },
        {
            maSPCode: "SP004",
            tenSP: "Kháng sinh Amoxicillin",
            soLuongBan: 60,
            doanhThu: 10800000,
            giaNhap: 140000,
            chiPhi: 8400000,
            loiNhuan: 2400000,
            tyLeLoiNhuan: 22.22
        },
    ];

    const summary: ProfitSummary = {
        tongDoanhThu: details.reduce((sum, d) => sum + d.doanhThu, 0),
        tongChiPhi: details.reduce((sum, d) => sum + d.chiPhi, 0),
        tongLoiNhuan: details.reduce((sum, d) => sum + d.loiNhuan, 0),
        tyLeLoiNhuanTrungBinh: 0,
        fromDate,
        toDate
    };
    summary.tyLeLoiNhuanTrungBinh = (summary.tongLoiNhuan / summary.tongDoanhThu) * 100;

    return { summary, details };
}

async function fetchInventoryReport(maKho: string) {
    const details: InventoryReportRow[] = [
        {
            maTonKho: "TK001",
            maSPCode: "SP001",
            tenSP: "Vitamin B-Complex cho gia súc",
            maLoCode: "LOT001-2024",
            soLuong: 350,
            donViTinh: "Hộp",
            hanSuDung: "2025-12-31",
            ngayCapNhat: "2025-01-06T10:00:00Z",
            trangThaiHSD: "CON_HAN"
        },
        {
            maTonKho: "TK002",
            maSPCode: "SP002",
            tenSP: "Thuốc tẩy giun Ivermectin",
            maLoCode: "LOT002-2024",
            soLuong: 180,
            donViTinh: "Chai",
            hanSuDung: "2025-08-15",
            ngayCapNhat: "2025-01-06T10:00:00Z",
            trangThaiHSD: "CON_HAN"
        },
        {
            maTonKho: "TK003",
            maSPCode: "SP003",
            tenSP: "Thức ăn hỗn hợp cho gà",
            maLoCode: "LOT003-2025",
            soLuong: 500,
            donViTinh: "Bao",
            hanSuDung: "2025-06-30",
            ngayCapNhat: "2025-01-06T10:00:00Z",
            trangThaiHSD: "CON_HAN"
        },
        {
            maTonKho: "TK004",
            maSPCode: "SP004",
            tenSP: "Kháng sinh Amoxicillin",
            maLoCode: "LOT004-2024",
            soLuong: 120,
            donViTinh: "Hộp",
            hanSuDung: "2025-03-20",
            ngayCapNhat: "2025-01-06T10:00:00Z",
            trangThaiHSD: "SAP_HET_HAN"
        },
        {
            maTonKho: "TK005",
            maSPCode: "SP005",
            tenSP: "Vaccine Newcastle cho gà",
            maLoCode: "LOT005-2024",
            soLuong: 90,
            donViTinh: "Lọ",
            hanSuDung: "2025-02-10",
            ngayCapNhat: "2025-01-06T10:00:00Z",
            trangThaiHSD: "SAP_HET_HAN"
        },
    ];

    const totalQuantity = details.reduce((sum, d) => sum + d.soLuong, 0);
    const pieChartData: InventoryPieChartData[] = details.map(d => ({
        maSPCode: d.maSPCode,
        tenSP: d.tenSP,
        tongSoLuong: d.soLuong,
        phanTram: (d.soLuong / totalQuantity) * 100
    }));

    const summary: InventorySummary = {
        tenKho: "Kho Trung Tâm HCM",
        maKhoCode: "KHO01",
        tongSanPham: details.length,
        tongSoLuong: totalQuantity,
        sanPhamSapHetHan: details.filter(d => d.trangThaiHSD === 'SAP_HET_HAN').length
    };

    return { summary, pieChartData, details };
}

// Main Component
export default function BaoCaoPage() {
    const [reportType, setReportType] = useState<ReportType>("sales");

    // Filters
    const [fromDate, setFromDate] = useState<string>(() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d.toISOString().slice(0, 10);
    });
    const [toDate, setToDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");

    // Data states
    const [warehouses, setWarehouses] = useState<WarehouseOption[]>([]);
    const [salesData, setSalesData] = useState<any>(null);
    const [profitData, setProfitData] = useState<any>(null);
    const [inventoryData, setInventoryData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Load warehouses on mount
    useEffect(() => {
        fetchWarehouses().then(data => {
            setWarehouses(data);
            if (data.length > 0) {
                setSelectedWarehouse(data[0].maKho);
            }
        });
    }, []);

    // Load data based on report type
    useEffect(() => {
        loadData();
    }, [reportType, fromDate, toDate, selectedWarehouse]);

    async function loadData() {
        setLoading(true);
        try {
            if (reportType === "sales") {
                const data = await fetchSalesReport(fromDate, toDate);
                setSalesData(data);
            } else if (reportType === "profit") {
                const data = await fetchProfitReport(fromDate, toDate);
                setProfitData(data);
            } else if (reportType === "inventory" && selectedWarehouse) {
                const data = await fetchInventoryReport(selectedWarehouse);
                setInventoryData(data);
            }
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    }

    // Formatters
    const formatCurrency = (v: number) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);
    const formatNumber = (v: number) => new Intl.NumberFormat("vi-VN").format(v);
    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("vi-VN");

    // CSV Export Functions
    const exportToCSV = (filename: string, data: any[]) => {
        if (!data || data.length === 0) return;

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(","),
            ...data.map(row =>
                headers.map(header => {
                    const val = row[header];
                    return typeof val === 'string' ? `"${val}"` : val;
                }).join(",")
            )
        ].join("\n");

        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    const PIE_COLORS = ['#253D90', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    return (
        <div className="mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                {/* <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <BarChart3 className="text-[#253D90]" size={32} />
                                Báo Cáo Kinh Doanh
                            </h1>
                            <p className="text-gray-600 mt-1">Phân tích dữ liệu và xu hướng kinh doanh</p>
                        </div>
                    </div> */}

                <div className="flex flex-wrap items-center gap-4">
                    {/* Report Type Selector */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-gray-700">Loại báo cáo:</label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value as ReportType)}
                            className="px-4 py-2.5 border-2 border-gray-300 rounded-xl bg-white text-sm font-medium text-gray-700 hover:border-[#253D90] focus:outline-none focus:ring-2 focus:ring-[#253D90] focus:border-transparent transition-all"
                        >
                            <option value="sales">Báo cáo Doanh thu</option>
                            <option value="profit">Báo cáo Lợi nhuận</option>
                            <option value="inventory">Báo cáo Tồn kho</option>
                        </select>
                    </div>

                    <div className="h-8 w-px bg-gray-300"></div>

                    {/* Date Range for Sales & Profit */}
                    {reportType !== "inventory" && (
                        <>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-semibold text-gray-700">Từ ngày:</label>
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="px-3 py-2 border-2 border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#253D90] focus:border-transparent"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-semibold text-gray-700">Đến ngày:</label>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="px-3 py-2 border-2 border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#253D90] focus:border-transparent"
                                />
                            </div>
                        </>
                    )}

                    {/* Warehouse Selector for Inventory */}
                    {reportType === "inventory" && (
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                <Warehouse size={16} />
                                Kho hàng:
                            </label>
                            <select
                                value={selectedWarehouse}
                                onChange={(e) => setSelectedWarehouse(e.target.value)}
                                className="px-4 py-2.5 border-2 border-gray-300 rounded-xl bg-white text-sm font-medium text-gray-700 hover:border-[#253D90] focus:outline-none focus:ring-2 focus:ring-[#253D90] focus:border-transparent transition-all min-w-50"
                            >
                                {warehouses.map(w => (
                                    <option key={w.maKho} value={w.maKho}>
                                        {w.maKhoCode} - {w.tenKho}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button
                        onClick={loadData}
                        disabled={loading}
                        className="ml-auto inline-flex items-center gap-2 bg-[#253D90] text-white px-6 py-2.5 rounded-xl hover:bg-[#1e3276] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                        <Calendar size={18} />
                        {loading ? "Đang tải..." : "Làm mới"}
                    </button>
                </div>
            </div>

            {/* Sales Report */}
            {reportType === "sales" && salesData && (
                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-blue-100 text-sm font-semibold uppercase tracking-wide">Tổng Doanh Thu</span>
                                <DollarSign className="text-blue-200" size={28} />
                            </div>
                            <div className="text-4xl font-bold mb-1">
                                {formatCurrency(salesData.summary.tongDoanhThu)}
                            </div>
                            <p className="text-blue-100 text-xs">
                                {formatDate(salesData.summary.fromDate)} - {formatDate(salesData.summary.toDate)}
                            </p>
                        </div>

                        <div className="bg-linear-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-green-100 text-sm font-semibold uppercase tracking-wide">Số Đơn Hàng</span>
                                <TrendingUp className="text-green-200" size={28} />
                            </div>
                            <div className="text-4xl font-bold mb-1">
                                {salesData.summary.tongSoPhieu}
                            </div>
                            <p className="text-green-100 text-xs">Phiếu bán</p>
                        </div>

                        <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-purple-100 text-sm font-semibold uppercase tracking-wide">Tổng Số Lượng</span>
                                <Package className="text-purple-200" size={28} />
                            </div>
                            <div className="text-4xl font-bold mb-1">
                                {formatNumber(salesData.summary.tongSoLuong)}
                            </div>
                            <p className="text-purple-100 text-xs">Sản phẩm</p>
                        </div>
                    </div>

                    {/* Sales Chart */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <TrendingUp className="text-[#253D90]" size={24} />
                            Xu Hướng Doanh Thu
                        </h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={salesData.chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(date) => formatDate(date)}
                                    stroke="#6B7280"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis
                                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                                    stroke="#6B7280"
                                    style={{ fontSize: '12px' }}
                                />
                                <Tooltip
                                    formatter={(value: any, name: string | undefined) => [
                                        name === 'doanhThu' ? formatCurrency(value) : value,
                                        name === 'doanhThu' ? 'Doanh thu' : 'Số phiếu'
                                    ]}
                                    labelFormatter={(date) => formatDate(date)}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="doanhThu"
                                    stroke="#253D90"
                                    strokeWidth={3}
                                    name="Doanh thu"
                                    dot={{ fill: '#253D90', r: 5 }}
                                    activeDot={{ r: 7 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="soPhieu"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                    name="Số phiếu"
                                    dot={{ fill: '#10B981', r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Sales Details Table */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
                            <h2 className="text-xl font-bold text-gray-900">Chi Tiết Doanh Thu</h2>
                            <button
                                onClick={() => exportToCSV(`sales_${fromDate}_${toDate}.csv`, salesData.details)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-[#253D90] transition-all text-sm font-semibold text-gray-700"
                            >
                                <Download size={18} />
                                Xuất CSV
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-linear-to-r from-gray-100 to-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Ngày</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Mã Phiếu</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Sản Phẩm</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Khách Hàng</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Số Lượng</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Đơn Giá</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Thành Tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {salesData.details.map((row: SalesReportRow, idx: number) => (
                                        <tr key={idx} className="hover:bg-blue-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                                {formatDate(row.ngayBan)}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-[#253D90]">{row.maPBCode}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                <div className="font-medium">{row.tenSP}</div>
                                                <div className="text-xs text-gray-500">{row.maSPCode}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{row.tenKH}</td>
                                            <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                                                {formatNumber(row.soLuong)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-right text-gray-700">
                                                {formatCurrency(row.donGia)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-right font-bold text-[#253D90]">
                                                {formatCurrency(row.thanhTien)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Profit Report */}
            {reportType === "profit" && profitData && (
                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-linear-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-indigo-100 text-sm font-semibold uppercase tracking-wide">Doanh Thu</span>
                                <TrendingUp className="text-indigo-200" size={24} />
                            </div>
                            <div className="text-3xl font-bold">
                                {formatCurrency(profitData.summary.tongDoanhThu)}
                            </div>
                        </div>

                        <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-orange-100 text-sm font-semibold uppercase tracking-wide">Chi Phí</span>
                                <DollarSign className="text-orange-200" size={24} />
                            </div>
                            <div className="text-3xl font-bold">
                                {formatCurrency(profitData.summary.tongChiPhi)}
                            </div>
                        </div>

                        <div className="bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-emerald-100 text-sm font-semibold uppercase tracking-wide">Lợi Nhuận</span>
                                <TrendingUp className="text-emerald-200" size={24} />
                            </div>
                            <div className="text-3xl font-bold">
                                {formatCurrency(profitData.summary.tongLoiNhuan)}
                            </div>
                        </div>

                        <div className="bg-linear-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-pink-100 text-sm font-semibold uppercase tracking-wide">Tỷ Suất</span>
                                <Package className="text-pink-200" size={24} />
                            </div>
                            <div className="text-3xl font-bold">
                                {profitData.summary.tyLeLoiNhuanTrungBinh.toFixed(2)}%
                            </div>
                        </div>
                    </div>

                    {/* Profit Chart */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <BarChart3 className="text-[#253D90]" size={24} />
                            Phân Tích Lợi Nhuận Theo Sản Phẩm
                        </h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={profitData.details}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="tenSP"
                                    angle={-45}
                                    textAnchor="end"
                                    height={120}
                                    stroke="#6B7280"
                                    style={{ fontSize: '11px' }}
                                />
                                <YAxis
                                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                                    stroke="#6B7280"
                                    style={{ fontSize: '12px' }}
                                />
                                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="doanhThu" fill="#6366F1" name="Doanh thu" />
                                <Bar dataKey="chiPhi" fill="#F97316" name="Chi phí" />
                                <Bar dataKey="loiNhuan" fill="#10B981" name="Lợi nhuận" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Profit Table */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
                            <h2 className="text-xl font-bold text-gray-900">Chi Tiết Lợi Nhuận Theo Sản Phẩm</h2>
                            <button
                                onClick={() => exportToCSV(`profit_${fromDate}_${toDate}.csv`, profitData.details)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-[#253D90] transition-all text-sm font-semibold text-gray-700"
                            >
                                <Download size={18} />
                                Xuất CSV
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-linear-to-r from-gray-100 to-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Sản Phẩm</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">SL Bán</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Doanh Thu</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Chi Phí</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Lợi Nhuận</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Tỷ Suất</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {profitData.details.map((row: ProfitReportRow, idx: number) => (
                                        <tr key={idx} className="hover:bg-emerald-50 transition-colors">
                                            <td className="px-6 py-4 text-sm">
                                                <div className="font-semibold text-gray-900">{row.tenSP}</div>
                                                <div className="text-xs text-gray-500">{row.maSPCode}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                                                {formatNumber(row.soLuongBan)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-right text-indigo-600 font-semibold">
                                                {formatCurrency(row.doanhThu)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-right text-orange-600 font-semibold">
                                                {formatCurrency(row.chiPhi)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-right text-emerald-600 font-bold">
                                                {formatCurrency(row.loiNhuan)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-right">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                                    {row.tyLeLoiNhuan.toFixed(2)}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Inventory Report */}
            {reportType === "inventory" && inventoryData && (
                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-blue-100 text-sm font-semibold uppercase tracking-wide">Tổng Sản Phẩm</span>
                                <Package className="text-blue-200" size={28} />
                            </div>
                            <div className="text-4xl font-bold mb-1">
                                {inventoryData.summary.tongSanPham}
                            </div>
                            <p className="text-blue-100 text-xs">Loại sản phẩm</p>
                        </div>

                        <div className="bg-linear-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-green-100 text-sm font-semibold uppercase tracking-wide">Tổng Số Lượng</span>
                                <TrendingUp className="text-green-200" size={28} />
                            </div>
                            <div className="text-4xl font-bold mb-1">
                                {formatNumber(inventoryData.summary.tongSoLuong)}
                            </div>
                            <p className="text-green-100 text-xs">Đơn vị</p>
                        </div>

                        <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-orange-100 text-sm font-semibold uppercase tracking-wide">Sắp Hết Hạn</span>
                                <AlertTriangle className="text-orange-200" size={28} />
                            </div>
                            <div className="text-4xl font-bold mb-1">
                                {inventoryData.summary.sanPhamSapHetHan}
                            </div>
                            <p className="text-orange-100 text-xs">Sản phẩm</p>
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Package className="text-[#253D90]" size={24} />
                            Phân Bổ Tồn Kho - {inventoryData.summary.tenKho}
                        </h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={inventoryData.pieChartData}
                                    dataKey="tongSoLuong"
                                    nameKey="maSPCode"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={140}
                                    label={(entry: any) =>
                                        `${entry.maSPCode}: ${entry.phanTram.toFixed(1)}%`
                                    }
                                    labelLine={true}
                                >
                                    {inventoryData.pieChartData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: any, name: string | undefined, props: any) => [
                                        `${formatNumber(value)} (${props.payload.phanTram.toFixed(1)}%)`,
                                        props.payload.tenSP
                                    ]}
                                />
                                <Legend
                                    formatter={(value, entry: any) => entry.payload.tenSP}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Inventory Table */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
                            <h2 className="text-xl font-bold text-gray-900">Chi Tiết Tồn Kho</h2>
                            <button
                                onClick={() => exportToCSV(`inventory_${selectedWarehouse}_${new Date().toISOString().slice(0, 10)}.csv`, inventoryData.details)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-[#253D90] transition-all text-sm font-semibold text-gray-700"
                            >
                                <Download size={18} />
                                Xuất CSV
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-linear-to-r from-gray-100 to-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Mã SP</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tên Sản Phẩm</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Mã Lô</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Số Lượng</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Đơn Vị</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Hạn SD</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Trạng Thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {inventoryData.details.map((row: InventoryReportRow, idx: number) => (
                                        <tr key={idx} className="hover:bg-blue-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-semibold text-[#253D90]">
                                                {row.maSPCode}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {row.tenSP}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                                                {row.maLoCode}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">
                                                {formatNumber(row.soLuong)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center text-gray-700">
                                                {row.donViTinh}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center text-gray-900">
                                                {formatDate(row.hanSuDung)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {row.trangThaiHSD === 'CON_HAN' && (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                                        Còn hạn
                                                    </span>
                                                )}
                                                {row.trangThaiHSD === 'SAP_HET_HAN' && (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
                                                        ⚠️ Sắp hết hạn
                                                    </span>
                                                )}
                                                {row.trangThaiHSD === 'HET_HAN' && (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                                                        ❌ Hết hạn
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
