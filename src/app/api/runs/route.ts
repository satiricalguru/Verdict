import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getRecentRuns } from "@/lib/models";
import { executeBenchmarkRun } from "@/lib/engine";
import crypto from "crypto";

export async function GET() {
  try {
    const runs = await getRecentRuns(10);
    return NextResponse.json({ runs });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch runs";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { modelId, categories } = body;

    const model = await db.model.findFirst({
      where: {
        OR: [{ id: modelId }, { slug: modelId }],
      },
      include: { provider: true },
    });

    if (!model) {
      return NextResponse.json({ error: "Invalid model specified" }, { status: 400 });
    }

    // Find prompt by matching category slug or fallback
    let prompt = null;
    if (categories && Array.isArray(categories) && categories.length > 0) {
      const selectedCategorySlug = categories[0];
      const category = await db.category.findFirst({
        where: { OR: [{ id: selectedCategorySlug }, { slug: selectedCategorySlug }] },
      });
      if (category) {
        prompt = await db.prompt.findFirst({
          where: { categoryId: category.id },
        });
      }
    }

    if (!prompt) {
      prompt = await db.prompt.findFirst();
    }

    if (!prompt) {
      return NextResponse.json({ error: "No benchmark prompts available in database" }, { status: 400 });
    }

    const runId = `run-${crypto.randomUUID().substring(0, 8)}`;
    
    // Execute benchmark evaluation through engine runner
    const execResult = await executeBenchmarkRun(model.id, prompt.id);

    const run = await db.run.create({
      data: {
        id: runId,
        modelId: model.id,
        status: "complete",
        costEstimate: execResult.costEstimate,
        costActual: execResult.costEstimate,
        startedAt: new Date(Date.now() - execResult.latencyMs),
        completedAt: new Date(),
      },
    });

    const sample = await db.sample.create({
      data: {
        runId: run.id,
        promptId: prompt.id,
        rawOutput: execResult.rawOutput,
        latencyMs: execResult.latencyMs,
      },
    });

    await db.judgment.create({
      data: {
        sampleId: sample.id,
        judgeModelId: execResult.judgment.judgeModelId,
        rubricVersion: execResult.judgment.rubricVersion,
        scores: JSON.stringify(execResult.judgment.scores),
        reasoning: execResult.judgment.reasoning,
        composite: execResult.judgment.composite,
        disagreementFlag: execResult.judgment.disagreementFlag,
      },
    });

    // Update Model composite score based on evaluated judgment composite
    await db.model.update({
      where: { id: model.id },
      data: { composite: execResult.judgment.composite },
    });

    revalidatePath("/leaderboard");
    revalidatePath(`/models/${model.slug}`);

    return NextResponse.json({
      success: true,
      runId: run.id,
      model: model.name,
      status: "complete",
      costEstimate: execResult.costEstimate,
      compositeScore: execResult.judgment.composite,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to launch run";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
