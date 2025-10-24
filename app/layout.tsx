import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YouTuber Finder - YouTube 채널 검색 도구",
  description: "YouTube Data API를 활용한 채널 검색 및 정보 추출 도구",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
