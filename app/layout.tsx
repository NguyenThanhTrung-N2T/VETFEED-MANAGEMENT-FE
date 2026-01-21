import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/providers/auth-provider';
import { Be_Vietnam_Pro } from "next/font/google";

const beVN = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});
export const metadata: Metadata = {
  title: "VetFeed",
  description: "Quản lý cửa hàng thú y dễ dàng và hiệu quả",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${beVN.className} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
