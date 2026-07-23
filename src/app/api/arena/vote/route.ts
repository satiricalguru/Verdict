import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { modelAId, modelBId, winner } = body;

    const isWinnerA = winner === "A";

    const match = await db.arenaMatch.create({
      data: {
        modelAId: modelAId || "m1",
        modelBId: modelBId || "m2",
        promptId: "p1",
        blind: true,
        votesA: isWinnerA ? 1 : 0,
        votesB: isWinnerA ? 0 : 1,
      },
    });

    return NextResponse.json({
      success: true,
      matchId: match.id,
      votesA: match.votesA,
      votesB: match.votesB,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to record vote";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
