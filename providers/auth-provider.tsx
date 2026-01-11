"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { LoginPayload, SignupPayload, UserInfo } from '@/types/auth';

interface AuthContextType {
    user: UserInfo | null;
    loading: boolean;
    login: (data: LoginPayload) => Promise<void>;
    signup: (data: SignupPayload) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Khôi phục user từ localStorage khi F5 trang
    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        const token = Cookies.get('accessToken');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (data: LoginPayload) => {
        try {
            const res = await authService.login(data);

            // 1. Lưu Token vào Cookie (để Middleware và Axios dùng)
            // Expires trong 7 ngày (hoặc lấy từ exp của JWT decoded)
            Cookies.set('accessToken', res.accessToken, { expires: 7 });

            // 2. Lưu User Info vào State & LocalStorage
            const userInfo: UserInfo = {
                maTK: res.maTK,
                email: res.email,
                hoTen: res.hoTen,
                role: res.role,
                avatar: res.anhDaiDien
            };

            setUser(userInfo);
            localStorage.setItem('userInfo', JSON.stringify(userInfo));

            // 3. Chuyển hướng
            router.push('/dashboard');
        } catch (error: any) {
            console.error("Login failed:", error);
            throw error; // Ném lỗi để UI hiển thị thông báo
        }
    };

    const signup = async (data: SignupPayload) => {
        try {
            await authService.signup(data);
            // Đăng ký thành công -> Chuyển sang login để đăng nhập
            router.push('/login?registered=true');
        } catch (error: any) {
            throw error;
        }
    };

    const logout = () => {
        Cookies.remove('accessToken');
        localStorage.removeItem('userInfo');
        setUser(null);
        router.push('/login');
        // Gọi thêm authService.logout() nếu cần
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook custom để dùng context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};