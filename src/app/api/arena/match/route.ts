import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST() {
  const models = await db.model.findMany({
    include: { provider: true },
  });

  if (models.length < 2) {
    return NextResponse.json({
      modelA: { id: "m1", name: "Nova-1", score: 85.2, elo: 1640 },
      modelB: { id: "m2", name: "Halcyon-2", score: 82.4, elo: 1615 },
    });
  }

  // Shuffle and pick 2 distinct models
  const shuffled = [...models].sort(() => 0.5 - Math.random());
  const mA = shuffled[0];
  const mB = shuffled[1];

  return NextResponse.json({
    matchId: `match-${Math.random().toString(36).substring(2, 8)}`,
    modelA: {
      id: mA.id,
      name: mA.name,
      slug: mA.slug,
      score: mA.composite,
      elo: 1600 + Math.round(mA.composite * 5),
    },
    modelB: {
      id: mB.id,
      name: mB.name,
      slug: mB.slug,
      score: mB.composite,
      elo: 1600 + Math.round(mB.composite * 5),
    },
  });
}
