/**
 * YouTube URL에서 채널 ID 또는 핸들을 추출하는 유틸리티
 */

export interface ExtractedChannel {
  type: 'id' | 'handle' | 'invalid';
  value: string;
}

/**
 * YouTube URL에서 채널 ID 또는 핸들 추출
 *
 * 지원하는 URL 형식:
 * - https://www.youtube.com/channel/UCxxx
 * - https://www.youtube.com/@username
 * - https://youtube.com/c/customname
 * - UCxxx (직접 ID)
 * - @username (직접 핸들)
 */
export function extractChannelFromUrl(url: string): ExtractedChannel {
  if (!url || typeof url !== 'string') {
    return { type: 'invalid', value: '' };
  }

  const trimmedUrl = url.trim();

  // 1. 직접 채널 ID (UC로 시작하는 24자)
  if (/^UC[\w-]{22}$/.test(trimmedUrl)) {
    return { type: 'id', value: trimmedUrl };
  }

  // 2. 직접 핸들 (@로 시작)
  if (trimmedUrl.startsWith('@')) {
    return { type: 'handle', value: trimmedUrl };
  }

  // 3. URL 파싱
  try {
    let urlObj: URL;

    // URL이 프로토콜이 없으면 추가
    if (!trimmedUrl.startsWith('http')) {
      urlObj = new URL('https://' + trimmedUrl);
    } else {
      urlObj = new URL(trimmedUrl);
    }

    const pathname = urlObj.pathname;

    // /channel/UCxxx 형식
    const channelMatch = pathname.match(/\/channel\/(UC[\w-]{22})/);
    if (channelMatch) {
      return { type: 'id', value: channelMatch[1] };
    }

    // /@username 형식
    const handleMatch = pathname.match(/\/@([\w-]+)/);
    if (handleMatch) {
      return { type: 'handle', value: '@' + handleMatch[1] };
    }

    // /c/customname 형식 (레거시)
    const customMatch = pathname.match(/\/c\/([\w-]+)/);
    if (customMatch) {
      return { type: 'handle', value: '@' + customMatch[1] };
    }

    // /user/username 형식 (레거시)
    const userMatch = pathname.match(/\/user\/([\w-]+)/);
    if (userMatch) {
      return { type: 'handle', value: '@' + userMatch[1] };
    }

    return { type: 'invalid', value: '' };
  } catch (error) {
    console.error('URL parsing error:', error);
    return { type: 'invalid', value: '' };
  }
}

/**
 * 여러 URL에서 채널 ID/핸들 추출 (중복 제거)
 */
export function extractChannelsFromUrls(urls: string[]): {
  ids: string[];
  handles: string[];
  invalid: string[];
} {
  const ids = new Set<string>();
  const handles = new Set<string>();
  const invalid: string[] = [];

  for (const url of urls) {
    const result = extractChannelFromUrl(url);

    if (result.type === 'id') {
      ids.add(result.value);
    } else if (result.type === 'handle') {
      handles.add(result.value);
    } else {
      invalid.push(url);
    }
  }

  return {
    ids: Array.from(ids),
    handles: Array.from(handles),
    invalid,
  };
}

/**
 * 채널 ID 유효성 검증
 */
export function isValidChannelId(id: string): boolean {
  return /^UC[\w-]{22}$/.test(id);
}

/**
 * 핸들 유효성 검증
 */
export function isValidHandle(handle: string): boolean {
  return /^@[\w-]+$/.test(handle);
}
