'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-red-600">YouTuber Finder</div>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden sm:flex space-x-3 sm:space-x-6">
            <Link
              href="/"
              className="text-sm sm:text-base text-gray-700 hover:text-red-600 transition-colors"
            >
              홈
            </Link>
            <Link
              href="/search"
              className="text-sm sm:text-base text-gray-700 hover:text-red-600 transition-colors"
            >
              검색
            </Link>
          </nav>

          {/* 모바일 햄버거 메뉴 버튼 */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5"
            aria-label="메뉴 토글"
          >
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* 모바일 드롭다운 메뉴 */}
        {isOpen && (
          <nav className="sm:hidden mt-4 pb-4 space-y-2 border-t pt-4">
            <Link
              href="/"
              className="block text-sm text-gray-700 hover:text-red-600 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              홈
            </Link>
            <Link
              href="/search"
              className="block text-sm text-gray-700 hover:text-red-600 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              검색
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
