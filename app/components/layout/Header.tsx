import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-red-600">YouTuber Finder</div>
          </Link>

          <nav className="flex space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-red-600 transition-colors"
            >
              홈
            </Link>
            <Link
              href="/search"
              className="text-gray-700 hover:text-red-600 transition-colors"
            >
              검색
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
