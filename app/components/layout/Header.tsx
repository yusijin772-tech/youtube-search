import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-red-600">YouTuber Finder</div>
          </Link>

          <nav className="flex space-x-3 sm:space-x-6">
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
        </div>
      </div>
    </header>
  );
}
