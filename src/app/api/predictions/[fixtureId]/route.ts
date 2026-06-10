import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(_req: NextRequest, { params }: { params: { fixtureId: string } }) {
  const { fixtureId } = params;

  const { data, error } = await supabaseAdmin
    .from("predictions")
    .select("pick")
    .eq("fixture_id", fixtureId);

  if (error || !data) {
    return NextResponse.json({ counts: { "1": 0, x: 0, "2": 0 }, total: 0 });
  }

  const counts = { "1": 0, x: 0, "2": 0 } as Record<string, number>;
  for (const row of data) counts[row.pick] = (counts[row.pick] ?? 0) + 1;
  const total = data.length;

  return NextResponse.json({ counts, total }, {
    headers: { "Cache-Control": "no-store" },
  });
}
