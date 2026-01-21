"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
    ShoppingBag, TrendingDown, TrendingUp, Package, ShoppingCart,
    ChevronRight, BarChart3, Loader2, Calendar, ArrowRight, Layers
} from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, Variants } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { dashboardService, DashboardSummary, ExpiringProduct } from '@/services/dashboard.service';

// --- Utility: Merge Class ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- Component: Animated Number ---
const AnimatedNumber = ({ value, formatter }: { value: number, formatter?: (v: number) => string }) => {
    return (
        <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="inline-block"
        >
            {formatter ? formatter(value) : value}
        </motion.span>
    );
};

// --- NEW COMPONENT: 3D Tilt Card Wrapper ---
// Component này tạo hiệu ứng nghiêng 3D khi di chuột
const ThreeDTiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);

    // Motion values để theo dõi vị trí chuột
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Cấu hình physics cho chuyển động mượt mà
    const springConfig = { damping: 25, stiffness: 150, mass: 1 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    // Chuyển đổi vị trí chuột thành góc xoay (rotateX, rotateY)
    // Di chuyển chuột ít nhưng tạo góc nghiêng vừa đủ (khoảng 12 độ)
    const rotateX = useTransform(ySpring, [-0.5, 0.5], ["12deg", "-12deg"]);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        // Tính toán vị trí chuột tương đối so với tâm thẻ (-0.5 đến 0.5)
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        // Reset về vị trí cân bằng khi chuột rời đi
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d", // Quan trọng: giữ không gian 3D cho children
            }}
            className={cn("relative transition-all duration-200 ease-out perspective-1000", className)}
        >
            {/* Hiệu ứng phản chiếu ánh sáng (Glare effect) di chuyển ngược chiều chuột */}
            <motion.div
                style={{
                    transform: useTransform(xSpring, [-0.5, 0.5], ["translateX(20%)", "translateX(-20%)"]),
                    opacity: useTransform(xSpring, [-0.5, 0, 0.5], [0.3, 0, 0.3])
                }}
                className="absolute inset-0 w-full h-full bg-gradient-to-tr from-white/40 to-transparent pointer-events-none rounded-2xl z-50 mix-blend-overlay"
            />
            {children}
        </motion.div>
    );
};


