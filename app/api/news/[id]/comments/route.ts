import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const newsId = parseInt(params.id, 10);

    const comments = await prisma.comment.findMany({
      where: { newsId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const newsId = parseInt(params.id, 10);
    const body = await req.json();
    const { name, comment, status } = body;

    if (!name || !comment) {
      return NextResponse.json(
        { error: "name dan comment wajib diisi" },
        { status: 400 }
      );
    }

    const newComment = await prisma.comment.create({
      data: { name, comment, status, newsId },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
