@AGENTS.md

# Tare

An espresso journal for everyday home enthusiasts that learns your palate and
gives drift-aware dial-in advice. Portfolio prototype. Product spec:
`docs/spec.md` (its "Updates" section overrides older sections).

## Phases

- **Phase 0, foundations (done):** project setup and the design system
  (tokens, Button, Card, Input, NumberWheel).
- **Phase 1 (current):** a basic app for logging shots and managing recipes,
  setups and beans. **No AI features yet**: no LLM calls, bag
  scanning, Diagnostic Coach or network cold-start.
- **Later:** AI features, each shipped with evals and observability.

## Stack

- Next.js 16 (App Router, `src/`), React 19, TypeScript
- Tailwind CSS v4, tokens in `src/styles/tokens.css`
- next-intl, messages in `src/i18n/messages/<locale>.json`
- Drizzle ORM + SQLite via libSQL (`src/db`, local file in `./data`)
- Storybook 10 (`@storybook/nextjs-vite`) with Vitest story tests and axe checks

## Commands

- `npm run dev`: the app on :3000
- `npm run storybook`: the design system on :6006
- `npx vitest run`: story tests, including accessibility (contrast etc.)
- `npm run lint`, `npx tsc --noEmit`, `npm run build`
- `npm run db:generate` / `db:migrate` / `db:studio`

npm 10.8 on this machine crashes resolving Storybook's peer deps
(`edgesOut`). Install packages with `npx npm@11 install …`.

## Rules

### No hardcoded strings (i18n-ready)
- Every user-facing string lives in `src/i18n/messages/en.json`, read with
  `useTranslations` / `getTranslations`. Keys are type-checked.
- Components take text as props; they never contain copy.
- Stories take their text from `en.json` too. Developer docs (`*.mdx`,
  `src/stories/TokenDocs.tsx`) are the only place English is written inline.
- Format numbers and units with `Intl` / next-intl's `useFormatter`, or the
  helpers in `src/lib/units.ts`. Never concatenate a number and a unit by hand.

### RTL-ready: logical CSS only
- Use logical utilities: `ms-* me-* ps-* pe-* start-* end-* text-start
  text-end border-s border-e rounded-s-* rounded-e-*`.
- Never use `ml mr pl pr left right text-left text-right border-l border-r`.
- Inline styles use `insetInlineStart`, `marginInlineEnd`, etc.
- Check new components with Storybook's Direction toolbar toggle.

### Canonical floats in the database
- Measurements are `real` columns in one fixed unit: grams (dose, yield),
  °C (temperature), bar (pressure).
- Shot time is the exception: an `integer` in milliseconds, displayed in
  seconds with one decimal (27.6 s), like a scale timer. Convert with
  `msToSeconds` / `secondsToMs` in `src/lib/units.ts`.
- Convert units only for display. Never store derived values (ratio, flow) or
  formatted strings. Timestamps are integer ms since epoch, UTC.

### Design system
- Use semantic tokens (`paper surface surface-sunken line line-strong ink
  ink-secondary ink-tertiary action on-action signal signal-subtle`), never the
  raw `grey-*` steps, and never hex values in components.
- Hierarchy comes from size, weight and spacing, not colour. Thin weights
  (200/300) for large numbers and headings, 400 for small text. Numbers are
  tabular everywhere (set globally).
- `signal` is only for shot warnings (too fast, channelling). Form errors use
  ink.
- `ink-tertiary` is for large text only (it fails contrast below 18px).
- No shadows. Separate with hairlines (`border-line`) and surface steps.
- Japandi: generous whitespace, calm, minimal. When in doubt, remove.
- Every component gets a story; story tests must pass axe accessibility
  checks (`a11y.test: "error"`).

### No personal data in the repo
- The repo is public. Never put real people's names, emails or other personal
  details in code, docs, specs, fixtures, tests, stories or agent prompts.
- Describe people by role: household, household member, main persona, sub
  persona, Head of Product.
- Example data must be obviously fictional or generic.

### Commits
- Small and focused: one concern per commit, clear imperative subject, a body
  that says why.
- Run lint, typecheck and story tests before committing.
