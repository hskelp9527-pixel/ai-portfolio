const COS_HOST = 'aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com';

const LOCAL_VIDEO_THUMBNAILS: Record<string, string> = {
  '搞笑漫-封面.jpg': '/videos/gallery/thumbnails/搞笑漫-封面.jpg',
  '搞笑漫-封面.png': '/videos/gallery/thumbnails/搞笑漫-封面.png',
};

function filenameFromUrl(src: string): string | null {
  try {
    const url = new URL(src);
    return decodeURIComponent(url.pathname.split('/').filter(Boolean).at(-1) || '');
  } catch {
    const clean = src.split('?')[0];
    return decodeURIComponent(clean.split('/').filter(Boolean).at(-1) || '');
  }
}

function isCosUrl(src: string): boolean {
  try {
    return new URL(src).hostname === COS_HOST;
  } catch {
    return false;
  }
}

function unsignedCosUrl(src: string): string {
  try {
    const url = new URL(src);
    return `${url.origin}${url.pathname}`;
  } catch {
    return src.split('?')[0];
  }
}

export function resolveImageUrl(src?: string | null, variant: 'compressed' | 'thumbnail' = 'compressed') {
  if (!src) return '';
  if (!isCosUrl(src)) return src;

  const filename = filenameFromUrl(src);
  const folder = variant === 'thumbnail' ? 'thumbnails' : 'compressed';
  return filename ? encodeURI(`/images/gallery/${folder}/${filename}`) : src;
}

export function resolveVideoThumbnailUrl(src?: string | null) {
  if (!src) return null;
  if (!isCosUrl(src)) return src;

  const filename = filenameFromUrl(src);
  return filename ? LOCAL_VIDEO_THUMBNAILS[filename] || null : null;
}

export function resolveVideoUrl(src?: string | null) {
  if (!src) return null;
  return isCosUrl(src) ? unsignedCosUrl(src) : src;
}
