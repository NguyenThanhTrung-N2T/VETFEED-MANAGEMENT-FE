"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider'; // Import hook
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const { login } = useAuth(); // Lấy hàm login từ Context
    const searchParams = useSearchParams();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const isRegistered = searchParams.get('registered');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            await login(formData);
            // Login thành công sẽ tự redirect trong Provider
        } catch (err: any) {
            // Xử lý lỗi hiển thị ra màn hình
            const msg = err.response?.data?.error || "Đăng nhập thất bại. Vui lòng kiểm tra lại.";
            setErrorMsg(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="bg-emerald-600 p-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Chào mừng trở lại</h2>
                    <p className="text-emerald-100 text-sm">Đăng nhập để quản lý cửa hàng của bạn</p>
                </div>

                <div className="p-8">
                    {/* Thông báo đăng ký thành công */}
                    {isRegistered && (
                        <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">
                            Đăng ký thành công! Vui lòng đăng nhập.
                        </div>
                    )}

                    {/* Thông báo lỗi */}
                    {errorMsg && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    required
                                    type="email"
                                    placeholder="admin@vetfeed.com"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-slate-700">Mật khẩu</label>
                                <Link href="/forgot-password" className="text-xs text-emerald-600 hover:underline">Quên mật khẩu?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-emerald-200 flex justify-center items-center disabled:opacity-70"
                        >
                            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : "Đăng nhập"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-500">
                        Chưa có tài khoản? <Link href="/register" className="text-emerald-600 font-bold hover:underline">Đăng ký ngay</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}