import { NextResponse } from "next/server";
import { getShowcaseSamples } from "@/lib/models";

export async function GET() {
  try {
    const samples = await getShowcaseSamples(12);
    return NextResponse.json({ items: samples, count: samples.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch showcase samples";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
