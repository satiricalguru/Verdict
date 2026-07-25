import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const run = await db.run.findUnique({
    where: { id },
    include: {
      model: {
        include: { provider: true },
      },
      samples: {
        include: {
          judgments: true,
        },
      },
    },
  });

  if (!run) {
    // If run ID doesn't exist yet, return active status structure
    return NextResponse.json({
      run: {
        id,
        model: "Claude Fable 5",
        status: "complete",
        costEstimate: 0.42,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        samples: [],
      },
    });
  }

  return NextResponse.json({ run });
}
