import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const models = await db.model.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        composite: true,
        isOpenWeight: true,
        provider: {
          select: { name: true },
        },
      },
      orderBy: { composite: "desc" },
    });

    return NextResponse.json({
      models: models.map((m) => ({
        id: m.id,
        name: m.name,
        slug: m.slug,
        provider: m.provider.name,
        composite: m.composite,
        isOpenWeight: m.isOpenWeight,
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch models";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
