import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { parseCapabilities, type HardwareKind } from "../../domain/capabilities";
import { isRoastLevel } from "../../domain/roast";
import { normalizeUrl } from "../../domain/url";
import * as schema from "../schema";
import {
  canonicalBeans,
  canonicalHardware,
  catalogAliases,
  catalogUrls,
  hardwareMakers,
  roasters,
  type CatalogEntityType,
} from "../schema";

/*
 * Loads the seed catalog (src/db/seed/*.json) into the database. Every row
 * gets a stable id derived from its keys, and loading upserts, so running it
 * twice changes nothing and an edited entry updates in place. Everything is
 * validated before anything is written; one bad value fails the whole seed.
 */

type Alias = { name: string; market: string | null };
type Link = { url: string; market: string | null };

export type HardwareSeed = {
  makers: {
    key: string;
    name: string;
    aliases: Alias[];
    models: {
      key: string;
      kind: HardwareKind;
      name: string;
      aliases: Alias[];
      links: Link[];
      capabilities: unknown;
    }[];
  }[];
};

export type CoffeeSeed = {
  roasters: {
    key: string;
    name: string;
    aliases: Alias[];
    links: Link[];
    beans: {
      key: string;
      name: string;
      roastLevel: string | null;
      tastingNotes: string[];
      aliases: Alias[];
      links: Link[];
    }[];
  }[];
};

const KEY = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MARKET = /^[A-Z]{2}$/;
const KINDS: HardwareKind[] = ["machine", "grinder", "basket"];

export const seedIds = {
  maker: (m: string) => `seed:maker:${m}`,
  model: (m: string, k: string) => `seed:model:${m}:${k}`,
  roaster: (r: string) => `seed:roaster:${r}`,
  bean: (r: string, b: string) => `seed:bean:${r}:${b}`,
  alias: (entityId: string, name: string) => `${entityId}:alias:${name.toLowerCase()}`,
  url: (entityId: string, normalized: string) => `${entityId}:url:${normalized}`,
};

/** Every problem in the seed, as "where: what" lines. Empty means valid. */
export function validateSeed(hardware: HardwareSeed, coffee: CoffeeSeed): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const urls = new Map<string, string>();

  const unique = (id: string, where: string) => {
    if (ids.has(id)) errors.push(`${where}: duplicate key`);
    ids.add(id);
  };
  const name = (v: unknown, where: string) => {
    if (typeof v !== "string" || v.trim() === "") errors.push(`${where}: name is required`);
  };
  const key = (v: unknown, where: string) => {
    if (typeof v !== "string" || !KEY.test(v)) errors.push(`${where}: key must be kebab-case`);
  };
  const aliases = (list: Alias[], where: string) => {
    if (!Array.isArray(list)) return errors.push(`${where}: aliases must be a list`);
    const seen = new Set<string>();
    for (const a of list) {
      name(a?.name, `${where} alias`);
      if (a?.market !== null && !MARKET.test(a?.market ?? "")) {
        errors.push(`${where} alias ${a?.name}: market must be ISO 3166-1 alpha-2 or null`);
      }
      const k = a?.name?.toLowerCase();
      if (seen.has(k)) errors.push(`${where} alias ${a?.name}: duplicate`);
      seen.add(k);
    }
  };
  const links = (list: Link[], where: string) => {
    if (!Array.isArray(list)) return errors.push(`${where}: links must be a list`);
    for (const l of list) {
      const n = normalizeUrl(l?.url ?? "");
      if (!n) errors.push(`${where}: not an http(s) link: ${l?.url}`);
      else if (urls.has(n)) errors.push(`${where}: link already used by ${urls.get(n)}`);
      else urls.set(n, where);
      if (l?.market !== null && !MARKET.test(l?.market ?? "")) {
        errors.push(`${where} link: market must be ISO 3166-1 alpha-2 or null`);
      }
    }
  };

  for (const m of hardware.makers ?? []) {
    const where = `maker ${m.key}`;
    key(m.key, where);
    name(m.name, where);
    unique(seedIds.maker(m.key), where);
    aliases(m.aliases, where);
    for (const model of m.models ?? []) {
      const w = `model ${m.key}/${model.key}`;
      key(model.key, w);
      name(model.name, w);
      unique(seedIds.model(m.key, model.key), w);
      aliases(model.aliases, w);
      links(model.links, w);
      if (!KINDS.includes(model.kind)) {
        errors.push(`${w}: unknown kind ${String(model.kind)}`);
      } else if (!parseCapabilities(model.kind, model.capabilities, { allowNotSure: false })) {
        errors.push(`${w}: invalid capabilities for a ${model.kind} (seeded rows never use "not sure")`);
      }
    }
  }

  for (const r of coffee.roasters ?? []) {
    const where = `roaster ${r.key}`;
    key(r.key, where);
    name(r.name, where);
    unique(seedIds.roaster(r.key), where);
    aliases(r.aliases, where);
    links(r.links, where);
    for (const b of r.beans ?? []) {
      const w = `bean ${r.key}/${b.key}`;
      key(b.key, w);
      name(b.name, w);
      unique(seedIds.bean(r.key, b.key), w);
      aliases(b.aliases, w);
      links(b.links, w);
      if (b.roastLevel !== null && !isRoastLevel(b.roastLevel)) {
        errors.push(`${w}: unknown roast level ${b.roastLevel}`);
      }
      if (!Array.isArray(b.tastingNotes) || b.tastingNotes.some((n) => typeof n !== "string" || !n.trim())) {
        errors.push(`${w}: tasting notes must be a list of words`);
      }
    }
  }
  return errors;
}

