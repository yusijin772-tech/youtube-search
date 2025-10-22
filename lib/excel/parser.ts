import * as XLSX from 'xlsx';
import Papa from 'papaparse';

/**
 * 엑셀/CSV 파일에서 YouTube URL 추출
 */

export interface ParseResult {
  urls: string[];
  errors: string[];
}

/**
 * 파일에서 YouTube URL 추출
 */
export async function parseFileForUrls(file: File): Promise<ParseResult> {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    return parseExcelFile(file);
  } else if (fileName.endsWith('.csv')) {
    return parseCsvFile(file);
  } else {
    return {
      urls: [],
      errors: ['지원하지 않는 파일 형식입니다. .xlsx, .xls, .csv 파일만 지원됩니다.'],
    };
  }
}

/**
 * 엑셀 파일 파싱
 */
async function parseExcelFile(file: File): Promise<ParseResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const urls = new Set<string>();
    const errors: string[] = [];

    // 모든 시트 순회
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      });

      // 모든 셀 순회
      jsonData.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell && typeof cell === 'string') {
            const extractedUrls = extractYouTubeUrls(cell);
            extractedUrls.forEach((url) => urls.add(url));
          }
        });
      });
    });

    return {
      urls: Array.from(urls),
      errors: urls.size === 0 ? ['YouTube URL을 찾을 수 없습니다.'] : [],
    };
  } catch (error) {
    console.error('Excel parsing error:', error);
    return {
      urls: [],
      errors: ['엑셀 파일 파싱 중 오류가 발생했습니다.'],
    };
  }
}

/**
 * CSV 파일 파싱
 */
async function parseCsvFile(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const urls = new Set<string>();

    Papa.parse(file, {
      complete: (results) => {
        // 모든 행과 열 순회
        results.data.forEach((row: any) => {
          if (Array.isArray(row)) {
            row.forEach((cell) => {
              if (cell && typeof cell === 'string') {
                const extractedUrls = extractYouTubeUrls(cell);
                extractedUrls.forEach((url) => urls.add(url));
              }
            });
          } else if (typeof row === 'object') {
            Object.values(row).forEach((cell) => {
              if (cell && typeof cell === 'string') {
                const extractedUrls = extractYouTubeUrls(cell);
                extractedUrls.forEach((url) => urls.add(url));
              }
            });
          }
        });

        resolve({
          urls: Array.from(urls),
          errors: urls.size === 0 ? ['YouTube URL을 찾을 수 없습니다.'] : [],
        });
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        resolve({
          urls: [],
          errors: ['CSV 파일 파싱 중 오류가 발생했습니다.'],
        });
      },
    });
  });
}

/**
 * 문자열에서 YouTube URL 추출
 */
function extractYouTubeUrls(text: string): string[] {
  const urls: string[] = [];

  // YouTube URL 패턴
  const patterns = [
    // https://www.youtube.com/channel/UCxxx
    /https?:\/\/(?:www\.)?youtube\.com\/channel\/(UC[\w-]{22})/gi,
    // https://www.youtube.com/@username
    /https?:\/\/(?:www\.)?youtube\.com\/@([\w-]+)/gi,
    // https://youtube.com/c/customname
    /https?:\/\/(?:www\.)?youtube\.com\/c\/([\w-]+)/gi,
    // https://youtube.com/user/username
    /https?:\/\/(?:www\.)?youtube\.com\/user\/([\w-]+)/gi,
  ];

  patterns.forEach((pattern) => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      urls.push(match[0]);
    }
  });

  // 채널 ID만 있는 경우 (UC로 시작하는 24자)
  const channelIdPattern = /\b(UC[\w-]{22})\b/g;
  const channelIdMatches = text.matchAll(channelIdPattern);
  for (const match of channelIdMatches) {
    // 이미 URL로 추출되지 않은 경우만 추가
    if (!urls.some((url) => url.includes(match[1]))) {
      urls.push(match[1]);
    }
  }

  return urls;
}

/**
 * 중복 URL 제거
 */
export function deduplicateUrls(urls: string[]): string[] {
  return Array.from(new Set(urls.map((url) => url.trim()).filter(Boolean)));
}
