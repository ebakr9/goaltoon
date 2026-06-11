import { fetchStandings } from "@/lib/apifootball";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const groups = await fetchStandings("1", 2026);
  return NextResponse.json(
    groups.map((g) => ({ name: g.name, teamCount: g.teams.length }))
  );
}
