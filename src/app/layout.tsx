import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthWrapper } from "@/components/AuthWrapper";
import { SidebarProvider } from "@/contexts/SidebarContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
