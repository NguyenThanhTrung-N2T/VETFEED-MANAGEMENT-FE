"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, User, Mail, Lock, Loader2, ShieldCheck } from 'lucide-react';
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-300">

                <div className="bg-emerald-800 p-8 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-white mb-2">Tạo tài khoản mới</h2>
                        <p className="text-emerald-200 text-sm">Tham gia VetFeed để quản lý tốt hơn</p>
                    </div>
                </div>

                <div className="p-8">
                    {errorMsg && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded border border-red-200">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Họ Tên */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input required type="text" placeholder="Nguyễn Văn A"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                    value={formData.hoTen}
                                    onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input required type="email" placeholder="email@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Mật khẩu */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input required
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                <ShieldCheck size={12} /> Tối thiểu 8 ký tự, hoa, thường, số, ký tự đặc biệt.
                            </p>
                        </div>

                        {/* Nhập lại Mật khẩu */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nhập lại mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input required
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-lg transition-all shadow-lg flex justify-center items-center disabled:opacity-70"
                        >
                            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : "Đăng ký tài khoản"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-500">
                        Đã có tài khoản? <Link href="/login" className="text-emerald-700 font-bold hover:underline">Đăng nhập</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}