import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          YouTuber Finder
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          YouTube 채널 정보를 쉽고 빠르게 검색하고 엑셀로 내보내세요
        </p>
        <Link
          href="/search"
          className="inline-block px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-lg"
        >
          검색 시작하기
        </Link>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">엑셀 파일 지원</h3>
          <p className="text-gray-600">
            엑셀이나 CSV 파일을 업로드하면 자동으로 YouTube URL을 추출합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">채널 정보 조회</h3>
          <p className="text-gray-600">
            구독자 수, 동영상 수, 총 조회수 등 상세한 채널 정보를 확인하세요
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl mb-4">💾</div>
          <h3 className="text-xl font-semibold mb-2">데이터 내보내기</h3>
          <p className="text-gray-600">
            검색 결과를 엑셀 또는 CSV 파일로 다운로드할 수 있습니다
          </p>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="bg-gray-50 rounded-lg p-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">사용 방법</h2>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-1">YouTube API 키 설정</h4>
              <p className="text-gray-600">
                Google Cloud Console에서 YouTube Data API v3 키를 발급받아 입력하세요
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-1">파일 업로드 또는 키워드 검색</h4>
              <p className="text-gray-600">
                YouTube 채널 URL이 포함된 엑셀/CSV 파일을 업로드하거나 키워드로 검색하세요
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-1">결과 확인 및 다운로드</h4>
              <p className="text-gray-600">
                채널 정보를 확인하고 필요시 엑셀 파일로 다운로드하세요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold mb-4">지금 바로 시작해보세요</h2>
        <p className="text-gray-600 mb-6">
          무료로 YouTube 채널 정보를 검색하고 관리할 수 있습니다
        </p>
        <Link
          href="/search"
          className="inline-block px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-lg"
        >
          검색 페이지로 이동
        </Link>
      </section>
    </div>
  );
}
