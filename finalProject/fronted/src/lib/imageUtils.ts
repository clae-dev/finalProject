/**
 * Canvas API로 이미지를 리사이즈 + 압축하여 File 반환
 * @param file     원본 File (image/*)
 * @param maxWidth 최대 가로 픽셀 (세로는 비율 유지)
 * @param quality  JPEG/WebP 품질 0~1
 * @returns        압축된 File (동일 name, 타입은 webp or jpeg)
 */

// WebP 지원 여부를 한 번만 확인해 캐싱
const supportsWebP: boolean = (() => {
  try {
    const c = document.createElement('canvas');
    c.width = 1; c.height = 1;
    return c.toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    return false;
  }
})();

const MIME_TYPE = supportsWebP ? 'image/webp' : 'image/jpeg';
const EXT      = supportsWebP ? 'webp' : 'jpg';

export async function compressImage(
  file: File,
  maxWidth: number,
  quality: number
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxWidth / img.naturalWidth);
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error('압축 실패')); return; }
          const name = file.name.replace(/\.[^.]+$/, `.${EXT}`);
          resolve(new File([blob], name, { type: MIME_TYPE }));
        },
        MIME_TYPE,
        quality
      );
    };
    img.onerror = reject;
    img.src = url;
  });
}
