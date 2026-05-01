# packages/ui

Design system condiviso — componenti React, theme tokens, Tailwind preset, Storybook.

## Scope
- Componenti UI riusabili tra `services/marketing`, `services/app`, `services/playground`
- Wrapper su Radix UI primitives + variant system (`class-variance-authority`)
- Theme tokens (colori, spacing, typography)
- Icone (lucide-react re-export)
- Storybook come unica vetrina componenti

## Stack target
- TypeScript + React 19
- Radix UI + Tailwind + `class-variance-authority` + `clsx`
- Storybook (script `npm run storybook`)
- `tsup` o `tsc` per build

## Convenzioni
- Componenti **stateless** quando possibile; lo stato vive nei consumer
- Ogni componente ha una `.stories.tsx` in Storybook
- API stabile: breaking change → bump major + ADR
- Niente import da `services/*` (dipendenza inversa vietata)
