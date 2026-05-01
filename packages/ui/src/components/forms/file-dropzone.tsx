'use client';

import * as React from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from '../Button';

/**
 * FileDropzone — drag/drop upload zone with multi-file support, validation,
 * and per-file progress slot. (TIER 6 + TIER 9)
 */
export interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onFiles: (files: File[]) => void;
  files?: { file: File; progress?: number; error?: string }[];
  onRemove?: (file: File) => void;
  className?: string;
  label?: string;
}

export function FileDropzone({
  accept,
  multiple = true,
  maxSize,
  onFiles,
  files = [],
  onRemove,
  className,
  label = 'Drop files here or click to browse',
}: FileDropzoneProps) {
  const [over, setOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleFiles(list: FileList | null) {
    if (!list) return;
    const arr = Array.from(list);
    const ok = maxSize ? arr.filter((f) => f.size <= maxSize) : arr;
    onFiles(ok);
  }

  return (
    <div className={cn('space-y-2', className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          'flex w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-center text-sm transition-colors',
          over ? 'border-primary bg-primary/5' : 'border-border bg-muted/20 hover:bg-muted/40'
        )}
        aria-label={label}
      >
        <Upload className="h-8 w-8 text-muted-fg" aria-hidden="true" />
        <span className="font-medium">{label}</span>
        {accept ? <span className="text-xs text-muted-fg">{accept}</span> : null}
        {maxSize ? (
          <span className="text-xs text-muted-fg">
            Max {(maxSize / 1024 / 1024).toFixed(0)} MB per file
          </span>
        ) : null}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="sr-only"
      />
      {files.length > 0 ? (
        <ul className="flex flex-col gap-1.5">
          {files.map(({ file, progress, error }) => (
            <li
              key={`${file.name}-${file.size}`}
              className="flex items-center gap-3 rounded-md border border-border p-2 text-sm"
            >
              <FileText className="h-4 w-4 shrink-0 text-muted-fg" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate">{file.name}</span>
                  <span className="shrink-0 text-xs text-muted-fg">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                {progress != null ? (
                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                ) : null}
                {error ? <p className="text-xs text-destructive">{error}</p> : null}
              </div>
              {onRemove ? (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onRemove(file)}
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
