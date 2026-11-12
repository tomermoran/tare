import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db/client";
import type { HardwareKind } from "@/domain/capabilities";
import { NoSessionError } from "@/server/auth/session-shared";
import { listMakers, listModels, searchHardware } from "@/server/dal/catalog";
import { NotFoundError, requireHousehold } from "@/server/dal/scope";

const KINDS: HardwareKind[] = ["machine", "grinder", "basket"];

/**
 * GET /api/catalog/search?catalog=hardware&kind=grinder&q=niche
 *   → { results }   matching models (no q: every model, stock baskets first)
 * GET /api/catalog/search?catalog=hardware&kind=grinder&browse=makers
 *   → { makers }    alphabetical
 * GET /api/catalog/search?catalog=hardware&kind=grinder&maker=<id>
 *   → { results }   one maker's models
 * The coffee catalog arrives in wave 3.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const kind = params.get("kind") as HardwareKind;
  if (params.get("catalog") !== "hardware" || !KINDS.includes(kind)) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const query = (params.get("q") ?? "").slice(0, 100);

  let householdId: string;
  try {
    ({ householdId } = await requireHousehold());
  } catch (error) {
    if (error instanceof NoSessionError || error instanceof NotFoundError) {
      return NextResponse.json({ error: "no_session" }, { status: 401 });
    }
    throw error;
  }

  if (params.get("browse") === "makers") {
    return NextResponse.json({ makers: await listMakers(db, householdId, { kind }) });
  }
  const makerId = params.get("maker");
  const results = makerId
    ? await listModels(db, householdId, { makerId, kind })
    : await searchHardware(db, householdId, { kind, query });
  return NextResponse.json({ results });
}
