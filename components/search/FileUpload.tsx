'use client';

import { useState, useRef } from 'react';
import { parseFileForUrls } from '@/lib/excel/parser';

interface FileUploadProps {
  onUrlsExtracted: (urls: string[]) => void;
  disabled?: boolean;
}

export default function FileUpload({ onUrlsExtracted, disabled }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setUploadedFile(file);

    try {
      const result = await parseFileForUrls(file);

      if (result.errors.length > 0) {
        alert(result.errors.join('\n'));
      }

      if (result.urls.length > 0) {
        onUrlsExtracted(result.urls);
        alert(`${result.urls.length}개의 URL을 찾았습니다.`);
      }
    } catch (error) {
      console.error('File processing error:', error);
      alert('파일 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleButtonClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleClear = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">파일 업로드</h2>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-red-500 bg-red-50'
            : disabled
            ? 'border-gray-200 bg-gray-50'
            : 'border-gray-300 hover:border-red-400'
        } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        {isProcessing ? (
          <div className="space-y-2">
            <div className="text-gray-600">파일 처리 중...</div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 animate-pulse w-1/2"></div>
            </div>
          </div>
        ) : uploadedFile ? (
          <div className="space-y-2">
            <div className="text-green-600 text-lg">✓ 파일 업로드 완료</div>
            <div className="text-gray-600 text-sm">{uploadedFile.name}</div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
            >
              파일 제거
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-gray-600 text-lg">
              {disabled
                ? 'API 키를 먼저 입력해주세요'
                : '파일을 드래그하거나 클릭하여 업로드'}
            </div>
            <div className="text-gray-400 text-sm">
              .xlsx, .xls, .csv 파일 지원
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-700 font-medium mb-2">
          파일 형식 안내:
        </p>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>엑셀 또는 CSV 파일 내 모든 셀에서 YouTube URL을 자동으로 추출합니다</li>
          <li>채널 URL 형식: https://www.youtube.com/channel/UCxxx</li>
          <li>핸들 URL 형식: https://www.youtube.com/@username</li>
          <li>중복된 URL은 자동으로 제거됩니다</li>
        </ul>
      </div>
    </div>
  );
}
