"use client";

import React, { useState, useEffect } from 'react';
import { Settings, User, Lock, Save, Loader2, Camera, Shield, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from "next/navigation";
import { accountService } from '@/services/account.service';
import { toast } from 'sonner';
import { motion, Variants } from 'framer-motion'; // Import Variants để fix lỗi TS
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility: Merge Class ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function SettingsPage() {
    const { user, loading, refreshUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isPassLoading, setIsPassLoading] = useState(false);

    const router = useRouter();
    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [loading, user, router]);
    // --- State Form Thông tin ---
    const [profile, setProfile] = useState({
        hoTen: '',
        soDienThoai: '',
        email: '',
        anhDaiDien: ''
    });

    // --- State Form Mật khẩu ---
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    // --- Animation Variants (FIX LỖI TS: Thêm ": Variants") ---
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0, opacity: 1,
            transition: { type: "spring", stiffness: 100, damping: 15 }
        }
    };

    // Load dữ liệu
    useEffect(() => {
        if (user) {
            setProfile({
                hoTen: user.hoTen || '',
                soDienThoai: user.soDienThoai || '',
                email: user.email || '',
                anhDaiDien: user.avatar || ''
            });
        }
    }, [user]);

    // 1. Xử lý Cập nhật thông tin
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.maTK) return;

        setIsLoading(true);
        try {
            await accountService.updateProfile(user.maTK, {
                hoTen: profile.hoTen,
                soDienThoai: profile.soDienThoai,
                email: profile.email,
                anhDaiDien: profile.anhDaiDien
            });
            toast.success("Cập nhật thông tin thành công!");
            if (refreshUser) refreshUser();
        } catch (error: any) {
            toast.error("Lỗi: " + (error.response?.data?.detail || "Không thể cập nhật"));
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Xử lý Đổi mật khẩu
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwords.newPassword.length < 8) {
            return toast.error("Mật khẩu phải có ít nhất 8 ký tự");
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error("Mật khẩu xác nhận không khớp");
        }

        setIsPassLoading(true);
        try {
            await accountService.changePassword({
                email: profile.email,
                password: passwords.newPassword
            });
            toast.success("Đổi mật khẩu thành công!");
            setPasswords({ newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            toast.error("Lỗi: " + (error.response?.data?.errors?.Password || "Không thể đổi mật khẩu"));
        } finally {
            setIsPassLoading(false);
        }
    };
    if (loading || !user) {
        return null;
    }
    return (
        <motion.div
            className="p-6 bg-[#eef2f6] min-h-screen relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* --- HEADER --- */}
            <motion.div variants={itemVariants} className="mb-8 relative z-10 bg-[#eef2f6]">
                <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br bg-[#25396f] rounded-xl text-white shadow-lg shadow-slate-300">
                        <Settings size={24} />
                    </div>
                    Cài đặt tài khoản
                </h1>
                <p className="text-slate-500 text-sm mt-2 ml-1">Quản lý thông tin cá nhân và bảo mật hệ thống.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">

                {/* --- LEFT: THÔNG TIN CÁ NHÂN --- */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col"
                >
                    <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-3 bg-gradient-to-r from-white to-slate-50/50">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <User size={20} />
                        </div>
                        <h2 className="font-bold text-slate-800 text-lg">Thông tin cá nhân</h2>
                    </div>

                    <div className="p-8 flex-1">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative group cursor-pointer">
                                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-4xl font-bold text-slate-400 overflow-hidden border-4 border-white shadow-xl shadow-slate-200/50 transition-transform duration-300 group-hover:scale-105">
                                    {profile.anhDaiDien ? (
                                        <img src={profile.anhDaiDien} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        profile.hoTen?.charAt(0).toUpperCase() || "U"
                                    )}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">Họ và tên</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full pl-4 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none text-slate-800 transition-all bg-slate-50/30 focus:bg-white"
                                        value={profile.hoTen}
                                        onChange={e => setProfile({ ...profile, hoTen: e.target.value })}
                                        placeholder="Nhập họ tên của bạn"
                                    />
                                    <User size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">Email (Đăng nhập)</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            disabled
                                            className="w-full pl-4 pr-10 py-3 border border-slate-200 rounded-xl text-sm bg-slate-100 text-slate-500 cursor-not-allowed font-medium"
                                            value={profile.email}
                                        />
                                        <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">Số điện thoại</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full pl-4 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none text-slate-800 transition-all bg-slate-50/30 focus:bg-white"
                                            value={profile.soDienThoai}
                                            onChange={e => setProfile({ ...profile, soDienThoai: e.target.value })}
                                            placeholder="09xxx..."
                                        />
                                        <Phone size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-2 py-3.5 bg-[#25396f] hover:bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 flex items-center justify-center gap-2 transition-all disabled:opacity-70 active:scale-[0.98]"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Lưu thay đổi
                            </button>
                        </form>
                    </div>
                </motion.div>

                {/* --- RIGHT: ĐỔI MẬT KHẨU --- */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden h-fit"
                >
                    <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-3 bg-gradient-to-r from-white to-slate-50/50">
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                            <Shield size={20} />
                        </div>
                        <h2 className="font-bold text-slate-800 text-lg">Bảo mật & Mật khẩu</h2>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleChangePassword} className="space-y-5">
                            <div className="p-4 bg-slate-50 text-slate-600 text-xs rounded-xl border border-slate-100 flex gap-3 leading-relaxed">
                                <div className="mt-0.5 shrink-0 text-emerald-500">
                                    <CheckCircle2 size={16} />
                                </div>
                                <p>Để bảo mật tài khoản, vui lòng sử dụng mật khẩu mạnh (Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt !).</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">Mật khẩu mới</label>
                                <div className="relative group">
                                    <input
                                        type="password"
                                        className="w-full pl-4 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none text-slate-800 transition-all bg-slate-50/30 focus:bg-white placeholder:text-slate-300"
                                        value={passwords.newPassword}
                                        onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                    <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">Xác nhận mật khẩu</label>
                                <div className="relative group">
                                    <input
                                        type="password"
                                        className="w-full pl-4 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none text-slate-800 transition-all bg-slate-50/30 focus:bg-white placeholder:text-slate-300"
                                        value={passwords.confirmPassword}
                                        onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                    <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isPassLoading}
                                className="w-full mt-18 py-3.5 border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 active:scale-[0.98]"
                            >
                                {isPassLoading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
                                Đổi mật khẩu
                            </button>
                        </form>
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
}