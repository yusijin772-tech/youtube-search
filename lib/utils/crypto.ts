/**
 * 간단한 암호화/복호화 유틸리티
 * 브라우저 localStorage에 민감한 정보를 저장할 때 사용
 */

const SECRET_KEY = 'youtube-finder-secret-2025'; // 앱별 고유 키

/**
 * 문자열을 암호화합니다 (AES-like 방식)
 */
export function encryptApiKey(plainText: string): string {
  if (!plainText) return '';

  try {
    // 1. Base64 인코딩
    const base64 = btoa(plainText);

    // 2. 간단한 XOR 암호화 추가
    let encrypted = '';
    for (let i = 0; i < base64.length; i++) {
      const charCode = base64.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
      encrypted += String.fromCharCode(charCode);
    }

    // 3. 다시 Base64로 인코딩
    return btoa(encrypted);
  } catch (error) {
    console.error('Encryption failed:', error);
    return plainText; // 암호화 실패 시 원문 반환
  }
}

/**
 * 암호화된 문자열을 복호화합니다
 */
export function decryptApiKey(encryptedText: string): string {
  if (!encryptedText) return '';

  try {
    // 1. Base64 디코딩
    const xorEncrypted = atob(encryptedText);

    // 2. XOR 복호화
    let base64 = '';
    for (let i = 0; i < xorEncrypted.length; i++) {
      const charCode = xorEncrypted.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
      base64 += String.fromCharCode(charCode);
    }

    // 3. Base64 디코딩
    return atob(base64);
  } catch (error) {
    console.error('Decryption failed:', error);
    return ''; // 복호화 실패 시 빈 문자열
  }
}

/**
 * localStorage에 암호화해서 저장
 */
export function setEncryptedItem(key: string, value: string): void {
  const encrypted = encryptApiKey(value);
  localStorage.setItem(key, encrypted);
}

/**
 * localStorage에서 복호화해서 가져오기
 */
export function getEncryptedItem(key: string): string | null {
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return null;

  return decryptApiKey(encrypted);
}

/**
 * localStorage에서 삭제
 */
export function removeEncryptedItem(key: string): void {
  localStorage.removeItem(key);
}
