'use client';

import * as React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — react-signature-canvas types are loose
import SignaturePadLib from 'react-signature-canvas';
import { cn } from '../../lib/cn';
import { Button } from '../Button';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SignaturePad: any = SignaturePadLib;

/**
 * SignaturePadField — canvas-based signature capture with clear + save.
 * (TIER 6)
 */
export interface SignaturePadFieldProps {
  onSave?: (dataUrl: string) => void;
  width?: number;
  height?: number;
  className?: string;
  ariaLabel?: string;
}

export function SignaturePadField({
  onSave,
  width = 400,
  height = 160,
  className,
  ariaLabel = 'Signature pad',
}: SignaturePadFieldProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = React.useRef<any>(null);
  const [empty, setEmpty] = React.useState(true);

  return (
    <div className={cn('flex flex-col gap-2', className)} role="group" aria-label={ariaLabel}>
      <div className="rounded-md border border-input bg-background">
        <SignaturePad
          ref={ref}
          canvasProps={{ width, height, className: 'rounded-md', 'aria-label': ariaLabel }}
          onEnd={() => setEmpty(false)}
        />
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          type="button"
          onClick={() => {
            ref.current?.clear();
            setEmpty(true);
          }}
        >
          Clear
        </Button>
        <Button
          size="sm"
          type="button"
          disabled={empty}
          onClick={() => {
            const url = ref.current?.toDataURL('image/png');
            if (url) onSave?.(url);
          }}
        >
          Save signature
        </Button>
      </div>
    </div>
  );
}
