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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-[#25396f] text-white p-2 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-blue-900/20">
                        <Stethoscope size={24} />
                    </div>
                    <span className={`text-2xl font-bold tracking-tight font-serif ${isScrolled ? 'text-[#1a237e]' : 'text-[#1a237e]'}`}>
                        Vet<span className="text-[#d4af37]">Feed</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        href="/"
                        className="text-black hover:text-[#F2C94C] font-medium transition-colors"
                    >
                        Giới thiệu
                    </Link>

                    <Link
                        href="/san-pham"
                        className="text-black hover:text-[#F2C94C] font-medium transition-colors"
                    >
                        Sản phẩm
                    </Link>

                    <Link
                        href="/doi-tac"
                        className="text-black hover:text-[#F2C94C] font-medium transition-colors"
                    >
                        Đối tác
                    </Link>
                </div>


                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login" className="text-black px-5 py-2 text-[#25396f] font-bold hover:bg-blue-50 rounded-full transition-colors">
                        Đăng nhập
                    </Link>
                    {/* Nút Đăng ký màu Vàng đồng giống màn Login */}
                    <Link href="/register" className="px-6 py-2 bg-[#d4af37] text-[#0f172a] font-bold rounded-full shadow-lg shadow-yellow-600/20 hover:bg-[#c5a028] hover:shadow-yellow-600/30 transition-all transform hover:-translate-y-0.5">
                        Đăng ký
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-[#25396f]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-5">
                    <Link href="/login" className="text-center py-3 border border-[#25396f] text-[#25396f] rounded-lg font-bold">Đăng nhập</Link>
                    <Link href="/register" className="text-center py-3 bg-[#d4af37] text-[#0f172a] rounded-lg font-bold">Đăng ký ngay</Link>
                </div>
            )}
        </header>
    );
}