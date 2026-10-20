# Tare

An espresso journal for everyday home enthusiasts that learns your palate and
gives drift-aware dial-in advice. A portfolio prototype.

The foundations (project setup and design system) are done. Now in phase 1:
a basic app for logging shots and managing recipes, setups and the pantry.
AI features come later.

## Run it

```bash
npm install
npm run storybook   # design system at http://localhost:6006
npm run dev         # app at http://localhost:3000
```

## Where things are

- `src/styles/tokens.css`: design tokens (colour, type, spacing, radius)
- `src/components/ui`: Button, Card, Input, NumberWheel, each with stories
- `src/i18n`: translatable strings
- `src/db`: Drizzle schema and client (SQLite via libSQL)
- `docs/spec.md`: product spec
- `CLAUDE.md`: project rules
