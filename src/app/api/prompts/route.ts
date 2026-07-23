import { NextResponse } from "next/server";
import { getAllPrompts } from "@/lib/models";

export async function GET() {
  const prompts = await getAllPrompts();
  return NextResponse.json({ prompts, count: prompts.length });
}
