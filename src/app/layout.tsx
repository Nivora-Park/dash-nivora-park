import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthWrapper } from "@/components/AuthWrapper";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { TokenDebug } from "@/components/common/TokenDebug";
import "@/hooks/useTokenTest";

const inter = localFont({
  src: [
    {
      path: "../fonts/Inter-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Inter-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-inter",
});

const geistMono = localFont({
  src: [
    {
      path: "../fonts/GeistMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/GeistMono-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Nivora Park - Dashboard Monitoring Transaksi",
  description:
    "Dashboard monitoring transaksi parkir dengan konfigurasi terminal dan payment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased font-sans`}
        style={{ backgroundColor: "#f7f8fa" }}
      >
        <AuthProvider>
          <SidebarProvider>
            <AuthWrapper>{children}</AuthWrapper>
            {/* <TokenDebug /> */}
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
