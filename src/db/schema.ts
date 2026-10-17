/*
 * Database schema (Drizzle ORM, SQLite via libSQL).
 *
 * Phase 1 has no tables yet. Conventions for when they arrive:
 *
 * - Store measurements as canonical floats (`real`) in one fixed unit:
 *     dose, yield → grams      time        → seconds
 *     temperature → °C         pressure    → bar
 *     grind       → the grinder's own scale value
 *   Convert to the user's preferred units only when displaying.
 * - Never store derived values (ratio, flow rate). Compute them on read.
 * - Never store display strings (formatted numbers, labels). Those belong in
 *   the i18n messages.
 * - Timestamps as integer milliseconds since the Unix epoch, UTC.
 */

export {};
