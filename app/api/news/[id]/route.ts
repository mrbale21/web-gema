import { NextRequest, NextResponse } from "next/server";
import {
  deleteMenu,
  getNewsById,
  updateMenu,
} from "@/lib/services/newsServices";
import fs from "fs";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // params harus Promise
) {
  try {
    const { id } = await context.params;
    const newsId = parseInt(id, 10);

    const news = await getNewsById(newsId);

    if (!news) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    return NextResponse.json(news);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const tag = formData.get("tag") as string;
    const editor = formData.get("editor") as string;
    const content = formData.get("content") as string;
    const imageFile = formData.get("image") as File | null;

    let imageUrl: string | undefined = undefined;
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = `public/uploads/${Date.now()}-${imageFile.name}`;
      await fs.promises.writeFile(filePath, buffer);
      imageUrl = "/uploads/" + filePath.split("/").pop();
    }

    const updatedNews = await updateMenu(
      id,
      title,
      content,
      imageUrl,
      tag,
      editor
    );
    return NextResponse.json(updatedNews);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const deleted = await deleteMenu(id);

    return NextResponse.json({ message: "News berhasil dihapus", deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
