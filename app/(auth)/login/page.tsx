"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const { login } = useAuth();
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
        } catch (err: any) {
            const msg = err.response?.data?.error || "Đăng nhập thất bại. Vui lòng kiểm tra lại.";
            setErrorMsg(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Container nền gradient xanh giống hình
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a237e] via-[#25396f] to-[#3949ab] p-4 font-sans relative overflow-hidden">

            {/* Background Decoration Circles (Trang trí nền giống hình) */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full border-[40px] border-white/5 opacity-30 pointer-events-none"></div>
            <div className="absolute top-[10%] left-[10%] w-72 h-72 rounded-full border-[30px] border-white/5 opacity-20 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 rounded-full border-[35px] border-white/5 opacity-30 pointer-events-none"></div>
            <div className="absolute bottom-[20%] right-[10%] w-60 h-60 rounded-full border-[25px] border-white/5 opacity-20 pointer-events-none"></div>

            {/* Main Card */}
            <div className="bg-[#fdfbf7] w-full max-w-4xl min-h-[550px] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">

                {/* --- LEFT SIDE: LOGIN FORM --- */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center z-10">
                    <div className="text-center md:text-left mb-8">
                        <h2 className="text-3xl font-bold text-slate-800 font-serif tracking-wide mb-6 text-center">ĐĂNG NHẬP</h2>
                    </div>

                    {isRegistered && (
                        <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded border border-green-200 text-center">
                            Đăng ký thành công!
                        </div>
                    )}

                    {errorMsg && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200 text-center">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5 text-slate-500">
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-slate-600 pl-1 font-serif">Email</label>
                            <input
                                required
                                type="email"
                                placeholder=""
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#25396f] transition-all shadow-sm"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-slate-600 pl-1 font-serif">Mật khẩu</label>
                            <div className="relative">
                                <input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    placeholder=""
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#25396f] transition-all shadow-sm"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-center md:justify-end">
                            <Link href="/forgot-password" className="text-sm font-bold text-slate-800 italic hover:underline font-serif">
                                Quên mật khẩu ?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#25396f] hover:bg-[#1a2850] text-white font-bold py-3 rounded-full transition-all shadow-lg transform hover:scale-[1.02] flex justify-center items-center disabled:opacity-70 mt-4"
                        >
                            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : "Đăng nhập"}
                        </button>
                    </form>
                </div>

                {/* --- RIGHT SIDE: WELCOME & REGISTER --- */}
                {/* Logic CSS tạo đường cong:
                    - Parent background màu kem (#fdfbf7).
                    - Right side có background màu xanh (#0f172a).
                    - Dùng 'rounded-l-[100px]' (hoặc giá trị lớn) để tạo đường cong lồi sang trái đè lên nền kem.
                    - margin-left âm (-ml-16) để kéo phần xanh đè sang cột bên trái một chút.
                */}
                <div className="hidden md:flex w-1/2 bg-[#0f172a] text-white flex-col justify-center items-center p-12 relative rounded-l-[100px] shadow-[-10px_0_30px_rgba(0,0,0,0.2)] z-20 overflow-hidden">
                    {/* Background decoration (optional circles) */}
                    <div className="absolute top-[-20%] right-[-20%] w-64 h-64 rounded-full border-[20px] border-white/5 opacity-20"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 rounded-full border-[15px] border-white/5 opacity-20"></div>

                    <div className="z-10 text-center max-w-xs">
                        <h2 className="text-4xl font-bold mb-4 font-serif leading-tight">Chào mừng bạn trở lại</h2>
                        <p className="text-slate-300 mb-10 text-sm leading-relaxed">
                            Đăng nhập để tiếp tục hành trình của bạn
                        </p>

                        <p className="text-slate-400 text-sm mb-4">Chưa có tài khoản ?</p>

                        <Link href="/register">
                            <button className="px-20 py-3 bg-[#d4af37] hover:bg-[#c5a028] text-[#0f172a] font-bold rounded-full transition-all shadow-lg shadow-yellow-900/20 transform hover:scale-105">
                                Đăng ký
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}