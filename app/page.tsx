"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import { ArrowRight, ShieldCheck, Truck, Users, Activity } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#fdfbf7] overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 animate-in slide-in-from-left-10 duration-700 fade-in">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#25396f] text-sm font-semibold border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25396f]"></span>
              </span>
              Giải pháp quản lý số 1 Việt Nam
            </div>

            {/* Main Heading - Font Serif */}
            <h1 className="text-4xl lg:text-6xl font-bold text-[#1a237e] leading-tight font-extrabold">
              Quản lý phân phối <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#25396f] to-[#4c6ef5]">
                Thuốc Thú Y & Thức Ăn
              </span>
            </h1>

            <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
              VetFeed giúp bạn tối ưu hóa quy trình nhập hàng, quản lý kho, theo dõi công nợ và chăm sóc khách hàng chỉ trên một nền tảng duy nhất.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/register" className="flex items-center justify-center gap-2 px-8 py-4 bg-[#25396f] text-white rounded-full font-bold text-lg shadow-xl shadow-blue-900/20 hover:bg-[#1a2850] hover:shadow-blue-900/30 transition-all transform hover:-translate-y-1">
                Dùng ngay
                <ArrowRight size={20} />
              </Link>
              <Link href="san-pham" className="flex items-center justify-center px-8 py-4 bg-white text-[#25396f] border border-[#25396f]/20 rounded-full font-bold text-lg hover:bg-blue-50 transition-all">
                Xem sản phẩm
              </Link>
            </div>
          </div>

          {/* Hero Image / Illustration */}
          <div className="relative animate-in slide-in-from-right-10 duration-700 fade-in lg:block hidden">
            {/* Background Blob - Deep Blue */}
            <div className="absolute top-0 right-0 w-125 h-125 bg-[#1a237e]/10 rounded-full blur-3xl -z-10"></div>

            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4 mt-16">
                <div className="bg-white p-6 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 hover:scale-105 transition-transform">
                  <Activity className="text-[#d4af37] mb-3" size={32} />
                  <h3 className="font-bold text-[#1a237e] font-serif">Theo dõi kho</h3>
                  <p className="text-sm text-slate-500">Cảnh báo hạn sử dụng thuốc</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 hover:scale-105 transition-transform">
                  <Truck className="text-blue-500 mb-3" size={32} />
                  <h3 className="font-bold text-[#1a237e] font-serif">Vận chuyển</h3>
                  <p className="text-sm text-slate-500">Tối ưu lộ trình giao hàng</p>
                </div>
              </div>
              <div className="space-y-4">
                {/* Highlighted Card - Navy Blue */}
                <div className="bg-[#25396f] p-6 rounded-3xl shadow-xl text-white transform hover:scale-105 transition-transform relative overflow-hidden">
                  {/* Decoration circle inside card */}
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full"></div>

                  <ShieldCheck className="text-[#d4af37] mb-3 relative z-10" size={32} />
                  <h3 className="font-bold font-serif relative z-10">An toàn dữ liệu</h3>
                  <p className="text-sm text-blue-100 relative z-10">Bảo mật chuẩn quốc tế</p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 hover:scale-105 transition-transform">
                  <Users className="text-purple-500 mb-3" size={32} />
                  <h3 className="font-bold text-[#1a237e] font-serif">Nhân sự</h3>
                  <p className="text-sm text-slate-500">Phân quyền Admin/Staff</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-slate-400 py-10 text-center text-sm border-t border-slate-800">
        <div className="flex justify-center items-center gap-2 mb-4">
          <span className="text-xl font-bold font-serif text-white">Vet<span className="text-[#d4af37]">Feed</span></span>
        </div>
        <p>© 2025 VetFeed - Hệ thống quản lý cửa hàng thú y.</p>
      </footer>
    </main>
  );
}