export default function DashboardPage() {
    // --- State (Giữ nguyên) ---
    const [isLoading, setIsLoading] = useState(true);
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [revenueData, setRevenueData] = useState<number[]>([]);
    const [expiringProducts, setExpiringProducts] = useState<ExpiringProduct[]>([]);
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);

    // --- Animation Variants (Cập nhật nhẹ) ---
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 40, opacity: 0, scale: 0.95 },
        visible: {
            y: 0, opacity: 1, scale: 1,
            transition: { type: "spring", stiffness: 90, damping: 15 }
        }
    };

    // --- Fetch Data & Helpers (Giữ nguyên) ---
    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                const [summaryRes, expiringRes] = await Promise.all([
                    dashboardService.getSummary(),
                    dashboardService.getExpiringProducts(5, 60)
                ]);
                setSummary(summaryRes);
                setExpiringProducts(expiringRes);
                await fetchRevenue(selectedYear);
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const fetchRevenue = async (year: number) => {
        try {
            const res = await dashboardService.getRevenue(year);
            setRevenueData(res.data || new Array(12).fill(0));
        } catch (error) { setRevenueData(new Array(12).fill(0)); }
    };
    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const year = Number(e.target.value);
        setSelectedYear(year);
        fetchRevenue(year);
    };
    const formatMoney = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount);
    const maxRevenue = useMemo(() => Math.max(...revenueData, 1), [revenueData]);
    const renderTrend = (percent: number, isIncrease: boolean) => {
        const isPositive = isIncrease;
        return (
            <div className={cn(
                "flex items-center text-xs font-bold px-3 py-1.5 rounded-full border backdrop-blur-md shadow-sm",
                isPositive
                    ? "text-emerald-600 bg-emerald-50/80 border-emerald-100/50"
                    : "text-rose-500 bg-rose-50/80 border-rose-100/50"
            )}
                // Tạo hiệu ứng nổi nhẹ cho badge
                style={{ transform: "translateZ(30px)" }}
            >
                {isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                {percent.toFixed(1)}%
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 gap-4">
                <Loader2 className="animate-spin text-blue-600 animate-bounce" size={50} />
                {/* Hiệu ứng bóng loading 3D */}
                <div className="w-12 h-2 bg-slate-300 rounded-full animate-pulse blur-sm"></div>
            </div>
        );
    }

    return (
        <motion.div
            // Nền tổng thể với gradient nhẹ và họa tiết trừu tượng mờ
            className="p-6 p-6 bg-[#eef2f6] min-h-screen relative space-y-8 overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ perspective: "2000px" }} // Thêm perspective cho container cha
        >
            {/* Background Abstract Shapes (Trang trí nền) */}
            <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-multiply"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-200/30 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-multiply"></div>


            {/* --- HEADER --- */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-center gap-4 z-10 relative">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3 tracking-tight drop-shadow-sm">
                        <Layers size={28} className="text-blue-600" /> Dashboard
                    </h1>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Tổng quan không gian kinh doanh đa chiều.</p>
                </div>

                {/* Buttons 3D */}
                <div className="flex gap-4">
                    <Link href="/ban-hang" className="group relative px-6 py-3 bg-white text-slate-700 rounded-2xl font-bold transition-all shadow-[0_4px_0_0_#e2e8f0] hover:shadow-[0_2px_0_0_#e2e8f0] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] border-2 border-slate-100 flex items-center gap-2 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50 opacity-50"></div>
                        <ShoppingBag size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors relative z-10" />
                        <span className="relative z-10">Bán hàng</span>
                    </Link>
                    <Link href="/nhap-hang" className="group relative px-6 py-3 bg-gradient-to-b from-blue-500 to-blue-600 text-white rounded-2xl font-bold transition-all shadow-[0_4px_0_0_#1e40af] hover:shadow-[0_2px_0_0_#1e40af] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] flex items-center gap-2 overflow-hidden">
                        {/* Hiệu ứng ánh sáng lướt qua nút */}
                        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-in-out z-20"></div>
                        <ShoppingCart size={18} className="relative z-10" />
                        <span className="relative z-10">Nhập hàng</span>
                    </Link>
                </div>
            </motion.div>

            {/* --- 3D STATS CARDS SECTION --- */}
            {/* Sử dụng perspective lớn ở đây để các thẻ nghiêng độc lập ẹp hơn */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ perspective: "1500px" }}>
                {/* Card 1: Doanh thu */}
                <motion.div variants={itemVariants} className="h-full">
                    <ThreeDTiltCard className="h-full bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.5)_inset] border-b-4 border-blue-100 group">
                        {/* Icon nền 3D nổi lên */}
                        <div className="absolute top-4 right-4 p-4 text-blue-200/30 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12" style={{ transform: "translateZ(40px)" }}>
                            <BarChart3 size={110} />
                        </div>

                        <div className="relative z-20 flex flex-col h-full justify-between" style={{ transform: "translateZ(50px)" }}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl text-blue-600 shadow-inner">
                                        <BarChart3 size={24} />
                                    </div>
                                    <span className="text-slate-600 font-bold text-base">Doanh thu hôm nay</span>
                                </div>
                                {summary && renderTrend(summary.todayRevenue.trendPercent, summary.todayRevenue.isIncrease)}
                            </div>
                            <div className="flex items-baseline gap-2 mt-4">
                                <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight drop-shadow-sm bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-blue-900">
                                    {summary ? <AnimatedNumber value={summary.todayRevenue.revenue} formatter={formatMoney} /> : 0}
                                </h3>
                                <span className="text-sm text-slate-500 font-bold">VNĐ</span>
                            </div>
                        </div>
                    </ThreeDTiltCard>
                </motion.div>

                {/* Card 2: Đơn hàng */}
                <motion.div variants={itemVariants} className="h-full">
                    <ThreeDTiltCard className="h-full bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.5)_inset] border-b-4 border-purple-100 group">
                        <div className="absolute top-4 right-4 p-4 text-purple-200/30 transition-all duration-500 transform group-hover:scale-110 group-hover:-rotate-12" style={{ transform: "translateZ(40px)" }}>
                            <ShoppingCart size={110} />
                        </div>
                        <div className="relative z-20 flex flex-col h-full justify-between" style={{ transform: "translateZ(50px)" }}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl text-purple-600 shadow-inner">
                                        <ShoppingCart size={24} />
                                    </div>
                                    <span className="text-slate-600 font-bold text-base">Đơn hàng hôm nay</span>
                                </div>
                                {summary && renderTrend(summary.todayOrders.trendPercent, summary.todayOrders.isIncrease)}
                            </div>
                            <div className="flex items-baseline gap-2 mt-4">
                                <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight drop-shadow-sm bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-purple-900">
                                    {summary ? <AnimatedNumber value={summary.todayOrders.orderCount} /> : 0}
                                </h3>
                                <span className="text-sm text-slate-500 font-bold">Đơn</span>
                            </div>
                        </div>
                    </ThreeDTiltCard>
                </motion.div>

                {/* Card 3: Tồn kho */}
                <motion.div variants={itemVariants} className="h-full">
                    <ThreeDTiltCard className="h-full bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.5)_inset] border-b-4 border-orange-100 group">
                        <div className="absolute top-4 right-4 p-4 text-orange-200/30 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-6" style={{ transform: "translateZ(40px)" }}>
                            <Package size={110} />
                        </div>
                        <div className="relative z-20 flex flex-col h-full justify-between" style={{ transform: "translateZ(50px)" }}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl text-orange-600 shadow-inner">
                                        <Package size={24} />
                                    </div>
                                    <span className="text-slate-600 font-bold text-base">Tổng tồn kho</span>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 mt-4">
                                <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight drop-shadow-sm bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-orange-900">
                                    {summary ? <AnimatedNumber value={summary.totalInventory.totalQuantity} formatter={(v) => v.toLocaleString()} /> : 0}
                                </h3>
                                <span className="text-sm text-slate-500 font-bold">Sản phẩm</span>
                            </div>
                        </div>
                    </ThreeDTiltCard>
                </motion.div>
            </div>

            {/* --- BOTTOM SECTION (Glassmorphism Containers) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: Revenue Chart */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/70 backdrop-blur-lg p-8 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-white/40 relative z-10">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="font-extrabold text-slate-800 text-xl flex items-center gap-2">
                                Biểu đồ doanh thu
                            </h3>
                            <p className="text-sm text-slate-500 mt-1 font-medium">Thống kê theo tháng trong năm {selectedYear}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 p-1.5 rounded-xl border border-slate-200/80 shadow-sm backdrop-blur-md">
                            <Calendar size={16} className="text-slate-500 ml-2" />
                            <select
                                className="text-sm bg-transparent border-none outline-none text-slate-700 font-bold py-1 pr-3 cursor-pointer focus:ring-0"
                                value={selectedYear}
                                onChange={handleYearChange}
                            >
                                <option value={currentYear}>{currentYear}</option>
                                <option value={currentYear - 1}>{currentYear - 1}</option>
                                <option value={currentYear - 2}>{currentYear - 2}</option>
                            </select>
                        </div>
                    </div>

                    {/* 3D-look Chart */}
                    <div className="h-72 flex items-end justify-between gap-4 relative pl-2">
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pl-8">
                            {[0, 1, 2, 3].map((_, i) => (
                                <div key={i} className="w-full h-px bg-slate-200/60 border-t border-dashed border-slate-300/50 last:border-slate-300/80"></div>
                            ))}
                        </div>

                        {revenueData.map((val, index) => {
                            const heightPercent = maxRevenue > 0 ? (val / maxRevenue) * 100 : 0;
                            const isCurrentMonth = index === new Date().getMonth() && selectedYear === currentYear;

                            return (
                                <div key={index} className="flex flex-col items-center flex-1 group relative h-full justify-end z-20 perspective-500">
                                    {/* Tooltip Floating */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-[100%] mb-4 left-1/2 -translate-x-1/2 pointer-events-none z-30 transform group-hover:translate-y-[-10px]">
                                        <div className="bg-slate-800/90 backdrop-blur-md text-white text-xs font-bold py-2 px-4 rounded-xl shadow-xl whitespace-nowrap relative">
                                            {formatMoney(val)}
                                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800/90 rotate-45"></div>
                                        </div>
                                    </div>

                                    {/* 3D Bar */}
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: `${Math.max(heightPercent, 3)}%`, opacity: 1 }}
                                        transition={{ duration: 0.8, delay: index * 0.05, type: "spring", bounce: 0.3 }}
                                        className={cn(
                                            "w-full max-w-[48px] rounded-t-xl relative overflow-visible transform-gpu transition-all duration-300 group-hover:scale-105",
                                            isCurrentMonth
                                                // Tháng hiện tại: Gradient mạnh + Shadow phát sáng
                                                ? "bg-gradient-to-t from-blue-700 via-blue-500 to-blue-400 shadow-[0_10px_25px_-5px_rgba(59,130,246,0.6)] z-10"
                                                // Các tháng khác: Gradient nhẹ hơn + Shadow thường
                                                : "bg-gradient-to-t from-slate-300 via-slate-200 to-slate-100 hover:from-blue-400 hover:via-blue-300 hover:to-blue-200 shadow-[0_5px_15px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_20px_-5px_rgba(59,130,246,0.4)]"
                                        )}
                                    >
                                        {/* Tạo khối 3D giả (Faux 3D effect) bằng inner shadow và gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent rounded-t-xl pointer-events-none"></div>
                                        <div className="absolute top-0 inset-x-0 h-[4px] bg-white/40 rounded-t-xl pointer-events-none"></div>
                                    </motion.div>

                                    <span className={cn(
                                        "text-[11px] mt-4 font-bold transition-colors",
                                        isCurrentMonth ? "text-blue-700" : "text-slate-400 group-hover:text-blue-500"
                                    )}>
                                        T{index + 1}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* RIGHT: Expiring Products (Stacked Cards Effect) */}
                <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-lg p-8 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-white/40 flex flex-col h-full relative z-10">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-extrabold text-slate-800 text-xl flex items-center gap-3">
                            Sắp hết hạn
                            <span className="flex h-3 w-3 relative shadow-sm">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-br from-red-500 to-red-600 border-[1.5px] border-white"></span>
                            </span>
                        </h3>
                        <Link href="/ton-kho" className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 backdrop-blur-md px-4 py-2 rounded-full transition-all shadow-sm hover:shadow flex items-center gap-1">
                            Xem tất cả <ChevronRight size={14} />
                        </Link>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4 custom-scrollbar relative" style={{ perspective: "1000px" }}>
                        {expiringProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-56 text-slate-400 gap-3 border-3 border-dashed border-slate-200/80 rounded-3xl bg-slate-50/30 backdrop-blur-sm">
                                <Package size={40} className="opacity-30 drop-shadow-sm" />
                                <p className="text-sm font-medium">An toàn! Không có sản phẩm báo động.</p>
                            </div>
                        ) : (
                            expiringProducts.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 30, rotateY: -15 }}
                                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                                    // Hiệu ứng stack: các thẻ sau đè lên thẻ trước một chút
                                    style={{ zIndex: expiringProducts.length - index, marginTop: index > 0 ? '-10px' : '0' }}
                                    whileHover={{
                                        scale: 1.03,
                                        zIndex: 100,
                                        translateZ: "20px", // Nổi lên khi hover
                                        boxShadow: "0 15px 30px -10px rgba(0,0,0,0.15)"
                                    }}
                                    transition={{ delay: 0.3 + (index * 0.1), type: "spring", stiffness: 120 }}
                                    className="group relative p-4 rounded-2xl border border-white/60 bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur-md shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05),0_1px_0_0_rgba(255,255,255,0.8)_inset] transition-all duration-300 transform-gpu"
                                >
                                    <div className="flex justify-between items-start mb-3 relative z-10">
                                        <div className="min-w-0 pr-3">
                                            <p className="font-bold text-sm text-slate-800 truncate group-hover:text-red-600 transition-colors drop-shadow-sm" title={item.tenSanPham}>
                                                {item.tenSanPham}
                                            </p>
                                            <p className="text-xs font-medium text-slate-500 mt-1">{item.loaiSanPham}</p>
                                        </div>
                                        <span className={cn(
                                            "text-[10px] font-extrabold px-2.5 py-1 rounded-lg shrink-0 border shadow-sm backdrop-blur-md",
                                            item.soNgayConLai <= 30
                                                ? "bg-red-50/80 text-red-600 border-red-100/50"
                                                : "bg-orange-50/80 text-orange-600 border-orange-100/50"
                                        )}>
                                            {item.soNgayConLai} ngày
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-slate-500 relative z-10">
                                        <span className="font-medium">Tồn: <span className="font-bold text-slate-700">{item.soLuongTon}</span></span>
                                        <div className="flex-1 h-2 bg-slate-200/70 rounded-full overflow-hidden shadow-inner relative">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(item.soLuongTon, 100)}%` }}
                                                transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                                                className={cn(
                                                    "h-full rounded-full relative",
                                                    item.soLuongTon < 10 ? "bg-gradient-to-r from-red-500 to-red-400" : "bg-gradient-to-r from-slate-500 to-slate-400"
                                                )}
                                            >
                                                {/* Hiệu ứng bóng sáng trên thanh progress */}
                                                <div className="absolute top-0 inset-x-0 h-[1px] bg-white/50 opacity-70"></div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {expiringProducts.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-slate-100/50 text-center relative z-10">
                            <Link href="/nhap-hang" className="group inline-flex items-center text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors gap-1 py-2 px-4 rounded-full hover:bg-blue-50/50">
                                Tạo phiếu nhập hàng <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}