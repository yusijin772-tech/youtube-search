'use client';

import Link from 'next/link';

export default function ApiGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/search"
            className="inline-flex items-center text-sm sm:text-base text-blue-600 hover:text-blue-800 mb-3 sm:mb-4"
          >
            ← 검색 페이지로 돌아가기
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            YouTube API 키 발급 방법
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            처음 발급받는 분들을 위한 단계별 가이드입니다.
          </p>
        </div>

        {/* 가이드 컨텐츠 */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 space-y-8 sm:space-y-12">

          {/* 1단계 */}
          <section>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center mr-2 sm:mr-3 text-base sm:text-lg flex-shrink-0">1</span>
              <span className="break-words">Google Cloud Console 접속</span>
            </h2>
            <div className="ml-0 sm:ml-11 space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base text-gray-700">
                브라우저 주소창에 <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm break-all">https://console.cloud.google.com/</code> 을 입력하여 접속합니다.
              </p>
              <div className="border rounded-lg overflow-hidden bg-gray-50">
                <img
                  src="/guide/1.JPG"
                  alt="Google Cloud Console 접속"
                  className="w-full h-auto max-w-full object-contain"
                  loading="lazy"
                />
              </div>
              <p className="text-sm sm:text-base text-gray-700">
                오른쪽 상단 <strong>'콘솔'</strong> 클릭
              </p>
            </div>
          </section>

          {/* 2단계 */}
          <section>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center mr-2 sm:mr-3 text-base sm:text-lg flex-shrink-0">2</span>
              <span className="break-words">프로젝트 만들기</span>
            </h2>
            <div className="ml-0 sm:ml-11 space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base text-gray-700">
                화면 위쪽의 <strong>"프로젝트 선택"</strong> 버튼을 클릭합니다.
              </p>
              <div className="border rounded-lg overflow-hidden bg-gray-50">
                <img
                  src="/guide/5.JPG"
                  alt="프로젝트 선택"
                  className="w-full h-auto max-w-full object-contain"
                  loading="lazy"
                />
              </div>
              <p className="text-sm sm:text-base text-gray-700">
                우측 상단의 <strong>"새 프로젝트"</strong> 버튼을 클릭합니다.
              </p>
              <div className="border rounded-lg overflow-hidden bg-gray-50">
                <img
                  src="/guide/3.JPG"
                  alt="새 프로젝트"
                  className="w-full h-auto max-w-full object-contain"
                  loading="lazy"
                />
              </div>
              <p className="text-sm sm:text-base text-gray-700">
                프로젝트 이름을 입력합니다. (예: <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm break-all">youtube-search-app</code>)
              </p>
              <div className="border rounded-lg overflow-hidden bg-gray-50">
                <img
                  src="/guide/4.JPG"
                  alt="프로젝트 이름 입력"
                  className="w-full h-auto max-w-full object-contain"
                  loading="lazy"
                />
              </div>
              <p className="text-sm sm:text-base text-gray-700">
                <strong>"만들기"</strong> 버튼을 클릭하고 10-30초 기다립니다.
              </p>
            </div>
          </section>

          {/* 3단계 */}
          <section>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center mr-2 sm:mr-3 text-base sm:text-lg flex-shrink-0">3</span>
              <span className="break-words">YouTube Data API v3 활성화</span>
            </h2>
            <div className="ml-0 sm:ml-11 space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base text-gray-700">
                정면에 있는 <strong>"API 및 서비스"</strong>를 클릭합니다.
              </p>
              <div className="border rounded-lg overflow-hidden bg-gray-50">
                <img
                  src="/guide/2.JPG"
                  alt="API 및 서비스"
                  className="w-full h-auto max-w-full object-contain"
                  loading="lazy"
                />
              </div>
              <p className="text-sm sm:text-base text-gray-700">
                왼쪽 화면 2번째에 있는 <strong>"라이브러리"</strong>를 클릭합니다.
              </p>
              <div className="border rounded-lg overflow-hidden bg-gray-50">
                <img
                  src="/guide/6.JPG"
                  alt="라이브러리"
                  className="w-full h-auto max-w-full object-contain"
                  loading="lazy"
                />
              </div>
              <p className="text-sm sm:text-base text-gray-700">
                검색창에 <strong>"youtube"</strong>를 입력하고, <strong>"YouTube Data API v3"</strong>를 선택합니다.
              </p>
              <div className="border rounded-lg overflow-hidden bg-gray-50">
                <img
                  src="/guide/7.JPG"
                  alt="YouTube API 검색"
                  className="w-full h-auto max-w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-yellow-800">
                  <strong>⚠️ 주의:</strong> "YouTube Analytics API"가 아닌 <strong>"YouTube Data API v3"</strong>를 선택하세요!
                </p>
              </div>
              <div className="border rounded-lg overflow-hidden bg-gray-50">
                <img
                  src="/guide/8.JPG"
                  alt="YouTube Data API v3 선택"
                  className="w-full h-auto max-w-full object-contain"
                  loading="lazy"
                />
              </div>
              <p className="text-sm sm:text-base text-gray-700">
                <strong>"사용"</strong> 버튼을 클릭하고 5-10초 기다립니다.
              </p>
            </div>
          </section>

          {/* 4단계 */}
          <section>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center mr-2 sm:mr-3 text-base sm:text-lg flex-shrink-0">4</span>
              <span className="break-words">API 키 만들기</span>
            </h2>
            <div className="ml-0 sm:ml-11 space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base text-gray-700">
                왼쪽 메뉴에서 <strong>"사용자 인증 정보"</strong>를 클릭합니다.
              </p>
              <div className="border rounded-lg overflow-hidden bg-gray-50">
                <img
                  src="/guide/9.JPG"
                  alt="사용자 인증 정보"
                  className="w-full h-auto max-w-full object-contain"
                  loading="lazy"
                />
              </div>
              <p className="text-sm sm:text-base text-gray-700">
                상단에 <strong>"사용자 인증 정보 만들기"</strong> - <strong>"API 키"</strong> 선택 후 이름(상관없음) <strong>"만들기"</strong> 클릭
              </p>
              <div className="border rounded-lg overflow-hidden bg-gray-50">
                <img
                  src="/guide/10.JPG"
                  alt="API 키 만들기"
                  className="w-full h-auto max-w-full object-contain"
                  loading="lazy"
                />
              </div>
              <p className="text-sm sm:text-base text-gray-700">
                방금 생성한 <strong>API 키 클릭</strong> 후 상단 <strong>"추가 정보"</strong> → <strong>"키 표시"</strong> 클릭
              </p>

              {/* API 키 생성 완료 이미지 */}
              <div className="border rounded-lg overflow-hidden bg-gray-50">
                <img
                  src="/guide/12.JPG"
                  alt="API 키 생성 완료"
                  className="w-full h-auto max-w-full object-contain"
                  loading="lazy"
                />
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-green-800">
                  <strong>✅ 완료!</strong> 복사한 API 키를 검색 페이지의 "API 키 입력" 란에 붙여넣으면 됩니다.
                </p>
              </div>
            </div>
          </section>

          {/* 참고사항 */}
          <section className="bg-blue-50 rounded-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">📌 참고사항</h3>
            <ul className="space-y-2 text-sm sm:text-base text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <span>API 키는 <strong>무료</strong>이며, 하루 <strong>10,000 units</strong>까지 사용 가능합니다.</span>
                  <div className="mt-1 text-sm text-gray-600 ml-0">
                    - 채널 검색 (50개): 약 99회<br />
                    - 키워드 검색 (200개): 약 24회
                  </div>
                  <div className="mt-2 text-sm text-red-600 font-semibold">
                    - 할당량 모두 소진 시 API 키를 추가 발급하여 사용 가능
                  </div>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>할당량은 매일 자정(PST 기준, 한국시간 오후 4-5시)에 리셋됩니다.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>API 키는 비밀번호처럼 관리하고, 다른 사람과 공유하지 마세요.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>API 키는 암호화되어 브라우저에만 저장되며, 서버로 전송되지 않습니다.</span>
              </li>
            </ul>
          </section>

          {/* 하단 버튼 */}
          <div className="flex justify-center pt-6 sm:pt-8">
            <Link
              href="/search"
              className="bg-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-base"
            >
              검색 시작하기 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
