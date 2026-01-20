"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { authService } from '@/services/auth.service';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            await authService.forgotPassword(email);
            setIsSent(true);
        } catch (error: any) {
            console.error("Forgot password error:", error);
            const message = error.response?.data?.detail ||
                error.response?.data?.title ||
                "Không tìm thấy email hoặc có lỗi xảy ra.";
            setErrorMsg(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Container nền gradient xanh + họa tiết vòng tròn (giả lập background hình ảnh)
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a237e] via-[#25396f] to-[#3949ab] p-4 font-sans relative overflow-hidden">

            {/* Background Decoration Circles (Trang trí nền giống hình) */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full border-[40px] border-white/5 opacity-30 pointer-events-none"></div>
            <div className="absolute top-[10%] left-[10%] w-72 h-72 rounded-full border-[30px] border-white/5 opacity-20 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 rounded-full border-[35px] border-white/5 opacity-30 pointer-events-none"></div>
            <div className="absolute bottom-[20%] right-[10%] w-60 h-60 rounded-full border-[25px] border-white/5 opacity-20 pointer-events-none"></div>

            {/* Main Card */}
            <div className="bg-[#fdfbf7] w-full max-w-lg rounded-3xl shadow-2xl p-8 md:p-12 relative z-10 animate-in fade-in zoom-in duration-300">

                {/* Header Section */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 font-serif tracking-wide mb-3 uppercase">
                        QUÊN MẬT KHẨU
                    </h2>
                    {!isSent && (
                        <p className="text-slate-500 text-sm md:text-base font-serif">
                            Đừng lo, chúng tôi sẽ giúp bạn khôi phục lại mật khẩu !
                        </p>
                    )}
                </div>

                {/* Error Message */}
                {errorMsg && !isSent && (
                    <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200 flex items-center justify-center gap-2">
                        <AlertCircle size={18} className="shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {/* --- STATE 1: FORM INPUT --- */}
                {!isSent ? (
                    <form onSubmit={handleReset} className="space-y-6 text-slate-500">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-600 pl-1 font-serif">Email</label>
                            <input
                                required
                                type="email"
                                placeholder=""
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#25396f] transition-all shadow-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#25396f] hover:bg-[#1a2850] text-white font-bold py-3 rounded-full transition-all shadow-lg transform hover:scale-[1.02] flex justify-center items-center disabled:opacity-70 mt-4"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={20} />
                                    Đang xử lý...
                                </>
                            ) : (
                                "Khôi phục mật khẩu"
                            )}
                        </button>
                    </form>
                ) : (
                    /* --- STATE 2: SUCCESS MESSAGE --- */
                    <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <CheckCircle size={40} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-slate-800 font-serif">Đã gửi email!</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến: <br />
                                <strong className="text-[#25396f]">{email}</strong>
                            </p>
                            <p className="text-xs text-slate-400 italic">
                                (Vui lòng kiểm tra cả hộp thư Spam/Rác)
                            </p>
                        </div>

                        <button
                            onClick={() => { setIsSent(false); setEmail(''); setErrorMsg(''); }}
                            className="text-sm text-[#d4af37] font-bold hover:underline hover:text-[#b59223] transition-colors"
                        >
                            Thử lại với email khác
                        </button>
                    </div>
                )}

                {/* Footer Link */}
                <div className="mt-10 text-center">
                    <Link href="/login" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-[#25396f] transition-colors group">
                        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Quay lại đăng nhập
                    </Link>
                </div>

            </div>
        </div>
    );
}