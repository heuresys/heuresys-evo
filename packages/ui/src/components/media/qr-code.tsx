'use client';

import * as React from 'react';
import QRCode from 'qrcode';
import { cn } from '../../lib/cn';

/**
 * QRCodeView — generate a QR code as a data URL via `qrcode`.
 * (TIER 7)
 */
export function QRCodeView({
  value,
  size = 200,
  className,
  ariaLabel,
  level = 'M',
}: {
  value: string;
  size?: number;
  className?: string;
  ariaLabel?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
}) {
  const [src, setSrc] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(value, { errorCorrectionLevel: level, width: size, margin: 1 })
      .then((url) => {
        if (!cancelled) setSrc(url);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      });
    return () => {
      cancelled = true;
    };
  }, [value, level, size]);

  if (error)
    return (
      <div role="alert" className={cn('text-xs text-destructive', className)}>
        {error}
      </div>
    );
  if (!src)
    return (
      <div
        role="status"
        aria-label="Generating QR code"
        className={cn('animate-pulse bg-muted', className)}
        style={{ width: size, height: size }}
      />
    );

  return (
    <img
      src={src}
      alt={ariaLabel ?? `QR code for ${value}`}
      width={size}
      height={size}
      className={cn('rounded-md', className)}
    />
  );
}
