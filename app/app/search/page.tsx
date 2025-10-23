'use client';

import { useState } from 'react';
import ApiKeyInput from '@/components/search/ApiKeyInput';
import FileUpload from '@/components/search/FileUpload';
import ResultTable from '@/components/search/ResultTable';
import { YouTubeChannel, getChannelsByIds, getChannelIdByHandle, searchChannelsByKeyword, searchChannelsByVideoKeyword } from '@/lib/youtube/api';
import { extractChannelsFromUrls } from '@/lib/utils/extractChannelId';

export default function SearchPage() {
  const [apiKey, setApiKey] = useState('');
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [channelKeyword, setChannelKeyword] = useState('');
  const [videoKeyword, setVideoKeyword] = useState('');
  const [channelResultCount, setChannelResultCount] = useState<number>(50);
  const [videoResultCount, setVideoResultCount] = useState<number>(50);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
  };

  const handleUrlsExtracted = async (urls: string[]) => {
    if (!apiKey) {
      alert('API 키를 먼저 입력해주세요.');
      return;
    }

    setIsSearching(true);

    try {
      // URL에서 채널 ID와 핸들 추출
      const extracted = extractChannelsFromUrls(urls);

      // 핸들을 채널 ID로 변환
      const handleIds: string[] = [];
      for (const handle of extracted.handles) {
        const id = await getChannelIdByHandle(handle, apiKey);
        if (id) {
          handleIds.push(id);
        }
      }

      // 모든 채널 ID 합치기
      const allIds = [...extracted.ids, ...handleIds];

      if (allIds.length === 0) {
        alert('유효한 채널 ID를 찾을 수 없습니다.');
        setIsSearching(false);
        return;
      }

      // 채널 정보 가져오기
      const channelData = await getChannelsByIds(allIds, apiKey);
      setChannels(channelData);

      if (extracted.invalid.length > 0) {
        alert(
          `${channelData.length}개의 채널을 찾았습니다.\n유효하지 않은 URL ${extracted.invalid.length}개는 제외되었습니다.`
        );
      } else {
        alert(`${channelData.length}개의 채널을 찾았습니다.`);
      }
    } catch (error) {
      console.error('Search error:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('검색 중 오류가 발생했습니다. API 키를 확인해주세요.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleChannelSearch = async () => {
    if (!apiKey) {
      alert('API 키를 먼저 입력해주세요.');
      return;
    }

    if (!channelKeyword.trim()) {
      alert('검색 키워드를 입력해주세요.');
      return;
    }

    setIsSearching(true);

    try {
      const results = await searchChannelsByKeyword(channelKeyword.trim(), apiKey, channelResultCount);
      setChannels(results);
      alert(`${results.length}개의 채널을 찾았습니다.`);
    } catch (error) {
      console.error('Channel search error:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('검색 중 오류가 발생했습니다.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleVideoKeywordSearch = async () => {
    if (!apiKey) {
      alert('API 키를 먼저 입력해주세요.');
      return;
    }

    if (!videoKeyword.trim()) {
      alert('검색 키워드를 입력해주세요.');
      return;
    }

    setIsSearching(true);

    try {
      const results = await searchChannelsByVideoKeyword(videoKeyword.trim(), apiKey, videoResultCount);
      setChannels(results);
      alert(`${results.length}개의 채널을 찾았습니다. (영상 검색 기반)`);
    } catch (error) {
      console.error('Video keyword search error:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('검색 중 오류가 발생했습니다.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">YouTube 채널 검색</h1>
        <p className="text-gray-600">
          API 키를 입력하고 원하는 방법으로 채널을 검색하세요
        </p>
      </div>

      {/* API Key Input */}
      <ApiKeyInput onApiKeyChange={handleApiKeyChange} />

      {/* Channel Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2">채널 검색</h2>
        <p className="text-sm text-gray-600 mb-4">채널명으로 직접 검색합니다</p>

        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={channelKeyword}
              onChange={(e) => setChannelKeyword(e.target.value)}
              placeholder="채널명을 입력하세요 (예: 브이로그, 요리 등)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              disabled={!apiKey || isSearching}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleChannelSearch();
                }
              }}
            />
            <select
              value={channelResultCount}
              onChange={(e) => setChannelResultCount(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
              disabled={!apiKey || isSearching}
            >
              <option value={50}>50개</option>
              <option value={100}>100개</option>
              <option value={200}>200개</option>
            </select>
            <button
              onClick={handleChannelSearch}
              disabled={!apiKey || isSearching}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {isSearching ? '검색 중...' : '검색'}
            </button>
          </div>
        </div>
      </div>

      {/* Video Keyword Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2">키워드 검색 (영상 기반)</h2>
        <p className="text-sm text-gray-600 mb-4">
          해당 키워드가 포함된 영상을 찾아 채널 정보를 추출합니다
        </p>

        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={videoKeyword}
              onChange={(e) => setVideoKeyword(e.target.value)}
              placeholder="영상 키워드를 입력하세요 (예: 브이로그, 게임 등)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!apiKey || isSearching}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleVideoKeywordSearch();
                }
              }}
            />
            <select
              value={videoResultCount}
              onChange={(e) => setVideoResultCount(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={!apiKey || isSearching}
            >
              <option value={50}>50개</option>
              <option value={100}>100개</option>
              <option value={200}>200개</option>
            </select>
            <button
              onClick={handleVideoKeywordSearch}
              disabled={!apiKey || isSearching}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {isSearching ? '검색 중...' : '검색'}
            </button>
          </div>

          <div className="text-sm text-gray-500">
            💡 영상 검색 후 채널이 중복 제거되므로 실제 채널 수는 더 적을 수 있습니다
          </div>
        </div>
      </div>

      {/* File Upload */}
      <FileUpload onUrlsExtracted={handleUrlsExtracted} disabled={!apiKey || isSearching} />

      {/* Loading Indicator */}
      {isSearching && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-blue-700 font-semibold">검색 중입니다...</div>
          <div className="text-blue-600 text-sm mt-1">
            최대 {channelResultCount > videoResultCount ? channelResultCount : videoResultCount}개의 결과를 가져오는 중입니다. 잠시만 기다려주세요.
          </div>
        </div>
      )}

      {/* Results */}
      <ResultTable channels={channels} />
    </div>
  );
}
