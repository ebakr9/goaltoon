import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { fixtureId, pick } = await req.json();

    if (!fixtureId || !["1", "x", "2"].includes(pick)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("predictions")
      .insert({ fixture_id: String(fixtureId), pick });

    if (error) {
      console.error("[predictions] insert error:", error);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    // Return updated counts immediately after insert
    const { data, error: countError } = await supabaseAdmin
      .from("predictions")
      .select("pick")
      .eq("fixture_id", String(fixtureId));

    if (countError || !data) {
      return NextResponse.json({ counts: { "1": 0, x: 0, "2": 0 }, total: 0 });
    }

    const counts = { "1": 0, x: 0, "2": 0 } as Record<string, number>;
    for (const row of data) counts[row.pick] = (counts[row.pick] ?? 0) + 1;
    const total = data.length;

    return NextResponse.json({ counts, total });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
