import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { modelAId, modelBId, winner } = body;

    if (!modelAId || !modelBId) {
      return NextResponse.json(
        { error: "modelAId and modelBId parameters are required" },
        { status: 400 }
      );
    }

    if (!["A", "B", "TIE", "BAD"].includes(winner)) {
      return NextResponse.json(
        { error: "winner must be A, B, TIE, or BAD" },
        { status: 400 }
      );
    }

    // Rate limit: extract IP for spam tracking
    const forwarded = request.headers.get("x-forwarded-for");
    const voterIp = forwarded?.split(",")[0]?.trim() || "unknown";

    // Check for recent duplicate votes from same IP on same pair (within 30s)
    const recentCutoff = new Date(Date.now() - 30_000);
    const recentVote = await db.arenaMatch.findFirst({
      where: {
        modelAId,
        modelBId,
        voterIp,
        createdAt: { gte: recentCutoff },
      },
    });

    if (recentVote) {
      return NextResponse.json(
        { error: "You already voted on this matchup recently. Please wait before voting again." },
        { status: 429 }
      );
    }

    const modelA = await db.model.findFirst({
      where: { OR: [{ id: modelAId }, { slug: modelAId }] },
    });
    const modelB = await db.model.findFirst({
      where: { OR: [{ id: modelBId }, { slug: modelBId }] },
    });

    if (!modelA || !modelB) {
      return NextResponse.json(
        { error: "Specified model not found in database registry" },
        { status: 404 }
      );
    }

    const prompt = await db.prompt.findFirst();
    if (!prompt) {
      return NextResponse.json(
        { error: "No prompts found in database" },
        { status: 500 }
      );
    }

    // Optional: get authenticated user for tracking
    const user = await getCurrentUser();

    const isWinnerA = winner === "A";
    const isTie = winner === "TIE";
    const isBad = winner === "BAD";

    const match = await db.arenaMatch.create({
      data: {
        modelAId: modelA.id,
        modelBId: modelB.id,
        promptId: prompt.id,
        blind: true,
        winner,
        votesA: isWinnerA ? 1 : 0,
        votesB: winner === "B" ? 1 : 0,
        voterIp: user?.id || voterIp,
      },
    });

    // Only update arenaElo when there's a clear winner (not TIE or BAD)
    if (!isTie && !isBad) {
      const eloA = modelA.arenaElo;
      const eloB = modelB.arenaElo;

      const expectedA = 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
      const actualA = isWinnerA ? 1 : 0;
      const actualB = isWinnerA ? 0 : 1;
      const expectedB = 1 - expectedA;

      const K = 32;
      const newEloA = Math.round((eloA + K * (actualA - expectedA)) * 10) / 10;
      const newEloB = Math.round((eloB + K * (actualB - expectedB)) * 10) / 10;

      // Update arenaElo only — never touch composite
      await db.model.update({
        where: { id: modelA.id },
        data: { arenaElo: newEloA },
      });
      await db.model.update({
        where: { id: modelB.id },
        data: { arenaElo: newEloB },
      });

      return NextResponse.json({
        success: true,
        matchId: match.id,
        winner,
        modelA: { name: modelA.name, arenaElo: newEloA, composite: modelA.composite },
        modelB: { name: modelB.name, arenaElo: newEloB, composite: modelB.composite },
      });
    }

    return NextResponse.json({
      success: true,
      matchId: match.id,
      winner,
      modelA: { name: modelA.name, arenaElo: modelA.arenaElo, composite: modelA.composite },
      modelB: { name: modelB.name, arenaElo: modelB.arenaElo, composite: modelB.composite },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to record arena vote";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
