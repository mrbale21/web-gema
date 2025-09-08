import { NextRequest, NextResponse } from "next/server";
import { createUser, validateUser } from "@/lib/services/userServices";

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
      if (!user)
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      return NextResponse.json({ user });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
