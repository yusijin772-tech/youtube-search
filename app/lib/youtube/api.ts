// YouTube Data API v3 관련 타입 정의
export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
  thumbnailUrl: string;
  customUrl?: string;
  email?: string;
}

// YouTube API 에러 타입
export class YouTubeAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorType: 'quota' | 'auth' | 'rateLimit' | 'network' | 'unknown'
  ) {
    super(message);
    this.name = 'YouTubeAPIError';
  }
}

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * YouTube API 응답 에러 처리
 */
async function handleApiError(response: Response): Promise<never> {
  let errorMessage = '알 수 없는 오류가 발생했습니다.';
  let errorType: 'quota' | 'auth' | 'rateLimit' | 'network' | 'unknown' = 'unknown';

  try {
    const errorData = await response.json();

    if (errorData.error) {
      const error = errorData.error;

      // 할당량 초과 (403 quotaExceeded)
      if (response.status === 403 && error.errors?.some((e: any) => e.reason === 'quotaExceeded')) {
        errorType = 'quota';
        errorMessage = `⚠️ API 할당량이 초과되었습니다!\n\n오늘 사용 가능한 YouTube API 할당량(10,000 units)을 모두 사용했습니다.\n\n해결 방법:\n1. 내일 자정(PST 기준)에 자동으로 리셋됩니다\n2. 다른 API 키를 사용하세요\n3. Google Cloud Console에서 유료 플랜으로 업그레이드하세요`;
      }
      // 요청 제한 초과 (429 Too Many Requests)
      else if (response.status === 429 || error.errors?.some((e: any) => e.reason === 'rateLimitExceeded')) {
        errorType = 'rateLimit';
        errorMessage = `⚠️ 요청이 너무 빠릅니다!\n\n잠시 후 다시 시도해주세요. (약 1-2분 후)`;
      }
      // 인증 오류 (401, 403)
      else if (response.status === 401 || response.status === 403) {
        errorType = 'auth';
        errorMessage = `⚠️ API 키 인증 오류!\n\nAPI 키가 유효하지 않거나 YouTube Data API v3가 활성화되지 않았습니다.\n\n확인사항:\n1. API 키가 올바른지 확인\n2. YouTube Data API v3가 활성화되어 있는지 확인\n3. API 키 제한 설정 확인`;
      }
      // 기타 에러
      else {
        errorMessage = error.message || `API 오류: ${response.statusText}`;
      }
    }
  } catch (parseError) {
    errorMessage = `API 요청 실패: ${response.statusText}`;
  }

  throw new YouTubeAPIError(errorMessage, response.status, errorType);
}

/**
 * API 키 유효성 검증
 * YouTube의 유명 채널 ID로 테스트 (Google의 공식 채널)
 */
