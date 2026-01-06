"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [isSent, setIsSent] = useState(false);

    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        // Giả lập gửi mail thành công
        setIsSent(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="bg-slate-800 p-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Quên mật khẩu?</h2>
                    <p className="text-slate-300 text-sm">Đừng lo, chúng tôi sẽ giúp bạn lấy lại ngay.</p>
                </div>

                {/* Content */}
                <div className="p-8">

                    {!isSent ? (
                        /* TRẠNG THÁI 1: FORM NHẬP EMAIL */
                        <form onSubmit={handleReset} className="space-y-6">
                            <p className="text-sm text-slate-600 text-center mb-4">
                                Nhập địa chỉ email đã đăng ký của bạn, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
                            </p>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input required type="email" placeholder="admin@vetfeed.com" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-emerald-200"
                            >
                                Gửi yêu cầu
                            </button>
                        </form>
                    ) : (
                        /* TRẠNG THÁI 2: THÔNG BÁO THÀNH CÔNG */
                        <div className="text-center space-y-4 animate-in fade-in">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Đã gửi email!</h3>
                            <p className="text-sm text-slate-600">
                                Vui lòng kiểm tra hộp thư đến (và cả mục Spam) để nhận hướng dẫn đặt lại mật khẩu.
                            </p>
                            <button
                                onClick={() => setIsSent(false)}
                                className="text-sm text-emerald-600 font-bold hover:underline"
                            >
                                Gửi lại nếu chưa nhận được
                            </button>
                        </div>
                    )}

                    <div className="mt-8 text-center border-t border-slate-100 pt-4">
                        <Link href="/login" className="inline-flex items-center text-sm text-slate-500 hover:text-emerald-600 transition-colors">
                            <ArrowLeft size={16} className="mr-1" /> Quay lại đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}