"use client";

import React, { useEffect, useState } from "react";
import {
    Calendar, Download, TrendingUp, Package, DollarSign, Warehouse, AlertTriangle, BarChart3, ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import {
    RevenueAnalyticsResponse, RevenueOrdersResponse,
    ProfitAnalyticsResponse, ProfitProductsResponse,
    InventoryAnalyticsResponse, InventoryItemsResponse,
    WarehouseOption
} from "@/types/reports";

import * as reportService from "@/services/bao-cao.service";
import { toast } from "sonner";
import { OverviewLoading } from "@/components/bao-cao/OverviewLoading";
import { TableBodyLoading } from "@/components/bao-cao/TableLoading";
import ExportButton from "@/components/ui/ExportButton";
import { exportToCSV, prepareInventoryData, prepareRevenueData, prepareProfitData } from "@/utils/csvHelper";
type ReportType = "sales" | "profit" | "inventory";

export default function BaoCaoPage() {
    const [reportType, setReportType] = useState<ReportType>("sales");

    // --- Filters ---
    const [fromDate, setFromDate] = useState<string>(() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d.toISOString().slice(0, 10);
    });
    const [toDate, setToDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");

    // --- Pagination State ---
    const [currentPage, setCurrentPage] = useState(1);
    const LIMIT = 20;

    // --- Data State ---
    const [warehouses, setWarehouses] = useState<WarehouseOption[]>([]);

    // Revenue Data
    const [revAnalytics, setRevAnalytics] = useState<RevenueAnalyticsResponse | null>(null);
    const [revOrders, setRevOrders] = useState<RevenueOrdersResponse | null>(null);

    // Profit Data
    const [profAnalytics, setProfAnalytics] = useState<ProfitAnalyticsResponse | null>(null);
    const [profProducts, setProfProducts] = useState<ProfitProductsResponse | null>(null);

    // Inventory Data
    const [invAnalytics, setInvAnalytics] = useState<InventoryAnalyticsResponse | null>(null);
    const [invItems, setInvItems] = useState<InventoryItemsResponse | null>(null);

    const [loading, setLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(true);

    // --- Formatters ---
    const formatCurrency = (v: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);
    const formatNumber = (v: number) => new Intl.NumberFormat("vi-VN").format(v);
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("vi-VN");
    };

    // --- Initial Load ---
    useEffect(() => {
        reportService.getWarehouses().then(data => {
            setWarehouses(data);
            if (data.length > 0) setSelectedWarehouse(data[0].maKho);
        });
    }, []);

    // --- Fetch Analytics (Charts/Cards) ---
    // Triggers when Report Type or Date/Warehouse Filters change
    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            setCurrentPage(1); // Reset page on filter change
            try {
                if (reportType === "sales") {
                    const data = await reportService.getRevenueAnalytics(fromDate, toDate);
                    setRevAnalytics(data);
                } else if (reportType === "profit") {
                    const data = await reportService.getProfitAnalytics(fromDate, toDate);
                    setProfAnalytics(data);
                } else if (reportType === "inventory" && selectedWarehouse) {
                    const data = await reportService.getInventoryAnalytics(selectedWarehouse);
                    setInvAnalytics(data);
                }
            } catch (error) {
                console.error("Error fetching analytics:", error);
                toast.error("Đã xảy ra lỗi khi tải dữ liệu!");
            } finally {
                setLoading(false);
            }
        };

        if (selectedWarehouse || reportType !== "inventory") {
            fetchAnalytics();
        }
    }, [reportType, fromDate, toDate, selectedWarehouse]);

    // --- Fetch Table Data ---
    // Triggers when Filters OR Page changes
    useEffect(() => {
        const fetchTable = async () => {
            setTableLoading(true);
            try {
                if (reportType === "sales") {
                    const data = await reportService.getRevenueOrders(fromDate, toDate, currentPage, LIMIT);
                    setRevOrders(data);
                } else if (reportType === "profit") {
                    const data = await reportService.getProfitProducts(fromDate, toDate, currentPage, LIMIT);
                    setProfProducts(data);
                } else if (reportType === "inventory" && selectedWarehouse) {
                    const data = await reportService.getInventoryItems(selectedWarehouse, currentPage, LIMIT);
                    setInvItems(data);
                }
            } catch (error) {
                console.error("Error fetching table:", error);
                toast.error("Đã xảy ra lỗi khi tải dữ liệu!");
            } finally {
                setTableLoading(false);
            }
        };

        if (selectedWarehouse || reportType !== "inventory") {
            fetchTable();
        }
    }, [reportType, fromDate, toDate, selectedWarehouse, currentPage]);


    const exportToCSV = (filename: string, data: any[]) => {
        if (!data || data.length === 0) return;
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(","),
            ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(","))
        ].join("\n");
        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
    };

    const PIE_COLORS = ['#253D90', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    // --- Render Helpers ---
    const PaginationControls = ({ meta }: { meta: any }) => {
        if (!meta) return null;
        return (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <span className="text-sm text-gray-700">
                    Trang {meta.page} / {meta.total_pages} ({meta.total_items} mục)
                </span>
                <div className="flex gap-2">
                    <button
                        disabled={meta.page <= 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        disabled={meta.page >= meta.total_pages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        );
    }
    const tooltipFormatter = (value?: ValueType, name?: NameType): [string | number, string] => {
        if (name === "doanhThu") {
            return [
                typeof value === "number" ? formatCurrency(value) : "-",
                "Doanh thu"
            ];
        }

        return [
            typeof value === "number" ? value : "-",
            "Số đơn"
        ];
    };
    return (
        <div className="mx-auto space-y-6">
            {/* --- CONTROLS SECTION --- */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-gray-700">Loại báo cáo:</label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value as ReportType)}
                            className="px-4 py-2.5 border-2 border-gray-300 rounded-xl bg-white text-sm font-medium text-gray-700 focus:ring-[#253D90] focus:border-[#253D90]"
                        >
                            <option value="sales">Báo cáo Doanh thu</option>
                            <option value="profit">Báo cáo Lợi nhuận</option>
                            <option value="inventory">Báo cáo Tồn kho</option>
                        </select>
                    </div>

                    <div className="h-8 w-px bg-gray-300"></div>

                    {reportType !== "inventory" && (
                        <>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-semibold text-gray-700">Từ ngày:</label>
                                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="px-3 py-2 border-2 border-gray-300 rounded-xl text-sm" />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-semibold text-gray-700">Đến ngày:</label>
                                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="px-3 py-2 border-2 border-gray-300 rounded-xl text-sm" />
                            </div>
                        </>
                    )}

                    {reportType === "inventory" && (
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                <Warehouse size={16} /> Kho hàng:
                            </label>
                            <select
                                value={selectedWarehouse}
                                onChange={(e) => setSelectedWarehouse(e.target.value)}
                                className="px-4 py-2.5 border-2 border-gray-300 rounded-xl text-sm"
                            >
                                {warehouses.map(w => (
                                    <option key={w.maKho} value={w.maKho}>{w.maKhoCode} - {w.tenKho}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* --- REVENUE REPORT --- */}
            {reportType === "sales" && (
                <div className="space-y-6">
                    {/* 1. OVERVIEW & CHART SECTION */}
                    {loading ? (
                        <OverviewLoading
                            summaryCards={[
                                { label: "TỔNG DOANH THU", color: "blue", maxNumber: 85600000 },
                                { label: "SỐ ĐƠN HÀNG", color: "green", maxNumber: 285 },
                                { label: "TỔNG SẢN PHẨM", color: "purple", maxNumber: 112 }
                            ]}
                            chartBars={[20, 35, 55, 30, 45, 65, 50, 75, 60, 85, 70, 90]} />
                    ) : revAnalytics ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
                                    <div className="flex justify-between mb-2"><span className="text-blue-100 font-semibold">TỔNG DOANH THU</span><DollarSign className="text-blue-200" /></div>
                                    <div className="text-4xl font-bold">{formatCurrency(revAnalytics.tongQuan.tongDoanhThu)}</div>
                                </div>
                                <div className="bg-linear-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
                                    <div className="flex justify-between mb-2"><span className="text-green-100 font-semibold">SỐ ĐƠN HÀNG</span><TrendingUp className="text-green-200" /></div>
                                    <div className="text-4xl font-bold">{revAnalytics.tongQuan.tongDonHangCount}</div>
                                </div>
                                <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                                    <div className="flex justify-between mb-2"><span className="text-purple-100 font-semibold">TỔNG SẢN PHẨM</span><Package className="text-purple-200" /></div>
                                    <div className="text-4xl font-bold">{formatNumber(revAnalytics.tongQuan.tongSanPhamCount)}</div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><TrendingUp className="text-[#253D90]" /> Xu Hướng Doanh Thu</h3>
                                <ResponsiveContainer width="100%" height={350}>
                                    <LineChart data={revAnalytics.xuHuongChart}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="ngay" tickFormatter={formatDate} />
                                        <YAxis />
                                        <Tooltip
                                            formatter={tooltipFormatter}
                                            labelFormatter={formatDate}
                                        />
                                        <Legend />
                                        <Line type="monotone" dataKey="doanhThu" stroke="#253D90" strokeWidth={3} dot={{ r: 4 }} name="Doanh thu" />
                                        <Line type="monotone" dataKey="donHangCount" stroke="#10B981" strokeWidth={2} name="Số đơn" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </>
                    ) : null}

                    {/* 2. TABLE SECTION */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="flex justify-between p-6 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-900">Chi Tiết Doanh Thu</h2>
                            <ExportButton
                                exportToCSV={exportToCSV}
                                data={prepareRevenueData(revOrders?.data ?? [])} // the data to export
                                filename={`Doanh_thu_${new Date().toISOString().split('T')[0]}.csv`} // file name
                                loading={tableLoading} // shows spinner while table loading
                                disabled={!revOrders?.data?.length} // Disable if no data
                            />
                        </div>
                        <div className="overflow-x-auto relative">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-bold text-gray-700">Ngày</th>
                                        <th className="px-6 py-4 text-left font-bold text-gray-700">Mã Phiếu</th>
                                        <th className="px-6 py-4 text-left font-bold text-gray-700">Sản Phẩm</th>
                                        <th className="px-6 py-4 text-left font-bold text-gray-700">Khách Hàng</th>
                                        <th className="px-6 py-4 text-right font-bold text-gray-700">Số Lượng</th>
                                        <th className="px-6 py-4 text-right font-bold text-gray-700">Thành Tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {tableLoading ? (
                                        <TableBodyLoading columns={6} />
                                    ) : revOrders?.data && revOrders.data.length > 0 ? (
                                        revOrders?.data.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-blue-50">
                                                <td className="px-6 py-4">{formatDate(row.ngay)}</td>
                                                <td className="px-6 py-4 font-semibold text-[#253D90]">{row.maPhieuBanCode}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium">{row.tenSanPham}</div>
                                                    <div className="text-xs text-gray-500">{row.maSPCode}</div>
                                                </td>
                                                <td className="px-6 py-4">{row.tenKhachHang}</td>
                                                <td className="px-6 py-4 text-right">{formatNumber(row.soLuong)}</td>
                                                <td className="px-6 py-4 text-right font-bold text-[#253D90]">
                                                    {formatCurrency(row.thanhTien)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="text-center py-6 text-gray-500">
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <PaginationControls meta={revOrders?.meta} />
                    </div>
                </div>
            )}


            {/* --- PROFIT REPORT --- */}
            {reportType === "profit" && (
                <div className="space-y-6">
                    {/* 1. OVERVIEW & CHART SECTION */}
                    {loading ? (<OverviewLoading
                        summaryCards={[
                            { label: "DOANH THU", color: "indigo", maxNumber: 85600000 },
                            { label: "CHI PHÍ", color: "orange", maxNumber: 6700000 },
                            { label: "LỢI NHUẬN", color: "emerald", maxNumber: 112000 },
                            { label: "TỶ SUẤT", color: "pink", maxNumber: 50 }
                        ]}
                        chartBars={[20, 35, 55, 30, 45, 65, 50, 75, 60, 85, 70, 90]} />) :
                        profAnalytics ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="bg-linear-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
                                        <div className="text-indigo-100 text-sm font-semibold mb-2">DOANH THU</div>
                                        <div className="text-4xl font-bold">{formatCurrency(profAnalytics.tongQuan.doanhThu)}</div>
                                    </div>
                                    <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
                                        <div className="text-orange-100 text-sm font-semibold mb-2">CHI PHÍ</div>
                                        <div className="text-4xl font-bold">{formatCurrency(profAnalytics.tongQuan.chiPhi)}</div>
                                    </div>
                                    <div className="bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                                        <div className="text-emerald-100 text-sm font-semibold mb-2">LỢI NHUẬN</div>
                                        <div className="text-4xl font-bold">{formatCurrency(profAnalytics.tongQuan.loiNhuan)}</div>
                                    </div>
                                    <div className="bg-linear-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
                                        <div className="text-pink-100 text-sm font-semibold mb-2">TỶ SUẤT</div>
                                        <div className="text-4xl font-bold">{profAnalytics.tongQuan.tiSuat.toFixed(2)}%</div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><BarChart3 className="text-[#253D90]" /> Top Sản Phẩm Lợi Nhuận</h3>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart data={profAnalytics.topSanPhamChart}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="tenSanPham" angle={-45} textAnchor="end" height={100} style={{ fontSize: '11px' }} />
                                            <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                                            <Tooltip formatter={(value: any) => formatCurrency(value)} />
                                            <Legend />
                                            <Bar dataKey="doanhThu" fill="#6366F1" name="Doanh thu" />
                                            <Bar dataKey="chiPhi" fill="#F97316" name="Chi phí" />
                                            <Bar dataKey="loiNhuan" fill="#10B981" name="Lợi nhuận" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </>
                        ) : null}
                    {/* 2. TABLE SECTION */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="flex justify-between p-6 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-900">Chi Tiết Lợi Nhuận</h2>
                            <ExportButton
                                exportToCSV={exportToCSV}
                                data={prepareProfitData(profProducts?.data ?? [])} // the data to export
                                filename={`Loi_nhuan_${new Date().toISOString().split('T')[0]}.csv`} // file name
                                loading={tableLoading} // shows spinner while table loading
                                disabled={!profProducts?.data?.length} // Disable if no data
                            />
                        </div>
                        <div className="overflow-x-auto relative">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-bold text-gray-700">Sản Phẩm</th>
                                        <th className="px-6 py-4 text-right font-bold text-gray-700">SL Bán</th>
                                        <th className="px-6 py-4 text-right font-bold text-gray-700">Doanh Thu</th>
                                        <th className="px-6 py-4 text-right font-bold text-gray-700">Chi Phí</th>
                                        <th className="px-6 py-4 text-right font-bold text-gray-700">Lợi Nhuận</th>
                                        <th className="px-6 py-4 text-right font-bold text-gray-700">Tỉ Suất</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {tableLoading ? (
                                        <TableBodyLoading columns={6} />
                                    ) : profProducts?.data && profProducts?.data.length > 0 ? (profProducts?.data.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-emerald-50">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold">{row.tenSanPham}</div>
                                                <div className="text-xs text-gray-500">{row.maSPCode}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right">{formatNumber(row.soLuongBan)}</td>
                                            <td className="px-6 py-4 text-right text-indigo-600">{formatCurrency(row.doanhThu)}</td>
                                            <td className="px-6 py-4 text-right text-orange-600">{formatCurrency(row.chiPhi)}</td>
                                            <td className="px-6 py-4 text-right text-emerald-600 font-bold">{formatCurrency(row.loiNhuan)}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-bold">{row.tiSuat.toFixed(2)}%</span>
                                            </td>
                                        </tr>
                                    )))
                                        : (
                                            <tr>
                                                <td colSpan={6} className="text-center py-6 text-gray-500">
                                                    Không có dữ liệu
                                                </td>
                                            </tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                        <PaginationControls meta={profProducts?.meta} />
                    </div>
                </div>
            )}

            {/* --- INVENTORY REPORT --- */}
            {reportType === "inventory" && (
                <div className="space-y-6">
                    {/* 1. OVERVIEW & CHART SECTION */}
                    {loading ? (<OverviewLoading
                        summaryCards={[
                            { label: "TỔNG SẢN PHẨM", color: "blue", maxNumber: 100 },
                            { label: "TỔNG SỐ LƯỢNG", color: "green", maxNumber: 989 },
                            { label: "SẮP HẾT HẠN", color: "orange", maxNumber: 90 },
                        ]}
                        showPieChart={true}
                    />) : invAnalytics ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
                                    <div className="flex justify-between mb-3"><span className="text-blue-100 font-semibold">TỔNG SẢN PHẨM</span><Package className="text-blue-200" /></div>
                                    <div className="text-4xl font-bold">{invAnalytics.tongQuan.tongSanPhamCount}</div>
                                </div>
                                <div className="bg-linear-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
                                    <div className="flex justify-between mb-3"><span className="text-green-100 font-semibold">TỔNG SỐ LƯỢNG</span><TrendingUp className="text-green-200" /></div>
                                    <div className="text-4xl font-bold">{formatNumber(invAnalytics.tongQuan.tongSoLuong)}</div>
                                </div>
                                <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
                                    <div className="flex justify-between mb-3"><span className="text-orange-100 font-semibold">SẮP HẾT HẠN</span><AlertTriangle className="text-orange-200" /></div>
                                    <div className="text-4xl font-bold">{invAnalytics.tongQuan.soLuongSapHetHan}</div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Package className="text-[#253D90]" /> Phân Bổ Tồn Kho</h3>
                                <ResponsiveContainer width="100%" height={400}>
                                    <PieChart>
                                        <Pie
                                            data={invAnalytics.soLuongChart}
                                            dataKey="soLuong"
                                            nameKey="tenSanPham"
                                            cx="50%" cy="50%"
                                            outerRadius={140}
                                            label={({ percent }) => `${(percent ? percent * 100 : 0).toFixed(0)}%`}
                                        >
                                            {invAnalytics.soLuongChart.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value?: number) =>
                                            value != null ? value.toLocaleString("vi-VN") : "-"
                                        } />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </>
                    ) : null}
                    {/* 2. TABLE SECTION*/}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="flex justify-between p-6 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-900">Chi Tiết Tồn Kho</h2>
                            <ExportButton
                                exportToCSV={exportToCSV}
                                data={prepareInventoryData(invItems?.data ?? [])} // the data to export
                                filename={`Ton_kho_${new Date().toISOString().split('T')[0]}.csv`} // file name
                                loading={tableLoading} // shows spinner while table loading
                                disabled={!invItems?.data?.length} // Disable if no data
                            />
                        </div>
                        <div className="overflow-x-auto relative">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-bold text-gray-700">Mã SP</th>
                                        <th className="px-6 py-4 text-left font-bold text-gray-700">Tên Sản Phẩm</th>
                                        <th className="px-6 py-4 text-left font-bold text-gray-700">Mã Lô</th>
                                        <th className="px-6 py-4 text-right font-bold text-gray-700">Số Lượng</th>
                                        <th className="px-6 py-4 text-center font-bold text-gray-700">Đơn Vị</th>
                                        <th className="px-6 py-4 text-center font-bold text-gray-700">Hạn SD</th>
                                        <th className="px-6 py-4 text-center font-bold text-gray-700">Trạng Thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {tableLoading ? (
                                        <TableBodyLoading columns={7} />
                                    ) : invItems?.data && invItems?.data.length > 0 ? (invItems?.data.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-blue-50">
                                            <td className="px-6 py-4 font-semibold text-[#253D90]">{row.maSPCode}</td>
                                            <td className="px-6 py-4 font-medium">{row.tenSanPham}</td>
                                            <td className="px-6 py-4 font-mono text-gray-600">{row.maLoCode}</td>
                                            <td className="px-6 py-4 text-right font-bold">{formatNumber(row.soLuong)}</td>
                                            <td className="px-6 py-4 text-center">{row.donVi}</td>
                                            <td className="px-6 py-4 text-center">{formatDate(row.ngayHetHan)}</td>
                                            <td className="px-6 py-4 text-center">
                                                {row.trangThai === 'CON_HAN' && <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">Còn hạn ({row.soNgayDenKhiHetHan} ngày)</span>}
                                                {row.trangThai === 'SAP_HET_HAN' && <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold">⚠️ Sắp hết ({row.soNgayDenKhiHetHan} ngày)</span>}
                                                {row.trangThai === 'HET_HAN' && <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold">❌ Hết hạn</span>}
                                            </td>
                                        </tr>
                                    ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="text-center py-6 text-gray-500">
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <PaginationControls meta={invItems?.meta} />
                    </div>
                </div>
            )
            }
        </div >
    );
}