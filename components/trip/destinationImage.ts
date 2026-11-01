import type { ImgHTMLAttributes } from 'react';

export function destinationImage(
  slug: string,
  alt: string
): Pick<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'onError'> {
  return {
    src: `/destinations/${slug}.jpg`,
    alt,
    onError: (event) => {
      event.currentTarget.onerror = null;
      const firstLetter = (alt.trim().charAt(0) || '?').toUpperCase();
      event.currentTarget.src =
        `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#4b7080"/><stop offset="1" stop-color="#8c6f62"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="55%" fill="white" font-family="sans-serif" font-size="180" font-weight="700" text-anchor="middle">${firstLetter}</text></svg>`)}`;
    },
  };
}
