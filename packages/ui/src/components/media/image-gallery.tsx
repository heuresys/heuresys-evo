'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from '../Button';

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

/**
 * ImageGallery — masonry grid + lightbox overlay with prev/next + ESC close.
 * Lightweight, no extra deps. (TIER 7)
 */
export function ImageGallery({
  images,
  className,
  columns = 3,
}: {
  images: GalleryImage[];
  className?: string;
  columns?: 2 | 3 | 4 | 5;
}) {
  const [active, setActive] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (active == null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setActive(null);
      if (e.key === 'ArrowLeft') setActive((i) => (i! > 0 ? i! - 1 : i));
      if (e.key === 'ArrowRight') setActive((i) => (i! < images.length - 1 ? i! + 1 : i));
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, images.length]);

  const colsClass = {
    2: 'columns-2',
    3: 'columns-2 md:columns-3',
    4: 'columns-2 md:columns-4',
    5: 'columns-2 md:columns-3 lg:columns-5',
  }[columns];

  return (
    <>
      <div className={cn(colsClass, 'gap-3 [&>*]:mb-3 [&>*]:break-inside-avoid', className)}>
        {images.map((img, i) => (
          <button
            type="button"
            key={img.src}
            onClick={() => setActive(i)}
            className="block w-full overflow-hidden rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Open ${img.alt} in lightbox`}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full transition-transform hover:scale-105"
              loading="lazy"
            />
          </button>
        ))}
      </div>
      {active !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Lightbox: ${images[active]!.alt}`}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4"
        >
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setActive(null)}
            aria-label="Close lightbox"
            className="absolute right-4 top-4 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setActive(active > 0 ? active - 1 : active)}
            disabled={active === 0}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 disabled:opacity-40"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setActive(active < images.length - 1 ? active + 1 : active)}
            disabled={active === images.length - 1}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 disabled:opacity-40"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          <img
            src={images[active]!.src}
            alt={images[active]!.alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
          {images[active]!.caption ? (
            <p className="mt-3 max-w-prose text-center text-sm text-white/80">
              {images[active]!.caption}
            </p>
          ) : null}
          <p className="mt-1 text-xs text-white/60">
            {active + 1} / {images.length}
          </p>
        </div>
      ) : null}
    </>
  );
}
