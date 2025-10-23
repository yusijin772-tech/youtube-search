import * as XLSX from 'xlsx';
import { YouTubeChannel } from '../youtube/api';

/**
 * 채널 정보를 엑셀 파일로 변환하여 다운로드
 */

export interface ExcelExportOptions {
  filename?: string;
  sheetName?: string;
}

/**
 * 채널 데이터를 엑셀로 내보내기
 */
export function exportChannelsToExcel(
  channels: YouTubeChannel[],
  options: ExcelExportOptions = {}
): void {
  const { filename = 'youtube_channels.xlsx', sheetName = 'Channels' } = options;

  // 엑셀에 표시할 데이터 구조화
  const data = channels.map((channel, index) => ({
    번호: index + 1,
    채널명: channel.title,
    채널ID: channel.id,
    '구독자 수': formatNumber(parseInt(channel.subscriberCount)),
    '동영상 수': formatNumber(parseInt(channel.videoCount)),
    '총 조회수': formatNumber(parseInt(channel.viewCount)),
    이메일: channel.email || '없음',
    '커스텀 URL': channel.customUrl || '없음',
    설명: cleanDescription(channel.description),
    'URL': `https://www.youtube.com/channel/${channel.id}`,
  }));

  // 워크북 생성
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 열 너비 설정
  const columnWidths = [
    { wch: 5 },  // 번호
    { wch: 30 }, // 채널명
    { wch: 30 }, // 채널ID
    { wch: 15 }, // 구독자 수
    { wch: 15 }, // 동영상 수
    { wch: 15 }, // 총 조회수
    { wch: 30 }, // 이메일
    { wch: 20 }, // 커스텀 URL
    { wch: 50 }, // 설명
    { wch: 50 }, // URL
  ];
  worksheet['!cols'] = columnWidths;

  // 워크북에 워크시트 추가
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // 파일 다운로드
  XLSX.writeFile(workbook, filename);
}

/**
 * CSV로 내보내기
 */
export function exportChannelsToCsv(
  channels: YouTubeChannel[],
  filename: string = 'youtube_channels.csv'
): void {
  const data = channels.map((channel, index) => ({
    번호: index + 1,
    채널명: channel.title,
    채널ID: channel.id,
    '구독자 수': channel.subscriberCount,
    '동영상 수': channel.videoCount,
    '총 조회수': channel.viewCount,
    이메일: channel.email || '없음',
    '커스텀 URL': channel.customUrl || '없음',
    설명: cleanDescription(channel.description),
    'URL': `https://www.youtube.com/channel/${channel.id}`,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);

  // CSV 파일 다운로드
  const blob = new Blob(['\uFEFF' + csv], {
    type: 'text/csv;charset=utf-8;',
  });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 숫자를 천 단위 구분 기호로 포맷
 */
function formatNumber(num: number): string {
  if (isNaN(num)) return '0';
  return num.toLocaleString('ko-KR');
}

/**
 * 설명 텍스트 정리 (줄바꿈 제거, 길이 제한)
 */
function cleanDescription(description: string): string {
  if (!description) return '';

  // 줄바꿈을 공백으로 변경
  let cleaned = description.replace(/\n/g, ' ');

  // 연속된 공백을 하나로
  cleaned = cleaned.replace(/\s+/g, ' ');

  // 길이 제한 (300자)
  if (cleaned.length > 300) {
    cleaned = cleaned.substring(0, 300) + '...';
  }

  return cleaned.trim();
}

/**
 * 간단한 통계 정보를 포함한 엑셀 생성
 */
export function exportChannelsWithStats(
  channels: YouTubeChannel[],
  filename: string = 'youtube_channels_with_stats.xlsx'
): void {
  // 채널 데이터
  const channelData = channels.map((channel, index) => ({
    번호: index + 1,
    채널명: channel.title,
    채널ID: channel.id,
    '구독자 수': parseInt(channel.subscriberCount),
    '동영상 수': parseInt(channel.videoCount),
    '총 조회수': parseInt(channel.viewCount),
    이메일: channel.email || '없음',
    '커스텀 URL': channel.customUrl || '없음',
    'URL': `https://www.youtube.com/channel/${channel.id}`,
  }));

  // 통계 데이터
  const totalSubscribers = channels.reduce(
    (sum, ch) => sum + parseInt(ch.subscriberCount),
    0
  );
  const totalVideos = channels.reduce(
    (sum, ch) => sum + parseInt(ch.videoCount),
    0
  );
  const totalViews = channels.reduce(
    (sum, ch) => sum + parseInt(ch.viewCount),
    0
  );
  const avgSubscribers = Math.round(totalSubscribers / channels.length);

  const statsData = [
    { 항목: '총 채널 수', 값: channels.length },
    { 항목: '총 구독자 수', 값: formatNumber(totalSubscribers) },
    { 항목: '총 동영상 수', 값: formatNumber(totalVideos) },
    { 항목: '총 조회수', 값: formatNumber(totalViews) },
    { 항목: '평균 구독자 수', 값: formatNumber(avgSubscribers) },
  ];

  // 워크북 생성
  const workbook = XLSX.utils.book_new();

  // 채널 시트
  const channelSheet = XLSX.utils.json_to_sheet(channelData);
  channelSheet['!cols'] = [
    { wch: 5 },
    { wch: 30 },
    { wch: 30 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 30 },
    { wch: 20 },
    { wch: 50 },
  ];
  XLSX.utils.book_append_sheet(workbook, channelSheet, '채널 목록');

  // 통계 시트
  const statsSheet = XLSX.utils.json_to_sheet(statsData);
  statsSheet['!cols'] = [{ wch: 20 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(workbook, statsSheet, '통계');

  // 파일 다운로드
  XLSX.writeFile(workbook, filename);
}
