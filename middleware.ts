// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. Danh sách các route cần bảo vệ (Phải đăng nhập mới vào được)
const protectedRoutes = [
  '/dashboard', 
  '/ban-hang', 
  '/nhap-hang', 
  '/chuyen-kho',
  '/tra-hang',
  '/ton-kho',
  '/danh-muc',
  '/cong-no',
  '/bao-cao'
];

export function middleware(request: NextRequest) {
  // Lấy token từ Cookie (được set lúc Login trong AuthProvider)
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // KIỂM TRA 1: Route bảo vệ mà KHÔNG có Token -> Đá về Login
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    // (Tùy chọn) Lưu lại trang đang muốn vào để redirect lại sau khi login xong
    // loginUrl.searchParams.set('from', pathname); 
    return NextResponse.redirect(loginUrl);
  }

  // KIỂM TRA 2: Đã có Token mà cố vào Login/Register -> Đá về Dashboard
  if ((pathname.startsWith('/login') || pathname.startsWith('/register')) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Config matcher
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};