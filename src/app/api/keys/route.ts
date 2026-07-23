import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const keys = await db.apiKey.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    keys: keys.map((k) => ({
      id: k.id,
      provider: k.provider,
      prefix: `${k.provider.toLowerCase()}-...${k.id.substring(k.id.length - 4)}`,
      createdAt: k.createdAt,
      status: "Active",
    })),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, key } = body;

    if (!provider || !key) {
      return NextResponse.json({ error: "Provider and key are required" }, { status: 400 });
    }

    let user = await db.user.findFirst();
    if (!user) {
      user = await db.user.create({
        data: {
          name: "Default Workspace",
          email: "workspace@verdict.dev",
        },
      });
    }

    const encrypted = `enc_${Buffer.from(key).toString("base64").substring(0, 16)}`;

    const newKey = await db.apiKey.create({
      data: {
        userId: user.id,
        provider,
        keyEncrypted: encrypted,
      },
    });

    return NextResponse.json({
      success: true,
      key: {
        id: newKey.id,
        provider: newKey.provider,
        prefix: `${provider.toLowerCase()}-...${newKey.id.substring(newKey.id.length - 4)}`,
        status: "Active",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to add API key";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
