"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { partnerService, Partner } from "@/services/partner.service";
import {
  Search,
  MapPin,
  Phone,
  Building2,
  ExternalLink,
  Loader2,
  Package,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function PartnerPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await partnerService.getAll();
        // Handle both plain array and PagedResult object
        setPartners(Array.isArray(data) ? data : (data as any)?.items || []);
      } catch (error) {
        console.error("Failed to fetch partners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter logic
  const filteredPartners = (Array.isArray(partners) ? partners : []).filter(
    (p) =>
      p.tenNCC?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.diaChi && p.diaChi.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <main className="min-h-screen bg-[#fdfbf7]">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-16 px-6 bg-[#25396f] overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

        <div className="container mx-auto text-center relative z-10 space-y-6">
          <span className="inline-block py-1 px-3 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-sm font-bold tracking-wider uppercase border border-[#d4af37]/30 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Mạng lưới kết nối
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Đối Tác & Nhà Cung Cấp
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            VetFeed tự hào hợp tác với những nhà cung cấp thuốc thú y và thức ăn
            chăn nuôi hàng đầu, mang đến sản phẩm chất lượng nhất cho khách
            hàng.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mt-8 relative duration-700 delay-300 bg-white rounded-full">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm nhà cung cấp, địa chỉ..."
              className="w-full pl-12 pr-4 py-4 rounded-full shadow-xl border-none outline-none focus:ring-4 focus:ring-[#d4af37]/30 text-slate-800 placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* --- LIST SECTION --- */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          {loading ? (
            // Skeleton Loader
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-64 animate-pulse"
                >
                  <div className="w-12 h-12 bg-slate-200 rounded-xl mb-4"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                    <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPartners.length > 0 ? (
            // Partners Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPartners.map((partner, index) => (
                <div
                  key={partner.maNCC}
                  className="group bg-white rounded-3xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-[#d4af37]/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                >
                  {/* Hover Gradient Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#25396f]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Icon & Count */}
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="w-14 h-14 bg-[#25396f]/5 text-[#25396f] rounded-2xl flex items-center justify-center group-hover:bg-[#25396f] group-hover:text-white transition-colors duration-300">
                      <Building2 size={28} />
                    </div>
                    {partner.sanPhamCount !== undefined && (
                      <span className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                        <Package size={14} />
                        {partner.sanPhamCount} SP
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3
                      className="text-xl font-bold text-[#1a237e] font-serif mb-3 line-clamp-1"
                      title={partner.tenNCC}
                    >
                      {partner.tenNCC}
                    </h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3 text-slate-500 text-sm">
                        <MapPin
                          size={16}
                          className="mt-0.5 shrink-0 text-[#d4af37]"
                        />
                        <span className="line-clamp-2">
                          {partner.diaChi || "Chưa cập nhật địa chỉ"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 text-sm">
                        <Phone size={16} className="shrink-0 text-[#d4af37]" />
                        <span>
                          {partner.soDienThoai || "Chưa cập nhật SĐT"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          partner.trangThai === "NgungHopTac"
                            ? "bg-red-50 text-red-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {partner.trangThai === "NGUNG_HOAT_DONG"
                          ? "Ngưng hợp tác"
                          : "Đang hợp tác"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-20">
              <div className="inline-flex justify-center items-center w-20 h-20 bg-slate-100 rounded-full mb-4 text-slate-400">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-700">
                Không tìm thấy đối tác nào
              </h3>
              <p className="text-slate-500 mt-2">Vui lòng thử từ khóa khác.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer - Reused style */}
      <footer className="bg-[#0f172a] text-slate-400 py-10 text-center text-sm border-t border-slate-800">
        <div className="flex justify-center items-center gap-2 mb-4">
          <span className="text-xl font-bold font-serif text-white">
            Vet<span className="text-[#d4af37]">Feed</span>
          </span>
        </div>
        <p>© 2025 VetFeed - Hệ thống quản lý cửa hàng thú y.</p>
      </footer>
    </main>
  );
}
