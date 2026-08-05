import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { encryptKey } from "@/lib/crypto";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ keys: [] });
  }

  const keys = await db.apiKey.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    keys: keys.map((k) => ({
      id: k.id,
      provider: k.provider,
      prefix: `${k.provider.toLowerCase()}-key-...${k.id.substring(k.id.length - 4)}`,
      createdAt: k.createdAt,
      status: "Connected",
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

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const encrypted = encryptKey(key);

    const existingKey = await db.apiKey.findFirst({
      where: {
        userId: user.id,
        provider: { equals: provider },
      },
    });

    let savedKey;
    if (existingKey) {
      savedKey = await db.apiKey.update({
        where: { id: existingKey.id },
        data: { keyEncrypted: encrypted, createdAt: new Date() },
      });
    } else {
      savedKey = await db.apiKey.create({
        data: {
          userId: user.id,
          provider,
          keyEncrypted: encrypted,
        },
      });
    }

    return NextResponse.json({
      success: true,
      key: {
        id: savedKey.id,
        provider: savedKey.provider,
        prefix: `${provider.toLowerCase()}-...${savedKey.id.substring(savedKey.id.length - 4)}`,
        status: "Connected",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save API key";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const provider = searchParams.get("provider");

    if (!provider) {
      return NextResponse.json({ error: "Provider parameter is required" }, { status: 400 });
    }

    await db.apiKey.deleteMany({
      where: {
        userId: user.id,
        provider: { equals: provider },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to disconnect key";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
