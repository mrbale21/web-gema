import { NextRequest, NextResponse } from "next/server";
import {
  getAllNews,
  createNews,
  getNewsById,
} from "@/lib/services/newsServices";
import fs from "fs";

export async function GET() {
  try {
    const news = await getAllNews();
    return NextResponse.json(news);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const tag = formData.get("tag") as string;
    const editor = formData.get("editor") as string;
    const content = formData.get("content") as string;
    const imageFile = formData.get("image") as File | null;

    let imageUrl: string | undefined = undefined;
    if (imageFile) {
      // contoh: simpan ke public/uploads
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = `public/uploads/${Date.now()}-${imageFile.name}`;
      await fs.promises.writeFile(filePath, buffer);
      imageUrl = "/uploads/" + filePath.split("/").pop();
    }

    const news = await createNews(title, content, imageUrl, tag, editor);
    return NextResponse.json(news);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
