import { NextResponse } from "next/server";
import { getLeaderboardModels } from "@/lib/models";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const modelSlug = searchParams.get("model");

  const models = await getLeaderboardModels();
  const target = models.find((m) => m.slug === modelSlug) || models[0];

  const priceInNum = parseFloat(target.priceInput.replace("$", "")) || 1.0;
  const priceOutNum = parseFloat(target.priceOutput.replace("$", "")) || 4.0;
  const estPromptCost = (priceInNum * 0.005 + priceOutNum * 0.002).toFixed(4);
  const estFullRunCost = (priceInNum * 0.15 + priceOutNum * 0.06).toFixed(2);

  return NextResponse.json({
    models: models.map((m) => ({
      name: m.name,
      slug: m.slug,
      provider: m.provider,
      isOpenWeight: m.isOpenWeight,
    })),
    selectedModel: {
      name: target.name,
      slug: target.slug,
      provider: target.provider,
      capabilities: target.capabilities,
      priceInput: target.priceInput,
      priceOutput: target.priceOutput,
      contextWindow: target.contextWindow,
      isOpenWeight: target.isOpenWeight,
      estimatedCostPerPrompt: `$${estPromptCost}`,
      estimatedFullRunCost: `$${estFullRunCost}`,
      warnings: target.capabilities.vision ? [] : ["Multimodal vision input not supported natively on this text/code model variant."],
    },
  });
}

