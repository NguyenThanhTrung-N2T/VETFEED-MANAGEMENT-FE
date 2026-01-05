"use client";
import React from 'react';
import Link from 'next/link';
import {
    ShoppingBag,
    TrendingDown,
    TrendingUp,
    Package,
    ShoppingCart,
    ChevronRight,
    BarChart3
} from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="p-6 bg-[#eef2f6] min-h-screen font-sans space-y-6">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <div className="p-2 bg-slate-800 rounded-lg text-white">
                        <BarChart3 size={24} />
                    </div>
                    Dashboard
                </h1>
                <div className="flex gap-3">
                    <Link href="/ban-hang" className="flex items-center gap-2 px-6 py-2.5 bg-[#25396f] hover:bg-[#1e2e5a] text-white rounded-lg font-medium transition-all shadow-md">
                        <ShoppingBag size={18} />
                        Bán hàng
                    </Link>
                    <Link href="/nhap-hang" className="flex items-center gap-2 px-6 py-2.5 bg-[#25396f] hover:bg-[#1e2e5a] text-white rounded-lg font-medium transition-all shadow-md">
                        <ShoppingCart size={18} />
                        Nhập hàng
                    </Link>
                </div>
            </div>

            {/* --- BANNER --- */}
            <div className="w-full h-64 rounded-2xl overflow-hidden shadow-sm relative group">
                <img
                    src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=2074&auto=format&fit=crop"
                    alt="Farm Banner"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                    <div>
                        <h2 className="text-white text-3xl font-bold mb-2">Xin chào!</h2>
                        <p className="text-slate-200">Chúc bạn một ngày kinh doanh hiệu quả.</p>
                    </div>
                </div>
            </div>

            {/* --- STATS CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Card 1: Doanh thu */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                            <BarChart3 size={16} className="text-blue-500" />
                            Doanh thu hôm nay
                        </div>
                        <span className="flex items-center text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded-full">
                            <TrendingDown size={14} className="mr-1" /> 25%
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800 mb-2">1.200.000 <span className="text-base text-slate-400 font-normal">VNĐ</span></h3>
                    {/* Mini Chart Line */}
                    <svg className="w-full h-10 text-blue-100 fill-current" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path d="M0 20 L0 10 Q10 5 20 12 T40 10 T60 15 T80 5 L100 12 L100 20 Z" />
                        <path d="M0 10 Q10 5 20 12 T40 10 T60 15 T80 5 L100 12" fill="none" stroke="#3b82f6" strokeWidth="2" />
                    </svg>
                </div>

                {/* Card 2: Số đơn hàng */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                            <ShoppingCart size={16} className="text-purple-500" />
                            Số đơn hàng hôm nay
                        </div>
                        <span className="flex items-center text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                            <TrendingUp size={14} className="mr-1" /> 25%
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800 mb-2">36 <span className="text-base text-slate-400 font-normal">Đơn hàng</span></h3>
                    {/* Mini Chart Line */}
                    <svg className="w-full h-10 text-purple-100 fill-current" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path d="M0 20 L0 15 Q20 18 40 10 T80 8 L100 5 L100 20 Z" />
                        <path d="M0 15 Q20 18 40 10 T80 8 L100 5" fill="none" stroke="#8b5cf6" strokeWidth="2" />
                    </svg>
                </div>

                {/* Card 3: Tồn kho */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                            <Package size={16} className="text-orange-500" />
                            Tồn kho
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800 mb-2">3600 <span className="text-base text-slate-400 font-normal">Sản phẩm</span></h3>
                    <svg className="w-full h-10 text-orange-100 fill-current" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path d="M0 20 L0 12 C20 12 40 5 60 15 S 80 18 100 10 L100 20 Z" />
                        <path d="M0 12 C20 12 40 5 60 15 S 80 18 100 10" fill="none" stroke="#f97316" strokeWidth="2" />
                    </svg>
                </div>
            </div>

            {/* --- BOTTOM SECTION (Chart & List) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT: Bar Chart (Chiếm 2/3) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-700 flex items-center gap-2">
                            <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                            Doanh thu tổng quan
                        </h3>
                        <select className="text-xs border border-gray-200 rounded-md px-2 py-1 outline-none text-slate-500">
                            <option>2024</option>
                            <option>2023</option>
                        </select>
                    </div>

                    {/* CSS Bar Chart */}
                    <div className="h-64 flex items-end justify-between gap-2 md:gap-4 pt-4 border-b border-gray-100 pb-2">
                        {[45, 60, 30, 20, 45, 70, 45, 80, 25, 95, 55, 10].map((height, index) => (
                            <div key={index} className="flex flex-col items-center flex-1 group">
                                {/* Tooltip ảo */}
                                <div className="opacity-0 group-hover:opacity-100 mb-2 text-xs bg-slate-800 text-white px-2 py-1 rounded transition-opacity absolute transform -translate-y-8">
                                    {height}tr
                                </div>
                                <div
                                    style={{ height: `${height}%` }}
                                    className={`w-full max-w-[30px] rounded-t-sm transition-all duration-500 hover:opacity-80
                                ${index === 9 ? 'bg-[#3b82f6]' : 'bg-[#60a5fa]'} 
                            `}
                                ></div>
                                <span className="text-[10px] text-slate-400 mt-2 font-medium">T{index + 1}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Đơn vị: Triệu VNĐ</p>
                </div>

                {/* RIGHT: Expiring Products List (Chiếm 1/3) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-700 flex items-center gap-2">
                            <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                            Sản phẩm sắp hết hạn
                        </h3>
                        <Link href="#" className="text-xs text-blue-500 hover:underline flex items-center">
                            Xem tất cả <ChevronRight size={12} />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {/* Item 1 */}
                        <div className="flex justify-between items-center p-3 rounded-xl border border-gray-50 hover:bg-slate-50 transition-colors">
                            <div>
                                <p className="font-bold text-sm text-slate-800">Cám gà NCVP</p>
                                <p className="text-xs text-slate-500 mt-0.5">100 ngày • Thức ăn chăn nuôi</p>
                            </div>
                            <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">2 ngày</span>
                        </div>

                        {/* Item 2 */}
                        <div className="flex justify-between items-center p-3 rounded-xl border border-gray-50 hover:bg-slate-50 transition-colors">
                            <div>
                                <p className="font-bold text-sm text-slate-800">Thóc cho gà NTT</p>
                                <p className="text-xs text-slate-500 mt-0.5">100 ngày • Thức ăn chăn nuôi</p>
                            </div>
                            <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">1 ngày</span>
                        </div>

                        {/* Item 3 */}
                        <div className="flex justify-between items-center p-3 rounded-xl border border-gray-50 hover:bg-slate-50 transition-colors">
                            <div>
                                <p className="font-bold text-sm text-slate-800">Vaccine DQT</p>
                                <p className="text-xs text-slate-500 mt-0.5">75 ngày • Thuốc thú y</p>
                            </div>
                            <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">3 ngày</span>
                        </div>

                        {/* Item 4 */}
                        <div className="flex justify-between items-center p-3 rounded-xl border border-gray-50 hover:bg-slate-50 transition-colors">
                            <div>
                                <p className="font-bold text-sm text-slate-800">Bioxide NTT</p>
                                <p className="text-xs text-slate-500 mt-0.5">120 ngày • Thuốc thú y</p>
                            </div>
                            <span className="bg-yellow-100 text-yellow-600 text-xs font-bold px-3 py-1 rounded-full">5 ngày</span>
                        </div>

                        {/* Item 5 */}
                        <div className="flex justify-between items-center p-3 rounded-xl border border-gray-50 hover:bg-slate-50 transition-colors">
                            <div>
                                <p className="font-bold text-sm text-slate-800">Flofen NCV</p>
                                <p className="text-xs text-slate-500 mt-0.5">120 ngày • Thuốc thú y</p>
                            </div>
                            <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">2 ngày</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}