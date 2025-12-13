import { NextRequest, NextResponse } from "next/server";

import db from "@/lib/supabase/db";
import { medias, productMedias } from "@/lib/supabase/schema";
import { asc, eq, inArray } from "drizzle-orm";

type MediaDTO = { id: string; key: string; alt: string };

/**
 * Returns additional images (product_medias -> medias) for a list of productIds.
 * Query param: `productIds` as comma-separated list.
 *
 * Response shape:
 * {
 *   "<productId>": [{ id, key, alt }, ...]
 * }
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const productIdsParam = url.searchParams.get("productIds") ?? "";

  const productIds = productIdsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (productIds.length === 0) {
    return NextResponse.json({}, { status: 200 });
  }

  // Basic guardrail to prevent abuse
  if (productIds.length > 50) {
    return NextResponse.json(
      { error: "Too many productIds. Max 50." },
      { status: 400 },
    );
  }

  const rows = await db
    .select({
      productId: productMedias.productId,
      priority: productMedias.priority,
      mediaId: medias.id,
      key: medias.key,
      alt: medias.alt,
    })
    .from(productMedias)
    .innerJoin(medias, eq(productMedias.mediaId, medias.id))
    .where(inArray(productMedias.productId, productIds))
    .orderBy(asc(productMedias.priority));

  const result: Record<string, MediaDTO[]> = {};
  for (const row of rows) {
    const arr = (result[row.productId] ??= []);
    arr.push({ id: row.mediaId, key: row.key, alt: row.alt });
  }

  return NextResponse.json(result, { status: 200 });
}
