import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "supersecretkey"
);

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return NextResponse.json(
      { error: "Email atau password salah" },
      { status: 400 }
    );
  if (!user.verified)
    return NextResponse.json(
      { error: "Email belum diverifikasi" },
      { status: 400 }
    );

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return NextResponse.json(
      { error: "Email atau password salah" },
      { status: 400 }
    );

  const token = await new SignJWT({ id: user.id, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(SECRET_KEY);

  const response = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email },
  });
  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
