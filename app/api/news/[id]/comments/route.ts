// app/api/news/[id]/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { filterBadWords } from "@/lib/filterBadwords";

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

    const filteredComment = filterBadWords(comment);

    const newComment = await prisma.comment.create({
      data: { name, comment: filteredComment, status, newsId },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commentId = parseInt(params.id, 10);
    const body = await req.json();
    const { name, comment, status } = body;

    if (!comment) {
      return NextResponse.json(
        { error: "Komentar wajib diisi" },
        { status: 400 }
      );
    }

    const filteredComment = filterBadWords(comment);

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { name, comment: filteredComment, status },
    });

    return NextResponse.json(updatedComment);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commentId = parseInt(params.id, 10);

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ message: "Komentar berhasil dihapus" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
