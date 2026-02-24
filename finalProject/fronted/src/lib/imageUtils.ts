/**
 * Canvas API로 이미지를 리사이즈 + 압축하여 File 반환
 * @param file     원본 File (image/*)
 * @param maxWidth 최대 가로 픽셀 (세로는 비율 유지)
 * @param quality  JPEG/WebP 품질 0~1
 * @returns        압축된 File (동일 name, 타입은 webp or jpeg)
 */
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
      const mimeType = canvas.toDataURL('image/webp').startsWith('data:image/webp')
        ? 'image/webp' : 'image/jpeg';
      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error('압축 실패')); return; }
          const ext = mimeType === 'image/webp' ? 'webp' : 'jpg';
          const name = file.name.replace(/\.[^.]+$/, `.${ext}`);
          resolve(new File([blob], name, { type: mimeType }));
        },
        mimeType,
        quality
      );
    };
    img.onerror = reject;
    img.src = url;
  });
}
