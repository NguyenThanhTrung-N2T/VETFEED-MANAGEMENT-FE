"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';

export default function RegisterPage() {
    const { signup } = useAuth();

    const [formData, setFormData] = useState({ hoTen: '', email: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Regex password từ BE
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        // Validation Client Side
        if (formData.password !== formData.confirmPassword) {
            setErrorMsg("Mật khẩu nhập lại không khớp!");
            return;
        }
        if (!passwordRegex.test(formData.password)) {
            setErrorMsg("Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, thường, số và ký tự đặc biệt.");
            return;
        }

        setIsLoading(true);
        try {
            await signup({
                hoTen: formData.hoTen,
                email: formData.email,
                password: formData.password
            });
            // Thành công sẽ redirect về login (xử lý trong provider)
        } catch (err: any) {
            const msg = err.response?.data?.detail || "Đăng ký thất bại. Email có thể đã tồn tại.";
            setErrorMsg(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a237e] via-[#25396f] to-[#3949ab] p-4  relative overflow-hidden">

            {/* Background Decoration Circles (Trang trí nền giống hình) */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full border-[40px] border-white/5 opacity-30 pointer-events-none"></div>
            <div className="absolute top-[10%] left-[10%] w-72 h-72 rounded-full border-[30px] border-white/5 opacity-20 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 rounded-full border-[35px] border-white/5 opacity-30 pointer-events-none"></div>
            <div className="absolute bottom-[20%] right-[10%] w-60 h-60 rounded-full border-[25px] border-white/5 opacity-20 pointer-events-none"></div>

            {/* Main Card Container */}
            <div className="bg-[#fdfbf7] w-full max-w-5xl min-h-[600px] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">

                {/* --- LEFT SIDE: WELCOME (BLUE) --- */}
                {/* Logic CSS tạo đường cong ngược lại so với màn Login:
                    - 'rounded-r-[100px]': Bo tròn mạnh phía bên phải của khối xanh.
                    - 'mr-[-50px]': Margin âm để khối xanh đè lên khối trắng bên phải.
                    - 'z-20': Đảm bảo khối xanh nằm trên khối trắng tại điểm giao nhau.
                */}
                <div className="hidden md:flex w-1/2 bg-[#0f172a] text-white flex-col justify-center items-center p-12 relative rounded-r-[100px] shadow-[10px_0_30px_rgba(0,0,0,0.2)] mr-[-50px] z-20 overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-[-10%] left-[-10%] w-64 h-64 rounded-full border-[20px] border-white/5 opacity-20"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-48 h-48 rounded-full border-[15px] border-white/5 opacity-20"></div>

                    <div className="z-10 text-center max-w-xs">
                        <h2 className="text-4xl font-bold mb-4 font-serif leading-tight">Xin chào,</h2>
                        <h3 className="text-l font-medium mb-8">Chào mừng bạn đã đến với VetFeed</h3>

                        <p className="text-slate-400 text-sm mb-4">Đã có tài khoản ?</p>

                        <Link href="/login">
                            <button className="px-20 py-3 bg-[#d4af37] hover:bg-[#c5a028] text-[#0f172a] font-bold rounded-full transition-all shadow-lg shadow-yellow-900/20 transform hover:scale-105">
                                Đăng nhập
                            </button>
                        </Link>
                    </div>
                </div>

                {/* --- RIGHT SIDE: REGISTER FORM (CREAM) --- */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center md:pl-20 z-10">
                    <div className="text-center md:text-left mb-6">
                        <h2 className="text-3xl font-bold text-slate-800 font-serif tracking-wide text-center">ĐĂNG KÝ</h2>
                    </div>

                    {errorMsg && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200 text-center">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 text-slate-500">
                        {/* Họ Tên */}
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-slate-600 pl-1 font-serif">Họ và tên</label>
                            <input
                                required
                                type="text"
                                placeholder=""
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#25396f] transition-all shadow-sm"
                                value={formData.hoTen}
                                onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                            />
                        </div>

                        {/* Email */}
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

                        {/* Mật khẩu */}
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
                            <p className="text-[10px] text-slate-400 mt-1 pl-1 flex items-center gap-1">
                                <ShieldCheck size={12} /> 8+ ký tự, hoa, thường, số & ký tự đặc biệt.
                            </p>
                        </div>

                        {/* Nhập lại mật khẩu */}
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-slate-600 pl-1 font-serif">Nhập lại mật khẩu</label>
                            <input
                                required
                                type="password"
                                placeholder=""
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#25396f] transition-all shadow-sm"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-between items-center mt-2 md:hidden">
                            <p className="text-xs text-slate-500 italic">Đã có tài khoản?</p>
                            <Link href="/login" className="text-xs font-bold text-[#25396f] hover:underline">Đăng nhập ngay</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#25396f] hover:bg-[#1a2850] text-white font-bold py-3 rounded-full transition-all shadow-lg transform hover:scale-[1.02] flex justify-center items-center disabled:opacity-70 mt-6"
                        >
                            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : "Đăng Ký"}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}