export class SeedError extends Error {
  constructor(public problems: string[]) {
    super(`The seed catalog is invalid:\n- ${problems.join("\n- ")}`);
    this.name = "SeedError";
  }
}

type SeedDb = LibSQLDatabase<typeof schema>;

/** Validates, then upserts the whole seed in one transaction. */
export async function loadSeed(db: SeedDb, hardware: HardwareSeed, coffee: CoffeeSeed) {
  const problems = validateSeed(hardware, coffee);
  if (problems.length > 0) throw new SeedError(problems);

  const now = new Date();
  const seeded = { source: "seed", status: "verified", createdAt: now } as const;
  const counts = { makers: 0, models: 0, roasters: 0, beans: 0, aliases: 0, links: 0 };

  await db.transaction(async (tx) => {
    const addAliases = async (type: CatalogEntityType, entityId: string, list: Alias[]) => {
      for (const a of list) {
        await tx
          .insert(catalogAliases)
          .values({ id: seedIds.alias(entityId, a.name), entityType: type, entityId, name: a.name, market: a.market, createdAt: now })
          .onConflictDoUpdate({ target: catalogAliases.id, set: { name: a.name, market: a.market } });
        counts.aliases++;
      }
    };
    const addLinks = async (type: CatalogEntityType, entityId: string, list: Link[]) => {
      for (const l of list) {
        const normalizedUrl = normalizeUrl(l.url)!;
        await tx
          .insert(catalogUrls)
          .values({ id: seedIds.url(entityId, normalizedUrl), entityType: type, entityId, url: l.url, normalizedUrl, market: l.market, createdAt: now })
          .onConflictDoUpdate({ target: catalogUrls.id, set: { url: l.url, market: l.market } });
        counts.links++;
      }
    };

    for (const m of hardware.makers) {
      const makerId = seedIds.maker(m.key);
      await tx
        .insert(hardwareMakers)
        .values({ id: makerId, name: m.name, ...seeded })
        .onConflictDoUpdate({ target: hardwareMakers.id, set: { name: m.name } });
      counts.makers++;
      await addAliases("maker", makerId, m.aliases);
      for (const model of m.models) {
        const id = seedIds.model(m.key, model.key);
        await tx
          .insert(canonicalHardware)
          .values({ id, makerId, kind: model.kind, name: model.name, capabilities: model.capabilities, ...seeded })
          .onConflictDoUpdate({
            target: canonicalHardware.id,
            set: { makerId, kind: model.kind, name: model.name, capabilities: model.capabilities },
          });
        counts.models++;
        await addAliases("model", id, model.aliases);
        await addLinks("model", id, model.links);
      }
    }

    for (const r of coffee.roasters) {
      const roasterId = seedIds.roaster(r.key);
      await tx
        .insert(roasters)
        .values({ id: roasterId, name: r.name, ...seeded })
        .onConflictDoUpdate({ target: roasters.id, set: { name: r.name } });
      counts.roasters++;
      await addAliases("roaster", roasterId, r.aliases);
      await addLinks("roaster", roasterId, r.links);
      for (const b of r.beans) {
        const id = seedIds.bean(r.key, b.key);
        await tx
          .insert(canonicalBeans)
          .values({ id, roasterId, name: b.name, roastLevel: b.roastLevel, tastingNotes: b.tastingNotes, ...seeded })
          .onConflictDoUpdate({
            target: canonicalBeans.id,
            set: { roasterId, name: b.name, roastLevel: b.roastLevel, tastingNotes: b.tastingNotes },
          });
        counts.beans++;
        await addAliases("bean", id, b.aliases);
        await addLinks("bean", id, b.links);
      }
    }
  });
  return counts;
}
