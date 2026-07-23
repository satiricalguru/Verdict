import { NextResponse } from "next/server";
import { getLeaderboardModels } from "@/lib/models";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const openWeight = searchParams.get("openWeight");
  const sort = searchParams.get("sort") || "composite";

  let models = await getLeaderboardModels();

  if (openWeight === "true") {
    models = models.filter((m) => m.isOpenWeight);
  } else if (openWeight === "false") {
    models = models.filter((m) => !m.isOpenWeight);
  }

  if (sort === "frontend") {
    models.sort((a, b) => b.frontend - a.frontend);
  } else if (sort === "game") {
    models.sort((a, b) => b.game - a.game);
  } else if (sort === "svg") {
    models.sort((a, b) => b.svg - a.svg);
  } else if (sort === "agentic") {
    models.sort((a, b) => b.agentic - a.agentic);
  } else {
    models.sort((a, b) => b.composite - a.composite);
  }

  return NextResponse.json({ models, count: models.length });
}
