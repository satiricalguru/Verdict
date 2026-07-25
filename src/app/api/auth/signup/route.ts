import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await db.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const newUser = await db.user.create({
      data: {
        name: name || cleanEmail.split("@")[0] || "User",
        email: cleanEmail,
        passwordHash: hashPassword(password),
      },
    });

    await createSession(newUser.id);

    return NextResponse.json({
      success: true,
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Signup error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
