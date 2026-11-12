# Server code

Everything here runs only on the server. Each file starts with
`import "server-only"`, so importing it from a client component fails the
build.

## `dal/`: the data access layer

- The only place that queries the database (`@/db/client`). Pages, layouts
  and actions read and write through it.
- Every function starts with `requireHousehold()` (`dal/scope.ts`) and
  filters by that household. Nothing reads another household's rows; the
  shared catalog is the one exception, filtered with `visibleCatalog()`.
- Before changing or linking to a row by ID, call `assertOwned()`. Another
  household's row and a missing one both throw `NotFoundError`, so IDs leak
  nothing.
- Each new read or action adds its case to
  `__tests__/isolation.test.ts`.
- Returns plain data shaped for its callers, never whole rows with fields
  the caller doesn't need.
- Measurements stay in canonical units (grams, °C, bar, milliseconds).
  Formatting happens in components.

## `actions/`: Server Actions for writes

- One file per area, with `"use server"` at the top.
- Each action checks the session first, then validates its input, then
  calls the data access layer. New records take the session's household,
  never a household ID sent by the client.
- Returns a result object (`{ ok: true, ... }` or `{ ok: false, error }`)
  with error codes, not copy. Components turn codes into messages.
- Route Handlers are only for the session exchange, catalog search and the
  duplicate-link check (S-02).
