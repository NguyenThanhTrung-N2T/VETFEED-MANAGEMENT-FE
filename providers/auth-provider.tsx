"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { accountService } from '@/services/account.service'; // [MỚI] Import account service
import { LoginPayload, SignupPayload, UserInfo } from '@/types/auth';

interface AuthContextType {
    user: UserInfo | null;
    loading: boolean;
    login: (data: LoginPayload) => Promise<void>;
    signup: (data: SignupPayload) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>; // Hàm refresh
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

    // Hàm làm mới thông tin user từ API
    const refreshUser = async () => {
        if (!user?.maTK) return;
        try {
            // Gọi API lấy thông tin mới nhất
            const updatedData = await accountService.getProfile(user.maTK);

            // Giữ nguyên các trường cũ, chỉ cập nhật trường thay đổi
            const newUserInfo: UserInfo = {
                ...user,
                hoTen: updatedData.hoTen,
                email: updatedData.email,
                avatar: updatedData.anhDaiDien,
            };

            setUser(newUserInfo);
            localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
        } catch (error) {
            console.error("Failed to refresh user info:", error);
        }
    };

    const login = async (data: LoginPayload) => {
        try {
            const res = await authService.login(data);

            Cookies.set('accessToken', res.accessToken, { expires: 7 });

            const userInfo: UserInfo = {
                maTK: res.maTK,
                email: res.email,
                hoTen: res.hoTen,
                role: res.role,
                avatar: res.anhDaiDien
            };

            setUser(userInfo);
            localStorage.setItem('userInfo', JSON.stringify(userInfo));

            router.push('/dashboard');
        } catch (error: any) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const signup = async (data: SignupPayload) => {
        try {
            await authService.signup(data);
            router.push('/login?registered=true');
        } catch (error: any) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            Cookies.remove('accessToken');
            localStorage.removeItem('userInfo');
            setUser(null);
            router.push('/login');
        } catch (error: any) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};