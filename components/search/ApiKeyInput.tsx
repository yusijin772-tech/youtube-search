'use client';

import { useState, useEffect } from 'react';
import { validateAPIKey } from '@/lib/youtube/api';
import { setEncryptedItem, getEncryptedItem, removeEncryptedItem } from '@/lib/utils/crypto';

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
}

export default function ApiKeyInput({ onApiKeyChange }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<
    'none' | 'valid' | 'invalid'
  >('none');

  // 로컬스토리지에서 암호화된 API 키 불러오기
  useEffect(() => {
    const savedApiKey = getEncryptedItem('youtube_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      onApiKeyChange(savedApiKey);
      setValidationStatus('valid');
    }
  }, [onApiKeyChange]);

  const handleValidate = async () => {
    if (!apiKey.trim()) {
      alert('API 키를 입력해주세요.');
      return;
    }

    setIsValidating(true);
    setValidationStatus('none');

    try {
      const isValid = await validateAPIKey(apiKey.trim());

      if (isValid) {
        setValidationStatus('valid');
        // 암호화해서 저장
        setEncryptedItem('youtube_api_key', apiKey.trim());
        onApiKeyChange(apiKey.trim());
        alert('API 키가 유효합니다! (암호화되어 안전하게 저장되었습니다)');
      } else {
        setValidationStatus('invalid');
        alert('유효하지 않은 API 키입니다.');
      }
    } catch (error) {
      setValidationStatus('invalid');
      alert('API 키 검증 중 오류가 발생했습니다.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleClear = () => {
    setApiKey('');
    setValidationStatus('none');
    removeEncryptedItem('youtube_api_key');
    onApiKeyChange('');
    alert('API 키가 삭제되었습니다.');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">YouTube API 키 설정</h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="api-key"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            API 키
          </label>
          <input
            id="api-key"
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="YouTube Data API v3 키를 입력하세요"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            disabled={isValidating}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleValidate}
            disabled={isValidating}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isValidating ? '검증 중...' : 'API 키 검증'}
          </button>

          {validationStatus === 'valid' && (
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              초기화
            </button>
          )}
        </div>

        {validationStatus === 'valid' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="text-green-700 font-semibold text-sm">
              ✓ 유효한 API 키입니다. 검색을 시작할 수 있습니다.
            </div>
            <div className="text-green-600 text-xs mt-1">
              🔒 API 키가 암호화되어 브라우저에 안전하게 저장되었습니다.
            </div>
          </div>
        )}

        {validationStatus === 'invalid' && (
          <div className="text-red-600 text-sm">
            ✗ 유효하지 않은 API 키입니다. 다시 확인해주세요.
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-gray-700">
            <strong>API 키 발급 방법:</strong>
          </p>
          <ol className="text-sm text-gray-600 mt-2 space-y-1 list-decimal list-inside">
            <li>
              <a
                href="https://console.cloud.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google Cloud Console
              </a>
              에 접속
            </li>
            <li>새 프로젝트 생성 또는 기존 프로젝트 선택</li>
            <li>YouTube Data API v3 활성화</li>
            <li>사용자 인증 정보에서 API 키 생성</li>
          </ol>

          <a
            href="/api-guide"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            📖 자세히 알아보기
          </a>
        </div>

        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-xs text-gray-600">
            🔐 <strong>보안:</strong> API 키는 XOR + Base64 암호화되어 저장됩니다.
            공용 컴퓨터 사용 후에는 반드시 "초기화" 버튼을 눌러주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
