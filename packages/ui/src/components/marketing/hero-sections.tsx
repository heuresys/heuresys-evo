import * as React from 'react';
import { cn } from '../../lib/cn';
import { Button } from '../Button';

/**
 * Hero sections — 5 layout variants for marketing landing pages.
 * (TIER 14)
 */

export function HeroSplit({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  imageSrc,
  imageAlt,
  className,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCta?: { label: string; onClick?: () => void; href?: string };
  secondaryCta?: { label: string; onClick?: () => void; href?: string };
  imageSrc: string;
  imageAlt: string;
  className?: string;
}) {
  return (
    <section className={cn('grid items-center gap-8 py-16 lg:grid-cols-2 lg:py-24', className)}>
      <div className="space-y-5">
        {eyebrow ? (
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="max-w-prose text-lg text-muted-fg">{description}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          {primaryCta ? <CtaButton {...primaryCta} variant="default" /> : null}
          {secondaryCta ? <CtaButton {...secondaryCta} variant="outline" /> : null}
        </div>
      </div>
      <img src={imageSrc} alt={imageAlt} className="rounded-lg shadow-xl" />
    </section>
  );
}

export function HeroCentered({
  title,
  description,
  primaryCta,
  secondaryCta,
  className,
}: {
  title: string;
  description: string;
  primaryCta?: { label: string; onClick?: () => void; href?: string };
  secondaryCta?: { label: string; onClick?: () => void; href?: string };
  className?: string;
}) {
  return (
    <section
      className={cn(
        'flex flex-col items-center justify-center gap-6 py-16 text-center lg:py-24',
        className
      )}
    >
      <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
        {title}
      </h1>
      <p className="max-w-2xl text-lg text-muted-fg">{description}</p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        {primaryCta ? <CtaButton {...primaryCta} variant="default" /> : null}
        {secondaryCta ? <CtaButton {...secondaryCta} variant="outline" /> : null}
      </div>
    </section>
  );
}

export function HeroVideoBackground({
  videoSrc,
  poster,
  title,
  description,
  primaryCta,
  className,
}: {
  videoSrc: string;
  poster?: string;
  title: string;
  description: string;
  primaryCta?: { label: string; onClick?: () => void; href?: string };
  className?: string;
}) {
  return (
    <section
      className={cn('relative isolate flex min-h-[80vh] items-center justify-center', className)}
    >
      <video
        src={videoSrc}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/60" />
      <div className="space-y-5 px-6 text-center text-white">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">{title}</h1>
        <p className="mx-auto max-w-2xl text-lg text-white/80">{description}</p>
        {primaryCta ? <CtaButton {...primaryCta} variant="default" /> : null}
      </div>
    </section>
  );
}

function CtaButton({
  label,
  onClick,
  href,
  variant,
}: {
  label: string;
  onClick?: () => void;
  href?: string;
  variant: 'default' | 'outline';
}) {
  if (href) {
    return (
      <a
        href={href}
        className={cn(
          'inline-flex h-10 items-center rounded-md px-6 text-sm font-medium transition-colors',
          variant === 'default'
            ? 'bg-primary text-primary-fg hover:bg-primary/90'
            : 'border border-input bg-background text-foreground hover:bg-accent'
        )}
      >
        {label}
      </a>
    );
  }
  return (
    <Button variant={variant} size="lg" onClick={onClick}>
      {label}
    </Button>
  );
}
