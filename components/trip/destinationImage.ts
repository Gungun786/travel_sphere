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
      event.currentTarget.src =
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="700"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0" x2="1" y1="0" y2="1"%3E%3Cstop stop-color="%234b7080"/%3E%3Cstop offset="1" stop-color="%238c6f62"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23g)"/%3E%3C/svg%3E';
    },
  };
}
