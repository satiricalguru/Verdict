import { NextResponse } from "next/server";
import { getModelBySlug } from "@/lib/models";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const model = await getModelBySlug(slug);

  if (!model) {
    return NextResponse.json({ error: "Model not found" }, { status: 404 });
  }

  return NextResponse.json({ model });
}
