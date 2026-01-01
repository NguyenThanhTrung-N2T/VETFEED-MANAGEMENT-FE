import React from 'react';
import {
    DollarSign, ShoppingBag, Users, AlertTriangle,
    ArrowUpRight, Package, TrendingUp
} from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="p-8 space-y-8 bg-[#eef2f6] min-h-full">

            {/* 1. Header & Welcome */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Tổng quan kinh doanh</h2>
                    <p className="text-slate-500">Cập nhật số liệu mới nhất ngày hôm nay.</p>
                </div>
                <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg shadow-sm">
                    Ngày: <span className="font-semibold text-slate-800">{new Date().toLocaleDateString('vi-VN')}</span>
                </div>
            </div>

            {/* 2. Stats Cards (Thẻ thống kê) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1: Doanh thu */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Doanh thu ngày</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">12.5tr ₫</h3>
                        </div>
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-emerald-600">
                        <ArrowUpRight size={16} className="mr-1" />
                        <span className="font-medium">+15%</span>
                        <span className="text-slate-400 ml-1">so với hôm qua</span>
                    </div>
                </div>

                {/* Card 2: Đơn hàng */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Đơn hàng mới</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">24</h3>
                        </div>
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <ShoppingBag size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-emerald-600">
                        <ArrowUpRight size={16} className="mr-1" />
                        <span className="font-medium">+4</span>
                        <span className="text-slate-400 ml-1">đơn chờ xử lý</span>
                    </div>
                </div>

                {/* Card 3: Khách hàng */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Khách hàng</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">1,203</h3>
                        </div>
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <Users size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-slate-500">
                        <span>Đã thêm </span>
                        <span className="font-medium text-slate-800 mx-1">5</span>
                        <span>khách mới</span>
                    </div>
                </div>

                {/* Card 4: Cảnh báo Tồn kho (Quan trọng cho cửa hàng thuốc) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-full w-1 bg-orange-500"></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Cảnh báo kho</p>
                            <h3 className="text-2xl font-bold text-orange-600 mt-1">08</h3>
                        </div>
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                            <AlertTriangle size={20} />
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-orange-600 font-medium">
                        Sản phẩm sắp hết hạn/hết hàng
                    </div>
                </div>
            </div>

            {/* 3. Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: Đơn hàng gần đây (Chiếm 2 phần) */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Đơn hàng vừa nhập</h3>
                        <button className="text-sm text-emerald-600 font-medium hover:underline">Xem tất cả</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                    <th className="pb-3 pl-2">Mã đơn</th>
                                    <th className="pb-3">Khách hàng</th>
                                    <th className="pb-3">Trạng thái</th>
                                    <th className="pb-3 text-right">Tổng tiền</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <tr key={item} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                                        <td className="py-4 pl-2 font-medium text-slate-700">#DH-00{item}</td>
                                        <td className="py-4 text-slate-600">Trại Heo Bình Minh</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${item === 1 ? 'bg-emerald-100 text-emerald-700' :
                                                    item === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}
                      `}>
                                                {item === 1 ? 'Hoàn thành' : item === 2 ? 'Đang giao' : 'Chờ xử lý'}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right font-medium text-slate-800">2.500.000₫</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* RIGHT: Cảnh báo nhanh (Chiếm 1 phần) */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Cần chú ý</h3>
                        <TrendingUp size={18} className="text-slate-400" />
                    </div>

                    <div className="space-y-4">
                        {/* Item 1 */}
                        <div className="flex gap-4 p-3 rounded-xl bg-red-50 border border-red-100">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-red-500 shadow-sm flex-shrink-0">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">Vaccine Dịch Tả</p>
                                <p className="text-xs text-red-600 font-medium">Hết hạn trong 5 ngày tới</p>
                            </div>
                        </div>

                        {/* Item 2 */}
                        <div className="flex gap-4 p-3 rounded-xl bg-orange-50 border border-orange-100">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-orange-500 shadow-sm flex-shrink-0">
                                <Package size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">Thức ăn CP 999</p>
                                <p className="text-xs text-orange-600 font-medium">Tồn kho thấp (Còn 2 bao)</p>
                            </div>
                        </div>

                        {/* Item 3 */}
                        <div className="flex gap-4 p-3 rounded-xl bg-blue-50 border border-blue-100">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-blue-500 shadow-sm flex-shrink-0">
                                <Users size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">Công nợ quá hạn</p>
                                <p className="text-xs text-blue-600 font-medium">Anh Ba (Trại Gà) - 15tr</p>
                            </div>
                        </div>
                    </div>

                    <button className="w-full mt-6 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 font-medium transition-colors">
                        Xem báo cáo chi tiết
                    </button>
                </div>

            </div>
        </div>
    );
}