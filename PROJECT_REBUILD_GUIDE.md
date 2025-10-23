# YouTuber Search 프로젝트 재구축 가이드

> 작성일: 2025-10-21
> 목적: 오류 없는 깔끔한 Next.js 프로젝트 새로 만들기

---

## 📋 사전 준비

### 1. 기존 프로젝트 정리
```cmd
cd /d "D:\커서AI\my project\youtuber_search"
```

**중요**: VSCode, 명령 프롬프트 등 모든 프로그램을 종료한 후:
- Windows 탐색기에서 `app` 폴더를 직접 삭제하거나 `app_old`로 이름 변경

---

## 🚀 Step 1: 새 Next.js 프로젝트 생성

### 1-1. 프로젝트 디렉토리로 이동
```cmd
cd /d "D:\커서AI\my project\youtuber_search"
```

### 1-2. Next.js 프로젝트 생성
```cmd
npx create-next-app@14.2.5 app
```

**설치 시 옵션 선택:**
- TypeScript? → **Yes**
- ESLint? → **Yes**
- Tailwind CSS? → **Yes**
- `src/` directory? → **No**
- App Router? → **Yes**
- import alias? → **Yes** (기본값 @/* 사용)

---

## 📦 Step 2: 필수 패키지 설치

### 2-1. app 폴더로 이동
```cmd
cd app
```

### 2-2. 필요한 패키지 설치
```cmd
npm install xlsx@0.18.5 papaparse@5.4.1
```

### 2-3. TypeScript 타입 정의 설치
```cmd
npm install --save-dev @types/papaparse@5.3.14
```

---

## 🏗️ Step 3: 프로젝트 구조 생성

### 3-1. 필요한 폴더 생성
```cmd
mkdir lib
mkdir lib\youtube
mkdir lib\excel
mkdir lib\utils
mkdir components
mkdir components\layout
mkdir components\search
```

### 3-2. 폴더 구조 확인
```
app/
├── app/                    (Next.js App Router - 자동 생성됨)
├── components/
│   ├── layout/
│   └── search/
├── lib/
│   ├── youtube/
│   ├── excel/
│   └── utils/
├── public/
├── package.json
└── tsconfig.json
```

---

## 📝 Step 4: 설정 파일 작성

### 4-1. next.config.js 수정
`app/next.config.js` 파일을 다음 내용으로 수정:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
```

### 4-2. tsconfig.json 확인
자동 생성된 파일 그대로 사용 (수정 불필요)

### 4-3. tailwind.config.js 확인
자동 생성된 파일 그대로 사용 (수정 불필요)

---

## 💻 Step 5: 핵심 라이브러리 파일 작성

### 5-1. YouTube API 연동 (`lib/youtube/api.ts`)

이 파일은 Claude Code에게 다음과 같이 요청:
```
app/lib/youtube/api.ts 파일을 만들어줘.
다음 기능이 필요해:
- getChannelsByIds(): 채널 ID 배열로 채널 정보 가져오기 (최대 50개)
- searchChannelsByKeyword(): 키워드로 채널 검색
- validateAPIKey(): API 키 유효성 검증
```

### 5-2. 채널 ID 추출 유틸 (`lib/utils/extractChannelId.ts`)

Claude Code에게 요청:
```
app/lib/utils/extractChannelId.ts 파일을 만들어줘.
YouTube URL에서 채널 ID를 추출하는 기능:
- channel/UCxxx 형식
- @handle 형식 (API로 변환 필요)
- 유효성 검증
```

### 5-3. 엑셀 파서 (`lib/excel/parser.ts`)

Claude Code에게 요청:
```
app/lib/excel/parser.ts 파일을 만들어줘.
엑셀/CSV 파일에서 YouTube URL 추출:
- xlsx, csv 형식 지원
- URL 중복 제거
- 빈 값 필터링
```

### 5-4. 엑셀 생성기 (`lib/excel/generator.ts`)

Claude Code에게 요청:
```
app/lib/excel/generator.ts 파일을 만들어줘.
채널 정보를 엑셀 파일로 변환:
- 채널명, 구독자수, 이메일 등
- 다운로드 기능
```

---

## 🎨 Step 6: 컴포넌트 작성

### 6-1. Header 컴포넌트 (`components/layout/Header.tsx`)
```
간단한 헤더 컴포넌트 만들어줘:
- 로고: "YouTuber Finder"
- 네비게이션: 홈, 검색
```

### 6-2. Footer 컴포넌트 (`components/layout/Footer.tsx`)
```
간단한 푸터 컴포넌트 만들어줘
```

### 6-3. API Key Input (`components/search/ApiKeyInput.tsx`)
```
API 키 입력 컴포넌트:
- 입력 필드
- localStorage 저장
- 유효성 검증 버튼
```

### 6-4. File Upload (`components/search/FileUpload.tsx`)
```
파일 업로드 컴포넌트:
- 드래그 앤 드롭
- .xlsx, .csv 파일 지원
- 파일 파싱
```

### 6-5. Result Table (`components/search/ResultTable.tsx`)
```
검색 결과 테이블:
- 채널명, 구독자수, 이메일 등 표시
- 엑셀 다운로드 버튼
- 정렬 기능
```

---

## 📄 Step 7: 페이지 작성

### 7-1. 메인 페이지 (`app/app/page.tsx`)
```
메인 랜딩 페이지:
- Hero 섹션
- 주요 기능 소개
- CTA 버튼 (검색 페이지로 이동)
```

### 7-2. 레이아웃 (`app/app/layout.tsx`)
자동 생성된 파일 확인 및 필요시 수정

### 7-3. 검색 페이지 (`app/app/search/page.tsx`)
```
검색 페이지:
- API Key Input
- File Upload
- 키워드 검색
- Result Table
```

### 7-4. 글로벌 스타일 (`app/app/globals.css`)
자동 생성된 Tailwind CSS 설정 사용

---

## ✅ Step 8: 테스트 및 실행

### 8-1. 개발 서버 시작
```cmd
cd /d "D:\커서AI\my project\youtuber_search\app"
npm run dev
```

### 8-2. 브라우저에서 확인
```
http://localhost:3000
```

### 8-3. 확인 사항
- [ ] 메인 페이지가 정상적으로 로드되는가?
- [ ] 검색 페이지로 이동이 가능한가?
- [ ] API 키 입력이 작동하는가?
- [ ] 파일 업로드가 작동하는가?
- [ ] 콘솔에 오류가 없는가?

---

## 🐛 문제 해결

### 문제 1: 포트가 이미 사용 중
```
Port 3000 is in use, trying 3001 instead.
```
→ 정상입니다. 3001 포트로 접속하세요.

### 문제 2: 모듈을 찾을 수 없음
```cmd
rm -rf node_modules package-lock.json
npm install
```

### 문제 3: 빌드 오류
```cmd
rm -rf .next
npm run dev
```

### 문제 4: TypeScript 오류
- `tsconfig.json`의 `strict` 옵션 확인
- 타입 정의 파일 설치 확인

---

## 📚 추가 작업 (선택사항)

### 환경 변수 설정
`.env.local` 파일 생성 (선택사항):
```
# YouTube API 키는 클라이언트에서 입력받으므로 불필요
# 필요시 기본값 설정
NEXT_PUBLIC_DEFAULT_API_KEY=
```

### README 작성
프로젝트 사용법 문서화

---

## 🎯 최종 체크리스트

- [ ] 1. 기존 app 폴더 삭제/백업
- [ ] 2. Next.js 프로젝트 생성 (create-next-app)
- [ ] 3. 필수 패키지 설치 (xlsx, papaparse)
- [ ] 4. 폴더 구조 생성
- [ ] 5. 설정 파일 작성
- [ ] 6. lib 파일들 작성 (youtube, excel, utils)
- [ ] 7. 컴포넌트 작성 (layout, search)
- [ ] 8. 페이지 작성 (메인, 검색)
- [ ] 9. 개발 서버 실행 및 테스트
- [ ] 10. 모든 기능 정상 작동 확인

---

## 💡 팁

1. **파일 작성 순서**: lib → components → pages
2. **각 파일을 하나씩 작성하고 바로 테스트**
3. **오류 발생 시 즉시 해결하고 다음 단계로**
4. **Git으로 버전 관리하면 더 안전** (선택사항)

---

## 🔗 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [YouTube Data API v3](https://developers.google.com/youtube/v3)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**작업 시작 전 확인:**
1. VSCode, 명령 프롬프트 모두 종료
2. 기존 `app` 폴더 완전히 삭제
3. 새 명령 프롬프트 열고 시작!

**이 문서를 따라하면 오류 없이 깔끔한 프로젝트를 만들 수 있습니다! 🚀**
