'use client';

import * as React from 'react';
import { PhoneInput as PhoneIntlInput } from 'react-international-phone';
import { cn } from '../../lib/cn';
import { Input } from '../Input';

// NOTE: consumers must import 'react-international-phone/style.css' once at
// app entry (e.g., services/app/src/app/globals.css) — we don't import here
// because TS can't resolve CSS without configuring loaders, and the package
// ships its own stylesheet alongside the JS.

/**
 * Smart inputs — domain-aware inputs with formatting + validation.
 * (TIER 6)
 */

export function PhoneInputField({
  value,
  onChange,
  defaultCountry = 'it',
  className,
}: {
  value: string;
  onChange: (val: string) => void;
  defaultCountry?: string;
  className?: string;
}) {
  return (
    <PhoneIntlInput
      defaultCountry={defaultCountry}
      value={value}
      onChange={(v) => onChange(v)}
      className={cn('phone-input-wrapper', className)}
      inputClassName="!h-10 !rounded-md !border !border-input !bg-background !px-3 !py-2 !text-sm"
    />
  );
}

export interface MoneyInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> {
  value: number | null;
  onChange: (val: number | null) => void;
  currency?: string;
  locale?: string;
}

export function MoneyInput({
  value,
  onChange,
  currency = 'EUR',
  locale = 'it-IT',
  className,
  ...rest
}: MoneyInputProps) {
  const [text, setText] = React.useState(() =>
    value != null ? formatMoney(value, locale, currency) : ''
  );

  function formatMoney(n: number, l: string, c: string): string {
    return new Intl.NumberFormat(l, { style: 'currency', currency: c }).format(n);
  }

  return (
    <Input
      {...rest}
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => {
        const cleaned = text.replace(/[^\d,.-]/g, '').replace(',', '.');
        const num = parseFloat(cleaned);
        if (Number.isFinite(num)) {
          onChange(num);
          setText(formatMoney(num, locale, currency));
        } else {
          onChange(null);
        }
      }}
      className={cn(className)}
      inputMode="decimal"
    />
  );
}

/**
 * IbanInput — formats IBAN with spaces every 4 chars + light validation.
 */
export function IbanInput({
  value,
  onChange,
  className,
  ...rest
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
  value: string;
  onChange: (val: string) => void;
}) {
  const formatted = value
    .replace(/\s+/g, '')
    .toUpperCase()
    .replace(/(.{4})/g, '$1 ')
    .trim();
  const isValid = /^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(value.replace(/\s+/g, ''));
  return (
    <div className="space-y-1">
      <Input
        {...rest}
        value={formatted}
        onChange={(e) => onChange(e.target.value.replace(/\s+/g, '').toUpperCase())}
        className={cn('font-mono', className)}
        aria-invalid={value.length > 0 && !isValid}
      />
      {value.length > 0 && !isValid ? (
        <p className="text-xs text-destructive">Invalid IBAN format</p>
      ) : null}
    </div>
  );
}

/**
 * TaxIdInput — Italian Codice Fiscale or VAT.
 */
export function TaxIdInput({
  value,
  onChange,
  variant = 'cf',
  className,
  ...rest
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
  value: string;
  onChange: (val: string) => void;
  variant?: 'cf' | 'vat';
}) {
  const cleaned = value.toUpperCase().replace(/\s+/g, '');
  const isValid =
    variant === 'cf'
      ? /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/.test(cleaned)
      : /^IT\d{11}$/.test(cleaned);
  return (
    <div className="space-y-1">
      <Input
        {...rest}
        value={cleaned}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        className={cn('font-mono uppercase', className)}
        aria-invalid={value.length > 0 && !isValid}
      />
      {value.length > 0 && !isValid ? (
        <p className="text-xs text-destructive">
          Invalid {variant === 'cf' ? 'codice fiscale' : 'VAT'} format
        </p>
      ) : null}
    </div>
  );
}
