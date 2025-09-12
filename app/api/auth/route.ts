import { NextRequest, NextResponse } from "next/server";
import { createUser, validateUser } from "@/lib/services/userServices";
import { SignJWT } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "supersecretkey"
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, email, password, name } = body;

  try {
    if (type === "register") {
      const user = await createUser(email, password, name);
      return NextResponse.json({ user });
    }

    if (type === "login") {
      const user = await validateUser(email, password);
      if (!user) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      // 🔑 generate JWT dengan jose
      const token = await new SignJWT({ id: user.id, email: user.email })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1h")
        .sign(SECRET_KEY);

      const response = NextResponse.json({ user });

      // simpan token di cookie HttpOnly
      response.cookies.set("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60, // 1 jam
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production", // hanya https kalau production
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
