"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    // Hàm giả lập đăng nhập
    const handleLoginMock = (role: 'admin' | 'staff') => {
        // 1. Lưu vào Cookie (để Middleware đọc được)
        // Thời hạn 1 ngày (86400 giây)
        document.cookie = `userRole=${role}; path=/; max-age=86400; SameSite=Lax`;

        // 2. Vẫn lưu LocalStorage (để Sidebar hiển thị tên/avatar cho tiện)
        localStorage.setItem('userRole', role);
        localStorage.setItem('userName', role === 'admin' ? 'Nguyễn Văn A (Admin)' : 'Trần Thị B (Staff)');

        // 3. Chuyển hướng
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="bg-emerald-600 p-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Chào mừng trở lại</h2>
                    <p className="text-emerald-100 text-sm">Đăng nhập để quản lý cửa hàng của bạn</p>
                </div>

                {/* Form */}
                <div className="p-8">
                    <div className="space-y-4">
                        {/* Input Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input type="email" placeholder="admin@vetfeed.com" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" />
                            </div>
                        </div>

                        {/* Input Password */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-slate-700">Mật khẩu</label>
                                <Link href="/forgot-password" className="text-xs text-emerald-600 hover:underline">Quên mật khẩu?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Nút đăng nhập giả lập - DEMO ONLY */}
                        <div className="pt-4 space-y-3">
                            <p className="text-xs text-center text-gray-400 bg-gray-100 p-2 rounded">
                                (Chế độ Demo: Chọn quyền để truy cập)
                            </p>
                            <button
                                onClick={() => handleLoginMock('admin')}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-emerald-200"
                            >
                                Đăng nhập (Quyền ADMIN)
                            </button>
                            <button
                                onClick={() => handleLoginMock('staff')}
                                className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-lg transition-all"
                            >
                                Đăng nhập (Quyền STAFF)
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 text-center text-sm text-slate-500">
                        Chưa có tài khoản? <Link href="/register" className="text-emerald-600 font-bold hover:underline">Đăng ký ngay</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}