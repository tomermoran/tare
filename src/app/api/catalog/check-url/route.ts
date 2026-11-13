import { NextResponse, type NextRequest } from "next/server";
import { NoSessionError } from "@/server/auth/session-shared";
import { checkCatalogUrl } from "@/server/dal/catalogAdd";
import { NotFoundError } from "@/server/dal/scope";

/**
 * GET /api/catalog/check-url?catalog=hardware&url=…
 *   → { match }   a visible entry with the same product page, or null
 * Runs when the link field is left (STORY-01-06-04 AC 1); save checks again.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const catalog = params.get("catalog");
  const url = (params.get("url") ?? "").slice(0, 2000);
  if (catalog !== "hardware" && catalog !== "coffee") {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  try {
    return NextResponse.json({ match: await checkCatalogUrl(catalog, url) });
  } catch (error) {
    if (error instanceof NoSessionError || error instanceof NotFoundError) {
      return NextResponse.json({ error: "no_session" }, { status: 401 });
    }
    throw error;
  }
}
