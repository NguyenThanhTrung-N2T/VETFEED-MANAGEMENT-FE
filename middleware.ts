import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. Định nghĩa các Route cần bảo vệ (Private)
const protectedRoutes = ['/dashboard', '/ban-hang', '/nhap-hang', '/bao-cao', '/ton-kho'];

// 2. Định nghĩa các Route chỉ dành cho Admin
const adminRoutes = ['/bao-cao']; 

export function middleware(request: NextRequest) {
  const userRole = request.cookies.get('userRole')?.value;
  const { pathname } = request.nextUrl;

  // KIỂM TRA 1: Nếu truy cập route cần bảo vệ mà chưa login
  // Logic: Nếu pathname bắt đầu bằng bất kỳ route nào trong protectedRoutes
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !userRole) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // KIỂM TRA 2: Đã login mà cố vào trang login/register -> đá về dashboard
  if ((pathname.startsWith('/login') || pathname.startsWith('/register')) && userRole) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // KIỂM TRA 3: Phân quyền Staff/Admin
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  
  if (isAdminRoute && userRole === 'staff') {
    // Nếu là staff mà vào trang admin -> Đá về trang bán hàng hoặc dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Cấu hình matcher để middleware chạy trên các path này
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/ban-hang/:path*', 
    '/nhap-hang/:path*', 
    '/bao-cao/:path*', 
    '/login', 
    '/register'
  ],
};