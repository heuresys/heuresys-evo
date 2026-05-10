import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const inputVariants = cva(
  'flex w-full rounded-md border bg-white px-3 py-2 text-sm transition-colors placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-neutral-300 focus-visible:ring-primary',
        error: 'border-destructive focus-visible:ring-destructive',
      },
      inputSize: {
        sm: 'h-11 text-sm',
        md: 'h-11',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: { variant: 'default', inputSize: 'md' },
  }
);

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  containerClassName?: string;
}

let inputIdCounter = 0;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      inputSize,
      type = 'text',
      label,
      helperText,
      errorText,
      containerClassName,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId ? React.useId() : `heur-input-${++inputIdCounter}`;
    const id = providedId ?? generatedId;
    const helperId = helperText || errorText ? `${id}-helper` : undefined;
    const effectiveVariant = errorText ? 'error' : variant;

    const inputEl = (
      <input
        ref={ref}
        id={id}
        type={type}
        aria-invalid={errorText ? 'true' : undefined}
        aria-describedby={helperId}
        className={cn(inputVariants({ variant: effectiveVariant, inputSize, className }))}
        {...props}
      />
    );

    if (!label && !helperText && !errorText) return inputEl;

    return (
      <div className={cn('flex flex-col gap-1', containerClassName)}>
        {label ? (
          <label htmlFor={id} className="text-sm font-medium text-neutral-900">
            {label}
          </label>
        ) : null}
        {inputEl}
        {errorText ? (
          <p id={helperId} className="text-xs text-destructive" role="alert">
            {errorText}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-neutral-600">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { inputVariants };