export async function validateAPIKey(apiKey: string): Promise<boolean> {
  try {
    // Google의 공식 YouTube 채널 ID로 테스트
    const testChannelId = 'UC_x5XG1OV2P6uZZ5FSM9Ttw'; // Google Developers
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/channels?part=snippet&id=${testChannelId}&key=${apiKey}`
    );

    if (!response.ok) {
      // 검증은 단순 true/false 반환
      return false;
    }

    const data = await response.json();
    // 응답이 유효한지 확인
    return data.items && data.items.length > 0;
  } catch (error) {
    console.error('API key validation failed:', error);
    return false;
  }
}

/**
 * 채널 ID 배열로 채널 정보 가져오기 (최대 50개)
 */
export async function getChannelsByIds(
  channelIds: string[],
  apiKey: string
): Promise<YouTubeChannel[]> {
  if (channelIds.length === 0) {
    return [];
  }

  // YouTube API는 한 번에 최대 50개의 ID를 처리할 수 있음
  const chunks: string[][] = [];
  for (let i = 0; i < channelIds.length; i += 50) {
    chunks.push(channelIds.slice(i, i + 50));
  }

  const allChannels: YouTubeChannel[] = [];

  for (const chunk of chunks) {
    try {
      const ids = chunk.join(',');
      const response = await fetch(
        `${YOUTUBE_API_BASE_URL}/channels?part=snippet,statistics&id=${ids}&key=${apiKey}`
      );

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();

      if (data.items) {
        const channels = data.items.map((item: any) => ({
          id: item.id,
          title: item.snippet.title,
          description: item.snippet.description,
          subscriberCount: item.statistics.subscriberCount || '0',
          videoCount: item.statistics.videoCount || '0',
          viewCount: item.statistics.viewCount || '0',
          thumbnailUrl: item.snippet.thumbnails?.default?.url || '',
          customUrl: item.snippet.customUrl,
          email: extractEmailFromDescription(item.snippet.description),
        }));

        allChannels.push(...channels);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
      throw error;
    }
  }

  return allChannels;
}

/**
 * 키워드로 채널 검색 (페이지네이션 지원)
 */
export async function searchChannelsByKeyword(
  keyword: string,
  apiKey: string,
  maxResults: number = 50
): Promise<YouTubeChannel[]> {
  try {
    const allChannelIds = new Set<string>();
    let pageToken: string | undefined = undefined;
    const perPage = 50; // API 최대값
    const totalPages = Math.ceil(maxResults / perPage);

    // 페이지네이션으로 여러 번 요청
    for (let page = 0; page < totalPages; page++) {
      const currentMaxResults = Math.min(perPage, maxResults - (page * perPage));

      let url: string;
      if (pageToken) {
        url = `${YOUTUBE_API_BASE_URL}/search?part=snippet&type=channel&q=${encodeURIComponent(
          keyword
        )}&maxResults=${currentMaxResults}&pageToken=${pageToken}&key=${apiKey}`;
      } else {
        url = `${YOUTUBE_API_BASE_URL}/search?part=snippet&type=channel&q=${encodeURIComponent(
          keyword
        )}&maxResults=${currentMaxResults}&key=${apiKey}`;
      }

      const searchResponse = await fetch(url);

      if (!searchResponse.ok) {
        await handleApiError(searchResponse);
      }

      const searchData = await searchResponse.json();

      if (!searchData.items || searchData.items.length === 0) {
        break;
      }

      // 채널 ID 수집 (중복 제거)
      searchData.items.forEach((item: any) => {
        allChannelIds.add(item.snippet.channelId);
      });

      // 다음 페이지 토큰
      pageToken = searchData.nextPageToken;

      // 다음 페이지가 없으면 중단
      if (!pageToken) {
        break;
      }

      // API 요청 간격 (Rate Limit 방지)
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (allChannelIds.size === 0) {
      return [];
    }

    // 채널 상세 정보 가져오기
    return await getChannelsByIds(Array.from(allChannelIds), apiKey);
  } catch (error) {
    console.error('Error searching channels:', error);
    throw error;
  }
}

/**
 * 영상 기반 키워드 검색 (영상을 검색하여 채널 정보 추출)
 * @param keyword - 검색 키워드
 * @param apiKey - YouTube API 키
 * @param maxResults - 최대 결과 수
 */
export async function searchChannelsByVideoKeyword(
  keyword: string,
  apiKey: string,
  maxResults: number = 50
): Promise<YouTubeChannel[]> {
  try {
    const allChannelIds = new Set<string>();
    let pageToken: string | undefined = undefined;
    const perPage = 50; // API 최대값
    const totalPages = Math.ceil(maxResults / perPage);

    // 페이지네이션으로 여러 번 요청
    for (let page = 0; page < totalPages; page++) {
      const currentMaxResults = Math.min(perPage, maxResults - (page * perPage));

      let url: string;
      if (pageToken) {
        url = `${YOUTUBE_API_BASE_URL}/search?part=snippet&type=video&q=${encodeURIComponent(
          keyword
        )}&maxResults=${currentMaxResults}&pageToken=${pageToken}&key=${apiKey}`;
      } else {
        url = `${YOUTUBE_API_BASE_URL}/search?part=snippet&type=video&q=${encodeURIComponent(
          keyword
        )}&maxResults=${currentMaxResults}&key=${apiKey}`;
      }

      const searchResponse = await fetch(url);

      if (!searchResponse.ok) {
        await handleApiError(searchResponse);
      }

      const searchData = await searchResponse.json();

      if (!searchData.items || searchData.items.length === 0) {
        break;
      }

      // 영상의 채널 ID 수집 (중복 제거)
      searchData.items.forEach((item: any) => {
        if (item.snippet.channelId) {
          allChannelIds.add(item.snippet.channelId);
        }
      });

      // 다음 페이지 토큰
      pageToken = searchData.nextPageToken;

      // 다음 페이지가 없으면 중단
      if (!pageToken) {
        break;
      }

      // API 요청 간격 (Rate Limit 방지)
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (allChannelIds.size === 0) {
      return [];
    }

    // 채널 상세 정보 가져오기
    return await getChannelsByIds(Array.from(allChannelIds), apiKey);
  } catch (error) {
    console.error('Error searching channels by video:', error);
    throw error;
  }
}

/**
 * 채널 설명에서 이메일 추출
 */
function extractEmailFromDescription(description: string): string | undefined {
  if (!description) return undefined;

  // 이메일 정규 표현식
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  const matches = description.match(emailRegex);

  return matches ? matches[0] : undefined;
}

/**
 * @handle 형식의 URL에서 채널 ID 가져오기
 */
export async function getChannelIdByHandle(
  handle: string,
  apiKey: string
): Promise<string | null> {
  try {
    // @ 제거
    const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle;

    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/search?part=snippet&type=channel&q=${encodeURIComponent(
        cleanHandle
      )}&maxResults=1&key=${apiKey}`
    );

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      return data.items[0].snippet.channelId;
    }

    return null;
  } catch (error) {
    console.error('Error getting channel ID by handle:', error);
    return null;
  }
}
