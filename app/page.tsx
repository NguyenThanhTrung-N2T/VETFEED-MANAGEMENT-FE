import React from 'react';
import Navbar from '@/components/Navbar';
import { ArrowRight, ShieldCheck, Truck, Users, Activity } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 animate-in slide-in-from-left-10 duration-700 fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Giải pháp quản lý số 1 Việt Nam
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
              Quản lý phân phối <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Thuốc Thú Y & Thức Ăn
              </span>
            </h1>
            <p className="text-lg text-slate-600 max-w-lg">
              VetFeed giúp bạn tối ưu hóa quy trình nhập hàng, quản lý kho, theo dõi công nợ và chăm sóc khách hàng chỉ trên một nền tảng duy nhất.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/register" className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:shadow-emerald-300 transition-all transform hover:-translate-y-1">
                Dùng thử miễn phí
                <ArrowRight size={20} />
              </Link>
              <Link href="#" className="flex items-center justify-center px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition-all">
                Xem bảng giá
              </Link>
            </div>
          </div>

          {/* Hero Image / Illustration */}
          <div className="relative animate-in slide-in-from-right-10 duration-700 fade-in lg:block hidden">
            {/* Background Blob */}
            <div className="absolute top-0 right-0 w-125 h-125 bg-emerald-200/50 rounded-full blur-3xl -z-10"></div>

            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4 mt-17">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:scale-105 transition-transform">
                  <Activity className="text-orange-500 mb-3" size={32} />
                  <h3 className="font-bold text-slate-800">Theo dõi kho</h3>
                  <p className="text-sm text-slate-500">Cảnh báo hạn sử dụng thuốc</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:scale-105 transition-transform">
                  <Truck className="text-blue-500 mb-3" size={32} />
                  <h3 className="font-bold text-slate-800">Vận chuyển</h3>
                  <p className="text-sm text-slate-500">Tối ưu lộ trình giao hàng</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-emerald-600 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-transform">
                  <ShieldCheck className="text-emerald-200 mb-3" size={32} />
                  <h3 className="font-bold">An toàn dữ liệu</h3>
                  <p className="text-sm text-emerald-100">Bảo mật chuẩn quốc tế</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:scale-105 transition-transform">
                  <Users className="text-purple-500 mb-3" size={32} />
                  <h3 className="font-bold text-slate-800">Nhân sự</h3>
                  <p className="text-sm text-slate-500">Phân quyền Admin/Staff</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer đơn giản */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>© 2025 VetFeed - Hệ thống quản lý cửa hàng thú y.</p>
      </footer>
    </main>
  );
}