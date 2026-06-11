import { fetchStandings } from "@/lib/apifootball";
import { setCached } from "@/lib/redis";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const groups = await fetchStandings("1", 2026);
  if (groups.length > 0) {
    await setCached("af:standings:1:2026", groups, 300);
  }
  return NextResponse.json(
    groups.map((g) => ({ name: g.name, teamCount: g.teams.length }))
  );
}
