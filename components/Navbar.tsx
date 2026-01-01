"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Stethoscope, Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Hiệu ứng đổi màu navbar khi cuộn trang
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-emerald-600 text-white p-2 rounded-lg group-hover:rotate-12 transition-transform">
                        <Stethoscope size={24} />
                    </div>
                    <span className={`text-2xl font-bold tracking-tight ${isScrolled ? 'text-slate-800' : 'text-slate-900'}`}>
                        Vet<span className="text-emerald-600">Feed</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="#" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Giới thiệu</Link>
                    <Link href="#" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Sản phẩm</Link>
                    <Link href="#" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Đối tác</Link>
                    <Link href="#" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Liên hệ</Link>
                </div>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/login" className="px-5 py-2 text-emerald-700 font-semibold hover:bg-emerald-50 rounded-full transition-colors">
                        Đăng nhập
                    </Link>
                    <Link href="/register" className="px-5 py-2 bg-emerald-600 text-white font-semibold rounded-full shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-emerald-300 transition-all transform hover:-translate-y-0.5">
                        Đăng ký
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-slate-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-5">
                    <Link href="/login" className="text-center py-3 border border-emerald-600 text-emerald-600 rounded-lg font-bold">Đăng nhập</Link>
                    <Link href="/register" className="text-center py-3 bg-emerald-600 text-white rounded-lg font-bold">Đăng ký ngay</Link>
                </div>
            )}
        </header>
    );
}