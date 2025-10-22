'use client';

import { useState } from 'react';
import { YouTubeChannel } from '@/lib/youtube/api';
import { exportChannelsToExcel, exportChannelsToCsv, exportChannelsWithStats } from '@/lib/excel/generator';

interface ResultTableProps {
  channels: YouTubeChannel[];
}

type SortKey = 'title' | 'subscriberCount' | 'videoCount' | 'viewCount';
type SortDirection = 'asc' | 'desc';

export default function ResultTable({ channels }: ResultTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('subscriberCount');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const sortedChannels = [...channels].sort((a, b) => {
    let aValue: string | number = a[sortKey];
    let bValue: string | number = b[sortKey];

    if (sortKey !== 'title') {
      aValue = parseInt(aValue as string) || 0;
      bValue = parseInt(bValue as string) || 0;
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const formatNumber = (num: string): string => {
    const parsed = parseInt(num);
    return parsed.toLocaleString('ko-KR');
  };

  const handleExportExcel = () => {
    exportChannelsToExcel(channels);
  };

  const handleExportCsv = () => {
    exportChannelsToCsv(channels);
  };

  const handleExportWithStats = () => {
    exportChannelsWithStats(channels);
  };

  if (channels.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <h2 className="text-lg sm:text-xl font-semibold">
          검색 결과 ({channels.length}개 채널)
        </h2>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleExportExcel}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition-colors"
          >
            📊 엑셀 다운로드
          </button>
          <button
            onClick={handleExportCsv}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
          >
            📄 CSV 다운로드
          </button>
          <button
            onClick={handleExportWithStats}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium transition-colors"
          >
            📈 통계 포함
          </button>
        </div>
      </div>

      {/* 데스크톱: 테이블 */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">번호</th>
              <th className="px-4 py-3 text-left">썸네일</th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('title')}
              >
                채널명 {sortKey === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-4 py-3 text-right cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('subscriberCount')}
              >
                구독자 수 {sortKey === 'subscriberCount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-4 py-3 text-right cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('videoCount')}
              >
                동영상 수 {sortKey === 'videoCount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-4 py-3 text-right cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('viewCount')}
              >
                조회수 {sortKey === 'viewCount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-left">이메일</th>
              <th className="px-4 py-3 text-left">링크</th>
            </tr>
          </thead>
          <tbody>
            {sortedChannels.map((channel, index) => (
              <tr key={channel.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">
                  {channel.thumbnailUrl && (
                    <img
                      src={channel.thumbnailUrl}
                      alt={channel.title}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                </td>
                <td className="px-4 py-3 font-medium">{channel.title}</td>
                <td className="px-4 py-3 text-right">
                  {formatNumber(channel.subscriberCount)}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatNumber(channel.videoCount)}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatNumber(channel.viewCount)}
                </td>
                <td className="px-4 py-3">
                  {channel.email || (
                    <span className="text-gray-400">없음</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`https://www.youtube.com/channel/${channel.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    채널 방문
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모바일: 카드형 */}
      <div className="md:hidden space-y-4">
        {sortedChannels.map((channel, index) => (
          <div key={channel.id} className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-sm font-bold text-gray-500 min-w-[30px]">
                #{index + 1}
              </span>
              {channel.thumbnailUrl && (
                <img
                  src={channel.thumbnailUrl}
                  alt={channel.title}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-gray-900 mb-1 break-words">
                  {channel.title}
                </h3>
                <a
                  href={`https://www.youtube.com/channel/${channel.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-red-600 hover:text-red-800 inline-block"
                >
                  🔗 채널 보기
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-white p-2 rounded">
                <div className="text-xs text-gray-500">구독자</div>
                <div className="font-semibold text-gray-900">
                  {formatNumber(channel.subscriberCount)}
                </div>
              </div>
              <div className="bg-white p-2 rounded">
                <div className="text-xs text-gray-500">동영상</div>
                <div className="font-semibold text-gray-900">
                  {formatNumber(channel.videoCount)}
                </div>
              </div>
              <div className="bg-white p-2 rounded col-span-2">
                <div className="text-xs text-gray-500">조회수</div>
                <div className="font-semibold text-gray-900">
                  {formatNumber(channel.viewCount)}
                </div>
              </div>
              {channel.email && (
                <div className="bg-white p-2 rounded col-span-2">
                  <div className="text-xs text-gray-500">이메일</div>
                  <div className="font-medium text-gray-900 text-xs break-all">
                    {channel.email}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-md">
        <h3 className="font-semibold text-sm mb-2">요약 통계</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">총 구독자</div>
            <div className="font-semibold">
              {formatNumber(
                channels
                  .reduce((sum, ch) => sum + parseInt(ch.subscriberCount), 0)
                  .toString()
              )}
            </div>
          </div>
          <div>
            <div className="text-gray-600">총 동영상</div>
            <div className="font-semibold">
              {formatNumber(
                channels
                  .reduce((sum, ch) => sum + parseInt(ch.videoCount), 0)
                  .toString()
              )}
            </div>
          </div>
          <div>
            <div className="text-gray-600">총 조회수</div>
            <div className="font-semibold">
              {formatNumber(
                channels
                  .reduce((sum, ch) => sum + parseInt(ch.viewCount), 0)
                  .toString()
              )}
            </div>
          </div>
          <div>
            <div className="text-gray-600">평균 구독자</div>
            <div className="font-semibold">
              {formatNumber(
                Math.round(
                  channels.reduce((sum, ch) => sum + parseInt(ch.subscriberCount), 0) /
                    channels.length
                ).toString()
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
