import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import "./styles/globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";
import AuthSync from "@/app/_client-auth-sync"; // 👈 добавили импорт

export const metadata: Metadata = {
  title: "Sino Auto Import - Автомобили из Китая, Южной Кореи и Японии",
  description: "Sino Auto Import - Автомобили из Китая, Южной Кореи и Японии",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${GeistSans.className} flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ScrollToTop />
          <Toaster richColors position="top-center" />
          <AuthSync />
        </ThemeProvider>
      </body>
    </html>
  );
}
