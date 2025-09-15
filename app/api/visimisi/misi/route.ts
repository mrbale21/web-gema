import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, authId } = body;

    const misi = await prisma.misi.create({
      data: {
        title,
        slug: title.toLowerCase().replace(/\s+/g, "-"),
        authId,
      },
    });

    return NextResponse.json(misi);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
