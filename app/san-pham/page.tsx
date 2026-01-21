"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { productService, Product } from '@/services/product.service';
import {
    Search, ShoppingCart, Package,
    Tag, Loader2, Stethoscope, Wheat
} from 'lucide-react';

// Định nghĩa danh mục chuẩn theo yêu cầu
const CATEGORIES = [
    { id: "ALL", label: "Tất cả", icon: null },
    { id: "THUOC_THU_Y", label: "Thuốc thú y", icon: <Stethoscope size={16} /> },
    { id: "THUC_AN_CHAN_NUOI", label: "Thức ăn chăn nuôi", icon: <Wheat size={16} /> }
];

export default function ProductPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // State cho bộ lọc
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState("ALL");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Gọi API lấy tất cả sản phẩm
                const data = await productService.getProducts({ PageSize: 100 });
                setProducts(data.items || []);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Logic lọc client-side
    const filteredProducts = products.filter(p => {
        // 1. Lọc theo từ khóa
        const matchesSearch = p.tenSP.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.maSPCode && p.maSPCode.toLowerCase().includes(searchTerm.toLowerCase()));

        // 2. Lọc theo loại sản phẩm (So sánh chính xác mã)
        const matchesCategory = activeCategory === "ALL" ||
            p.loaiSanPham === activeCategory;

        return matchesSearch && matchesCategory;
    });

    const formatMoney = (val?: number) => val ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val) : 'Liên hệ';

    // Helper: Lấy label hiển thị từ mã loại
    const getCategoryLabel = (type?: string) => {
        if (type === 'THUOC_THU_Y') return 'Thuốc thú y';
        if (type === 'THUC_AN_CHAN_NUOI') return 'Thức ăn chăn nuôi';
        return type || 'Khác';
    };

    return (
        <main className="min-h-screen bg-[#fdfbf7] font-sans">
            <Navbar />

            {/* --- HERO SECTION --- */}
            <section className="relative pt-32 pb-20 px-6 bg-[#25396f] overflow-hidden">
                {/* Decor elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#d4af37] rounded-full blur-[120px]"></div>
                </div>

                <div className="container mx-auto text-center relative z-10 space-y-6">
                    <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-sm font-bold border border-[#d4af37]/20 animate-in fade-in slide-in-from-bottom-3 duration-500">
                        <Package size={16} /> Kho hàng chính hãng
                    </span>

                    <h1 className="text-4xl lg:text-5xl font-bold text-white font-serif leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Danh Mục Sản Phẩm
                    </h1>

                    <p className="text-blue-100 text-lg max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                        Cung cấp đầy đủ các loại thuốc thú y và thức ăn chăn nuôi chất lượng cao, đảm bảo nguồn gốc xuất xứ rõ ràng.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mt-8 relative group animate-in fade-in zoom-in duration-700 delay-200">
                        <div className="absolute inset-0 bg-[#d4af37] rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative flex items-center bg-white rounded-full shadow-2xl p-2">
                            <div className="pl-4 text-slate-400"><Search size={22} /></div>
                            <input
                                type="text"
                                placeholder="Tìm kiếm tên thuốc, mã sản phẩm..."
                                className="w-full px-4 py-3 text-slate-800 outline-none bg-transparent placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- BODY SECTION --- */}
            <section className="py-16 px-6 container mx-auto">

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 border flex items-center gap-2
                                ${activeCategory === cat.id
                                    ? 'bg-[#25396f] text-white border-[#25396f] shadow-lg shadow-blue-900/20 transform -translate-y-1'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-[#25396f] hover:text-[#25396f]'
                                }`}
                        >
                            {cat.icon}
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                {loading ? (
                    // Skeleton Loading
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-pulse">
                                <div className="aspect-square bg-slate-200 rounded-xl mb-4"></div>
                                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.maSP}
                                className="group bg-white rounded-2xl p-4 shadow-[0_5px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-[#d4af37]/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full"
                            >
                                {/* Image Area */}
                                <div className="relative aspect-[4/3] bg-slate-50 rounded-xl overflow-hidden mb-4 border border-slate-50">
                                    {product.anhSanPham ? (
                                        <img
                                            src={product.anhSanPham}
                                            alt={product.tenSP}
                                            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        // Placeholder Image Icon if no image
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                            <Package size={48} strokeWidth={1.5} />
                                            <span className="text-xs mt-2 font-medium">No Image</span>
                                        </div>
                                    )}

                                    {/* Category Badge */}
                                    {product.loaiSanPham && (
                                        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 backdrop-blur-sm
                                            ${product.loaiSanPham === 'THUOC_THU_Y'
                                                ? 'bg-blue-50/90 text-blue-700'
                                                : 'bg-green-50/90 text-green-700'}`
                                        }>
                                            <Tag size={12} />
                                            {getCategoryLabel(product.loaiSanPham)}
                                        </div>
                                    )}
                                </div>

                                {/* Content Area */}
                                <div className="flex-1 flex flex-col">
                                    <div className="mb-1 text-xs text-slate-500 font-mono flex justify-between">
                                        <span>{product.maSPCode}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#1a237e] line-clamp-2 mb-2 group-hover:text-[#d4af37] transition-colors" title={product.tenSP}>
                                        {product.tenSP}
                                    </h3>

                                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                        <div className="text-emerald-600 font-bold text-lg">
                                            {formatMoney(product.donGia)}
                                            {product.donViCoSo && (
                                                <span className="text-xs font-normal text-slate-500 ml-1">
                                                    / {product.donViCoSo}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Empty State
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700">Không tìm thấy sản phẩm</h3>
                        <p className="text-slate-500 mt-2">Vui lòng thử từ khóa hoặc danh mục khác.</p>
                    </div>
                )}
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