import { NextResponse } from "next/server";
import { getLeaderboardModels } from "@/lib/models";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const modelSlug = searchParams.get("model");

  const models = await getLeaderboardModels();
  const target = models.find((m) => m.slug === modelSlug) || models[0];

  return NextResponse.json({
    model: target.name,
    slug: target.slug,
    provider: target.provider,
    capabilities: target.capabilities,
    priceInput: target.priceInput,
    priceOutput: target.priceOutput,
    estimatedCostPerPrompt: "$0.025",
    estimatedFullRunCost: "$0.90",
  });
}
